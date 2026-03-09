<script lang="ts" setup>
const userStore = useUserStore();
const { clear: clearAuthCookie } = useAuthCookie();

function logout() {
  userStore.clearAuth();
  clearAuthCookie();
  navigateTo('/');
}
</script>

<template>
  <header class="sticky top-0 z-10 border-b border-default bg-default">
    <div class="container mx-auto flex h-14 items-center justify-between px-4">
      <NuxtLink to="/" class="font-semibold text-highlighted hover:opacity-80">
        Bardo
      </NuxtLink>
      <nav class="flex items-center gap-3">
        <NuxtLink
          to="/"
          class="text-muted hover:text-highlighted text-sm font-medium"
        >
          Worlds
        </NuxtLink>
        <template v-if="userStore.isAuthenticated">
          <span class="text-muted text-sm">
            {{ userStore.user.username }}
          </span>
          <UButton
            label="Logout"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="logout"
          />
        </template>
        <template v-else>
          <UButton
            to="/auth/login"
            label="Login"
            color="neutral"
            variant="ghost"
            size="sm"
          />
          <UButton
            to="/auth/register"
            label="Register"
            color="primary"
            size="sm"
          />
        </template>
      </nav>
    </div>
  </header>
</template>
