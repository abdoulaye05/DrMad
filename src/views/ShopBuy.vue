<template>
  <v-container class="mt-5 d-flex justify-center">
    <v-card class="elevation-12" max-width="400">
      <v-card-title class="text-h5 text-center">Buy Products</v-card-title>
      <v-card-text>
        <p class="text-center">Select items you wish to purchase.</p>
        <v-btn
            color="primary"
            block
            class="mt-4"
            @click="confirmPurchase"
        >
          Proceed to Payment
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ShopBuy",
  methods: {
    confirmPurchase() {
      this.$router.push("/shop/pay/123"); // Exemple avec un orderId temporaire
    },
  },
};
</script>