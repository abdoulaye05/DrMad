<template>
  <v-app>
    <!-- Barre de navigation avec le menu burger -->
    <NavBar :titles="navLinks" @menu-clicked="handleMenuClicked" />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: 'App',
  components: {
    NavBar,
  },
  data() {
    return {
      isLoggedIn: false, // État de l'authentification  l'utilisateur
      navLinks: [],
    };
  },
  methods: {
    handleMenuClicked(action) {
      if (action === 'logout') {
        this.logout();
      }
    },
    login() {
      this.isLoggedIn = true;
      this.updateNavLinks();
    },
    logout() {
      this.isLoggedIn = false;
      this.updateNavLinks();
      this.$router.push({ name: 'shoplogin' }); // Redirection vers la page Login
    },
    updateNavLinks() {
      this.navLinks = this.isLoggedIn
          ? [
            { text: 'Home', to: { name: 'shophome' }, icon: 'mdi-home' },
            { text: 'Logout', action: 'logout', icon: 'mdi-logout' },
            { text: 'Virus', to: { name: 'shopitems' }, icon: 'mdi-virus' },
            { text: 'Acheter', to: { name: 'shopbuy' }, icon: 'mdi-cart' },
            { text: 'Payer', to: { name: 'shoppay' }, icon: 'mdi-credit-card' },
            { text: 'Mes commandes', to: { name: 'shoporders' }, icon: 'mdi-clipboard-list' },
          ]
          : [
            { text: 'Home', to: { name: 'shophome' }, icon: 'mdi-home' },
            { text: 'Login', to: { name: 'shoplogin' }, icon: 'mdi-login' },
            { text: 'Compte Bancaire', to: { name: 'bankaccount' }, icon: 'mdi-bank' },
          ];
    },
  },
  created() {
    this.updateNavLinks();
  },
};
</script>

