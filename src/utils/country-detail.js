// Funciones de apoyo para la vista de detalle (Pantalla 2)

// Idiomas en español usando el código BCP 47 ("es" -> "Español")
const languageNamesEs = new Intl.DisplayNames(['es'], { type: 'language' })

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

export function languageNames(country) {
  const languages = country?.languages
  if (!languages) return '—'

  const list = Array.isArray(languages) ? languages : Object.values(languages)
  const names = list.map((lang) => {
    if (typeof lang === 'string') return lang
    const tag = lang.bcp47 || lang.iso639_1 || lang.code
    if (tag) {
      try {
        return capitalize(languageNamesEs.of(tag))
      } catch {
        // código no reconocido: se usa el nombre que envía la API
      }
    }
    return lang.name || lang.english_name || lang.native_name || '—'
  })

  return names.length ? names.join(', ') : '—'
}

// "UTC-05:00" -> "UTC-5"   |   "UTC+05:30" -> "UTC+5:30"
export function formatTimezones(country) {
  const zones = country?.timezones ?? []
  if (!zones.length) return '—'
  return zones
    .map((tz) => tz.replace(/([+-])0?(\d{1,2}):00$/, '$1$2').replace(/([+-])0(\d):/, '$1$2:'))
    .join(', ')
}

// ["51"] -> "+51"
export function callingCodes(country) {
  const codes = country?.calling_codes ?? []
  if (!codes.length) return '—'
  return codes.map((code) => (String(code).startsWith('+') ? code : `+${code}`)).join(', ')
}

export function domains(country) {
  const tlds = country?.tlds ?? []
  return tlds.length ? tlds.join(', ') : '—'
}

export function drivingSide(country) {
  const side = country?.cars?.driving_side
  if (side === 'right') return 'Derecha'
  if (side === 'left') return 'Izquierda'
  return '—'
}

// 1285216 -> "1 285 216 km²"
export function formatArea(country) {
  const km = country?.area?.kilometers
  if (km == null) return '—'
  return `${km.toLocaleString('fr-FR')} km²`
}
