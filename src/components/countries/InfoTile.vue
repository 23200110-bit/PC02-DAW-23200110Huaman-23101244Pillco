<template>
  <!-- Componente reutilizable: dato del país con etiqueta y valor -->
  <div
    class="info-tile q-pa-md rounded-borders"
    :class="{ 'cursor-pointer clickable': clickable }"
    @click="clickable && emit('click')"
  >
    <div class="text-caption text-grey-7">
      {{ label }}
      <q-icon v-if="clickable" name="chevron_right" size="xs" />
    </div>
    <div class="text-subtitle1 text-weight-bold">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    default: '—',
  },
  clickable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])
</script>

<style scoped>
.info-tile {
  background: #f6f7f9;
  height: 100%;
}
.clickable:hover {
  background: #eaf2fd;
}
</style>
