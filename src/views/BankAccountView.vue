<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5 mx-auto" elevation="3" max-width="650">
      <!-- 🔹 Titre -->
      <v-card-title class="justify-center">
        <h2>🏦 Connexion à votre Compte Bancaire</h2>
      </v-card-title>

      <v-divider class="my-3"></v-divider>

      <!-- 🔹 Champ de saisie du numéro de compte -->
      <v-text-field
          label="Numéro de compte"
          v-model="number"
          placeholder="Entrez votre numéro de compte"
          :disabled="!!currentAccount"
          outlined
          dense
      />

      <!-- 🔹 Message d'erreur -->
      <v-alert v-if="errorMessage" type="error" dense class="my-2">
        {{ errorMessage }}
      </v-alert>

      <!-- 🔹 Boutons Connexion & Réinitialiser -->
      <v-row>
        <v-col cols="6">
          <v-btn
              color="primary"
              :disabled="!isAccountNumberValid || currentAccount"
              @click="loadAccountInfo"
              block
          >
            <v-icon left>mdi-login</v-icon> Connexion
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn color="warning" @click="resetAccount" block>
            <v-icon left>mdi-refresh</v-icon> Réinitialiser
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "BankAccountView",
  data() {
    return {
      number: "",
      errorMessage: "",
    };
  },
  computed: {
    ...mapState("bank", ["currentAccount"]),

    isAccountNumberValid() {
      const regex = /^[A-Za-z0-9]{22}-[0-9]{7}$/;
      return regex.test(this.number.trim());
    },
  },
  methods: {
    ...mapActions("bank", ["getAccount"]),
    ...mapMutations("bank", ["clearCurrentAccount"]),

    async loadAccountInfo() {
      this.errorMessage = "";
      if (!this.isAccountNumberValid) {
        this.errorMessage = "⚠️ Numéro de compte invalide.";
        return;
      }

      try {
        await this.getAccount(this.number.trim());
        if (this.currentAccount) {
          this.$router.push("/bank/amount"); // Redirection vers solde
        } else {
          this.errorMessage = "⚠️ Aucun compte trouvé.";
        }
      } catch (error) {
        this.errorMessage = "❌ Erreur de connexion.";
      }
    },

    resetAccount() {
      this.number = "";
      this.errorMessage = "";
      this.clearCurrentAccount();
      window.location.reload();
    },
  },
};
</script>
