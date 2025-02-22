<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card class="elevation-12 pa-4" max-width="500" outlined color="#f8f9fa">
      <v-card-title class="text-h5 text-center">Paiement de la Commande</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <!-- Champ facultatif pour l'UUID de la commande -->
        <v-text-field
            v-model="orderUuid"
            label="UUID de la commande (facultatif)"
            outlined
            dense
            class="mt-2"
            prepend-inner-icon="mdi-order-bool-descending-variant"
            @blur="loadOrder"
        ></v-text-field>

        <!-- Message avec les détails de la commande si trouvée -->
        <p v-if="order" class="text-center mt-2">
          Vous êtes sur le point de payer la commande n° <strong>{{ order.uuid }}</strong>.
          <br />
          Montant total : <strong>{{ order.total.toFixed(2) }} €</strong>
          <br />
          Date de commande : <strong>{{ formatDate(order.createdAt) }}</strong>
        </p>
        <p v-else class="text-center text-danger mt-2">
          Commande introuvable ou chargement en cours...
        </p>

        <!-- Champ pour l'UUID de la transaction bancaire -->
        <v-text-field
            v-model="transactionId"
            label="UUID de transaction bancaire"
            outlined
            dense
            class="mt-4"
            :rules="[v => !!v || 'Ce champ est obligatoire']"
            prepend-inner-icon="mdi-credit-card"
        ></v-text-field>

        <!-- Bouton de paiement -->
        <v-btn
            color="primary"
            block
            class="mt-4"
            @click="handlePayOrder"
            :loading="isPaying"
            :disabled="isPaying || !transactionId || !order"
        >
          {{ isPaying ? "Paiement en cours..." : "Payer Maintenant" }}
        </v-btn>

        <!-- Messages de succès et d'erreur -->
        <v-alert v-if="successMessage" type="success" class="mt-3 fade">
          ✅ {{ successMessage }}
        </v-alert>
        <v-alert v-if="errorMessage" type="error" class="mt-3 fade">
          ❌ {{ errorMessage }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ShopPay",
  props: {
    uuid: {
      type: String,
      default: "", // L'UUID est facultatif
    },
  },
  data() {
    return {
      orderUuid: "", // UUID local de la commande
      order: null, // Commande récupérée via l'UUID
      transactionId: "", // UUID de la transaction bancaire
      isPaying: false, // État de chargement du paiement
      successMessage: "", // Message de succès
      errorMessage: "", // Message d'erreur
    };
  },
  methods: {
    ...mapActions("shop", ["getOrder", "payOrder"]),

    // Charger les informations de la commande
    async loadOrder() {
      if (!this.orderUuid) {
        this.errorMessage = "Veuillez fournir un UUID de commande.";
        return;
      }

      try {
        // Rechercher la commande via l'UUID
        const response = await this.getOrder(this.orderUuid);
        if (response.error === 0) {
          this.order = response.data;
          this.errorMessage = "";
        } else {
          this.order = null;
          this.errorMessage = "Commande introuvable.";
        }
      } catch (error) {
        this.errorMessage = "Erreur réseau lors du chargement de la commande.";
      }
    },

    // Payer la commande
    async handlePayOrder() {
      if (!this.order || !this.transactionId) {
        alert("Veuillez remplir tous les champs !");
        return;
      }

      this.isPaying = true;
      this.successMessage = "";
      this.errorMessage = "";

      try {
        const response = await this.payOrder({
          orderId: this.order.uuid,
          transactionId: this.transactionId,
        });

        if (response.error === 0) {
          this.successMessage = `Paiement effectué avec succès pour la commande n° ${this.order.uuid}.`;

          // Redirection vers la page des commandes après le succès
          setTimeout(() => {
            this.$router.push({ name: "shoporders" });
          }, 1500);
        } else {
          this.errorMessage = response.data || "Erreur lors du paiement.";
        }
      } catch (error) {
        this.errorMessage = "Une erreur réseau s'est produite. Veuillez réessayer.";
      } finally {
        this.isPaying = false;
      }
    },

    // Simple version de la méthode pour formater la date
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  async created() {
    // Si un UUID est fourni via les props, initialiser le champ local et charger la commande
    if (this.uuid) {
      this.orderUuid = this.uuid;
      await this.loadOrder();
    }
  },
};
</script>

<style scoped>
.text-danger {
  color: red;
}
.fade {
  transition: all 0.5s ease;
}
</style>
