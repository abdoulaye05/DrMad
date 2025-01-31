<template>
  <v-app>
    <v-app-bar app color="#800020" dark>
      <v-img
          src="@/assets/logo1.png"
          alt="DrMad Logo"
          max-width="100"
          class="mr-4"
      ></v-img>
      <v-spacer></v-spacer>
      <v-btn text @click="redirectTo('shopLogin')">
        <v-icon left>mdi-store</v-icon>
            Boutique </v-btn>
      <v-btn text @click="redirectTo('bankHome')">
        <v-icon left>mdi-bank</v-icon>
        Banque </v-btn>
    </v-app-bar>

    <v-container class="d-flex justify-center align-center" style="min-height: 70vh;">
      <div v-if="currentPage === 'shophome'">
        <v-img
            src="@/assets/logo1.png"
            alt="DrMad Logo"
            max-width="500"
            class="mr-4"
        ></v-img>
        <h1 class="text-h2 font-weight-bold">Bienvenue sur DrMad</h1>
      </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'ShopHome',
  data() {
    return {
      currentPage: 'shophome', // Default page
    };
  },
  methods: {
    redirectTo(route) {
      if (route === 'shopLogin') {
        this.$router.push({ name: 'shoplogin' });
      } else if (route === 'bankHome') {
        this.$router.push({ name: 'bankaccount' });
      }
    },
  },
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>