package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Модели данных для PostgreSQL
type Product struct {
	ID                 uint           `gorm:"primaryKey" json:"id"`
	Slug               string         `gorm:"uniqueIndex" json:"slug"`
	Name               string         `json:"name"`
	Type               string         `json:"type"` // indoor, outdoor
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
}

type Solution struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	Slug             string         `gorm:"uniqueIndex" json:"slug"`
	Name             string         `json:"name"`
	Type             string         `json:"type"`
	Width            float64        `json:"width"`
	Height           float64        `json:"height"`
	Area             float64        `json:"area"`
	PixelPitch       string         `json:"pixelPitch"`
	Brightness       int            `json:"brightness"`
	Included         pq.StringArray `gorm:"type:text[]" json:"included"`
	PriceFrom        float64        `json:"priceFrom"`
	ShortDescription string         `json:"shortDescription"`
	FullDescription  string         `json:"fullDescription"`
	Images           pq.StringArray `gorm:"type:text[]" json:"images"`
	IsFeatured       bool           `json:"isFeatured"`
	FeaturedOrder    int            `json:"featuredOrder"`
}

type Case struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Slug          string         `gorm:"uniqueIndex" json:"slug"`
	Title         string         `json:"title"`
	City          string         `json:"city"`
	Industry      string         `json:"industry"`
	Task          string         `json:"task"`
	SolutionDesc  string         `json:"solution"`
	Specs         pq.StringArray `gorm:"type:text[]" json:"specs"`
	Duration      int            `json:"duration"`
	Result        string         `json:"result"`
	Images        pq.StringArray `gorm:"type:text[]" json:"images"`
	IsFeatured    bool           `json:"isFeatured"`
	FeaturedOrder int            `json:"featuredOrder"`
}

type Lead struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	CreatedAt   string `json:"createdAt"`
	Name        string `json:"name"`
	Phone       string `json:"phone"`
	City        string `json:"city"`
	Message     string `json:"message"`
	PageUrl     string `json:"pageUrl"`
	Source      string `json:"source"`
	Status      string `json:"status"`
	ManagerNote string `json:"managerNote"`
}

var db *gorm.DB

func ensureStringArray(value pq.StringArray) pq.StringArray {
	if value == nil {
		return pq.StringArray{}
	}
	return value
}

func normalizeProduct(product *Product) {
	product.Purpose = ensureStringArray(product.Purpose)
	product.Images = ensureStringArray(product.Images)
}

func normalizeSolution(item *Solution) {
	item.Included = ensureStringArray(item.Included)
	item.Images = ensureStringArray(item.Images)
}

func normalizeCase(item *Case) {
	item.Specs = ensureStringArray(item.Specs)
	item.Images = ensureStringArray(item.Images)
}

func initDB() {
	// Настройки подключения к PostgreSQL (замените на свои)
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=127.0.0.1 user=postgres password=postgres dbname=ledvision port=5432 sslmode=disable TimeZone=Asia/Almaty"
	}

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Авто-миграция таблиц
	db.AutoMigrate(&Product{}, &Solution{}, &Case{}, &Lead{})
}

func sendTelegram(lead Lead) {
	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	chatID := os.Getenv("TELEGRAM_CHAT_ID")
	if token == "" || chatID == "" {
		return
	}

	text := fmt.Sprintf("🆕 НОВАЯ ЗАЯВКА:\nИмя: %s\nТел: %s\nГород: %s\nИсточник: %s\nURL: %s", lead.Name, lead.Phone, lead.City, lead.Source, lead.PageUrl)
	payload, _ := json.Marshal(map[string]string{
		"chat_id": chatID,
		"text":    text,
	})
	http.Post("https://api.telegram.org/bot"+token+"/sendMessage", "application/json", bytes.NewBuffer(payload))
}

func main() {
	_ = godotenv.Load()
	initDB()

	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PATCH")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})
	// 1) Статика Vite
	r.Static("/assets", "./dist/assets")

	// 2) Главная страница
	r.GET("/", func(c *gin.Context) {
		c.File("./dist/index.html")
	})

	// 3) SPA fallback: все, что не /api — отдаём index.html
	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		if strings.HasPrefix(path, "/api") {
			c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
			return
		}
		c.File("./dist/index.html")
	})

	apiGroup := r.Group("/api")
	{
		// Products
		apiGroup.GET("/products", func(c *gin.Context) {
			var products []Product
			db.Find(&products)
			for i := range products {
				normalizeProduct(&products[i])
			}
			c.JSON(200, products)
		})
		apiGroup.GET("/products/:slug", func(c *gin.Context) {
			var product Product
			if err := db.Where("slug = ?", c.Param("slug")).First(&product).Error; err != nil {
				c.JSON(404, gin.H{"error": "Product not found"})
				return
			}
			normalizeProduct(&product)
			c.JSON(200, product)
		})
		apiGroup.POST("/products", func(c *gin.Context) {
			var product Product
			if err := c.ShouldBindJSON(&product); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			normalizeProduct(&product)
			db.Save(&product)
			c.JSON(201, product)
		})
		apiGroup.DELETE("/products/:id", func(c *gin.Context) {
			db.Delete(&Product{}, c.Param("id"))
			c.Status(204)
		})

		// Solutions
		apiGroup.GET("/solutions", func(c *gin.Context) {
			var items []Solution
			db.Find(&items)
			for i := range items {
				normalizeSolution(&items[i])
			}
			c.JSON(200, items)
		})
		apiGroup.POST("/solutions", func(c *gin.Context) {
			var item Solution
			if err := c.ShouldBindJSON(&item); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			normalizeSolution(&item)
			db.Save(&item)
			c.JSON(201, item)
		})
		apiGroup.DELETE("/solutions/:id", func(c *gin.Context) {
			db.Delete(&Solution{}, c.Param("id"))
			c.Status(204)
		})

		// Cases
		apiGroup.GET("/cases", func(c *gin.Context) {
			var items []Case
			db.Find(&items)
			for i := range items {
				normalizeCase(&items[i])
			}
			c.JSON(200, items)
		})
		apiGroup.POST("/cases", func(c *gin.Context) {
			var item Case
			if err := c.ShouldBindJSON(&item); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			normalizeCase(&item)
			db.Save(&item)
			c.JSON(201, item)
		})
		apiGroup.DELETE("/cases/:id", func(c *gin.Context) {
			db.Delete(&Case{}, c.Param("id"))
			c.Status(204)
		})

		// Leads
		apiGroup.GET("/leads", func(c *gin.Context) {
			var leads []Lead
			db.Order("id desc").Find(&leads)
			c.JSON(200, leads)
		})
		apiGroup.POST("/leads", func(c *gin.Context) {
			var lead Lead
			if err := c.ShouldBindJSON(&lead); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}

			lead.ID = 0
			db.Create(&lead)
			go sendTelegram(lead)
			c.JSON(201, lead)
		})
		apiGroup.PATCH("/leads/:id", func(c *gin.Context) {
			var updates map[string]interface{}
			if err := c.ShouldBindJSON(&updates); err != nil {
				c.JSON(400, gin.H{"error": err.Error()})
				return
			}
			db.Model(&Lead{}).Where("id = ?", c.Param("id")).Updates(updates)
			c.Status(204)
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
