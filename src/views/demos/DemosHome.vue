<template>
  <div class="mt-3 mb-3">
    <router-link class :to="{ name: 'dogs-api' }">Dogs API</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>
