<template>
  <div class="nav">
    NAV
      <router-link :to="{ name: 'Intro' }">Intro</router-link>
      <router-link :to="{ name: 'ListView' }">ListView</router-link>
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
  margin: 10vh 10vw;
  border: 1px solid black;
}

</style>

