# Maistorena Etxea — cómo publicar la web

Coste total: el dominio (≈10–15 €/año). Alojamiento, HTTPS y calendario: 0 €.

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página completa (textos, galería, calendario, contacto). |
| `privacidad.html` | Aviso legal y privacidad (obligatorio). |
| `fotos/` | Aquí van tus fotos, nombradas `01.jpg`, `02.jpg`… (ver abajo). |
| `functions/api/calendar.js` | Pequeño programa que lee el calendario de Airbnb y se lo pasa a la web. Cloudflare lo ejecuta solo. |

## Antes de publicar: rellenar datos

Ya está todo relleno: correo (maistorenaetxea@gmail.com), titular y NIF en el aviso legal, textos y las
17 fotos (en `fotos/` a 1600 px para el visor y en `fotos/t/` a 800 px para la rejilla).

1. Si más adelante cambias fotos: guárdalas con el mismo nombre en las dos carpetas (`fotos/` y
   `fotos/t/`) o edita la lista `FOTOS` al final de `index.html`. Para reducirlas gratis sin subirlas a
   ningún sitio: https://squoosh.app.

## Publicar (dos cuentas gratuitas: GitHub y Cloudflare)

### A. Subir la carpeta a GitHub (es el "almacén" de los archivos)
1. Crea cuenta en https://github.com (gratis).
2. Botón **New repository** → nombre `maistorena-web` → marca **Private** → *Create repository*.
3. En la página del repositorio, **Add file → Upload files**: arrastra TODO el contenido de esta
   carpeta (los archivos y las carpetas `fotos` y `functions`) → *Commit changes*.
   Nota: arrastra las carpetas enteras para que se conserve `functions/api/calendar.js`.

### B. Cloudflare Pages (lo que sirve la web al público)
1. Crea cuenta en https://dash.cloudflare.com (gratis).
2. Menú **Workers & Pages → Create → Pages → Connect to Git** → autoriza GitHub y elige `maistorena-web`.
3. Configuración de build: deja **Framework preset: None**, *Build command* vacío,
   *Build output directory*: `/` (barra). → **Save and Deploy**.
4. En uno o dos minutos tendrás la web en `https://maistorena-web.pages.dev`. Compruébala.

### C. Conectar el calendario de Airbnb (una sola vez)
1. En Cloudflare, dentro del proyecto: **Settings → Environment variables → Add variable**.
2. *Variable name*: `AIRBNB_ICAL`
   *Value*: tu enlace iCal de Airbnb (el que acaba en `.ics?t=…`). Marca **Encrypt**.
   Guárdalo para **Production**.
3. Vuelve a **Deployments → Retry deployment** (o sube cualquier cambio) para que se aplique.
4. Abre la web: el apartado Disponibilidad debe mostrar en gris las fechas ocupadas.

Ese enlace es privado: no lo pongas nunca en el HTML ni lo compartas. Si alguna vez se filtra,
en Airbnb puedes desconectar el calendario y generar uno nuevo; luego cambias la variable.

### D. Dominio propio
1. Compra el dominio. Si es `.com`: en Cloudflare, **Domain Registration → Register Domains**
   (precio de coste, sin recargo al renovar). Si es `.es`: Cloudflare no lo vende; cómpralo en
   https://porkbun.com o https://dinahosting.com y, en el paso siguiente, Cloudflare te dará dos
   "nameservers" que debes copiar en el panel de ese registrador.
2. En el proyecto de Pages: **Custom domains → Set up a custom domain** → escribe tu dominio
   (p. ej. `maistorenaetxea.com`) y sigue el asistente. Añade también la versión `www`.
3. El certificado HTTPS se activa solo. En unas horas (a veces hasta 24 h) la web responde en tu dominio.

## Actualizar la web más adelante

Cambiar una foto o un texto: en GitHub, abre el archivo → icono del lápiz (o *Upload files* para
fotos) → *Commit*. Cloudflare publica el cambio solo en un minuto. No hay que tocar nada más.

El calendario no hay que actualizarlo: se sincroniza con Airbnb cada 30 minutos como máximo
(Airbnb, por su parte, puede tardar unas horas en reflejar una reserva nueva en el iCal).

## Comprobaciones finales
- [ ] Variable `AIRBNB_ICAL` creada en Cloudflare y calendario mostrando fechas ocupadas.
- [ ] Web abierta en el móvil: galería y calendario se ven bien.
- [ ] Dominio conectado y `https://` funcionando.
