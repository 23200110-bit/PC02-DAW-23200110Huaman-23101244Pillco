import { countriesApi } from './api.js'

// La API devuelve 25 países por defecto; 100 es el máximo del plan Free
export const PAGE_SIZE = 100

function readCountries(payload) {
  const countries = payload?.data?.objects

  if (!Array.isArray(countries)) {
    throw new Error('La respuesta de RestCountries no contiene una lista en data.objects.')
  }

  return countries
}

// Listado general paginado: devuelve la página y si hay más países (data.meta.more)
export async function listCountries(signal, offset = 0) {
  const { data } = await countriesApi.get('', {
    params: { limit: PAGE_SIZE, offset },
    signal,
  })

  const countries = readCountries(data)
  const more = data?.data?.meta?.more ?? countries.length === PAGE_SIZE
  return { countries, more: Boolean(more) }
}

export async function searchByCapital(text, signal) {
  const { data } = await countriesApi.get('/capitals', {
    params: { q: text, limit: PAGE_SIZE },
    signal,
  })

  return readCountries(data)
}

export async function listByRegion(region, signal) {
  const { data } = await countriesApi.get(`/region/${encodeURIComponent(region)}`, {
    params: { limit: PAGE_SIZE },
    signal,
  })

  return readCountries(data)
}
