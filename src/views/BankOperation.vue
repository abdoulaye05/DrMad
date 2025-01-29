<template>
  <div>
    <h1>Bank Operation</h1>

    <!--  montant Input-->
    <div class="form-group">
      <label for="montant">Montant :</label>
      <input
          type="number"
          id="montant"
          v-model="montant"
          placeholder="Entrez le montant"
          min="0.01"
      />
    </div>

    <!-- Checkbox for destinataire -->
    <div class="form-group">
      <input type="checkbox" id="hasDestinataire" v-model="hasDestinataire"/>
      <label for="hasDestinataire">Destinataire</label>
    </div>

    <!-- destinataire Input -->
    <div class="form-group" v-if="hasDestinataire">
      <label for="destinataire">Numéro de compte destinataire :</label>
      <input
          type="text"
          id="destinataire"
          v-model="destinataire"
          placeholder="Entrez le numéro de compte"
      />
    </div>

    <!-- Submit Button -->
    <div class="form-group">
      <button @click="handleSubmit">Valider</button>
    </div>

    <!-- Success Message -->
    <p v-if="Messagesucces" class="success-message">
      {{ Messagesucces }}
    </p>
  </div>
</template>


<script>
import {mapActions} from "vuex";

export default {
  name: "BankOperation",
  data() {
    return {
      montant: null,
      hasDestinataire: false,
      destinataire: "",
      Messagesucces: "",
    };
  },
  methods: {
    ...mapActions("bank", ["createWithdraw", "createPayment"]),
    async handleSubmit() {
      // Validation for montant
      if (!this.montant || this.montant <= 0) {
        alert("Veuillez entrer un montant valide.");
        return;
      }

      // If destinataire is checked, validate destinataire account
      if (this.hasDestinataire && !this.destinataire) {
        alert("Veuillez entrer un numéro de compte destinataire.");
        return;
      }

      try {
        let response;

        // Perform payment or withdrawal
        if (this.hasDestinataire) {
          response = await this.createPayment({
            idAccount: this.$store.state.bank.currentAccount._id,
            destNumber: this.destinataire,
            montant: this.montant,
          });
        } else {
          response = await this.createWithdraw({
            idAccount: this.$store.state.bank.currentAccount._id,
            montant: this.montant,
          });
        }

        if (response.error === 0) {
          // Display success message with UUID
          this.Messagesucces = `L'opération est validée avec le n° : ${response.data.uuid}. Vous pouvez la retrouver dans l'historique.`;
          setTimeout(() => {
            this.Messagesucces = "";
          }, 5000); // Clear success message after 5 seconds
        } else {
          // Display error message
          alert(response.data || "Une erreur est survenue.");
        }
      } catch (error) {
        alert("Une erreur inattendue est survenue.");
        console.error(error);
      }
    },
  },
};
</script>

<style>
.form-group {
  margin-bottom: 1rem;
}
</style>
