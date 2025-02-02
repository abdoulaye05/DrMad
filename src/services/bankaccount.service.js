import controller from "@/datasource/controller";

// getAccountAmount
async function getAccountFromcontroller(number) {
    return controller.getAccount(number);
}
async function getAccount(number) {
    let response = null;
    try {
        response = await getAccountFromcontroller(number);
    } catch (err) {
        return {error: 1, status: 404, data: "Erreur réseau, impossible de récupérer le montant"};
    }
    return response;
}

// getAccountAmount
async function getAccountAmountFromcontroller(number) {
    return controller.getAccountAmount(number);
}
async function getAccountAmount(number) {
    let response = null;
    try {
        response = await getAccountAmountFromcontroller(number);
        // Vérifier si la réponse est correcte
        if (!response || response.error !== 0) {
            console.error("❌ [BankAccountService] Erreur dans la réponse amount :", response);
            return {error: 1, status: 500, data: "Erreur lors de la récupération du montant"};
        }
        console.log("📡 [BankAccountService] Réponse renvoyée :", JSON.stringify(response, null, 2));
        return {
            data: {
                amount: response.data.amount,
                transactions: response.data.transactions ? response.data.transactions : []
            }
        };
    } catch (err) {
        return {error: 1, status: 404, data: "Erreur réseau, impossible de récupérer le montant"};
    }
}

// getAccountTransactions
async function getTransactionsFromcontroller(number) {
    return controller.getTransactions(number);
}
async function getAccountTransactions(number) {
    let response = null;
    try {
        response = await getTransactionsFromcontroller(number);
    } catch (err) {
        return {error: 1, status: 404, data: "Erreur réseau, impossible de récupérer les transactions"};
    }
    return response;

}

// createWithdraw
async function createWithdrawFromcontroller(idAccount, amount) {
    return controller.createWithdraw(idAccount, amount);
}
async function createWithdraw(idAccount, amount) {
    let response = null;
    try {
        response = await createWithdrawFromcontroller({idAccount, amount});
    } catch (err) {
        return {error: 1, status: 404, data: "Erreur réseau"};
    }
    return response;
}

// createPayement
async function createPaymentFromcontroller(idAccount, amount, destination) {
    return controller.createPayement(idAccount, amount, destination );
}
async function createPayement(idAccount, amount, destination) {
    let response = null;
    try {
        response = await createPaymentFromcontroller(idAccount, amount, destination);
    } catch (err) {
        return { error: 1, status: 404, data: "Erreur réseau" };
    }
    return response;
}

export default {
    getAccountAmount,
    getAccountTransactions,
    createWithdraw,
    createPayement,
    getAccount
};
