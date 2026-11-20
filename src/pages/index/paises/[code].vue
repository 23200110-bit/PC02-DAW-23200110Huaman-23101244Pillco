<template>
  <q-page class="q-pa-md">
    <q-btn
      flat
      icon="chevron_left"
      label="Volver al listado"
      to="/"
      no-caps
      color="grey-9"
      class="q-mb-md"
    />

    <!-- Loading -->
    <div v-if="loading" class="column items-center q-pa-xl text-grey-7">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Cargando país...</div>
    </div>

    <!-- Error -->
    <q-banner v-else-if="errorMessage" class="bg-red-1 text-negative" rounded>
      <template #avatar>
        <q-icon name="error_outline" color="negative" />
      </template>
      {{ errorMessage }}
      <template #action>
        <q-btn flat color="negative" label="Reintentar" @click="loadCountry(code)" />
      </template>
    </q-banner>

    <!-- Detalle -->
    <CountryDetail
      v-else-if="country"
      :country="country"
      :borders="borders"
      :borders-loading="bordersLoading"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { countriesApi, apiErrorMessage } from '@/services/api'
import { countryName } from '@/utils/country'
import CountryDetail from '@/components/countries/CountryDetail.vue'

const route = useRoute()
const code = computed(() => String(route.params.code ?? ''))

const country = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const borders = ref([])
const bordersLoading = ref(false)

// Pantalla 2: GET /countries/v5/codes.alpha_2/{codigo}
// (también acepta alpha-3, que es el formato en que la API envía los países fronterizos)
async function loadCountry(value) {
  loading.value = true
  errorMessage.value = ''
  country.value = null
  borders.value = []

  try {
    const property = value.length === 3 ? 'codes.alpha_3' : 'codes.alpha_2'
    const { data } = await countriesApi.get(`/${property}/${value}`)
    const found = data.data?.objects?.[0]

    if (!found) {
      errorMessage.value = `No se encontró el país con código "${value.toUpperCase()}".`
      return
    }

    country.value = found
    loadBorders(found.borders ?? [])
  } catch (error) {
    errorMessage.value =
      error.response?.status === 404
        ? `No se encontró el país con código "${value.toUpperCase()}".`
        : apiErrorMessage(error, 'No se pudo cargar el país.')
  } finally {
    loading.value = false
  }
}

// La API envía las fronteras como códigos alpha-3 (ECU, COL...): se consulta el nombre de cada uno
async function loadBorders(codes) {
  if (!codes.length) return
  bordersLoading.value = true

  const results = await Promise.allSettled(
    codes.map((alpha3) =>
      countriesApi.get(`/codes.alpha_3/${alpha3}`, {
        params: { response_fields: 'names,codes' },
      }),
    ),
  )

  borders.value = results.map((result, i) => {
    const found = result.status === 'fulfilled' ? result.value.data.data?.objects?.[0] : null
    return {
      code: found?.codes?.alpha_2 ?? codes[i],
      name: found ? countryName(found) : codes[i],
    }
  })
  bordersLoading.value = false
}

// Carga al entrar y cada vez que cambia el código en la URL (ej. al tocar un país fronterizo)
watch(
  code,
  (value) => {
    if (value) loadCountry(value)
  },
  { immediate: true },
)
</script>
