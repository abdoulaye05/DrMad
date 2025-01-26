<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
    <v-card class="elevation-12 pa-4" max-width="500" outlined color="#f8f9fa">
      <v-card-title class="text-h5 text-center">Paiement de la Commande</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <!-- Message avec l'UUID et le total de la commande -->
        <p v-if="uuid || commandUuid" class="text-center mt-2">
          Vous êtes sur le point de payer la commande n° <strong>{{ uuid || commandUuid }}</strong>.
          <br />
          Montant total :
          <strong v-if="isTotalValid">{{ total.toFixed(2) }} €</strong>
          <span v-else class="text-danger">Non défini</span>
        </p>
        <p v-else class="text-center text-danger mt-2">
          Merci de renseigner l'UUID de la commande ci-dessous.
        </p>

        <!-- Champ pour UUID de la commande si non fourni -->
        <v-text-field
            v-if="!uuid"
            v-model="commandUuid"
            label="UUID de la commande"
            outlined
            dense
            class="mt-4"
            :rules="[v => !!v || 'Ce champ est obligatoire']"
            prepend-inner-icon="mdi-package"
        ></v-text-field>

        <!-- Champ pour UUID de la transaction bancaire -->
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
            :disabled="isPaying || !(uuid || commandUuid) || !transactionId || !isTotalValid"
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
      default: null, // UUID de commande optionnel
    },
    total: {
      type: Number,
      default: null, // Montant total de la commande
    },
  },
  data() {
    return {
      commandUuid: "", // UUID de commande si non fourni en paramètre
      transactionId: "", // UUID de transaction bancaire
      isPaying: false, // Indicateur de chargement
      successMessage: "", // Message de succès
      errorMessage: "", // Message d'erreur
    };
  },
  computed: {
    isTotalValid() {
      return this.total !== null && this.total > 0;
    },
  },
  methods: {
    ...mapActions("shop", ["payOrder"]),

    async handlePayOrder() {
      const orderId = this.uuid || this.commandUuid; // Utilise l'UUID passé ou celui renseigné manuellement
      if (!orderId || !this.transactionId) {
        alert("Veuillez remplir tous les champs !");
        return;
      }

      console.log(`[ShopPay] Paiement de la commande n° ${orderId} avec UUID de transaction : ${this.transactionId}`);
      this.isPaying = true;
      this.successMessage = "";
      this.errorMessage = "";

      try {
        // Appel Vuex pour effectuer le paiement
        const response = await this.payOrder({
          orderId,
          transactionId: this.transactionId,
        });

        console.log("[ShopPay] Réponse reçue :", response);

        if (response.error === 0) {
          // Succès du paiement
          this.successMessage = `Paiement effectué avec succès pour la commande n° ${orderId}.`;
          console.log("[ShopPay] Paiement réussi :", response.data);

          // Redirection vers la page des commandes
          setTimeout(() => {
            this.$router.push({ name: "shoporders" });
          }, 1500);
        } else {
          // Erreur lors du paiement
          this.errorMessage = response.data || "Erreur lors du paiement.";
          console.error("[ShopPay] Erreur lors du paiement :", response);
        }
      } catch (error) {
        // Erreur réseau
        this.errorMessage = "Une erreur réseau s'est produite. Veuillez réessayer.";
        console.error("[ShopPay] Erreur réseau lors du paiement :", error);
      } finally {
        this.isPaying = false;
      }
    },
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
