package graph

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jmoiron/sqlx"

	"github.com/riuchek/api/graph/model"
)

var errUnauthorized = errors.New("unauthorized")

func (r *Resolver) signToken(userID string) (string, error) {
	claims := jwt.RegisteredClaims{
		Subject:   userID,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(r.JWTSecret)
}

func userIDFromContext(ctx context.Context) string {
	v := ctx.Value(UserIDKey)
	if v == nil {
		return ""
	}
	s, _ := v.(string)
	return s
}

func getWorldByID(ctx context.Context, db *sqlx.DB, id string) (*model.World, error) {
	var w model.World
	err := db.QueryRowxContext(ctx,
		"SELECT id::text as id, name, description FROM worlds WHERE id = $1", id,
	).StructScan(&w)
	if err != nil {
		return nil, err
	}
	return &w, nil
}
