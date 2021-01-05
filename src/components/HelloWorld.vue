<template>
  <div class="hello">
    Hello World!
    <div class="headers">
      <header v-for="field in allFields" :key="field">
        {{ field }}
      </header>
    </div>
    <div class="entries">
      <div class="entry" v-for="record in records" v-bind:key="record.id">
        <div
          class="field left"
          v-for="field in Object.keys(record.fields)"
          :key="field"
        >
          {{ record.fields[field] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  computed: {
    records() {
      return this.$store.state.records;
    },
    allFields() {
      try { 
        return Object.keys(this.records[0].fields)
      } catch {
        return []
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.headers {
  font-size: 1.3em;
  margin: 1vh 0;
  padding: 1vh 0;
  border-bottom: 1px solid;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: space-between;
}

header {
  height: auto;
  flex-basis: 40%;
  text-align: left;
  padding-left: .3em;
}

header:first-child {
  flex-basis: 13%;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, p {
  padding: 0;
  margin: 0;
}

li {
  list-style: none;
}

.entries {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.entry {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: space-between;
  margin: 0.3vh 0.1vw;
}


.field {
  height: auto;
  flex-basis: 25%;
  overflow: scroll;
  padding: .4em;
}

.location {
  flex-basis:8%;
}


</style>
