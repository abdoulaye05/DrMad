<template>
  <v-container class="mt-5 d-flex justify-center">
    <v-card class="elevation-12" max-width="400">
      <v-card-title class="text-h5 text-center">Login</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
              v-model="login"
              label="Login"
              outlined
              dense
          ></v-text-field>
          <v-text-field
              v-model="password"
              label="Password"
              type="password"
              outlined
              dense
          ></v-text-field>
          <v-btn
              color="primary"
              block
              class="mt-4"
              @click="shopLogin({ login, password })"
          >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
      <v-alert
          v-if="shopUser"
          type="success"
          class="mt-3"
      >
        Welcome, {{ shopUser.name || shopUser.login }}!
      </v-alert>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ShopLoginView",
  data: () => ({
    login: "",
    password: "",
  }),
  computed: {
    ...mapState(["shopUser"]),
  },
  methods: {
    ...mapActions(["shopLogin"]),
  },
};
</script>
