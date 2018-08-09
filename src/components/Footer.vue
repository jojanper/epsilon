<template>
    <footer class="footer">
      <div class="container-fluid w-100">
        <span class="text-muted">
            <a :href="link" target="_blank">{{ title }}</a>
        </span>
      </div>
    </footer>
</template>

<script>
export default {
    name: 'DraalFooter',
    props: {
        link: {
            type: String,
            required: true
        },
        title: {
            type: String,
            reqired: true
        }
    }
};
</script>

<style lang="scss">
.footer {
  bottom: 0;
  width: 100%;
  height: 60px; /* Set the fixed height of the footer here */
  line-height: 60px; /* Vertically center the text there */
  background-color: #f5f5f5;
}
</style>
