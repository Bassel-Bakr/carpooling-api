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
                prepend-icon="email"
                v-model="email"
                label="Email"
                @input="$v.email.touch"
                :error-messages="emailErrors"
              ></v-text-field>

              <v-text-field
                prepend-icon="lock"
                v-model="password"
                label="Password"
                type="password"
                @input="$v.password.touch"
                :error-messages="passwordErrors"
              ></v-text-field>

              <v-text-field
                prepend-icon="lock"
                v-model="repeatPassword"
                label="Repeat password"
                type="password"
                @input="$v.repeatPassword.touch"
                :error-messages="repeatPasswordErrors"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="register" :disabled="invalidInput">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-container>

    <!-- stray snackbar -->
    <v-snackbar top v-model="snackbar" :timeout="2000">{{ message }}</v-snackbar>
  </v-content>
</template>

<script>
import eventBus from "../eventBus";
import limits from "../../../middle/limits";

export default {
  name: "Register",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
      action: "api/register",
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
    emailErrors() {
      let errors = [];
      !this.$v.email.required && errors.push("Required");
      !this.$v.email.email && errors.push("Invalid email");
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
    repeatPasswordErrors() {
      let errors = [];
      !this.$v.repeatPassword.sameAs &&
        errors.push("Must match password field");
      return errors;
    },
    invalidInput() {
      return (
        this.nameErrors.length +
          this.emailErrors.length +
          this.passwordErrors.length +
          this.repeatPasswordErrors.length >
        0
      );
    }
  },
  validations: {
    ...limits.validations
  },
  methods: {
    register() {
      const credentials = {
        name: this.name,
        email: this.email,
        password: this.password
      };

      console.log(credentials);
      this.$http.post(this.action, credentials).then(
        res => {
          this.message = res.body;
          this.snackbar = true;
        },
        err => console.log(err)
      );
    }
  }
};
</script>

<style lang="sass">
input
    display: block
</style>
