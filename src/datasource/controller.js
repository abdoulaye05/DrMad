import { items, shopusers, bankaccounts, transactions } from './data';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

function shopLogin(data) {
  if (!data.login || !data.password) {
    return { error: 1, status: 404, data: 'Aucun login/pass fourni' };
  }

  // Recherche d'un utilisateur par login
  let user = shopusers.find(e => e.login === data.login);
  if (!user) {
    return { error: 1, status: 404, data: 'Login/pass incorrect' };
  }

  // Vérification du mot de passe avec bcrypt.compareSync
  const isPasswordValid = bcrypt.compareSync(data.password, user.password);
  if (!isPasswordValid) {
    return { error: 1, status: 404, data: 'Login/pass incorrect' };
  }

  // Création de la session si elle n'existe pas encore
  if (!user.session) {
    user.session = uuidv4();
  }

  // Construction de l'objet utilisateur
  const u = {
    _id: user._id,
    name: user.name,
    login: user.login,
    email: user.email,
    session: user.session,
  };

  return { error: 0, status: 200, data: u };
}


function getAllViruses() {
  return { error: 0, data: items };
}

function getAccountAmount(number) {
  if (!number) return { error: 1, status: 404, data: 'Aucun numéro de compte bancaire fourni' };
  let account = bankaccounts.find(a => a.number === number);
  if (!account) return { error: 1, status: 404, data: 'Numéro de compte bancaire incorrect' };
  return { error: 0, status: 200, data: account.amount };
}

function getAccountTransactions(number) {
  if (!number) return { error: 1, status: 404, data: 'Aucun numéro de compte bancaire fourni' };
  let account = bankaccounts.find(a => a.number === number);
  if (!account) return { error: 1, status: 404, data: 'Numéro de compte bancaire incorrect' };
  let trans = transactions.filter(t => t.account === account._id);
  return { error: 0, status: 200, data: trans };
}

export default {
  shopLogin,
  getAllViruses,
  getAccountAmount,
  getAccountTransactions,
};
