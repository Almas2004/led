package main

import (
	"bytes"
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type ID uint

func (id *ID) UnmarshalJSON(data []byte) error {
	value := strings.TrimSpace(string(data))
	if value == "" || value == "null" || value == `""` {
		*id = 0
		return nil
	}

	if strings.HasPrefix(value, `"`) && strings.HasSuffix(value, `"`) {
		unquoted, err := strconv.Unquote(value)
		if err != nil {
			return err
		}
		value = strings.TrimSpace(unquoted)
	}

	parsed, err := strconv.ParseUint(value, 10, 64)
	if err != nil {
		return fmt.Errorf("invalid id %q", value)
	}

	*id = ID(parsed)
	return nil
}

func (id ID) MarshalJSON() ([]byte, error) {
	return []byte(strconv.FormatUint(uint64(id), 10)), nil
}

func (id ID) Value() (driver.Value, error) {
	return int64(id), nil
}

func (id *ID) Scan(value interface{}) error {
	switch v := value.(type) {
	case int64:
		*id = ID(v)
	case int:
		*id = ID(v)
	case uint:
		*id = ID(v)
	case []byte:
		parsed, err := strconv.ParseUint(string(v), 10, 64)
		if err != nil {
			return err
		}
		*id = ID(parsed)
	case string:
		parsed, err := strconv.ParseUint(v, 10, 64)
		if err != nil {
			return err
		}
		*id = ID(parsed)
	default:
		return fmt.Errorf("cannot scan %T into ID", value)
	}
	return nil
}

type Product struct {
	ID                 ID             `gorm:"primaryKey" json:"id"`
	Slug               string         `gorm:"uniqueIndex;size:160;not null" json:"slug"`
	Name               string         `json:"name"`
	Type               string         `gorm:"size:32" json:"type"`
	Purpose            pq.StringArray `gorm:"type:text[]" json:"purpose"`
	PixelPitch         string         `json:"pixelPitch"`
	Brightness         int            `json:"brightness"`
	RefreshRate        int            `json:"refreshRate"`
	IPRating           string         `json:"ipRating"`
	ViewingDistanceMin int            `json:"viewingDistanceMin"`
	ViewingDistanceMax int            `json:"viewingDistanceMax"`
	PriceFrom          float64        `json:"priceFrom"`
	ShortDescription   string         `json:"shortDescription"`
	FullDescription    string         `json:"fullDescription"`
	Images             pq.StringArray `gorm:"type:text[]" json:"images"`
	IsFeatured         bool           `json:"isFeatured"`
	SortOrder          int            `json:"sortOrder"`
	Warranty           int            `gorm:"default:3" json:"warranty"`
	LeadTime           int            `gorm:"default:15" json:"leadTime"`
}

type Solution struct {
	ID               ID             `gorm:"primaryKey" json:"id"`
	Slug             string         `gorm:"uniqueIndex;size:160;not null" json:"slug"`
	Name             string         `json:"name"`
	Type             string         `gorm:"size:32" json:"type"`
	Width            float64        `json:"width"`
	Height           float64        `json:"height"`
	Area             float64        `json:"area"`
	PixelPitch       string         `json:"pixelPitch"`
	Brightness       int            `json:"brightness"`
	Included         pq.StringArray `gorm:"type:text[]" json:"included"`
	PriceFrom        float64        `json:"priceFrom"`
	ShortDescription string         `json:"shortDescription"`
	FullDescription  string         `json:"fullDescription"`
	Warranty         int            `gorm:"default:3" json:"warranty"`
	LeadTime         int            `gorm:"default:15" json:"leadTime"`
	Images           pq.StringArray `gorm:"type:text[]" json:"images"`
	IsFeatured       bool           `json:"isFeatured"`
	FeaturedOrder    int            `json:"featuredOrder"`
}

type Case struct {
	ID            ID             `gorm:"primaryKey" json:"id"`
	Slug          string         `gorm:"uniqueIndex;size:160;not null" json:"slug"`
	Title         string         `json:"title"`
	City          string         `json:"city"`
	Industry      string         `json:"industry"`
	Task          string         `json:"task"`
	SolutionDesc  string         `gorm:"column:solution_desc" json:"solution"`
	SolutionAlias string         `gorm:"-" json:"solutionDesc,omitempty"`
	Specs         pq.StringArray `gorm:"type:text[]" json:"specs"`
	Duration      int            `json:"duration"`
	Result        string         `json:"result"`
	Images        pq.StringArray `gorm:"type:text[]" json:"images"`
	VideoURL      string         `json:"videoUrl,omitempty"`
	Testimonial   string         `json:"testimonial,omitempty"`
	IsFeatured    bool           `json:"isFeatured"`
	FeaturedOrder int            `json:"featuredOrder"`
}

type Lead struct {
	ID          ID     `gorm:"primaryKey" json:"id"`
	CreatedAt   string `json:"createdAt"`
	Name        string `json:"name"`
	Phone       string `json:"phone"`
	City        string `json:"city"`
	Message     string `json:"message"`
	PageURL     string `json:"pageUrl"`
	Source      string `json:"source"`
	ProductID   string `json:"productId,omitempty"`
	SolutionID  string `json:"solutionId,omitempty"`
	Status      string `gorm:"size:32;default:new" json:"status"`
	ManagerNote string `json:"managerNote,omitempty"`
}

type app struct {
	db         *gorm.DB
	http       *http.Client
	distDir    string
	startedAt  time.Time
	telegramOK bool
	adminUser  string
	adminPass  string
}

func main() {
	_ = godotenv.Load(".env", ".env.local")

	gin.SetMode(env("GIN_MODE", gin.ReleaseMode))

	adminUser := strings.TrimSpace(os.Getenv("ADMIN_USERNAME"))
	adminPass := strings.TrimSpace(os.Getenv("ADMIN_PASSWORD"))
	if adminUser == "" || adminPass == "" {
		log.Fatal("ADMIN_USERNAME and ADMIN_PASSWORD must be set")
	}

	db, err := connectDB()
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("database handle failed: %v", err)
	}
	defer sqlDB.Close()

	if err := migrate(db); err != nil {
		log.Fatalf("database migration failed: %v", err)
	}

	application := &app{
		db:        db,
		http:      &http.Client{Timeout: 8 * time.Second},
		distDir:   env("DIST_DIR", "./dist"),
		startedAt: time.Now(),
		adminUser: adminUser,
		adminPass: adminPass,
	}
	application.telegramOK = os.Getenv("TELEGRAM_BOT_TOKEN") != "" && os.Getenv("TELEGRAM_CHAT_ID") != ""

	router := application.router()
	port := env("PORT", "8082")

	log.Printf("backend started on :%s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}

func connectDB() (*gorm.DB, error) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=127.0.0.1 user=postgres password=postgres dbname=ledvision port=5432 sslmode=disable TimeZone=Asia/Almaty"
	}

	var lastErr error
	attempts := envInt("DB_CONNECT_ATTEMPTS", 5)
	if attempts < 1 {
		attempts = 1
	}

	for attempt := 1; attempt <= attempts; attempt++ {
		db, err := openDB(dsn)
		if err == nil {
			return db, nil
		}

		lastErr = err
		if attempt < attempts {
			log.Printf("database connection attempt %d/%d failed: %v", attempt, attempts, err)
			time.Sleep(time.Duration(attempt) * time.Second)
		}
	}

	return nil, lastErr
}

