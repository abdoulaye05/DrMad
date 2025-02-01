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
          <!-- Toolbar au-dessus du tableau -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Liste des Commandes</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon color="primary" @click="refreshOrders">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
          </template>

          <!-- Colonne Date de commande ou de transaction -->
          <template v-slot:[`item.transactionDate`]="{ item }">
            {{ formatDate(item) }}
          </template>

          <!-- Colonne pour le statut -->
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="statusColor(item.status)" text-color="white" small>
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
        { text: "UUID Commande", value: "uuid", align: "start", width: "30%" },
        { text: "Montant Total (€)", value: "total", align: "center", width: "15%" },
        { text: "Date de commande", value: "transactionDate", align: "center", width: "25%" },
        { text: "Statut", value: "status", align: "center", width: "15%" },
        { text: "Actions", value: "actions", align: "end", sortable: false, width: "15%" },
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
      if (!this.shopUser) {
        alert("Veuillez vous connecter pour voir vos commandes.");
        return;
      }

      this.isLoading = true;
      try {
        const response = await this.getOrders(this.shopUser._id);
        if (response?.error === 0) {
          console.log("[ShopOrders] Commandes récupérées avec succès.");
        } else {
          alert("Impossible de récupérer vos commandes.");
        }
      } catch (err) {
        console.error("[ShopOrders] Erreur réseau :", err);
        alert("Erreur réseau. Veuillez réessayer.");
      } finally {
        this.isLoading = false;
      }
    },

    async processPayment(orderUuid) {
      if (!orderUuid) {
        alert("Erreur : identifiant de commande manquant.");
        return;
      }

      this.$router.push({ name: "shoppay", params: { uuid: orderUuid } });
    },

    async cancelOrder(orderUuid) {
      if (!orderUuid) {
        alert("Erreur : identifiant de commande manquant.");
        return;
      }

      try {
        this.isLoading = true;
        const response = await this.cancelOrder(orderUuid);
        if (response?.error === 0) {
          alert("Commande annulée avec succès.");
          this.refreshOrders();
        } else {
          alert("Erreur lors de l'annulation.");
        }
      } catch (err) {
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

    formatDate(order) {
      const date = order.transactionDate || order.createdAt;
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },

  mounted() {
    this.refreshOrders();
  },
};
</script>

<style scoped>
.v-chip {
  text-transform: capitalize;
}
</style>
