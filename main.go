/*
 * +===============================================
 * | Author:        Parham Alvani <parham.alvani@gmail.com>
 * |
 * | Creation Date: 28-02-2018
 * |
 * | File Name:     main.go
 * +===============================================
 */

package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/go-github/github"
	"github.com/jinzhu/configor"
	log "github.com/sirupsen/logrus"
	"golang.org/x/oauth2"
)

// Config represents main configuration
var Config = struct {
	APIKey string `env:"api_key" yaml:"api_key"`
}{}

var client *github.Client

func handle() http.Handler {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/about", aboutHandler)

		api.POST("/student", registerHandler)
	}

	r.Static("/assets", "./ui/dist")
	r.StaticFile("/", "./ui/dist/index.html")

	return r
}

func main() {
	// Load configuration
	if err := configor.Load(&Config, "config.yml"); err != nil {
		panic(err)
	}

	// Github client initiation
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: Config.APIKey},
	)
	tc := oauth2.NewClient(ctx, ts)
	client = github.NewClient(tc)
	log.Infoln("Github client is ready")

	r := handle()

	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	go func() {
		fmt.Printf("Registerator Listen: %s\n", srv.Addr)
		// service connections
		if err := srv.ListenAndServe(); err != nil {
			log.Fatal("Listen Error:", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	fmt.Println("Registerator Shutdown")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Shutdown Error:", err)
	}
}

func aboutHandler(c *gin.Context) {
	c.String(http.StatusOK, "18.20 is leaving us")
}

func registerHandler(c *gin.Context) {
	var json struct {
		FirstName string `json:"fname" binding:"required,alpha"`
		LastName  string `json:"lname" binding:"required,alpha"`
		ID        string `json:"id" binding:"required,numeric,len=7"`
		Email     string `json:"email" binding:"required,email"`
	}
	if err := c.BindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()

	_, resp, err := client.Organizations.CreateOrgInvitation(ctx, "ce104", &github.CreateOrgInvitationOptions{
		Email:  &json.Email,
		Role:   github.String("direct_member"),
		TeamID: []int64{},
	})
	if err != nil {
		log.WithFields(log.Fields{
			"email":   json.Email,
			"student": json.ID,
		}).Errorln(err)
	}

	log.WithFields(log.Fields{
		"email":   json.Email,
		"student": json.ID,
	}).Infoln(resp)

	c.JSON(http.StatusOK, gin.H{"email": json.Email})
}
