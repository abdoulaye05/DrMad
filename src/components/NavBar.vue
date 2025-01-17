<template>
  <v-app-bar app color="#7b241c" dark>
    <!-- Titre principal -->
    <v-toolbar-title class="ml-2">
      <!-- Logo cliquable qui redirige vers Shop Home -->
      <v-btn icon :to="{ name: 'home', }" class="ml-3">
        <v-img
            src="@/assets/logo1.png"
            alt="Logo"
            max-height="80"
            max-width="80"
            class="logo"
        />
      </v-btn>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Boutons de navigation pour tous les utilisateurs -->
    <v-btn text :to="{ name: 'bankaccount' }" exact>
      <v-icon left>mdi-store</v-icon> Bank Account
    </v-btn>

    <!-- Boutons supplémentaires pour utilisateurs connectés -->
    <template v-if="isLoggedIn">
      <v-btn text :to="{ name: 'shoppay' }" exact>
        <v-icon left>mdi-virus</v-icon> Payer
      </v-btn>
      <v-btn text :to="{ name: 'shopbuy' }" exact>
        <v-icon left>mdi-cart</v-icon> Acheter
      </v-btn>
      <v-btn text :to="{ name: 'shoporders' }" exact>
        <v-icon left>mdi-package-variant-closed</v-icon> Commandes
      </v-btn>
      <v-btn text @click="logout">
        <v-icon left>mdi-logout</v-icon> Logout
      </v-btn>
    </template>

    <!-- Bouton Login pour utilisateurs non connectés -->
    <v-btn v-else text :to="{ name: 'shoplogin' }" exact>
      <v-icon left>mdi-login</v-icon> Login
    </v-btn>
  </v-app-bar>
</template>

<script>

import {mapMutations} from "vuex";

export default {
  name: "NavBar",
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true, // Passé comme prop depuis le parent
    },
  },
  methods: {
    ...mapMutations("shop", ["updateShopUser"]),
    logout() {
      this.updateShopUser(null); // Déconnecte l'utilisateur côté Vuex
      this.$router.push({ path: "/shop/home" }); // Redirige vers la page d'accueil
    },
  },
};
</script>

<style scoped>
.logo {
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}
</style>