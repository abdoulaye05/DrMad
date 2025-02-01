<template>
  <v-container class="bank-container">
    <v-card class="pa-5 welcome-card" elevation="2">
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <h1 class="bank-title">🏦 Bienvenue dans votre Banque</h1>
          <p class="bank-subtitle">Gérez votre compte facilement et en toute sécurité.</p>
        </v-col>
      </v-row>
    </v-card>

    <v-spacer></v-spacer>

    <v-row>
      <v-col cols="12">
        <v-card class="pa-3 content-card" elevation="3">
          <router-view />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "BankHome",
};
</script>

<style scoped>
.bank-container {
  max-width: 1000px;
  margin: auto;
  padding-top: 30px;
}

.welcome-card {
  background-color: #f5f5f5;
  text-align: center;
}

.bank-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7b241c;
}

.bank-subtitle {
  font-size: 1.2rem;
  color: #555;
}

.content-card {
  margin-top: 20px;
}
</style>
