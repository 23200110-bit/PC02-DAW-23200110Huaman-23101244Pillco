import { countriesApi } from './api.js'

function readCountries(payload) {
  const countries = payload?.data?.objects

  if (!Array.isArray(countries)) {
    throw new Error('La respuesta de RestCountries no contiene una lista en data.objects.')
  }

  return countries
}

export async function listCountries(signal) {
  const { data } = await countriesApi.get('', { signal })
  return readCountries(data)
}

export async function searchByCapital(text, signal) {
  const { data } = await countriesApi.get('/capitals', {
    params: { q: text },
    signal,
  })

  return readCountries(data)
}

export async function searchByCountry(text, signal) {
  const name = text.normalize('NFD').replace(/\p{M}/gu, '')

  const { data } = await countriesApi.get('/names.common', {
    params: { q: name },
    signal,
  })

  return readCountries(data)
}

export async function listByRegion(region, signal) {
  const { data } = await countriesApi.get(`/region/${encodeURIComponent(region)}`, {
    signal,
  })

  return readCountries(data)
}
