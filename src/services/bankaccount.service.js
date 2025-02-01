import LocalSource from "@/datasource/controller";

async function getAccountAmountFromLocalSource(number) {
    console.log("📡 [LocalSource] Demande du montant pour :", number);
    return LocalSource.getAccountAmount(number);
}

async function getAccountTransactionsFromLocalSource(number) {
    console.log("📡 [LocalSource] Demande des transactions pour :", number);
    return LocalSource.getTransactions(number);
}

async function createWithdrawFromLocalSource(data) {
    console.log("📡 [LocalSource] Demande de retrait :", data);
    return LocalSource.createWithdraw(data);
}

async function createPaymentFromLocalSource(data) {
    console.log("📡 [LocalSource] Demande de paiement :", data);
    return LocalSource.createPaiement(data);
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
            return {error: 1, status: 500, data: "Erreur lors de la récupération du montant"};
        }
        console.log("📡 [BankAccountService] Réponse renvoyée :", JSON.stringify(response, null, 2));
        return {
            error: 0,
            data: {
                amount: response.data.amount,
                transactions: response.data.transactions || []
            }
        };
    } catch (err) {
        console.error("🔥 [BankAccountService] Erreur réseau lors de getAccountAmount :", err);
        return {error: 1, status: 404, data: "Erreur réseau, impossible de récupérer le montant"};
    }
}

async function getAccountTransactions(number) {
    let response = null;
    try {
        console.log("🔍 [BankAccountService] Envoi de la requête pour transactions :", number);
        response = await getAccountTransactionsFromLocalSource(number);
        if (!response || response.error !== 0 || !Array.isArray(response.data)) {
            console.error("❌ [BankAccountService] Erreur ou format incorrect :", response);
            return {error: 1, status: 500, data: "Erreur lors de la récupération des transactions"};
        }
        console.log("✅ [BankAccountService] Transactions retournées :", response.data);
        return response; // ✅ Assure de bien retourner la réponse si elle est valide
    } catch (err) {
        console.error("🔥 [BankAccountService] Erreur réseau lors de getAccountTransactions :", err);
        return {error: 1, status: 404, data: "Erreur réseau, impossible de récupérer les transactions"};
    }
}

async function createWithdraw(data) {
    let response = null;
    try {
        console.log("🔍 [BankAccountService] Envoi de la requête de retrait :", data);
        response = await createWithdrawFromLocalSource(data);

        console.log("✅ [BankAccountService] Réponse reçue pour retrait :", response);

        if (!response || response.error !== 0) {
            console.error("❌ [BankAccountService] Erreur lors du retrait :", response);
            return { error: 1, status: 500, data: "Erreur lors du retrait" };
        }
    } catch (err) {
        console.error("🔥 [BankAccountService] Erreur réseau lors du retrait :", err);
        response = { error: 1, status: 404, data: "Erreur réseau, impossible d'effectuer le retrait" };
    }
    return response;
}

async function createPaiement(data) {
    console.log("🔍 [BankAccountService] createPayment appelé avec :", data);
    try {
        let response = await createPaymentFromLocalSource(data);
        console.log("✅ [BankAccountService] Réponse reçue :", response);

        if (!response || response.error !== 0) {
            console.error("❌ [BankAccountService] Erreur paiement :", response);
            return { error: 1, status: 500, data: "Erreur lors du paiement" };
        }

        return response;
    } catch (err) {
        console.error("🔥 [BankAccountService] Erreur réseau lors de createPayment :", err);
        return { error: 1, status: 404, data: "Erreur réseau" };
    }
}


export default {
    getAccountAmount,
    getAccountTransactions,
    createWithdraw,
    createPaiement
};
