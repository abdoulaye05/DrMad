<template>
  <div>
    <h2>Fonds Retirables</h2>
    <input
      type="number"
      v-model="amount"
      placeholder="Enter amount"
    />
    <button @click="withdraw">Submit</button>
  </div>
</template>

<script>
export default {
  name: "BankWithdrawForm",
  props: {
    account: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      amount: null,
    };
  },
  methods: {
    async withdraw() {
      if (this.amount && this.amount > 0) {
        const response = await this.$store.dispatch("bank/createWithdraw", {
          idAccount: this.account._id,
          amount: this.amount,
        });
        if (response.error === 0) {
          alert("Retrait réussi!");
          this.$emit("refresh");
        } else {
          alert("Erreur: " + response.data);
        }
      }
    },
  },
};
</script>