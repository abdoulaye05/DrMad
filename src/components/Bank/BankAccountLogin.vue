<template>
  <v-card class="pa-5">
    <v-card-title class="text-h5">Connexion au compte bancaire</v-card-title>
    <v-card-text>
      <v-text-field
          v-model="number"
          label="Numéro de compte"
          outlined
          dense
          placeholder="Entrer le numéro de compte"
      ></v-text-field>

      <v-btn
          :disabled="!isAccountNumberValid"
          color="blue darken-2"
          @click="validateAccount"
      >
        Valider
      </v-btn>

      <v-alert v-if="errorMessage" type="error" dense>
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "BankAccountLogin",
  data() {
    return {
      number: "",
      errorMessage: "",
    };
  },
  computed: {
    isAccountNumberValid() {
      const regex = /^[A-Za-z0-9]{22}-[0-9]{7}$/;
      return regex.test(this.number);
    },
  },
  methods: {
    ...mapActions("bank", ["getAccountAmount", "getAccountTransactions"]),

    async validateAccount() {
      console.log("🔍 [BankAccountLogin] Bouton Valider cliqué avec numéro :", this.number);

      try {
        const response = await this.getAccountAmount(this.number);
        console.log("✅ [BankAccountLogin] Réponse de getAccountAmount :", response);

        if (response && response.error === 0) {
          console.log("📜 [BankAccountLogin] Récupération des transactions...");
          await this.getAccountTransactions(this.number);

          console.log("🚀 [BankAccountLogin] Émission de `account-validated` avec :", this.number);
          this.$emit("account-validated", this.number);
        } else {
          this.errorMessage = "Numéro de compte invalide ou inexistant.";
        }
      } catch (error) {
        console.error("🔥 [BankAccountLogin] Erreur lors de la validation :", error);
        this.errorMessage = "Erreur de connexion au serveur.";
      }
    },
  },
};
</script>
