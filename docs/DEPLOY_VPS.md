# Guia de despliegue en VPS (Ubuntu 22.04+)

## 1) Requisitos
- Docker y Docker Compose plugin instalados.
- Dominio apuntando al VPS.
- Puertos 80/443 abiertos.

## 2) Preparacion
```bash
git clone <repo>
cd <repo>
cp .env.example .env
# editar secretos en .env
```

## 3) Levantar servicios
```bash
docker compose up -d --build
```

## 4) Reverse proxy (recomendado)
Use Nginx o Caddy delante de:
- Frontend: `localhost:3000`
- Backend: `localhost:8000`

Configurar TLS (Let's Encrypt) y forzar HTTPS.

## 5) Variables de produccion
- `JWT_SECRET`: valor largo y aleatorio.
- `COOKIE_SECURE=true`
- `CORS_ORIGINS=https://tu-dominio`
- `POSTGRES_PASSWORD` fuerte.

## 6) Operacion
```bash
docker compose logs -f backend
docker compose logs -f runner
docker compose logs -f frontend
```

## 7) Backup minimo
- Programar dump diario de PostgreSQL:
```bash
docker exec edu-postgres pg_dump -U edu_user edu_platform > backup.sql
```

