<template>
  <div class="min-h-screen bg-black text-white">
    <header class="border-b border-slate-800 bg-black">
      <nav class="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <RouterLink class="font-semibold text-white" to="/">Time Tracking</RouterLink>
        <RouterLink class="text-slate-300 hover:text-white" to="/">Home</RouterLink>
        <RouterLink class="text-slate-300 hover:text-white" to="/login">Login</RouterLink>
      </nav>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
