<script lang="ts" setup>
import type { World } from '~/types/bardo';
import { myWorldsQuery } from '~/gql/queries/myWorlds';
import { useCreateWorld } from '~/composables/useCreateWorld';
import { useUpdateWorld } from '~/composables/useUpdateWorld';
import { useDeleteWorld } from '~/composables/useDeleteWorld';

interface MyWorldsData {
  myWorlds: World[];
}

const userStore = useUserStore();

const { data, pending: loading, error: queryError, refresh } = useQuery<MyWorldsData>(myWorldsQuery);
const worlds = computed(() => data.value?.myWorlds ?? []);

const { createWorld, pending: creating, error: createError } = useCreateWorld();
const { updateWorld, pending: updating, error: updateError } = useUpdateWorld();
const { deleteWorld, pending: deleting, error: deleteError } = useDeleteWorld();

const createModalOpen = ref(false);
const editModalOpen = ref(false);
const deleteModalOpen = ref(false);
const selectedWorld = ref<World | null>(null);

const createForm = reactive({ name: '', description: '' });
const editForm = reactive({ name: '', description: '' });

function openCreate() {
  if (!userStore.isAuthenticated) {
    navigateTo('/auth/login');
    return;
  }
  createForm.name = '';
  createForm.description = '';
  createError.value = null;
  createModalOpen.value = true;
}

function openEdit(world: World) {
  if (!userStore.isAuthenticated) {
    navigateTo('/auth/login');
    return;
  }
  selectedWorld.value = world;
  editForm.name = world.name;
  editForm.description = world.description ?? '';
  updateError.value = null;
  editModalOpen.value = true;
}

function openDelete(world: World) {
  if (!userStore.isAuthenticated) {
    navigateTo('/auth/login');
    return;
  }
  selectedWorld.value = world;
  deleteError.value = null;
  deleteModalOpen.value = true;
}

function closeCreate() {
  createModalOpen.value = false;
  selectedWorld.value = null;
}

function closeEdit() {
  editModalOpen.value = false;
  selectedWorld.value = null;
}

function closeDelete() {
  deleteModalOpen.value = false;
  selectedWorld.value = null;
}

async function onSubmitCreate() {
  try {
    await createWorld(
      createForm.name.trim(),
      createForm.description.trim() || undefined
    );
    await refresh();
    closeCreate();
  } catch {
  }
}

async function onSubmitEdit() {
  if (!selectedWorld.value) return;
  try {
    await updateWorld(selectedWorld.value.id, {
      name: editForm.name.trim(),
      description: editForm.description.trim() || undefined,
    });
    await refresh();
    closeEdit();
  } catch {
  }
}

async function onConfirmDelete() {
  if (!selectedWorld.value) return;
  try {
    const ok = await deleteWorld(selectedWorld.value.id);
    if (ok) {
      await refresh();
      closeDelete();
    }
  } catch {
  }
}

const mutationError = computed(
  () => createError.value ?? updateError.value ?? deleteError.value
);

const deleteConfirmDescription = computed(() =>
  selectedWorld.value
    ? `Delete "${selectedWorld.value.name}"? This cannot be undone.`
    : ''
);
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold text-highlighted">
        Worlds
      </h1>
      <UButton
        label="New world"
        color="primary"
        icon="i-lucide-plus"
        @click="openCreate"
      />
    </div>

    <p v-if="queryError" class="text-sm text-error mb-4">
      {{ queryError.message }}
    </p>
    <p v-if="mutationError" class="text-sm text-error mb-4">
      {{ mutationError.message }}
    </p>

    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-muted" />
    </div>

    <ul v-else-if="worlds.length === 0" class="text-muted text-center py-12">
      No worlds yet. Create one to get started.
    </ul>

    <ul v-else class="grid gap-4 sm:grid-cols-2">
      <li
        v-for="world in worlds"
        :key="world.id"
        class="rounded-lg border border-default bg-default p-4 flex flex-col"
      >
        <h2 class="font-medium text-highlighted truncate">
          {{ world.name }}
        </h2>
        <p
          v-if="world.description"
          class="text-sm text-muted mt-1 line-clamp-2 flex-1"
        >
          {{ world.description }}
        </p>
        <p v-else class="text-sm text-muted mt-1 flex-1">
          No description
        </p>
        <div class="flex gap-2 mt-4">
          <UButton
            label="Edit"
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-pencil"
            @click="openEdit(world)"
          />
          <UButton
            label="Delete"
            color="error"
            variant="outline"
            size="sm"
            icon="i-lucide-trash-2"
            @click="openDelete(world)"
          />
        </div>
      </li>
    </ul>

    <UModal v-model:open="createModalOpen" title="New world" :ui="{ footer: 'justify-end' }">
      <template #body>
        <form class="space-y-4" @submit.prevent="onSubmitCreate">
          <UFormField label="Name" required>
            <UInput
              v-model="createForm.name"
              placeholder="World name"
              required
            />
          </UFormField>
          <UFormField label="Description">
            <UTextarea
              v-model="createForm.description"
              placeholder="Optional description"
              :rows="3"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <UButton color="neutral" variant="outline" label="Cancel" @click="closeCreate" />
        <UButton
          label="Create"
          :loading="creating"
          :disabled="creating || !createForm.name.trim()"
          @click="onSubmitCreate"
        />
      </template>
    </UModal>

    <UModal v-model:open="editModalOpen" title="Edit world" :ui="{ footer: 'justify-end' }">
      <template #body>
        <form class="space-y-4" @submit.prevent="onSubmitEdit">
          <UFormField label="Name" required>
            <UInput
              v-model="editForm.name"
              placeholder="World name"
              required
            />
          </UFormField>
          <UFormField label="Description">
            <UTextarea
              v-model="editForm.description"
              placeholder="Optional description"
              :rows="3"
            />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <UButton color="neutral" variant="outline" label="Cancel" @click="closeEdit" />
        <UButton
          label="Save"
          :loading="updating"
          :disabled="updating || !editForm.name.trim()"
          @click="onSubmitEdit"
        />
      </template>
    </UModal>

    <UModal
      v-model:open="deleteModalOpen"
      title="Delete world"
      :description="deleteConfirmDescription"
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer>
        <UButton color="neutral" variant="outline" label="Cancel" @click="closeDelete" />
        <UButton
          label="Delete"
          color="error"
          :loading="deleting"
          :disabled="deleting"
          @click="onConfirmDelete"
        />
      </template>
    </UModal>
  </div>
</template>
