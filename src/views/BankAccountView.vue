<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title class="text-h5">Compte Bancaire</v-card-title>
      <v-card-text>
        <!-- Input for Account Number -->
        <v-text-field
            v-model="number"
            :disabled="Boolean(accountNumber)"
            dense
            label="Numéro de compte"
            outlined
            placeholder="Entrer le numéro de compte"
        ></v-text-field>

        <!-- Load Account Info Button -->
        <v-btn
            :disabled="!isAccountNumberValid || Boolean(accountNumber)"
            class="mr-2"
            color="red darken-2"
            @click="loadAccountInfo"
        >
          Charger les informations du compte
        </v-btn>

        <v-btn
            v-if="number !== ''"
            class="ml-2"
            color="grey darken-1"
            @click="resetAccount"
        >
          Réinitialiser
        </v-btn>

        <!-- Error Message -->
        <v-alert v-if="!currentAccount && number !== '' && !isAccountNumberValid" dense type="error">
          Numéro de compte invalide
        </v-alert>

        <v-divider class="my-4"></v-divider>

        <!-- Dynamic Component -->
        <component
            :is="currentView"
            :account="currentAccount || {}"
            :transactions="accountTransactions"
            @refresh="loadAccountInfo"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import BankAccountInfo from "@/components/Bank/BankAccountInfo.vue";
import BankWithdrawForm from "@/components/Bank/BankWithdrawForm.vue";
import BankPayementForm from "@/components/Bank/BankPayementForm.vue";
import BankTransactionList from "@/components/Bank/BankTransactionList.vue";

export default {
  name: "BankAccountView",
  components: {
    BankAccountInfo,
    BankWithdrawForm,
    BankPayementForm,
    BankTransactionList,
  },
  data: () => ({
    number: "", // Numéro de compte saisi
    currentView: "BankAccountInfo", // Default view to display
  }),
  computed: {
    ...mapState("bank", [
      "accountAmount",
      "accountTransactions",
      "accountNumberError",
      "accountNumber",
    ]),
    // Vérification du format du numéro de compte
    isAccountNumberValid() {
      const regex = /^[A-Za-z0-9]{22}-[0-9]{7}$/;
      return regex.test(this.number);
    },
  },
  methods: {
    ...mapActions("bank", ["getAccountAmount", "getAccountTransactions", "resetAccountNumber"]),
    ...mapMutations("bank", ["updateAccountNumber", "updateAccountNumberError"]),

    async loadAccountInfo() {
      try {
        if (this.isAccountNumberValid) {
          await this.getAccountAmount(this.number);
          this.updateAccountNumber(this.number);
          if (this.accountAmount > 0) {
            await this.getAccountTransactions(this.number);
          }
          this.currentView = "BankAccountInfo";
        }
      } catch (e) {
        console.error(e);
      }
    },
    resetAccount() {
      this.number = "";
      this.currentView = "BankAccountInfo";
      this.resetAccountNumber();
    },
  },
};
</script>