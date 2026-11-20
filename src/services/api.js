import axios from 'axios'

// La API key se lee del archivo .env (QCLI_API_KEY=...), que NO se sube a GitHub
const API_KEY = import.meta.env.QCLI_API_KEY

if (!API_KEY) {
  console.warn('Falta QCLI_API_KEY en el archivo .env (revisa .env.example)')
}

const headers = { Authorization: `Bearer ${API_KEY}` }

// API Countries: listado, búsqueda por capital, filtro por continente y detalle
export const countriesApi = axios.create({
  baseURL: 'https://api.restcountries.com/countries/v5',
  headers,
})

// API Currencies: tasa de cambio y conversión de montos
export const currenciesApi = axios.create({
  baseURL: 'https://api.restcountries.com/currencies/v1',
  headers,
})

// Mensaje legible a partir del formato de error de la API: { errors: [{ message, code }] }
export function apiErrorMessage(error, fallback = 'Ocurrió un error al consultar la API.') {
  if (error.response?.status === 401) return 'API key inválida o ausente (revisa el archivo .env).'
  if (error.response?.status === 429) return 'Demasiadas solicitudes, espera unos segundos.'
  return error.response?.data?.errors?.[0]?.message || fallback
}
