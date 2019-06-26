<template>
  <v-card>
    <v-card-text>
      <v-toolbar flat>{{ title }}</v-toolbar>

      <v-spacer class="v-divider"/>

      <v-card class="v-card">
        <v-card-text>{{description}}</v-card-text>
      </v-card>

      <v-spacer class="v-divider"/>

      <v-card class="v-card">
        <v-card-text>
          <ul>
            <li v-for="option in options" :key="option.name">{{option.name}}: {{option.description}}</li>
          </ul>
        </v-card-text>
      </v-card>

      <v-spacer class="v-divider"/>

      <v-card class="v-card-api">
        <v-card-text>{{example}}</v-card-text>
      </v-card>

      <v-spacer class="v-divider"/>

      <v-card class="v-card">
        <v-card-text>
          <pre>{{output}}</pre>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
// import "vuetify/lib/components/";
export default {
  name: "APIEndPoint",
  props: ["title", "description", "options", "example", "output"],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="sass">
.v-card
    box-shadow: 0 0 1px 1px yellow
    overflow: auto

.v-card-api
    font-style: italic

.v-divider
    // padding: 0.5rem

pre
    max-height: 30vh
</style>
