<template>
  <v-app>
    <!-- Passe une méthode directe à NavBar -->
    <NavBar :titles="navLinks" :isLoggedIn="isLoggedIn" @logout="logout" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",
  components: {
    NavBar,
  },
  computed: {
    ...mapState({
      isLoggedIn: state => !!state.shop.shopUser,
    }),
    navLinks() {
      return this.isLoggedIn
          ? [
            { text: "Home", to: { name: "shophome" }, icon: "mdi-home" },
            { text: "Logout", action: "logout", icon: "mdi-logout" },
            { text: "Acheter", to: { name: "shopbuy" }, icon: "mdi-cart" },
            { text: "Payer", to: { name: "shoppay" }, icon: "mdi-credit-card" },
            { text: "Mes commandes", to: { name: "shoporders" }, icon: "mdi-clipboard-list" },
          ]
          : [
            { text: "Home", to: { name: "shophome" }, icon: "mdi-home" },
            { text: "Login", to: { name: "shoplogin" }, icon: "mdi-login" },
            { text: "Compte Bancaire", to: { name: "bankaccount" }, icon: "mdi-bank" },
          ];
    },
  },
  methods: {
    ...mapMutations("shop", ["updateShopUser"]),
    logout() {
      this.updateShopUser(null); // Réinitialise l'utilisateur
      this.$router.push({ name: "shophome" }); // Redirige vers la page d'accueil
    },
  },
};
</script>
