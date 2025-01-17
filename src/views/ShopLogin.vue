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
              @click="handleLogin"
          >
            Login
          </v-btn>
        </v-form>
        <v-alert
            v-if="loginError"
            type="error"
            class="mt-3"
        >
          {{ loginError }}
        </v-alert>
        <v-alert
            v-if="shopUser"
            type="success"
            class="mt-3"
        >
          Welcome, {{ shopUser.name || shopUser.login }}!
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ShopLogin",
  data: () => ({
    login: "",
    password: "",
    errorDialog: false,
    errorMessage: "",
  }),
  computed: {
    ...mapState(["shopUser"]), // Utilisateur connecté
  },
  methods: {
    ...mapActions("shop", ["shopLogin"]),
    async handleLogin() {
      try {
        await this.shopLogin({ login: this.login, password: this.password });
        this.$router.push({ name: "shopbuy" }); // Redirige vers la boutique après connexion
      } catch (error) {
        this.errorMessage = error.message;
        this.errorDialog = true;
      }
    },
  },
};
</script>
