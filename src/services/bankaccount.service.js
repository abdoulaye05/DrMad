import LocalSource from "@/datasource/controller";

async function getAccountAmountFromLocalSource(number) {
  console.log("📡 [LocalSource] Demande du montant pour :", number);
  return LocalSource.getAccountAmount(number);
}

async function getAccountTransactionsFromLocalSource(number) {
  console.log("📡 [LocalSource] Demande des transactions pour :", number);
  return LocalSource.getTransactions(number);
}

async function getAccountAmount(number) {
  let response = null;
  try {
    console.log("🔍 [BankAccountService] Envoi de la requête pour amount :", number);
    response = await getAccountAmountFromLocalSource(number);
    console.log("✅ [BankAccountService] Réponse reçue pour amount :", response);

    // Vérifier si la réponse est correcte
    if (!response || response.error !== 0) {
      console.error("❌ [BankAccountService] Erreur dans la réponse amount :", response);
      return { error: 1, status: 500, data: "Erreur lors de la récupération du montant" };
    }
  } catch (err) {
    console.error("🔥 [BankAccountService] Erreur réseau lors de getAccountAmount :", err);
    response = { error: 1, status: 404, data: "Erreur réseau, impossible de récupérer le montant" };
  }
  return response;
}

async function getAccountTransactions(number) {
  let response = null;
  try {
    console.log("🔍 [BankAccountService] Envoi de la requête pour transactions :", number);
    response = await getAccountTransactionsFromLocalSource(number);
    console.log("✅ [BankAccountService] Réponse reçue pour transactions :", response);

    // Vérifier si la réponse est correcte
    if (!response || response.error !== 0) {
      console.error("❌ [BankAccountService] Erreur dans la réponse transactions :", response);
      return { error: 1, status: 500, data: "Erreur lors de la récupération des transactions" };
    }
  } catch (err) {
    console.error("🔥 [BankAccountService] Erreur réseau lors de getAccountTransactions :", err);
    response = { error: 1, status: 404, data: "Erreur réseau, impossible de récupérer les transactions" };
  }
  return response;
}

export default {
  getAccountAmount,
  getAccountTransactions,
};
