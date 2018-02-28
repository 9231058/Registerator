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
	"log"

	"github.com/google/go-github/github"
	"github.com/jinzhu/configor"
	"golang.org/x/oauth2"
)

// Config represents main configuration
var Config = struct {
	APIKey string `env:"api_key" yaml:"api_key"`
}{}

func main() {
	// Load configuration
	if err := configor.Load(&Config, "config.yml"); err != nil {
		panic(err)
	}

	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: Config.APIKey},
	)
	tc := oauth2.NewClient(ctx, ts)

	client := github.NewClient(tc)

	pesehr := "sepehr.sabour@gmail.com"
	role := "direct_member"

	invite, resp, err := client.Organizations.CreateOrgInvitation(ctx, "ce104", &github.CreateOrgInvitationOptions{
		Email:  &pesehr,
		Role:   &role,
		TeamID: []int64{},
	})
	if err != nil {
		log.Fatal(err)
	}
	log.Print(invite)
	log.Print(resp)
}
