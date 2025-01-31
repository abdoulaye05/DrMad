<template>
  <div>
    <h2>Effectuer un Paiement</h2>
    <input
      type="text"
      v-model="destNumber"
      placeholder="Numéro de compte de destination"
    />
    <input
      type="number"
      v-model="amount"
      placeholder="Entrer le montant"
    />
    <button @click="pay">Submit</button>
  </div>
</template>

<script>
export default {
  name: "BankPayementForm",
  props: {
    account: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      destNumber: "",
      amount: null,
    };
  },
  methods: {
    async pay() {
      if (this.destNumber && this.amount && this.amount > 0) {
        const response = await this.$store.dispatch("bank/createPaiement", {
          idAccount: this.account._id,
          destNumber: this.destNumber,
          amount: this.amount,
        });
        if (response.error === 0) {
          alert("Paiement réussi!");
          this.$emit("refresh");
        } else {
          alert("Erreur: " + response.data);
        }
      }
    },
  },
};
</script>