<template>
  <v-card>
    <v-card-text>
      <v-card>
        <v-card-text>
          <div v-for="prop in ['name', 'email', 'apiKey']" :key="prop">
            <v-list-tile>
              {{prop | uppercase}}
              <v-spacer/>
              {{user[prop]}}
            </v-list-tile>
          </div>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Profile",
  props: ["user"],
  components: {},
  data() {
    return {};
  },
  filters: {
    uppercase(text) {
      return text.toUpperCase();
    }
  },
  methods: {}
};
</script>

<style lang="sass">
</style>
