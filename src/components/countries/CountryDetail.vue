<template>
  <q-card flat bordered class="q-pa-lg detail-card">
    <!-- Bandera grande, nombre y continente -->
    <div class="row items-center q-gutter-md q-mb-lg">
      <q-img
        :src="flagUrl(country.codes?.alpha_2, 'w320')"
        :alt="`Bandera de ${countryName(country)}`"
        width="140px"
        ratio="1.5"
        fit="contain"
        class="rounded-borders bg-grey-2"
      />
      <div>
        <div class="text-h4 text-weight-bold">{{ countryName(country) }}</div>
        <q-badge rounded color="blue-1" text-color="blue-9" class="q-px-sm q-py-xs q-mt-xs">
          {{ continentLabel(country) }}
        </q-badge>
      </div>
    </div>

    <!-- Capital destacada -->
    <div class="bg-primary text-white rounded-borders q-pa-lg row items-center q-mb-lg">
      <q-icon name="place" size="md" class="q-mr-md" />
      <div>
        <div class="text-caption text-weight-medium" style="opacity: 0.85">CAPITAL</div>
        <div class="text-h5 text-weight-bold">{{ capitalName(country) }}</div>
      </div>
    </div>

    <!-- Datos generales -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="item in items" :key="item.label" class="col-12 col-sm-6 col-md-4">
        <InfoTile :label="item.label" :value="item.value" />
      </div>
    </div>

    <!-- Países fronterizos -->
    <div class="text-caption text-grey-7 q-mb-sm">Países fronterizos</div>
    <div v-if="bordersLoading" class="row items-center q-gutter-sm text-grey-7">
      <q-spinner size="1em" /> <span>Cargando países fronterizos...</span>
    </div>
    <div v-else-if="borders.length" class="row q-gutter-sm">
      <q-chip
        v-for="border in borders"
        :key="border.code"
        clickable
        color="grey-3"
        text-color="dark"
        class="q-ma-none"
        @click="router.push(`/paises/${border.code}`)"
      >
        {{ border.name }}
      </q-chip>
    </div>
    <div v-else class="text-grey-7">No tiene países fronterizos</div>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import InfoTile from '@/components/countries/InfoTile.vue'
import {
  flagUrl,
  countryName,
  capitalName,
  continentLabel,
  currencyList,
  formatPopulation,
} from '@/utils/country'
import {
  languageNames,
  formatTimezones,
  callingCodes,
  domains,
  drivingSide,
  formatArea,
} from '@/utils/country-detail'

const props = defineProps({
  country: {
    type: Object,
    required: true,
  },
  // [{ code, name }] ya resueltos por la página
  borders: {
    type: Array,
    default: () => [],
  },
  bordersLoading: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

const items = computed(() => {
  const c = props.country
  const currency = currencyList(c)
    .map((cur) => `${cur.name} (${cur.code})`)
    .join(', ')

  return [
    { label: 'Población', value: formatPopulation(c.population) },
    { label: 'Área', value: formatArea(c) },
    { label: 'Moneda', value: currency || '—' },
    { label: 'Idiomas', value: languageNames(c) },
    { label: 'Zona horaria', value: formatTimezones(c) },
    { label: 'Código telefónico', value: callingCodes(c) },
    { label: 'Dominio', value: domains(c) },
    { label: 'Conducción', value: drivingSide(c) },
  ]
})
</script>

<style scoped>
.detail-card {
  border-radius: 16px;
  max-width: 900px;
}
</style>
