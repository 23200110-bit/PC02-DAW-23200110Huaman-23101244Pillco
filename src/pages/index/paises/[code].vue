<template>
  <q-page class="q-pa-md">
    <q-btn flat icon="chevron_left" label="Volver al listado" to="/" no-caps />
    <div class="text-h5 q-mt-md">Detalle del país {{ route.params.code }}</div>
    <div class="text-grey-7">Pendiente: Pantalla 2 (detalle del país)</div>
  </q-page>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
