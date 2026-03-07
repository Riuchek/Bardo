<script lang="ts" setup>
import { useUserStore } from '~/stores/user';
import { useRegister } from '~/composables/useRegister';

const userStore = useUserStore();
const { register, pending, error } = useRegister();

const form = reactive({
  username: '',
  email: '',
  password: '',
});

if (userStore.isAuthenticated) {
  await navigateTo('/');
}

async function onSubmit() {
  try {
    await register({
      username: form.username,
      email: form.email,
      password: form.password,
    });
    await navigateTo('/');
  } catch {
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm space-y-6">
      <h1 class="text-2xl font-semibold text-center">
        Register
      </h1>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Username">
          <UInput
            v-model="form.username"
            type="text"
            placeholder="username"
            required
            autocomplete="username"
          />
        </UFormField>

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
            autocomplete="new-password"
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
          Create account
        </UButton>
      </form>

      <p class="text-center text-sm text-muted">
        Already have an account?
        <NuxtLink to="/auth/login" class="font-medium text-primary hover:underline">
          Login
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