func openDB(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetConnMaxLifetime(time.Hour)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := sqlDB.PingContext(ctx); err != nil {
		return nil, err
	}

	return db, nil
}

func migrate(db *gorm.DB) error {
	return db.AutoMigrate(&Product{}, &Solution{}, &Case{}, &Lead{})
}

func (a *app) router() *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery(), requestLogger(), cors())

	api := r.Group("/api")
	{
		api.GET("/health", a.health)
		api.GET("/admin/session", a.requireAdminAuth(), func(c *gin.Context) {
			c.Status(http.StatusNoContent)
		})

		api.GET("/products", a.listProducts)
		api.GET("/products/:slug", a.getProduct)
		api.POST("/products", a.requireAdminAuth(), a.saveProduct)
		api.DELETE("/products/:id", a.requireAdminAuth(), a.deleteProduct)

		api.GET("/solutions", a.listSolutions)
		api.GET("/solutions/:slug", a.getSolution)
		api.POST("/solutions", a.requireAdminAuth(), a.saveSolution)
		api.DELETE("/solutions/:id", a.requireAdminAuth(), a.deleteSolution)

		api.GET("/cases", a.listCases)
		api.GET("/cases/:slug", a.getCase)
		api.POST("/cases", a.requireAdminAuth(), a.saveCase)
		api.DELETE("/cases/:id", a.requireAdminAuth(), a.deleteCase)

		api.GET("/leads", a.requireAdminAuth(), a.listLeads)
		api.POST("/leads", a.createLead)
		api.PATCH("/leads/:id", a.requireAdminAuth(), a.updateLead)
	}

	a.mountFrontend(r)
	return r
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", env("CORS_ORIGIN", "*"))
		c.Header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type,Authorization")
		c.Header("Vary", "Origin, Authorization")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func (a *app) requireAdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		username, password, ok := c.Request.BasicAuth()
		if !ok || username != a.adminUser || password != a.adminPass {
			c.Header("WWW-Authenticate", `Basic realm="admin"`)
			respondError(c, http.StatusUnauthorized, "admin authorization required")
			c.Abort()
			return
		}

		c.Next()
	}
}

func requestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		log.Printf("%s %s -> %d (%s)", c.Request.Method, c.Request.URL.Path, c.Writer.Status(), time.Since(start).Round(time.Millisecond))
	}
}

func (a *app) mountFrontend(r *gin.Engine) {
	assetsPath := filepath.Join(a.distDir, "assets")
	if stat, err := os.Stat(assetsPath); err == nil && stat.IsDir() {
		r.Static("/assets", assetsPath)
	}

	r.GET("/", func(c *gin.Context) {
		a.serveIndex(c)
	})

	r.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/api") {
			respondError(c, http.StatusNotFound, "route not found")
			return
		}
		a.serveIndex(c)
	})
}

func (a *app) serveIndex(c *gin.Context) {
	indexPath := filepath.Join(a.distDir, "index.html")
	if _, err := os.Stat(indexPath); err != nil {
		respondError(c, http.StatusNotFound, "frontend build not found; run npm run build")
		return
	}
	c.File(indexPath)
}

func (a *app) health(c *gin.Context) {
	sqlDB, err := a.db.DB()
	if err != nil {
		respondError(c, http.StatusInternalServerError, "database handle is unavailable")
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
	defer cancel()

	if err := sqlDB.PingContext(ctx); err != nil {
		respondError(c, http.StatusServiceUnavailable, "database is unavailable")
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ok":         true,
		"uptimeSec":  int(time.Since(a.startedAt).Seconds()),
		"telegram":   a.telegramOK,
		"serverTime": time.Now().Format(time.RFC3339),
	})
}

func (a *app) listProducts(c *gin.Context) {
	var products []Product
	if err := a.db.Order("sort_order asc, id desc").Find(&products).Error; err != nil {
		respondDBError(c, err)
		return
	}
	for i := range products {
		normalizeProduct(&products[i])
	}
	c.JSON(http.StatusOK, products)
}

func (a *app) getProduct(c *gin.Context) {
	var product Product
	if err := a.db.Where("slug = ?", c.Param("slug")).First(&product).Error; err != nil {
		respondDBError(c, err)
		return
	}
	normalizeProduct(&product)
	c.JSON(http.StatusOK, product)
}

func (a *app) saveProduct(c *gin.Context) {
	var product Product
	if err := bindJSON(c, &product); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	normalizeProduct(&product)
	if err := validateSlug(product.Slug); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	if product.Warranty == 0 {
		product.Warranty = 3
	}
	if product.LeadTime == 0 {
		product.LeadTime = 15
	}

	if err := a.db.Save(&product).Error; err != nil {
		respondDBError(c, err)
		return
	}

	normalizeProduct(&product)
	c.JSON(http.StatusCreated, product)
}

