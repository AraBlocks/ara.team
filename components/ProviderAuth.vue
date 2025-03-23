<template>
  <div class="auth-buttons">
    <NuxtLink 
      to="/api/auth/signin/discord" 
      class="button discord"
    >
      Verify with Discord
    </NuxtLink>
    <NuxtLink 
      to="/api/auth/signin/twitter" 
      class="button twitter"
    >
      Verify with Twitter
    </NuxtLink>
  </div>
</template>

<style scoped>
.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto;
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
}

.button:hover {
  opacity: 0.9;
}

.discord {
  background-color: #5865F2;
  color: white;
}

.twitter {
  background-color: #1DA1F2;
  color: white;
}
</style> 