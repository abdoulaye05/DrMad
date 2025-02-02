<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5 text-center" elevation="3" max-width="400">
      <v-card-title class="justify-center">
        <h1>🔒 Déconnexion en cours...</h1>
      </v-card-title>

      <v-card-subtitle>
        Vous allez être redirigé vers l'accueil de la banque.
      </v-card-subtitle>

      <v-progress-circular
          indeterminate
          color="red"
          size="50"
          class="mt-3"
      />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "BankLogout",
  mounted() {
    setTimeout(() => {
      this.$store.commit("bank/updateCurrentAccount", null);
      this.$router.push("/bank");
    }, 1000);
  },
};
</script>
