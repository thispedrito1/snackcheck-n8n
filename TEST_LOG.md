# Registro de pruebas: SnackCheck

Entorno: n8n 2.41.7 (Docker, VPS de 1 vCPU / 1 GB). Webhook de producción `POST /webhook/nutrition-check`, llamado con `curl`. Fecha: 2026-11-17. Versión del flujo: 1.0.0.

## Funcionales (código válido → veredicto)

| ID | Entrada | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| TC-001 | `3017620422003` Nutella | 200 texto, no saludable, tono cauteloso, preocupación 2/3 | 200 `text/plain`, NO SALUDABLE, 🔴 azúcar y grasa, párrafo cauteloso ("disfrutarla ocasionalmente") | ✅ |
| TC-002 | `5449000000996` Coca-Cola | No saludable aunque ningún nutriente sea alto (gana el Nutri-Score E) | NO SALUDABLE, preocupación 0/3, todo 🟢, tono cauteloso | ✅ |
| TC-003 | `8076800195057` Spaghetti Barilla (Nutri-Score A) | Saludable, tono alentador | SALUDABLE, 0/3, párrafo alentador ("¡Excelente elección!") | ✅ |
| TC-004 | `3175680011480` Sésame Gerblé (Nutri-Score C, grasa alta) | Moderado, tono alentador que menciona la grasa | MODERADO, 1/3, 🔴 grasa, párrafo alentador que la menciona | ✅ |
| TC-005 | Reglas de clasificación (`node tests/verdict-rules.test.js`) | "La peor de las dos", respaldo sin Nutri-Score, umbrales exactos | 7/7 casos OK | ✅ |

## Integración (API en vivo)

| ID | Prueba | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| TC-010 | Open Food Facts devuelve datos reales con el código inyectado en la URL | Nombre, marca, Nutri-Score y nutrientes del producto | TC-001 a TC-004 muestran los datos reales de cada producto | ✅ |
| TC-011 | Lectura de `energy-kcal_100g` con corchetes | Energía visible en el veredicto | 539 kcal (Nutella), 44 kcal (Coca-Cola), 359 kcal (Barilla) | ✅ |
| TC-012 | Groq genera el párrafo con la credencial de n8n | Párrafo en español con los datos del producto | Párrafos correctos en TC-001 a TC-004 | ✅ |

## Errores

| ID | Entrada | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| TC-020 | Cuerpo vacío | 200 JSON de autodocumentación | 200 `application/json` con servicio, campo requerido y ejemplo | ✅ |
| TC-021 | `{}` | 200 JSON de autodocumentación | Igual que TC-020 | ✅ |
| TC-022 | `{"barcode":"abc123"}` | 400 JSON con mensaje y ejemplo | 400 `invalid_barcode`, mensaje y ejemplo | ✅ |
| TC-023 | `{"barcode":""}` | 400 JSON | 400 `invalid_barcode` | ✅ |
| TC-024 | `{"barcode":"0000000000001"}` (no existe) | 404 JSON propio, el flujo no se cae | 404 `product_not_found` con código de ejemplo | ✅ |
| TC-025 | `6111250470209` (existe, sin nutrientes) | 200 JSON "datos insuficientes", sin veredicto | 200 `insufficient_data` con el nombre del producto | ✅ |

## Rendimiento

| ID | Medida | Resultado |
|---|---|---|
| TC-030 | Tiempo de respuesta medido con `curl` | Rutas sin IA (docs, 400, 404, datos insuficientes): 0.2-1 s. Veredicto con IA: 1.6-2.0 s; la primera llamada tras un reinicio, 6.9 s (arranque en frío). La mayor parte del tiempo se va en Open Food Facts y Groq. El VPS tiene 1 GB de RAM compartida: no se probó carga concurrente. |
