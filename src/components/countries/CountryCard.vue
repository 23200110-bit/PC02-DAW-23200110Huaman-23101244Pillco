<template>
  <q-card flat bordered class="country-card full-height" @click="openDetail">
    <q-card-section class="row items-center no-wrap q-gutter-sm">
      <img
        v-if="countryCode"
        :src="flagUrl(countryCode, 'w80')"
        :alt="`Bandera de ${name}`"
        class="country-flag"
        width="48"
        height="32"
        loading="lazy"
      />

      <button
        v-if="countryCode"
        type="button"
        class="country-name text-subtitle1 text-weight-bold"
        @click.stop="openDetail"
      >
        {{ name }}
      </button>
      <span v-else class="text-subtitle1 text-weight-bold">{{ name }}</span>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div>Capital: {{ capitalName(country) }}</div>
      <div>Población: {{ formatPopulation(country.population) }}</div>

      <div class="q-mt-sm">
        <q-chip dense color="blue-1" text-color="blue-10">
          {{ continentLabel(country) }}
        </q-chip>

        <q-chip
          v-for="currency in currencies"
          :key="currency.code"
          clickable
          dense
          color="green-1"
          text-color="green-10"
          :aria-label="`Ver tipo de cambio de ${currency.name || currency.code}`"
          @click.stop="emit('open-currency', currency)"
        >
          {{ currency.code }}
        </q-chip>

        <span v-if="currencies.length === 0" class="text-caption text-grey-7">
          Moneda no disponible
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import {
  capitalName,
  continentLabel,
  countryName,
  currencyList,
  flagUrl,
  formatPopulation,
} from '../../utils/country.js'

const props = defineProps({
  country: { type: Object, required: true },
  countryCode: { type: String, default: '' },
})

const emit = defineEmits(['open-detail', 'open-currency'])

const name = computed(() => countryName(props.country))
const currencies = computed(() => currencyList(props.country).filter((currency) => currency?.code))

function openDetail() {
  if (props.countryCode) {
    emit('open-detail', props.countryCode)
  }
}
</script>

<style scoped>
.country-card {
  cursor: pointer;
}

.country-flag {
  object-fit: cover;
  border-radius: 4px;
}

.country-name {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.country-name:hover {
  text-decoration: underline;
}
</style>
