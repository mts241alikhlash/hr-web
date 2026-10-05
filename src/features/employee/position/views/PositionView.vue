<script setup lang="ts">
import { DataTable, SearchInput } from '@mts241alikhlash/ui'
import { Button } from '@mts241alikhlash/ui/button'
import { Card, CardHeader, CardTitle } from '@mts241alikhlash/ui/card'
import { Plus } from '@lucide/vue'
import { onMounted, ref } from 'vue'
import PositionFormDialog from '../components/PositionFormDialog.vue'
import { usePosition } from '../composables/usePosition'
import { useRoleGuard } from '@/features/platform/auth'
import { createColumns } from '../components/columns'
import type { Position } from '../types'
import { watchDebounced } from '@vueuse/core'

const { items, loading, searchQuery, fetchPositions, deletePosition } =
  usePosition()

const isAddOpen = ref(false)
const isEditDialogOpen = ref(false)
const selectedItem = ref<Position | null>(null)

const { can } = useRoleGuard()

const columns = createColumns({
  showActions: can('positions.update') || can('positions.delete'),
  canUpdate: can('positions.update'),
  canDelete: can('positions.delete'),
  onEdit: (item: Position) => {
    selectedItem.value = item
    isEditDialogOpen.value = true
  },
  onDelete: async (item: Position, { closeAlert, setLoading }) => {
    setLoading(true)
    const success = await deletePosition(item.id)
    setLoading(false)
    if (success) {
      closeAlert()
    }
  },
})

watchDebounced(
  searchQuery,
  () => {
    void fetchPositions({ search: searchQuery.value })
  },
  { debounce: 400 },
)

onMounted(() => {
  void fetchPositions()
})
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <Card
      class="overflow-hidden rounded-2xl shadow-sm shadow-black/5 ring-1 ring-black/4"
    >
      <CardHeader
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b px-6 py-5 gap-4"
      >
        <div>
          <CardTitle class="text-2xl font-bold tracking-tight">
            Daftar Jabatan
          </CardTitle>
        </div>
        <div
          v-if="can('positions.create')"
          class="flex flex-col sm:flex-row w-full sm:w-auto gap-2"
        >
          <Button
            class="w-full sm:w-auto"
            @click="isAddOpen = true"
          >
            <Plus class="mr-2 h-4 w-4" /> Tambah Jabatan
          </Button>
        </div>
      </CardHeader>

      <div class="p-6">
        <DataTable
          :columns="columns"
          :data="items"
          :is-loading="loading"
          item-label="jabatan"
        >
          <template #header-right>
            <SearchInput
              v-model="searchQuery"
              label="Cari jabatan"
            />
          </template>
        </DataTable>
      </div>
    </Card>

    <PositionFormDialog
      v-if="can('positions.create')"
      v-model:open="isAddOpen"
      @success="fetchPositions"
    />

    <PositionFormDialog
      v-if="can('positions.update')"
      v-model:open="isEditDialogOpen"
      :initial-data="selectedItem"
      @success="fetchPositions"
    />
  </div>
</template>
