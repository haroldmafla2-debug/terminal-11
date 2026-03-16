# Seguridad implementada (MVP)

## Controles aplicados
- Autenticacion JWT por cookie `HttpOnly`.
- Roles: `admin`, `profesor`, `estudiante`.
- Validacion de tamano de codigo en backend y runner.
- Runner separado del backend principal.
- Bloqueo de imports sensibles (`os`, `subprocess`, `socket`, etc.).
- Timeout de ejecucion (default 4s).
- Limite de memoria en proceso y contenedor.
- Runner con privilegios reducidos (`cap_drop`, `read_only`, `tmpfs`).
- Registro de auditoria: login, guardado, ejecucion, envio, exportaciones.

## Riesgos conocidos del MVP
- El filtrado por imports es una capa preventiva, no reemplaza un sandbox de kernel completo.
- Para produccion escolar de alto riesgo se recomienda añadir aislamiento de sistema (gVisor/Firecracker/nsjail) o contenedor por ejecucion con runtime endurecido.
- El rate limiting esta preparado para ampliarse con Redis distribuido por endpoint.

## Endurecimiento siguiente fase
1. WAF y reverse proxy con limites por IP y ruta.
2. Integrar escaneo de payloads y deteccion de patrones maliciosos.
3. Firmar y rotar JWT secret por entorno.
4. HTTPS obligatorio y `COOKIE_SECURE=true` en produccion.
5. Politicas de backup y retencion de auditoria.

