# HablaEstrella / SpeakStar — App de Terapia del Habla 🌟

App bilingüe (español/inglés) de terapia del habla para niños. PWA — funciona en cualquier teléfono Android o iOS, no requiere instalación de SDK ni dependencias.

---

## 📦 ¿Qué está incluido?

### App principal (PWA)
- **`index.html`** — Punto de entrada de la app
- **`data.js`** — Todo el contenido (sonidos, trabalenguas, frases, traducciones)
- **`app.js`** — Lógica de la app (pantallas, micrófono, AI)
- **`manifest.json`** — Configuración PWA para instalar en teléfono
- **`sw.js`** — Service worker (funciona sin internet)
- **`icon-192.png`, `icon-512.png`, `icon.png`** — Íconos

### Módulos de práctica
- **🔤 Sonidos** — 8 categorías en español (RR, Ñ, S, LL, J, D, B/V, P), 10 palabras cada una = **80 palabras**
- **🌀 Trabalenguas** — 8 trabalenguas clásicos en español (Tres tristes tigres, Pablito clavó, Erre con erre, etc.)
- **💬 Frases** — 6 temas (Familia, Escuela, Mi Día, Animales, Comida, Colores)
- **📚 Para Padres** — Enlace a artículos SEO

### Contenido SEO (Spanish)
Carpeta `articulos/` con 8 artículos optimizados para Google:
1. **dislalia-infantil.html** — "¿Qué es la dislalia infantil?"
2. **edad-hablar-bien.html** — "¿A qué edad debe hablar bien un niño?"
3. **ensenar-pronunciar-r.html** — "Cómo enseñar a pronunciar la R"
4. **ejercicios-logopedia-casa.html** — "10 ejercicios de logopedia en casa"
5. **cuando-preocuparse-habla.html** — "¿Cuándo preocuparse?"
6. **tartamudez-infantil.html** — "Tartamudez infantil"
7. **estimular-lenguaje-2-5.html** — "Estimular el lenguaje 2-5 años"
8. **trabalenguas-ninos.html** — "Trabalenguas para niños"

### Legales (requeridos por Play Store)
- **`privacy.html`** — Política de Privacidad
- **`terms.html`** — Términos de Uso

### SEO técnico
- **`sitemap.xml`** — Para que Google indexe todo
- **`robots.txt`** — Permisos de crawlers

---

## 🚀 Subir a Vercel (5 minutos)

1. Ve a **https://vercel.com/new**
2. Arrastra la carpeta `SpeakStarPWA` completa
3. Click en "Deploy"
4. ✅ Tu app tiene una URL como `https://speakstar-xxx.vercel.app`

Esa URL ya es:
- 📱 Una app instalable en teléfonos (Add to Home Screen)
- 🌐 Un sitio web con SEO
- 📚 Un blog de artículos para padres

---

## 📱 Generar APK para Google Play Store

1. Ve a **https://www.pwabuilder.com**
2. Pega tu URL de Vercel
3. Click "Start" → tab Android → "Generate Package"
4. Descarga el archivo `.aab`
5. Sube a Google Play Console

**URLs requeridas por Play Store (ya están listas):**
- Privacy Policy: `https://tu-url.vercel.app/privacy.html`
- Terms of Use: `https://tu-url.vercel.app/terms.html`

---

## 🔑 Activar AI feedback (opcional)

La app funciona con mensajes de aliento pregrabados. Para retroalimentación personalizada con Claude AI:

1. Obtén una clave en https://console.anthropic.com (tiene créditos gratis)
2. Abre `data.js` en un editor
3. Encuentra la línea:
   ```js
   const ANTHROPIC_API_KEY = 'sk-ant-YOUR_KEY_HERE';
   ```
4. Reemplaza con tu clave
5. Sube los archivos actualizados a Vercel

⚠️ **Para producción**: la clave queda visible en el código del navegador. Antes de publicar al público, mueve la clave a un backend (ej. una función serverless en Vercel).

---

## ✏️ Modificar el contenido

### Cambiar nombre de la app
Edita `manifest.json` (campos `name`, `short_name`) y `data.js` (campo `appName`).

### Agregar más palabras a un sonido
En `data.js`, encuentra la categoría (ej. `rr`) y agrega más palabras al array `words`:
```js
{w:'nuevapalabra', e:'🎯'}
```

### Agregar un nuevo trabalenguas
En `data.js`, en `TWISTERS.es`, agrega un nuevo objeto siguiendo el formato existente.

### Agregar un nuevo artículo SEO
1. Copia uno de los archivos en `articulos/` (ej. `dislalia-infantil.html`)
2. Cambia el contenido, título, meta tags
3. Agrégalo a `articulos/index.html` (el hub)
4. Agrégalo a `sitemap.xml`

---

## 📊 SEO: Lo que está implementado

Cada artículo tiene:
- ✅ `<title>` y `<meta description>` optimizados
- ✅ `<meta keywords>` relevantes
- ✅ `<link rel="canonical">` 
- ✅ Open Graph tags para redes sociales
- ✅ Schema.org JSON-LD (Article schema)
- ✅ Headings jerárquicos (h1, h2, h3)
- ✅ Tabla de contenido con anchors
- ✅ Enlaces internos a artículos relacionados
- ✅ CTA hacia la app
- ✅ Listo para Google Search Console

**Palabras clave de alta búsqueda + baja competencia en español** (perfectas para posicionar):
- "dislalia infantil"
- "cómo enseñar la R a un niño"
- "ejercicios de logopedia en casa"
- "a qué edad debe hablar un niño"
- "trabalenguas para niños"

---

## 📈 Próximos pasos sugeridos

- [ ] Verifica el sitio en Google Search Console (envía sitemap.xml)
- [ ] Comparte en Facebook groups de "padres con niños con problemas del habla"
- [ ] Crea cuentas de Instagram/TikTok para HablaEstrella
- [ ] Considera AdSense en los artículos (pero NO en la app)
- [ ] Implementa un modelo freemium (algunos sonidos gratis, otros premium)
- [ ] Agrega más artículos SEO (objetivo: 20-30 artículos en 6 meses)
- [ ] Construye backlinks contactando blogs de logopedia

---

## 📧 Contacto

Email: oscar.mora2347@alumnos.udg.mx

---

**Estructura final del proyecto:**

```
SpeakStarPWA/
├── index.html          ← La app
├── data.js             ← Contenido
├── app.js              ← Lógica
├── manifest.json       ← PWA config
├── sw.js               ← Service worker
├── icon-*.png          ← Íconos
├── privacy.html        ← Privacidad
├── terms.html          ← Términos
├── sitemap.xml         ← SEO
├── robots.txt          ← SEO
├── README.md           ← Esto
└── articulos/
    ├── style.css       ← Estilos compartidos
    ├── index.html      ← Hub de artículos
    ├── dislalia-infantil.html
    ├── edad-hablar-bien.html
    ├── ensenar-pronunciar-r.html
    ├── ejercicios-logopedia-casa.html
    ├── cuando-preocuparse-habla.html
    ├── tartamudez-infantil.html
    ├── estimular-lenguaje-2-5.html
    └── trabalenguas-ninos.html
```
