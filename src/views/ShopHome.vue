<template>
  <v-container class="mt-5 d-flex justify-center">
    <v-card class="elevation-12" max-width="400">
      <v-card-title class="text-h5 text-center">Welcome to the Shop</v-card-title>
      <v-card-text>
        <p class="text-center">Explore our products and enjoy shopping!</p>
        <v-btn
            color="primary"
            block
            class="mt-4"
            @click="goToBuy"
        >
          Start Shopping
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ShopHome",
  methods: {
    goToBuy() {
      this.$router.push("/shop/buy");
    },
  },
};
</script>