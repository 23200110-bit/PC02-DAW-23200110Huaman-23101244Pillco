<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-8">
      <q-input
        :model-value="capital"
        @update:model-value="emit('update:capital', $event ?? '')"
        label="Buscar por capital"
        placeholder="Ej. Lima"
        outlined
        clearable
        :debounce="400"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-sm-4">
      <q-select
        :model-value="region"
        @update:model-value="emit('update:region', $event)"
        :options="regionOptions"
        label="Continente"
        outlined
        emit-value
        map-options
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  capital: { type: String, required: true },
  region: { type: String, default: null },
  regionOptions: { type: Array, required: true },
})

const emit = defineEmits(['update:capital', 'update:region'])
</script>
