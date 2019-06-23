<template>
  <v-content>
    <v-container fill-width fill-height>
      <v-layout justify-center>
        <v-card>
          <v-card-text>
            <v-form>
              <v-text-field required prepend-icon="person" v-model="name" label="Username"></v-text-field>

              <v-text-field
                required
                prepend-icon="lock"
                v-model="password"
                label="Password"
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="register">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import eventBus from "../eventBus";
export default {
  name: "Register",
  data() {
    return {
      name: "",
      password: "",
      action: "api/register"
    };
  },
  methods: {
    register() {
      const credentials = {
        name: this.name,
        password: this.password
      };

      console.log(credentials);
      this.$http
        .post(this.action, credentials)
        .then(res => eventBus.$emit("userLogin"), err => console.error(err));
    }
  }
};
</script>

<style lang="sass">
input
    display: block
</style>
