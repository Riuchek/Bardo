<script lang="ts" setup>
import { useUserStore } from '~/stores/user';
import { useLogin } from '~/composables/useLogin';

const userStore = useUserStore();
const { login, pending, error } = useLogin();

const form = reactive({
  email: '',
  password: '',
});

if (userStore.isAuthenticated) {
  await navigateTo('/');
}

async function onSubmit() {
  try {
    await login({ email: form.email, password: form.password });
    await navigateTo('/');
  } catch {
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm space-y-6">
      <h1 class="text-2xl font-semibold text-center">
        Login
      </h1>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Email">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="email@example.com"
            required
            autocomplete="email"
          />
        </UFormField>

        <UFormField label="Password">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </UFormField>

        <p v-if="error" class="text-sm text-error">
          {{ error.message }}
        </p>

        <UButton
          type="submit"
          block
          :loading="pending"
          :disabled="pending"
        >
          Sign in
        </UButton>
      </form>

      <p class="text-center text-sm text-muted">
        No account?
        <NuxtLink to="/auth/register" class="font-medium text-primary hover:underline">
          Register
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
