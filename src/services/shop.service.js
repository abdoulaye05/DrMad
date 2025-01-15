import LocalSource from "@/datasource/controller";

async function shopLoginFromLocalSource(data) {
  // récupération auprès de la source locale
  return LocalSource.shopLogin(data)
}
/*
async function shopLoginFromAPI(data) {
  // a écrire quand l'API est fonctionnelle
  return {}
}
 /

async function getAllVirusesFromLocalSource() {
  // récupération auprès de la source locale
  return LocalSource.getAllViruses()
}
/
async function getAllVirusesFromAPI() {
  // a écrire quand l'API est fonctionnelle
  return {}
}
*/

async function getAllVirusesFromLocalSource() {
  // récupération auprès de la source locale
  return LocalSource.getAllViruses()
}
/*
async function getAllVirusesFromAPI() {
  // a écrire quand l'API est fonctionnelle
  return {}
}
*/


async function shopLogin(data) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await shopLoginFromLocalSource(data)
  }
      // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de se loguer'  }
  }
  return response
}

async function getAllViruses() {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await getAllVirusesFromLocalSource()
  }
      // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer la liste des viruses'  }
  }
  return response
}
async function getBasket() {
  let response = null;
  try {
    response = await LocalSource.getBasket();
  } catch (err) {
    response = { error: 1, status: 404, data: "Erreur réseau, impossible de récupérer le panier." };
  }
  return response;
}
async function addToBasket(item, quantity) {
  let response = null;
  try {
    response = await LocalSource.addToBasket(item, quantity);
  } catch (err) {
    response = { error: 1, status: 404, data: "Erreur réseau, impossible d'ajouter l'article au panier." };
  }
  return response;
}
async function removeFromBasket(index) {
  let response = null;
  try {
    response = await LocalSource.removeFromBasket(index);
  } catch (err) {
    response = { error: 1, status: 404, data: "Erreur réseau, impossible de supprimer l'article du panier." };
  }
  return response;
}
async function clearBasket() {
  let response = null;
  try {
    response = await LocalSource.clearBasket();
  } catch (err) {
    response = { error: 1, status: 404, data: "Erreur réseau, impossible de vider le panier." };
  }
  return response;
}

export default {
  shopLogin,
  getAllViruses,
  getBasket,
  addToBasket,
  removeFromBasket,
  clearBasket,
};
