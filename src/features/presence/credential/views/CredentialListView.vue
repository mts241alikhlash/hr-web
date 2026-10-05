<script setup lang="ts">
import { DataTable, SearchInput } from '@mts241alikhlash/ui'
import { Button } from '@mts241alikhlash/ui/button'
import { Card, CardHeader, CardTitle } from '@mts241alikhlash/ui/card'
import { watchDebounced } from '@vueuse/core'
import { Plus } from '@lucide/vue'
import { computed, onMounted, ref, watch } from 'vue'
import { createCredentialColumns } from '../components/credentialColumns'
import IssueCredentialDialog from '../components/IssueCredentialDialog.vue'
import { credentialService } from '../services/credentialService'
import { useCredentialStore } from '../stores/credentialStore'
import type { Credential } from '../types'

const store = useCredentialStore()
const issueOpen = ref(false)

async function handleRevoke(credential: Credential) {
  const reason = window.prompt(
    `Alasan pencabutan kartu "${credential.holder.displayName ?? credential.holder.identifier}" (mis. kartu hilang):`,
  )
  if (!reason) return
  await credentialService.revoke(credential.id, { reason })
}

const tableColumns = computed(() =>
  createCredentialColumns((item) => void handleRevoke(item)),
)

watchDebounced(
  () => store.search,
  () => {
    store.page = 1
    void credentialService.fetchCredentials()
  },
  { debounce: 300 },
)

watch(
  () => [store.page, store.limit],
  () => void credentialService.fetchCredentials(),
)

onMounted(() => void credentialService.fetchCredentials())
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <Card
      class="overflow-hidden rounded-2xl shadow-sm shadow-black/5 ring-1 ring-black/4"
    >
      <CardHeader
        class="flex flex-row items-center justify-between border-b px-6 py-5"
      >
        <CardTitle class="text-2xl font-bold tracking-tight">
          Kartu Presensi
        </CardTitle>
        <Button @click="issueOpen = true">
          <Plus class="mr-2 h-4 w-4" />
          Terbitkan
        </Button>
      </CardHeader>

      <div class="p-6 space-y-6">
        <DataTable
          v-model:page="store.page"
          v-model:page-size="store.limit"
          :columns="tableColumns"
          :data="store.items"
          :total-items="store.totalItems"
          :is-loading="store.loading"
          item-label="kartu presensi"
        >
          <template #header-right>
            <SearchInput
              v-model="store.search"
              label="Cari nama pemegang kartu"
            />
          </template>
        </DataTable>

        <IssueCredentialDialog v-model:open="issueOpen" />
      </div>
    </Card>
  </div>
</template>
