let nombreArticles = 0; // Pour le compteur du panier

// On récupère les éléments de la fenêtre de paiement
const modal = document.getElementById('payment-modal');
const spanClose = document.getElementsByClassName("close")[0];

// Fermer la fenêtre quand on clique sur la petite croix
if(spanClose) {
    spanClose.onclick = function() { modal.style.display = "none"; }
}

const affichagePanier = document.getElementById('cart-count');
// 1. Charger les produits au démarrage de la page
async function chargerProduits() {
    try {
        const reponse = await fetch('products.json');
        const produits = await reponse.json();
        
        const conteneur = document.getElementById('shop-container');
        conteneur.innerHTML = ''; // Vide la zone avant d'ajouter

        produits.forEach(produit => {
            const carte = document.createElement('div');
            carte.className = 'product-card';
            
            carte.dataset.category = produit.categorie;

            carte.innerHTML = `
                <img src="${produit.image}" alt="${produit.nom}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${produit.nom}</h3>
                <p class="category">${produit.categorie}</p>
                <p class="price">${produit.prix} FCFA</p>
                
                <select id="operator-${produit.id}">
                    <option value="wave">Wave</option>
                    <option value="orange_money">Orange Money</option>
                </select>
                
                <button onclick="payer(${produit.prix}, '${produit.id}')">
                    Acheter maintenant
                </button>
            `;
// 1. On récupère le bouton payer qui vient d'être créé dans le HTML de la carte
        const boutonPayer = carte.querySelector('button'); 

        // 2. On écoute le clic sur ce bouton
        boutonPayer.addEventListener('click', () => {
            // Augmenter le compteur d'articles
            nombreArticles++; 
            
            // Mettre à jour l'affichage du chiffre 0 en haut
            document.getElementById('cart-count').innerText = nombreArticles;
            
           // 1. Récupérer le mode de paiement choisi (Wave ou Orange Money)
            const modePaiement = carte.querySelector('select').value;

            // 2. Remplir les infos dans la fenêtre de paiement
            document.getElementById('order-details').innerText = `Produit : ${produit.nom} - Prix : ${produit.prix} FCFA`;
            document.getElementById('payment-method-display').innerText = modePaiement.toUpperCase();

            console.log("La fenêtre devrait s'ouvrir maintenant !");

            modal.style.display = "block";

        });

        // Enfin, on ajoute la carte finie au conteneur
        conteneur.appendChild(carte);
      }); // <--- C'est la fin de ton forEach

           
    
    } catch (erreur) {
        console.error("Erreur de chargement des produits:", erreur);
    }
}

// 2. Ta fonction de paiement adaptée
async function payer(montant, idProduit) {
    const operateur = document.getElementById(`operator-${idProduit}`).value;
    
    // On cherche le nom du produit dans la liste pour l'envoyer à PayTech
    const nomProduit = idProduit; // On peut faire plus précis plus tard

    const response = await fetch('/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: montant,
            item_name: nomProduit,
            operator: operateur
        })
    });

    const data = await response.json();
    if (data.success && data.redirect_url) {
        window.location.href = data.redirect_url;
    } else {
        alert("Erreur lors de la création du paiement.");
    }
}


// --- FONCTIONNALITÉ DU BOUTON REMONTER ---

// On récupère le bouton via son ID
const backToTop = document.getElementById("backToTop");

// On surveille le défilement de la page
window.onscroll = function() {
    // Si on a descendu de plus de 300 pixels
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTop.style.display = "block"; // On affiche le bouton
    } else {
        backToTop.style.display = "none";  // On cache le bouton
    }
};

// Quand on clique sur le bouton
backToTop.onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Remontée fluide et douce
    });
};

// Sélection des boutons de filtre
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Changer le bouton actif
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        const products = document.querySelectorAll('.product-card');

        products.forEach(product => {
            // On vérifie si le produit appartient à la catégorie
            // (Assure-toi que tes produits dans products.json ont une catégorie)
            if (category === 'tous' || product.dataset.category === category) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    });
});
// Lancer le chargement
window.onload = chargerProduits;

// Fonction pour gérer le bouton de confirmation du paiement
function confirmerPaiement() {
    const nom = document.getElementById('nomProduit').innerText;
    const prixStr = document.getElementById('prixProduit').innerText;
    const methode = document.getElementById('methodePaiement').value;
    const monNumero = "777226359"; // <--- METS TON VRAI NUMÉRO ICI

    // On récupère juste le chiffre du prix
    const prix = parseInt(prixStr.replace(/\s/g, ''));

    if (methode === "Wave") {
        // Redirection vers l'application Wave
        window.location.href = `https://wave.com/pay/${monNumero}?amount=${prix}`;
    } else {
        // Redirection vers WhatsApp pour Orange Money
        const message = `Bonjour Boutique Mamadou, je souhaite payer ${nom} (${prix} FCFA) par Orange Money.`;
        window.location.href = `https://wa.me/${monNumero}?text=${encodeURIComponent(message)}`;
    }
}

function confirmerPaiement() {
    // On récupère le texte du prix (ex: "100000 FCFA")
    const prixTexte = document.getElementById('prixProduit').innerText;
    
    // CETTE LIGNE EST TRÈS IMPORTANTE : elle enlève "FCFA" et les espaces pour ne garder que le chiffre
    const prixChiffre = prixTexte.replace(/[^\d]/g, ''); 
    
    const methode = document.getElementById('payment-method-display').innerText; // On récupère la méthode affichée
    const monNumero = "777226359"; 

    if (methode === "WAVE") {
        // Redirection vers Wave avec uniquement le chiffre
        window.location.href = `https://wave.com/pay/${monNumero}?amount=${prixChiffre}`;
    } else {
        // Redirection vers WhatsApp pour Orange Money
        const nom = document.getElementById('nomProduit').innerText;
        const message = `Bonjour, je souhaite payer ${nom} (${prixChiffre} FCFA) par Orange Money.`;
        window.location.href = `https://wa.me/${monNumero}?text=${encodeURIComponent(message)}`;
    }
}

