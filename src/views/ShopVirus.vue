<template>
  <v-container class="mt-5 d-flex justify-center">
    <v-card class="elevation-12" max-width="500">
      <v-card-title class="text-h5 text-center">Viruses</v-card-title>
      <v-card-text>
        <p class="text-center">
          Welcome to our shop! Here you can buy viruses to infect your computer.
        </p>
        <p class="text-center">
          We have a wide range of viruses available, from the most common to the most exotic.
        </p>
        <p class="text-center">
          Choose the viruses you want to buy and add them to your cart.
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ShopVirus",
  methods: {
    payOrder() {
      alert(`Paiement effectué pour la commande n° ${this.orderId}.`);
  },
  },
};
</script>