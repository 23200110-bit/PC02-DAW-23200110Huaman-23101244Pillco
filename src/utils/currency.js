// Funciones de apoyo para el modal de moneda

const currencyNamesEs = new Intl.DisplayNames(['es'], { type: 'currency' })

// "PEN" -> "Sol peruano" (si el navegador no lo conoce, usa el nombre de la API)
export function currencyName(currency) {
  if (!currency) return '—'
  try {
    const name = currencyNamesEs.of(currency.code)
    if (name && name.toUpperCase() !== currency.code.toUpperCase()) {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
  } catch {
    // código no reconocido por el navegador
  }
  return currency.name || currency.code
}

// 0.2712345 -> "0.2712"  |  3.71234 -> "3.71"  |  0.0000654 -> "0.00006540"
export function formatRate(value) {
  if (value == null || Number.isNaN(value)) return '—'
  if (value >= 1) return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return String(Number(value.toPrecision(4)))
}

// 27.1234 -> "27.12"
export function formatAmount(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
