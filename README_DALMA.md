# Sitio - Dalma Flores

Este sitio es una adaptacion del template original y queda listo para subir a hosting (GitHub Pages, Netlify, etc.).

## 1) Datos editables (sin tocar el HTML)

Abrir: `js/config.js`

- WhatsApp, email, Instagram
- Link del canal: CLUB DE FINANZAS
- Link para abrir cuenta (se muestra como "Abrir tu cuenta de inversion" sin nombrar marca)
- **formEndpoint**: URL de Formspree (o similar)
- **talleresSheetCsv**: URL CSV de Google Sheets publicada

## 2) Talleres editables desde Google Drive (Google Sheets)

1. Crea una Google Sheet nueva con estas columnas en la fila 1:
   - `fecha` | `tema` | `tipo`
2. Completa filas con tus talleres (ej: `Jue 25/01 19:00` | `Fondos Comunes de Inversion` | `Taller por Teams`).
3. Ve a **Archivo > Publicar en la web**.
4. Publica la hoja como **CSV**.
5. Copia el link CSV (termina en `output=csv`).
6. Pegalo en `js/config.js` en `talleresSheetCsv`.

Listo: la seccion "Talleres gratuitos por Teams" se actualiza sola.

## 3) Formulario de contacto

El formulario esta preparado para usar un endpoint (ej: Formspree).

- Crea tu formulario en Formspree con el mail que quieras recibir.
- Copia la URL (ej: `https://formspree.io/f/xxxxxxx`).
- Pegala en `js/config.js` en `formEndpoint`.

Mientras no se configure, el formulario no va a poder enviar.

## 4) Cumplimiento / contenido

- No se menciona el nombre de la empresa en textos publicos.
- Se incluye aviso: *no hay rendimientos garantizados*.

