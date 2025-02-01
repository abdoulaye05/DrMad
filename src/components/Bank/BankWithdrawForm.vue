<template>
  <v-card class="pa-5">
    <h2>💸 Débit / Virement</h2>
    <p><strong>Compte :</strong> {{ account.number }}</p>
    <p><strong>Solde actuel :</strong> {{ account.amount }} €</p>

    <v-text-field v-model="amount" label="Montant" outlined type="number"></v-text-field>

    <v-checkbox v-model="isTransfer" label="Effectuer un virement"></v-checkbox>
    <v-text-field v-if="isTransfer" v-model="destination" label="Numéro de compte destinataire" outlined></v-text-field>

    <v-btn color="green" @click="submitTransaction">Valider</v-btn>

    <!-- ✅ Popup affiché après le virement -->
    <PaymentSuccessPopup/>
  </v-card>
</template>

<script>
import {mapActions} from "vuex";
import PaymentSuccessPopup from "./PaymentSuccessPopup.vue";

export default {
  name: "BankWithdrawForm",
  components: {PaymentSuccessPopup},
  props: {
    account: {type: Object, required: true}, // ✅ Assure que la prop `account` est bien fournie
  },
  data() {
    return {
      amount: "",
      isTransfer: false,
      destination: "",
    };
  },
  methods: {
    ...mapActions("bank", ["createPaiement", "createWithdraw"]),
    async submitTransaction() {
      console.log("🔄 Transaction soumise :", {
        montant: this.amount,
        destinataire: this.isTransfer ? this.destination : "Retrait",
      });

      if (!this.amount || this.amount <= 0) {
        alert("Veuillez entrer un montant valide.");
        return;
      }
      try {
        let response;
        if (this.isTransfer) {
          // Virement vers un autre compte
          if (!this.destination) {
            alert("Veuillez entrer un numéro de compte destinataire.");
            return;
          }
          response = await this.createPaiement({
            id_account: this.account._id,
            amount: this.amount,
            destination: this.destination,
          });
        } else {
          // Retrait simple
          response = await this.createWithdraw({
            id_account: this.account._id,
            amount: this.amount,
          });
        }
        if (response.error === 0) {
          console.log("✅ Transaction réussie, UUID :", response.data.uuid);
        } else {
          alert("Erreur lors de la transaction : " + response.data);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la transaction :", error);
      }
    },
  },
};
</script>
