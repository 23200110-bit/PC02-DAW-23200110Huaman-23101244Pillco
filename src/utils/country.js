// Funciones de apoyo para mostrar los datos de un país (API Countries v5)

// Bandera desde flagcdn.com. Tamaños: w80 / w160 (miniaturas), w320 (grande)
export function flagUrl(alpha2, size = 'w320') {
  return alpha2 ? `https://flagcdn.com/${size}/${alpha2.toLowerCase()}.png` : ''
}

// Nombre en español si existe la traducción, si no el nombre común
export function countryName(country) {
  return country?.names?.translations?.spa?.common || country?.names?.common || '—'
}

// Capital principal (la API devuelve un arreglo de capitales)
export function capitalName(country) {
  const capitals = country?.capitals ?? []
  const primary = capitals.find((c) => c?.attributes?.primary || c?.primary)
  return (primary ?? capitals[0])?.name ?? '—'
}

// Monedas como arreglo [{ code, name, symbol }] (la API puede enviarlas como arreglo u objeto)
export function currencyList(country) {
  const currencies = country?.currencies
  if (!currencies) return []
  if (Array.isArray(currencies)) return currencies
  return Object.entries(currencies).map(([code, value]) => ({ code, ...value }))
}

// 34 012 345 -> "34.0 M"
export function formatPopulation(value) {
  if (value == null) return '—'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} M`
  return value.toLocaleString('es-PE')
}

// Traducción de continentes / regiones de la API al español
const CONTINENT_ES = {
  Africa: 'África',
  Americas: 'América',
  'North America': 'Norteamérica',
  'South America': 'Sudamérica',
  Antarctic: 'Antártida',
  Antarctica: 'Antártida',
  Asia: 'Asia',
  Europe: 'Europa',
  Oceania: 'Oceanía',
}

export function continentLabel(country) {
  const value = country?.continents?.[0] ?? country?.region
  return CONTINENT_ES[value] ?? value ?? '—'
}

// Opciones del selector de continente (value = valor que espera /region/{continente})
export const CONTINENT_OPTIONS = [
  { label: 'Todos los continentes', value: null },
  { label: 'África', value: 'Africa' },
  { label: 'América', value: 'Americas' },
  { label: 'Asia', value: 'Asia' },
  { label: 'Europa', value: 'Europe' },
  { label: 'Oceanía', value: 'Oceania' },
  { label: 'Antártida', value: 'Antarctic' },
]
