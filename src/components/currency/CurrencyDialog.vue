<template>
  <!-- Modal de moneda: tasa frente a USD + conversor -->
  <q-dialog :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)">
    <q-card v-if="currency" class="currency-card q-pa-sm">
      <!-- Encabezado: símbolo, nombre y código -->
      <q-card-section class="row items-center no-wrap q-gutter-md">
        <div class="currency-symbol flex flex-center text-weight-bold text-green-8">
          {{ currency.symbol || currency.code }}
        </div>
        <div class="col">
          <div class="text-h6 text-weight-bold">{{ currencyName(currency) }}</div>
          <div class="text-caption text-grey-7">{{ currency.code }} · API: Currencies (rates)</div>
        </div>
        <q-btn v-close-popup flat round dense icon="close" aria-label="Cerrar" />
      </q-card-section>

      <!-- Tasa actual frente al dólar -->
      <q-card-section class="q-pt-none">
        <div class="rate-box rounded-borders q-pa-md text-subtitle1 text-weight-bold">
          <div v-if="rateLoading" class="row items-center q-gutter-sm text-grey-7">
            <q-spinner size="1.2em" color="primary" />
            <span class="text-body2">Consultando tasa...</span>
          </div>
          <div v-else-if="rateError" class="text-negative text-body2">{{ rateError }}</div>
          <div v-else>1 {{ currency.code }} = {{ formatRate(rate) }} USD</div>
        </div>
      </q-card-section>

      <!-- Conversor simple -->
      <q-card-section class="q-pt-none">
        <div class="text-body2 text-weight-medium q-mb-sm">
          Convertir monto en {{ currency.code }}
        </div>
        <q-input
          v-model.number="amount"
          type="number"
          outlined
          min="0"
          :prefix="currency.symbol"
          :rules="[(val) => (val !== '' && val > 0) || 'Ingresa un monto mayor a 0']"
          lazy-rules
          @keyup.enter="convert"
        />
        <q-btn
          unelevated
          no-caps
          color="primary"
          class="full-width q-mt-sm q-py-sm text-weight-bold"
          label="Convertir a USD"
          :loading="convertLoading"
          :disable="!(amount > 0)"
          @click="convert"
        />

        <!-- Resultado -->
        <div
          v-if="result"
          class="result-box rounded-borders q-pa-md q-mt-md text-center text-subtitle1"
        >
          {{ formatAmount(result.amount) }} {{ currency.code }} =
          <b>{{ formatAmount(result.value) }} USD</b>
        </div>
        <div v-if="convertError" class="text-negative text-body2 q-mt-md">{{ convertError }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { currenciesApi, apiErrorMessage } from '@/services/api'
import { currencyName, formatRate, formatAmount } from '@/utils/currency'

// v-model controla si el modal está abierto; currency = { code, name, symbol }
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const rate = ref(null)
const rateLoading = ref(false)
const rateError = ref('')

const amount = ref(100)
const result = ref(null)
const convertLoading = ref(false)
const convertError = ref('')

// Tasa actual: GET /currencies/v1/rates/{codigoMoneda} -> rates.USD
async function loadRate(code) {
  rate.value = null
  rateError.value = ''

  if (code === 'USD') {
    rate.value = 1
    return
  }

  rateLoading.value = true
  try {
    const { data } = await currenciesApi.get(`/rates/${code}`)
    const usd = data.data?.objects?.[0]?.rates?.USD
    if (usd == null) {
      rateError.value = `No hay tasa disponible de ${code} frente a USD.`
    } else {
      rate.value = usd
    }
  } catch (error) {
    rateError.value = apiErrorMessage(error, 'No se pudo obtener la tasa de cambio.')
  } finally {
    rateLoading.value = false
  }
}

// Conversión: GET /currencies/v1/convert?from={origen}&to=USD&amount={monto}
async function convert() {
  if (!(amount.value > 0) || !props.currency) return

  convertLoading.value = true
  convertError.value = ''
  result.value = null

  try {
    const { data } = await currenciesApi.get('/convert', {
      params: { from: props.currency.code, to: 'USD', amount: amount.value },
    })
    const conversion = data.data?.objects?.[0]
    result.value = { amount: conversion.amount, value: conversion.result }
  } catch (error) {
    convertError.value = apiErrorMessage(error, 'No se pudo convertir el monto.')
  } finally {
    convertLoading.value = false
  }
}

// Cada vez que se abre el modal con una moneda, se reinicia y se consulta la tasa
watch(
  () => [props.modelValue, props.currency?.code],
  ([open, code]) => {
    if (open && code) {
      amount.value = 100
      result.value = null
      convertError.value = ''
      loadRate(code)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.currency-card {
  width: 400px;
  max-width: 92vw;
  border-radius: 16px;
}
.currency-symbol {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #e8f7ee;
  font-size: 18px;
}
.rate-box {
  background: #f6f7f9;
}
.result-box {
  background: #e8f7ee;
}
</style>
