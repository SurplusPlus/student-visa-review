<template>
  <div id="debug">
    <select v-model="sky" >
      <option>day</option>
      <option>night</option>
    </select>
        
  </div>
</template>

<script>



export default {
  name: "Debug",
  data() {
    return {
  };
  },
  components: {
  },
  computed: {
    sky: {
      get() {
        return this.$store.state.sky;
      },
      set(value) {
        this.$store.commit("setSky", value);
      },
    }
  },
  methods: {
  },
  watch: {
    sky: function(val) {
      if(val === "night") {
//        this.$store.commit("setSky", night
      }
    }
  }
};
</script>
<style scoped lang="scss">


#debug {
  position: fixed;
  bottom: 20px;
  left: 50vw;
  border: 1px solid red;
  height: 30px;
}


</style>

