<template>
  <v-container class="mt-5 d-flex justify-center">
    <v-card class="elevation-12" max-width="500">
      <v-card-title class="text-h5 text-center">Paiement de la Commande</v-card-title>
      <v-card-text>
        <v-text-field
            label="ID de la commande"
            v-model="localOrderId"
            :value="orderId"
            outlined
            clearable
        ></v-text-field>
        <v-btn
            color="primary"
            block
            :disabled="!localOrderId"
            @click="payOrder"
        >
          Payer
        </v-btn>
        <v-alert v-if="errorMessage" type="error" class="mt-3">
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

import controller from "@/datasource/controller";

export default {
  name: "ShopPay",
  props: {
    orderId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      localOrderId: this.orderId,
      errorMessage: "",
    };
  },
  methods: {
    async payOrder() {
      this.errorMessage = "";

      try {
        // Simuler une API qui vérifie et finalise la commande
        const response = controller.finalizeOrder(this.$store.state.userId, this.localOrderId);

        if (response.success) {
          // Redirection vers les commandes de l'utilisateur courant
          this.$router.push("/user/orders");
        } else {
          this.errorMessage = response.data;
        }
      } catch (error) {
        this.errorMessage = "Une erreur est survenue lors du paiement.";
      }
    },
    finalizeOrder(orderId) {
      // Simulation d'une API de validation de commande
      return new Promise((resolve) => {
        setTimeout(() => {
          const validOrderIds = ["123", "456", "789"]; // Exemple d'IDs valides
          if (validOrderIds.includes(orderId)) {
            resolve({ success: true });
          } else {
            resolve({ success: false, message: "Commande non trouvée." });
          }
        }, 1000);
      });
    },
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
