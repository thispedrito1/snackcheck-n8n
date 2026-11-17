# CLAUDE.md

Proyecto final no-code del curso de n8n (4Geeks): **SnackCheck**, un flujo que recibe un código de barras y devuelve un veredicto de salud con datos de Open Food Facts e IA de Groq. Enunciado: `README.es.md` de la clase (en Descargas). Documentación del flujo en `README.md`.

## Features

- **v1.0.0 SnackCheck**: webhook `POST /nutrition-check` → validación → Open Food Facts → semáforo y "peor de dos" con Nutri-Score → nodo Code de preocupación → IA con tono según el nivel → texto plano. Respuestas JSON para docs (200), 400, 404 y datos insuficientes (200).

## Reglas que no hay que romper (vienen del enunciado)

- Nodos mínimos: Webhook, Respond to Webhook, HTTP Request (GET), IF, Merge (Append), Set, Code (un ítem, sin bucles) y Groq.
- Todo nodo se llama `[Acción] - [Propósito]` y lleva nota. Única cuenta: Groq. Las demás APIs, sin clave.
- La clave de Groq nunca va en el JSON: solo en las credenciales de n8n.

## Cómo se probó

- Se probó en un n8n self-hosted con `curl` contra el webhook de producción (ver `TEST_LOG.md`).
- Importar o activar por CLI (`n8n import:workflow` + `n8n publish:workflow`) exige reiniciar n8n, y el webhook tarda unos segundos más que `/healthz` en responder.
- `node tests/verdict-rules.test.js` comprueba las reglas con las expresiones reales del JSON.
