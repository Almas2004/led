package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestValidateSlug(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name    string
		slug    string
		wantErr bool
	}{
		{name: "valid", slug: "indoor-p2-5"},
		{name: "empty", slug: "", wantErr: true},
		{name: "slash", slug: "bad/slug", wantErr: true},
		{name: "backslash", slug: `bad\slug`, wantErr: true},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			err := validateSlug(tt.slug)
			if tt.wantErr && err == nil {
				t.Fatalf("expected error for slug %q", tt.slug)
			}
			if !tt.wantErr && err != nil {
				t.Fatalf("unexpected error for slug %q: %v", tt.slug, err)
			}
		})
	}
}

func TestNormalizeLeadUpdates(t *testing.T) {
	t.Parallel()

	updates := normalizeLeadUpdates(map[string]interface{}{
		"status":      " done ",
		"pageUrl":     " /contacts ",
		"managerNote": " call back ",
		"createdAt":   "ignore",
		"unknown":     "ignore",
	})

	if got := updates["status"]; got != "done" {
		t.Fatalf("expected trimmed status, got %#v", got)
	}
	if got := updates["page_url"]; got != "/contacts" {
		t.Fatalf("expected mapped page_url, got %#v", got)
	}
	if got := updates["manager_note"]; got != "call back" {
		t.Fatalf("expected mapped manager_note, got %#v", got)
	}
	if _, ok := updates["unknown"]; ok {
		t.Fatal("unexpected unknown field in normalized updates")
	}
}

func TestRequireAdminAuth(t *testing.T) {
	t.Parallel()

	gin.SetMode(gin.TestMode)
	app := &app{adminUser: "admin", adminPass: "secret"}
	router := gin.New()
	router.GET("/protected", app.requireAdminAuth(), func(c *gin.Context) {
		c.Status(http.StatusNoContent)
	})

	t.Run("rejects missing credentials", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/protected", nil)
		rec := httptest.NewRecorder()

		router.ServeHTTP(rec, req)
		if rec.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401, got %d", rec.Code)
		}
	})

	t.Run("accepts correct credentials", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/protected", nil)
		req.SetBasicAuth("admin", "secret")
		rec := httptest.NewRecorder()

		router.ServeHTTP(rec, req)
		if rec.Code != http.StatusNoContent {
			t.Fatalf("expected 204, got %d", rec.Code)
		}
	})
}