func (a *app) deleteProduct(c *gin.Context) {
	id, ok := parseParamID(c)
	if !ok {
		return
	}
	if err := a.db.Delete(&Product{}, id).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (a *app) listSolutions(c *gin.Context) {
	var items []Solution
	if err := a.db.Order("featured_order asc, id desc").Find(&items).Error; err != nil {
		respondDBError(c, err)
		return
	}
	for i := range items {
		normalizeSolution(&items[i])
	}
	c.JSON(http.StatusOK, items)
}

func (a *app) getSolution(c *gin.Context) {
	var item Solution
	if err := a.db.Where("slug = ?", c.Param("slug")).First(&item).Error; err != nil {
		respondDBError(c, err)
		return
	}
	normalizeSolution(&item)
	c.JSON(http.StatusOK, item)
}

func (a *app) saveSolution(c *gin.Context) {
	var item Solution
	if err := bindJSON(c, &item); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	normalizeSolution(&item)
	if err := validateSlug(item.Slug); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	if item.Area == 0 && item.Width > 0 && item.Height > 0 {
		item.Area = item.Width * item.Height
	}
	if item.Warranty == 0 {
		item.Warranty = 3
	}
	if item.LeadTime == 0 {
		item.LeadTime = 15
	}

	if err := a.db.Save(&item).Error; err != nil {
		respondDBError(c, err)
		return
	}

	normalizeSolution(&item)
	c.JSON(http.StatusCreated, item)
}

func (a *app) deleteSolution(c *gin.Context) {
	id, ok := parseParamID(c)
	if !ok {
		return
	}
	if err := a.db.Delete(&Solution{}, id).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (a *app) listCases(c *gin.Context) {
	var items []Case
	if err := a.db.Order("featured_order asc, id desc").Find(&items).Error; err != nil {
		respondDBError(c, err)
		return
	}
	for i := range items {
		normalizeCase(&items[i])
	}
	c.JSON(http.StatusOK, items)
}

func (a *app) getCase(c *gin.Context) {
	var item Case
	if err := a.db.Where("slug = ?", c.Param("slug")).First(&item).Error; err != nil {
		respondDBError(c, err)
		return
	}
	normalizeCase(&item)
	c.JSON(http.StatusOK, item)
}

func (a *app) saveCase(c *gin.Context) {
	var item Case
	if err := bindJSON(c, &item); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	normalizeCase(&item)
	if err := validateSlug(item.Slug); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := a.db.Save(&item).Error; err != nil {
		respondDBError(c, err)
		return
	}

	normalizeCase(&item)
	c.JSON(http.StatusCreated, item)
}

func (a *app) deleteCase(c *gin.Context) {
	id, ok := parseParamID(c)
	if !ok {
		return
	}
	if err := a.db.Delete(&Case{}, id).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (a *app) listLeads(c *gin.Context) {
	var leads []Lead
	if err := a.db.Order("id desc").Find(&leads).Error; err != nil {
		respondDBError(c, err)
		return
	}
	c.JSON(http.StatusOK, leads)
}

func (a *app) createLead(c *gin.Context) {
	var lead Lead
	if err := bindJSON(c, &lead); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	lead.ID = 0
	normalizeLead(&lead)

	if lead.Name == "" && lead.Phone == "" {
		respondError(c, http.StatusBadRequest, "name or phone is required")
		return
	}

	if err := a.db.Create(&lead).Error; err != nil {
		respondDBError(c, err)
		return
	}

	go a.sendTelegram(lead)
	c.JSON(http.StatusCreated, lead)
}

func (a *app) updateLead(c *gin.Context) {
	id, ok := parseParamID(c)
	if !ok {
		return
	}

	var updates map[string]interface{}
	if err := bindJSON(c, &updates); err != nil {
		respondError(c, http.StatusBadRequest, err.Error())
		return
	}

	delete(updates, "id")
	delete(updates, "createdAt")

	if status, exists := updates["status"].(string); exists && !validLeadStatus(status) {
		respondError(c, http.StatusBadRequest, "invalid lead status")
		return
	}

	cleanUpdates := normalizeLeadUpdates(updates)
	if len(cleanUpdates) == 0 {
		c.Status(http.StatusNoContent)
		return
	}

	if err := a.db.Model(&Lead{}).Where("id = ?", id).Updates(cleanUpdates).Error; err != nil {
		respondDBError(c, err)
		return
	}

	c.Status(http.StatusNoContent)
}

func (a *app) sendTelegram(lead Lead) {
	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	chatID := os.Getenv("TELEGRAM_CHAT_ID")
	if token == "" || chatID == "" {
		return
	}

	text := fmt.Sprintf(
		"Новая заявка\nИмя: %s\nТелефон: %s\nГород: %s\nИсточник: %s\nURL: %s\nСообщение: %s",
		lead.Name,
		lead.Phone,
		lead.City,
		lead.Source,
		lead.PageURL,
		lead.Message,
	)

	payload, err := json.Marshal(gin.H{
		"chat_id": chatID,
		"text":    text,
	})
	if err != nil {
		log.Printf("telegram payload error: %v", err)
		return
	}

	resp, err := a.http.Post("https://api.telegram.org/bot"+token+"/sendMessage", "application/json", bytes.NewReader(payload))
	if err != nil {
		log.Printf("telegram send error: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		log.Printf("telegram returned status %d", resp.StatusCode)
	}
}

func bindJSON(c *gin.Context, dst interface{}) error {
	decoder := json.NewDecoder(c.Request.Body)
	if err := decoder.Decode(dst); err != nil {
		return err
	}
	return nil
}

func parseParamID(c *gin.Context) (uint, bool) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil || id == 0 {
		respondError(c, http.StatusBadRequest, "invalid id")
		return 0, false
	}
	return uint(id), true
}

func validateSlug(slug string) error {
	slug = strings.TrimSpace(slug)
	if slug == "" {
		return errors.New("slug is required")
	}
	if strings.Contains(slug, "/") || strings.Contains(slug, "\\") {
		return errors.New("slug must not contain slashes")
	}
	return nil
}

func normalizeProduct(product *Product) {
	product.Slug = cleanText(product.Slug)
	product.Name = cleanText(product.Name)
	product.Type = defaultText(product.Type, "indoor")
	product.Purpose = ensureStringArray(product.Purpose)
	product.Images = ensureStringArray(product.Images)
}

func normalizeSolution(item *Solution) {
	item.Slug = cleanText(item.Slug)
	item.Name = cleanText(item.Name)
	item.Type = defaultText(item.Type, "indoor")
	item.Included = ensureStringArray(item.Included)
	item.Images = ensureStringArray(item.Images)
}

func normalizeCase(item *Case) {
	item.Slug = cleanText(item.Slug)
	item.Title = cleanText(item.Title)
	if item.SolutionDesc == "" && item.SolutionAlias != "" {
		item.SolutionDesc = item.SolutionAlias
	}
	item.SolutionAlias = ""
	item.Specs = ensureStringArray(item.Specs)
	item.Images = ensureStringArray(item.Images)
}

func normalizeLead(lead *Lead) {
	lead.Name = cleanText(lead.Name)
	lead.Phone = cleanText(lead.Phone)
	lead.City = cleanText(lead.City)
	lead.Status = defaultText(lead.Status, "new")
	if lead.CreatedAt == "" {
		lead.CreatedAt = time.Now().Format(time.RFC3339)
	}
	if !validLeadStatus(lead.Status) {
		lead.Status = "new"
	}
}

func normalizeLeadUpdates(updates map[string]interface{}) map[string]interface{} {
	allowed := map[string]string{
		"name":        "name",
		"phone":       "phone",
		"city":        "city",
		"message":     "message",
		"pageUrl":     "page_url",
		"source":      "source",
		"productId":   "product_id",
		"solutionId":  "solution_id",
		"status":      "status",
		"managerNote": "manager_note",
	}

	result := make(map[string]interface{}, len(updates))
	for jsonKey, value := range updates {
		column, ok := allowed[jsonKey]
		if !ok {
			continue
		}
		if text, ok := value.(string); ok {
			value = strings.TrimSpace(text)
		}
		result[column] = value
	}

	return result
}

func ensureStringArray(value pq.StringArray) pq.StringArray {
	if value == nil {
		return pq.StringArray{}
	}
	for i := range value {
		value[i] = strings.TrimSpace(value[i])
	}
	return value
}

func validLeadStatus(status string) bool {
	switch status {
	case "new", "in_progress", "done":
		return true
	default:
		return false
	}
}

func cleanText(value string) string {
	return strings.TrimSpace(value)
}

func defaultText(value, fallback string) string {
	value = cleanText(value)
	if value == "" {
		return fallback
	}
	return value
}

func respondDBError(c *gin.Context, err error) {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		respondError(c, http.StatusNotFound, "record not found")
		return
	}

	message := "database error"
	if isUniqueViolation(err) {
		message = "record with this slug already exists"
		respondError(c, http.StatusConflict, message)
		return
	}

	log.Printf("database error: %v", err)
	respondError(c, http.StatusInternalServerError, message)
}

func isUniqueViolation(err error) bool {
	return strings.Contains(err.Error(), "SQLSTATE 23505") || strings.Contains(strings.ToLower(err.Error()), "duplicate key")
}

func respondError(c *gin.Context, status int, message string) {
	c.JSON(status, gin.H{"error": message})
}

func env(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func envInt(key string, fallback int) int {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}

	return parsed
}
