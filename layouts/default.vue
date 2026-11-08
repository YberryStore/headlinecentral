<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased selection:bg-yberry-200 selection:text-yberry-1000">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
    <CookieConsentModal />
  </div>
</template>

