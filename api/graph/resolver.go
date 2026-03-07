package graph

import "github.com/jmoiron/sqlx"

type Resolver struct {
	DB        *sqlx.DB
	JWTSecret []byte
}