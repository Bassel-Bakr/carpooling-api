<template>
  <div>
    <APIEndPoint
      class="api"
      v-for="api in apis"
      :key="api.name"
      :title="api.name"
      :description="api.description"
      :options="api.options"
      :example="api.example"
      :output="api.output"
    ></APIEndPoint>
  </div>
</template>

<script>
import APIEndPoint from "./APIEndPoint";
import apiList from "../api";
export default {
  name: "API",
  components: {
    APIEndPoint
  },
  data() {
    return {
      apis: apiList
    };
  },
  methods: {}
};
</script>

<style lang="sass">
.api
    margin-top: 2rem
    box-shadow: 0 0 1px 1px black
</style>
