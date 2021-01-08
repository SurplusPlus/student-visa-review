<template>
  <div class="nav">
      <router-link :to="{ name: 'Intro' }">Intro</router-link>
      <router-link :to="{ name: 'ListView' }">ListView</router-link>
      <router-link :to="{ name: 'Landscape' }">Landscape</router-link>
  </div>
</template>

<script>

export default {
  name: "Nav",
  data() {
    return {};
  },
  components: {
  },
  computed: {
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">
.nav {
  display: flex;
  flex-direction: column;
  margin: 20px;
  border: 1px solid black;
}

</style>

