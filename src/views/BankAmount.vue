<template>
  <v-card class="pa-5">
    <h2>💰 Solde du compte</h2>
    <p><strong>Numéro de compte :</strong> {{ accountNumber }}</p>
    <p><strong>Solde actuel :</strong> <span :style="{ color: accountAmount < 0 ? 'red' : 'green' }">{{ accountAmount }} €</span></p>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "BankAmount",
  computed: {
    ...mapState("bank", ["accountNumber", "accountAmount"]),
  },
};
</script>
