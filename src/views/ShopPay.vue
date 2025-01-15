<template>
  <v-container class="mt-5 d-flex justify-center">
    <v-card class="elevation-12" max-width="500">
      <v-card-title class="text-h5 text-center">Paiement de la Commande</v-card-title>
      <v-card-text>
        <p class="text-center">Vous êtes sur le point de payer la commande n° {{ orderId }}.</p>
        <v-btn color="primary" block @click="payOrder">Payer Maintenant</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ShopPay",
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },
  methods: {
    payOrder() {
      alert(`Paiement effectué pour la commande n° ${this.orderId}.`);
    },
  },
};
</script>
