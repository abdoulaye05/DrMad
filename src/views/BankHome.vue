<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-12 text-center" elevation="3" max-width="500">
      <v-card-title class="justify-center">
        <h2>🏦 Bienvenue dans votre Banque</h2>
      </v-card-title>

      <v-divider class="my-3"></v-divider>

      <v-card-text>
        <p>Accédez à votre compte bancaire en cliquant ci-dessous.</p>
      </v-card-text>

      <v-btn color="primary" @click="goToAccount" block>
        <v-icon left>mdi-account</v-icon> Mon compte
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "BankHome",
  methods: {
    goToAccount() {
      this.$router.push("/bank/account"); // Redirige vers BankAccountView
    },
  },
};
</script>