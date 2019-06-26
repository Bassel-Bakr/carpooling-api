<template>
  <v-content>
    <v-container fill-width fill-height>
      <v-layout justify-center>
        <v-card>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="person"
                v-model="name"
                label="Username"
                @input="$v.name.touch"
                :error-messages="nameErrors"
              ></v-text-field>

              <v-text-field
                prepend-icon="lock"
                v-model="password"
                label="Password"
                type="password"
                @input="$v.password.touch"
                :error-messages="passwordErrors"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="login" :disabled="invalidInput">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-container>

    <!-- stray snackbar -->
    <v-snackbar top v-model="snackbar" :timeout="2000">{{ message }}</v-snackbar>
  </v-content>
</template>

<script>
import router from "../router";
import eventBus from "../eventBus";
import limits from "../../../middle/limits";
import {
  required,
  sameAs,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  name: "Login",
  data() {
    return {
      name: "",
      password: "",
      action: "api/login",
      snackbar: false,
      message: ""
    };
  },
  computed: {
    nameErrors() {
      let errors = [];
      !this.$v.name.required && errors.push("Required");
      !this.$v.name.maxLength &&
        errors.push(`At most ${limits.nameLimits.max} characters`);
      return errors;
    },
    passwordErrors() {
      let errors = [];
      !this.$v.password.required && errors.push("Required");
      !this.$v.password.minLength &&
        errors.push(`At least ${limits.passwordLimits.min} characters`);
      !this.$v.password.maxLength &&
        errors.push(`At most ${limits.passwordLimits.max} characters`);
      return errors;
    },
    invalidInput() {
      return this.nameErrors.length + this.passwordErrors.length > 0;
    }
  },
  validations: {
    ...limits.validations
  },
  methods: {
    login() {
      const credentials = {
        name: this.name,
        password: this.password
      };

      console.log(credentials);
      this.$http.post(this.action, credentials).then(
        res => {
          eventBus.$emit("userLogin");
          router.replace("/");
          this.message = res.body;
          this.snackbar = true;
        },
        err => {
          if (err.status == 401) {
            this.message = err.body;
            this.snackbar = true;
          } else {
            console.log(err);
          }
        }
      );
    }
  }
};
</script>

<style lang="sass">
input
    display: block
</style>
