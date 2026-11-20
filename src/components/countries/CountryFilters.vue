<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 col-sm-3 col-md-2">
      <q-select
        :model-value="searchMode"
        @update:model-value="emit('update:searchMode', $event)"
        :options="searchOptions"
        label="Buscar por"
        outlined
        emit-value
        map-options
      />
    </div>

    <div class="col-12 col-sm-5 col-md-7">
      <q-input
        :model-value="query"
        @update:model-value="emit('update:query', $event ?? '')"
        :label="searchMode === 'country' ? 'Buscar por país' : 'Buscar por capital'"
        :placeholder="searchMode === 'country' ? 'Ej. Perú' : 'Ej. Lima'"
        outlined
        clearable
        :debounce="400"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-sm-4 col-md-3">
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
  query: { type: String, required: true },
  searchMode: { type: String, required: true },
  region: { type: String, default: null },
  regionOptions: { type: Array, required: true },
})

const emit = defineEmits(['update:query', 'update:searchMode', 'update:region'])

const searchOptions = [
  { label: 'Capital', value: 'capital' },
  { label: 'País', value: 'country' },
]
</script>
