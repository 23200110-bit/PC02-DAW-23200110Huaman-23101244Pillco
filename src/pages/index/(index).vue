<template>
  <q-page class="explorer-page">
    <section class="explorer" aria-labelledby="explorer-title">
      <header class="explorer-heading">
        <h1 id="explorer-title">Explorador de países</h1>
        <p>
          Busca por capital, filtra por continente, toca una tarjeta para ver el detalle o toca la
          moneda para ver su tasa.
        </p>
      </header>

      <CountryFilters
        v-model:capital="capital"
        v-model:region="region"
        :region-options="regionOptions"
      />

      <div v-if="loading" class="explorer-status" role="status">
        <q-spinner color="primary" size="24px" />
        <span>Cargando países…</span>
      </div>

      <q-banner
        v-else-if="errorMessage"
        rounded
        class="bg-red-1 text-negative q-mt-lg"
        role="alert"
      >
        {{ errorMessage }}

        <template #action>
          <q-btn flat color="negative" label="Reintentar" @click="loadCountries" />
        </template>
      </q-banner>

      <q-banner v-else-if="countries.length === 0" rounded class="bg-white text-grey-8 q-mt-lg">
        No se encontraron países con esos filtros.
      </q-banner>

      <div v-else class="country-grid">
        <CountryCard
          v-for="(country, index) in countries"
          :key="countryCode(country) || `country-${index}`"
          :country="country"
          :country-code="countryCode(country)"
          @open-detail="openDetail"
          @open-currency="openCurrency"
        />
      </div>

      <!-- Paginación: la API entrega máximo 100 países por petición -->
      <div v-if="hasMore && !loading && !errorMessage" class="flex flex-center q-mt-lg">
        <q-btn
          outline
          no-caps
          color="primary"
          icon="expand_more"
          label="Cargar más países"
          :loading="loadingMore"
          @click="loadMore"
        />
      </div>

      <!-- Modal de moneda (tasa frente a USD + conversor) -->
      <CurrencyDialog v-model="currencyOpen" :currency="selectedCurrency" />
    </section>
  </q-page>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CountryCard from '../../components/countries/CountryCard.vue'
import CountryFilters from '../../components/countries/CountryFilters.vue'
import CurrencyDialog from '../../components/currency/CurrencyDialog.vue'
import { apiErrorMessage } from '../../services/api.js'
import { listByRegion, listCountries, searchByCapital } from '../../services/countries.js'
import { CONTINENT_OPTIONS } from '../../utils/country.js'

const router = useRouter()

const regionOptions = CONTINENT_OPTIONS.map((option) => ({
  ...option,
  value: option.value ?? '',
}))

const capital = ref('')
const region = ref('')
const countries = ref([])
const loading = ref(false)
const errorMessage = ref('')
const currencyOpen = ref(false)
const selectedCurrency = ref(null)
const hasMore = ref(false)
const loadingMore = ref(false)

let activeRequest

function countryCode(country) {
  const code = country?.codes?.alpha_2 ?? country?.cca2
  return typeof code === 'string' && /^[a-z]{2}$/i.test(code) ? code.toLowerCase() : ''
}

function matchesRegion(country, selectedRegion) {
  const continents = Array.isArray(country.continents) ? country.continents : []
  const labels = [country.region, ...continents].map((label) =>
    String(label ?? '')
      .trim()
      .toLowerCase(),
  )

  const target = selectedRegion.toLowerCase()

  if (target === 'americas') {
    return labels.some((label) =>
      ['americas', 'america', 'north america', 'south america'].includes(label),
    )
  }

  if (target === 'antarctic') {
    return labels.some((label) => ['antarctic', 'antarctica'].includes(label))
  }

  return labels.includes(target)
}

async function loadCountries() {
  activeRequest?.abort()

  const request = new AbortController()
  activeRequest = request

  const text = capital.value.trim()
  const selectedRegion = region.value

  loading.value = true
  errorMessage.value = ''
  hasMore.value = false

  try {
    let result

    if (text) {
      result = await searchByCapital(text, request.signal)

      if (selectedRegion) {
        result = result.filter((country) => matchesRegion(country, selectedRegion))
      }
    } else if (selectedRegion) {
      result = await listByRegion(selectedRegion, request.signal)
    } else {
      const page = await listCountries(request.signal)
      result = page.countries
      hasMore.value = page.more
    }

    if (!request.signal.aborted) {
      countries.value = result
    }
  } catch (error) {
    if (request.signal.aborted) return

    countries.value = []

    if (text && error.response?.status === 404) return

    errorMessage.value = apiErrorMessage(
      error,
      error.response ? 'No se pudieron cargar los países.' : error.message,
    )
  } finally {
    if (activeRequest === request) {
      activeRequest = undefined
      loading.value = false
    }
  }
}

// Trae la siguiente página del listado general (offset = países ya cargados)
async function loadMore() {
  loadingMore.value = true

  try {
    const page = await listCountries(undefined, countries.value.length)

    // Si mientras tanto el usuario buscó o filtró, no se mezclan resultados
    if (!capital.value.trim() && !region.value) {
      countries.value = [...countries.value, ...page.countries]
      hasMore.value = page.more
    }
  } catch (error) {
    errorMessage.value = apiErrorMessage(error, 'No se pudieron cargar más países.')
  } finally {
    loadingMore.value = false
  }
}

function openDetail(code) {
  router.push(`/paises/${code}`)
}

function openCurrency(currency) {
  selectedCurrency.value = currency
  currencyOpen.value = true
}

watch([capital, region], loadCountries, { immediate: true })
onBeforeUnmount(() => activeRequest?.abort())
</script>

<style scoped>
.explorer-page {
  background: #f3f5f7;
}

.explorer {
  max-width: 1240px;
  margin: 0 auto;
  padding: 20px 20px 32px;
}

.explorer-heading {
  margin-bottom: 24px;
}

.explorer-heading h1 {
  margin: 0 0 4px;
  color: #101828;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.explorer-heading p {
  margin: 0;
  color: #526175;
  font-size: 14px;
}

.country-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.explorer-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  color: #526175;
}

@media (min-width: 600px) {
  .country-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .country-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
