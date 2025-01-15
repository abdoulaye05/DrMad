<template>
  <v-container class="mt-5 d-flex justify-center">
    <v-card class="elevation-12" max-width="400">
      <v-card-title class="text-h5 text-center">Your Orders</v-card-title>
      <v-card-text>
        <p class="text-center">View your past orders here.</p>
        <v-btn
            color="primary"
            block
            class="mt-4"
            @click="refreshOrders"
        >
          Refresh Orders
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ShopOrders",
  methods: {
    refreshOrders() {
      // Placeholder pour rafraîchir les commandes
      console.log("Refreshing orders...");
    },
  },
};
</script>