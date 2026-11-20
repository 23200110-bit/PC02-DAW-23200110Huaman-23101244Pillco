<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-white text-dark">
      <q-toolbar>
        <q-icon name="public" color="primary" size="sm" class="q-mr-sm" />
        <q-toolbar-title class="text-weight-bold">Country Explorer</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
