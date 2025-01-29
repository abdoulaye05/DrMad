<template>
  <v-container fluid>
    <v-card class="mx-auto pa-4" max-width="600" elevation="4">
      <!-- Titre -->
      <v-card-title class="headline">Compte Bancaire</v-card-title>
      <v-card-text>
        <!-- Champ de saisie pour le numéro de compte -->
        <v-row>
          <v-col cols="12">
            <v-text-field
                v-model="number"
                label="Numéro de compte"
                outlined
                dense
                clearable
                @click:clear="resetAccountNumber"
                :error="accountNumberError === -1"
                :error-messages="accountNumberError === -1 ? 'Invalid account number' : ''"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Boutons GET AMOUNT et GET TRANSACTIONS -->
        <v-row>
          <v-col cols="6">
            <v-btn
                :style="{ backgroundColor: '#7B241C', color: 'white' }"
                :disabled="!isAccountNumberValid"
                @click="getAccountAmount(number)"
                block
            >
              OBTENIR LE MONTANT
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
                :style="{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #7B241C' }"
                :disabled="!isAccountNumberValid"
                @click="getAccountTransactions(number)"
                block
            >
              OBTENIR LES TRANSACTIONS
            </v-btn>
          </v-col>
        </v-row>

        <!-- Résultat du montant disponible -->
        <v-divider></v-divider>
        <v-row v-if="accountNumberError === 1" class="mt-4">
          <v-col cols="12" class="text-center">
            <h3>Available Amount:</h3>
            <v-chip color="green" outlined>{{ accountAmount }} €</v-chip>
          </v-col>
        </v-row>

        <!-- Transactions passées -->
        <v-divider class="mt-4"></v-divider>
        <v-row v-if="accountNumberError === 1" class="mt-4">
          <v-col cols="12">
            <h3>Passed Transactions:</h3>
            <v-list dense>
              <v-list-item v-for="(trans, index) in accountTransactions" :key="index">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ trans.amount }} € on {{ convertDate(trans.date.$date) }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Bouton Reset -->
      <v-card-actions>
        <v-btn text color="grey" @click="resetAccountNumber">RESET</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "BankAccountView",
  data: () => ({
    number: "",
  }),
  computed: {
    ...mapState("bank", ["accountAmount", "accountTransactions", "accountNumberError"]),
    isAccountNumberValid() {
      const rexp = RegExp("^[A-Za-z0-9]{22}-[0-9]{7}$", "g");
      return rexp.test(this.number);
    },
  },
  methods: {
    ...mapActions("bank", ["getAccountAmount", "getAccountTransactions"]),
    ...mapMutations("bank", ["updateAccountNumberError"]),
    convertDate(date) {
      let d = new Date(date);
      return (
          d.getMonth() +
          1 +
          "/" +
          d.getDate() +
          "/" +
          d.getFullYear() +
          " at " +
          d.getHours() +
          ":" +
          d.getMinutes() +
          ":" +
          d.getSeconds()
      );
    },
    resetAccountNumber() {
      this.number = "";
      this.updateAccountNumberError(0);
    },

  },
};
</script>