<template>
  <div>
    <h1>Déconnexion en cours...</h1>
    <p>Vous allez être redirigé vers l'accueil de la banque.</p>
  </div>
</template>

<script>
export default {
  name: "BankLogout",
  mounted() {
    // Effectuer la déconnexion après 1 seconde
    setTimeout(() => {
      this.$store.commit("bank/updateCurrentAccount", null); // Efface le compte courant
      this.$router.push("/bank/account"); // Redirige vers l'accueil de la banque
    }, 1000);
  },
};
</script>
