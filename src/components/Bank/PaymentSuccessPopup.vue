<template>
  <v-dialog v-model="isVisible" max-width="400px">
    <v-card>
      <v-card-title class="headline">
        ✅ Virement Réussi !
      </v-card-title>
      <v-card-text>
        <p>Le virement a été effectué avec succès.</p>
        <p><strong>UUID :</strong> <span class="uuid">{{ paymentUUID }}</span></p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closePopup">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "PaymentSuccessPopup",
  computed: {
    ...mapState("bank", ["paymentUUID"]),
    isVisible() {
      return !!this.paymentUUID; // ✅ Affiche le popup si l'UUID est défini
    },
  },
  methods: {
    ...mapMutations("bank", ["setPaymentUUID"]),
    closePopup() {
      this.setPaymentUUID(null); // ✅ Cache le popup après validation
    },
  },
};
</script>

<style scoped>
.uuid {
  color: #1976d2;
  font-weight: bold;
}
</style>
