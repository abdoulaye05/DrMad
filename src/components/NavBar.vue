<template>
  <v-app-bar app color="#7b241c" dark>
    <!-- Titre principal -->
    <v-toolbar-title class="ml-2">
      <!-- Logo cliquable qui redirige vers Shop Home -->
      <v-btn icon :to="{ path: '/shop/home' }" class="ml-3">
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
      <v-btn text :to="{ name: 'shopitems' }" exact>
        <v-icon left>mdi-virus</v-icon> Virus
      </v-btn>
      <v-btn text :to="{ path: '/shop/buy' }" exact>
        <v-icon left>mdi-cart</v-icon> Buy
      </v-btn>
      <v-btn text :to="{ path: '/shop/orders' }" exact>
        <v-icon left>mdi-package-variant-closed</v-icon> Orders
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
export default {
  name: "NavBar",
  data() {
    return {
      isLoggedIn: false, // État de connexion de l'utilisateur
    };
  },
  methods: {
    login() {
      this.isLoggedIn = true;
    },
    logout() {
      this.isLoggedIn = false;
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped>
/*.v-btn {
  margin-left: 10px;
  font-weight: bold;
}*/

/*.v-toolbar-title {
  font-weight: bold;
  font-size: 1.2rem;
}*/

/* Animation au survol du logo */
.logo {
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}
</style>
