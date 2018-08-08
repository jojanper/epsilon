<template>
  <div class="home">
    <img src="../assets/logo.png">
    <draal-hello-world msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import DraalHelloWorld from '@/components/HelloWorld.vue';

export default {
    name: 'home',
    components: {
        DraalHelloWorld
    }
};
</script>
