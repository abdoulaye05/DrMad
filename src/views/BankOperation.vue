<template>
  <v-container>
    <v-card class="pa-4" elevation="2">
      <v-card-title class="justify-center">💸 Débit / Virement</v-card-title>

      <v-divider class="my-3"></v-divider>

      <v-card-text>
        <!-- Inclut BankWithdrawForm pour la gestion des retraits -->
        <BankWithdrawForm v-if="!hasDestinataire" :account="currentAccount" />

        <!-- Case à cocher pour ajouter un destinataire (activer le mode virement) -->
        <v-checkbox v-model="hasDestinataire" label="Ajouter un destinataire (Virement)" />

        <!-- Champ pour le numéro de compte du destinataire -->
        <v-text-field
            v-if="hasDestinataire"
            label="Numéro de compte destinataire"
            v-model.trim="destinataire"
            outlined
            dense
        />

        <v-divider class="my-3"></v-divider>

        <!-- Bouton Valider -->
        <v-btn
            v-if="hasDestinataire"
            color="red"
            :disabled="isProcessing || !montant || !destinataire"
            @click="handleSubmit"
            block
        >
          <v-icon left>mdi-check</v-icon> Valider le Virement
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
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import BankWithdrawForm from "@/components/Bank/BankWithdrawForm.vue";

export default {
  name: "BankOperation",
  components: { BankWithdrawForm },
  data() {
    return {
      montant: null,
      hasDestinataire: false,
      destinataire: "",
      messageSucces: "",
      errorMessage: "",
      isProcessing: false,
    };
  },
  computed: {
    ...mapState("bank", ["currentAccount"]),
  },
  methods: {
    ...mapActions("bank", ["createPayment"]),
    async handleSubmit() {
      this.errorMessage = "";
      this.isProcessing = true;

      if (!this.montant || this.montant <= 0) {
        this.errorMessage = "⚠️ Veuillez entrer un montant valide.";
        this.isProcessing = false;
        return;
      }

      if (!this.destinataire) {
        this.errorMessage = "⚠️ Veuillez entrer un numéro de compte destinataire.";
        this.isProcessing = false;
        return;
      }

      try {
        const response = await this.createPayment({
          idAccount: this.currentAccount._id,
          destNumber: this.destinataire,
          amount: this.montant,
        });

        if (response.error === 0) {
          this.messageSucces = `✅ Virement validé : ${response.data.uuid}`;
          this.resetForm();
        } else {
          this.errorMessage = response.data || "Une erreur est survenue.";
        }
      } catch (error) {
        this.errorMessage = "❌ Une erreur inattendue est survenue.";
        console.error(error);
      }

      this.isProcessing = false;
    },

    resetForm() {
      this.montant = null;
      this.destinataire = "";
      this.hasDestinataire = false;
    },
  },
};
</script>
