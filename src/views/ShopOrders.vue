<template>
  <v-container class="mt-5 d-flex justify-center">
    <v-card class="elevation-12 pa-4" max-width="800">
      <v-card-title class="headline text-center">
        <v-icon color="primary" class="mr-2">mdi-receipt</v-icon>
        Vos Commandes
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-data-table
            v-if="orders && orders.length > 0"
            :headers="headers"
            :items="orders"
            dense
            class="elevation-2"
            hide-default-footer
            style="border-radius: 10px; overflow: hidden;"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Liste des Commandes</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon color="primary" @click="refreshOrders">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
          </template>

          <!-- Colonne pour le statut -->
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
                :color="statusColor(item.status)"
                text-color="white"
                small
            >
              {{ formatStatus(item.status) }}
            </v-chip>
          </template>

          <!-- Colonne pour les actions -->
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex align-center">
              <v-btn
                  v-if="item.status === 'waiting_payment'"
                  color="success"
                  small
                  class="mr-2"
                  :loading="isLoading"
                  @click="processPayment(item.uuid)"
              >
                Payer
              </v-btn>
              <v-btn
                  v-if="item.status === 'waiting_payment'"
                  color="error"
                  small
                  :loading="isLoading"
                  @click="cancelOrder(item.uuid)"
              >
                Annuler
              </v-btn>
            </div>
          </template>
        </v-data-table>

        <!-- Message si aucune commande -->
        <v-alert v-else type="info" class="mt-4">
          <v-icon left>mdi-information</v-icon>
          Vous n'avez pas encore passé de commandes.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ShopOrders",
  data() {
    return {
      isLoading: false,
      headers: [
        { text: "UUID Commande", value: "uuid", align: "start", width: "40%" },
        { text: "Montant Total (€)", value: "total", align: "center", width: "20%" },
        { text: "Statut", value: "status", align: "center", width: "20%" },
        { text: "Actions", value: "actions", align: "end", sortable: false, width: "20%" },
      ],
    };
  },
  computed: {
    ...mapState("shop", {
      shopUser: (state) => state.shopUser,
      orders: (state) => state.orders || [],
    }),
  },
  methods: {
    ...mapActions("shop", ["getOrders", "payOrder", "cancelOrder"]),

    async refreshOrders() {
      console.log("[ShopOrders] Début de refreshOrders.");
      if (!this.shopUser) {
        console.error("[ShopOrders] Aucun utilisateur connecté.");
        alert("Veuillez vous connecter pour voir vos commandes.");
        return;
      }

      this.isLoading = true;
      try {
        const response = await this.getOrders(this.shopUser._id);
        console.log("[ShopOrders] Réponse reçue de getOrders :", response);

        if (response?.error === 0) {
          console.log("[ShopOrders] Commandes récupérées avec succès :", response.data);
        } else {
          console.error(
              "[ShopOrders] Erreur lors de la récupération des commandes :",
              response?.data || "Réponse invalide."
          );
          alert("Impossible de récupérer vos commandes.");
        }
      } catch (err) {
        console.error("[ShopOrders] Erreur inattendue :", err);
        alert("Erreur réseau. Veuillez réessayer.");
      } finally {
        this.isLoading = false;
        console.log("[ShopOrders] Fin de refreshOrders.");
      }
    },

    async processPayment(orderUuid) {
      console.log(`[ShopOrders] Paiement de la commande UUID : ${orderUuid}`);
      if (!orderUuid) {
        console.error("[ShopOrders] UUID manquant pour le paiement.");
        alert("Erreur : identifiant de commande manquant.");
        return;
      }

      const order = this.orders.find((o) => o.uuid === orderUuid);

      if (!order) {
        console.error("[ShopOrders] Commande introuvable pour UUID :", orderUuid);
        alert("Erreur : commande introuvable.");
        return;
      }

      console.log("[ShopOrders] Commande trouvée pour le paiement :", order);

      try {
        this.$router.push({
          name: "shoppay",
          params: {
            uuid: orderUuid,
            total: order.total,
          },
        });
        console.log("[ShopOrders] Redirection vers shoppay réussie.");
      } catch (err) {
        console.error("[ShopOrders] Erreur lors de la redirection vers ShopPay :", err);
        alert("Une erreur est survenue lors de la redirection.");
      }
    },

    async cancelOrder(orderUuid) {
      console.log(`[ShopOrders] Annulation de la commande UUID : ${orderUuid}`);
      if (!orderUuid) {
        console.error("[ShopOrders] UUID manquant pour l'annulation.");
        alert("Erreur : identifiant de commande manquant.");
        return;
      }

      try {
        this.isLoading = true;
        const response = await this.cancelOrder(orderUuid);
        console.log("[ShopOrders] Réponse reçue de cancelOrder :", response);

        if (response?.error === 0) {
          alert("Commande annulée avec succès.");
          this.refreshOrders();
        } else {
          console.error("[ShopOrders] Erreur lors de l'annulation :", response?.data || "Réponse invalide.");
          alert("Erreur lors de l'annulation.");
        }
      } catch (err) {
        console.error("[ShopOrders] Erreur inattendue lors de l'annulation :", err);
        alert("Erreur réseau. Veuillez réessayer.");
      } finally {
        this.isLoading = false;
      }
    },

    formatStatus(status) {
      switch (status) {
        case "waiting_payment":
          return "En attente de paiement";
        case "finalized":
          return "Finalisée";
        case "cancelled":
          return "Annulée";
        default:
          return "Inconnu";
      }
    },

    statusColor(status) {
      switch (status) {
        case "waiting_payment":
          return "orange";
        case "finalized":
          return "green";
        case "cancelled":
          return "red";
        default:
          return "grey";
      }
    },
  },

  mounted() {
    console.log("[ShopOrders] Composant monté. Chargement des commandes.");
    this.refreshOrders();
  },
};
</script>
