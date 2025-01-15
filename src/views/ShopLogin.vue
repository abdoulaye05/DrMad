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
    loginError: null, // Gestion locale de l'erreur de login
  }),
  computed: {
    ...mapState(["shopUser"]), // Utilisateur connecté
  },
  methods: {
    ...mapActions('shop', ["s2hopLogin"]), // Action Vuex pour la connexion
    async handleLogin() {
      this.loginError = null; // Réinitialisation de l'erreur
      console.log('Tentative de connexion avec', this.login, this.password);


      const response = await this.shopLogin({ login: this.login, password: this.password });
      console.log('Réponse du serveur', response);


      if (response.error) {
        // Gestion de l'erreur (message affiché dans un v-alert)
        this.loginError = response.data;
      } else {
        console.log('Connexion réussie, redirection vers /shop/buy');
        this.$router.push("/shop/buy");
      }
    },
  },
};
</script>
