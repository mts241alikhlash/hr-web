<script setup lang="ts">
import { ReferenceDataListView } from '@/reference-data'
import { usePositionCategoryConfig } from '../config'

const config = usePositionCategoryConfig()
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <ReferenceDataListView :config="config" />
  </div>
</template>
