<template>
  <v-card class="pa-5" elevation="2">
    <v-card-title class="justify-center">💸 Effectuer un retrait</v-card-title>

    <v-divider class="my-3"></v-divider>

    <v-card-text>
      <p><strong>Compte :</strong> {{ account.number }}</p>
      <p><strong>Solde actuel :</strong>
        <v-chip :color="account.amount < 0 ? 'red' : 'green'" class="text-white">
          {{ account.amount }} €
        </v-chip>
      </p>

      <!-- Champ pour le montant -->
      <v-text-field
          v-model.number="amount"
          label="Montant (€)"
          type="number"
          min="0.01"
          outlined
          dense
      />

      <!-- Bouton Valider -->
      <v-btn
          color="red"
          :disabled="isProcessing || !amount"
          @click="submitWithdraw"
          block
      >
        <v-icon left>mdi-check</v-icon> Valider
        <v-progress-circular v-if="isProcessing" indeterminate size="20" class="ml-2" />
      </v-btn>

      <!-- Message d'erreur -->
      <v-alert v-if="errorMessage" type="error" dense class="mt-3">
        {{ errorMessage }}
      </v-alert>

      <!-- Notification de succès -->
      <v-snackbar v-model="messageSucces" timeout="5000" color="green">
        {{ messageSucces }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="messageSucces = false">
            OK
          </v-btn>
        </template>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "BankWithdrawForm",
  props: {
    account: { type: Object, required: true },
  },
  data() {
    return {
      amount: null,
      messageSucces: "",
      errorMessage: "",
      isProcessing: false,
    };
  },
  methods: {
    ...mapActions("bank", ["createWithdraw"]),
    async submitWithdraw() {
      this.errorMessage = "";
      this.isProcessing = true;

      if (!this.amount || this.amount <= 0) {
        this.errorMessage = "⚠️ Veuillez entrer un montant valide.";
        this.isProcessing = false;
        return;
      }

      try {
        const response = await this.createWithdraw({
          idAccount: this.account._id,
          amount: this.amount,
        });

        if (response.error === 0) {
          this.messageSucces = `✅ Retrait validé : ${response.data.uuid}`;
          this.amount = null;
        } else {
          this.errorMessage = response.data || "Une erreur est survenue.";
        }
      } catch (error) {
        this.errorMessage = "❌ Une erreur inattendue est survenue.";
        console.error(error);
      }

      this.isProcessing = false;
    },
  },
};
</script>
