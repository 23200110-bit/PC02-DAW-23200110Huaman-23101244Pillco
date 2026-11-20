# Country Explorer (PC02)

Aplicación Vue 3 + Quasar (solo frontend) que consume la API de [REST Countries](https://restcountries.com) v5 y la API de Currencies v1.

## Configuración

1. Crea tu API key gratuita en <https://restcountries.com/sign-up>.
2. En **restcountries.com → API Keys**, agrega `localhost` como origen permitido (si no, el navegador bloquea las peticiones por CORS).
3. Copia `.env.example` como `.env` y pega tu key:

   ```bash
   QCLI_API_KEY=tu_api_key
   ```

## Ejecutar

```bash
npm install
npx quasar dev
```

## Rutas

| Ruta | Pantalla |
|---|---|
| `/` | Pantalla 1 – Listado de países (búsqueda por capital y filtro por continente) |
| `/paises/:code` | Pantalla 2 – Detalle del país |
| — | Modal de moneda: tasa frente a USD y conversor |
