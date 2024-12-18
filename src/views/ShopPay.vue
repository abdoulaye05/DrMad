<template>
  <div>
    <h1>Payer une commande</h1>
    <form>
      <label for="order-id">ID de la commande :</label>
      <input id="order-id" type="text" placeholder="Entrez l'ID de la commande" />

      <label for="transaction-id">ID de la transaction bancaire :</label>
      <input id="transaction-id" type="text" placeholder="Entrez l'ID de la transaction" />

      <button type="submit">Payer</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ShopPay",
};
</script>

<style scoped>
/* Ajoutez des styles ici si nécessaire */
</style>
