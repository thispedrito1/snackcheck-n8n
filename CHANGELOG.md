# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Versiones según [SemVer](https://semver.org/lang/es/).

## [1.0.0] - 2026-11-17

### Añadido

- Webhook `POST /nutrition-check` con autodocumentación (200) si llega sin `barcode`.
- Validación del código de barras: presente y numérico (400 si no).
- Consulta a Open Food Facts, con manejo de "no encontrado" (404) y de producto sin nutrientes (200, datos insuficientes).
- Semáforo de azúcar, sal y grasa por 100 g. Nivel final = la peor entre el semáforo y el Nutri-Score, con respaldo al semáforo si no hay Nutri-Score.
- Puntuación de preocupación (0-3) en un nodo Code de un solo ítem.
- Párrafo de veredicto con Groq, con un prompt cauteloso y otro alentador según el nivel.
- Respuesta final en texto plano con titular, números alineados con 🔴/🟢 y el párrafo de IA.
- Diagrama, README, registro de pruebas y test de las reglas de clasificación.
