// ==========================================
// 1. VARIABLES ET ÉTAT GLOBAL
// ==========================================
let panier = [];
let slideIndex = 0;

// ==========================================
// 2. CHARGEMENT DYNAMIQUE DEPUIS MONGOOSE / BACKEND
// ==========================================
async function fetchProductsFromBackend() {
    try {
        // Appel de la route de ton API backend
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Erreur lors de la récupération des produits du backend :", error);
        return []; // Retourne un tableau vide en cas de panne du serveur
    }
}

// ==========================================
// 3. FONCTIONS D'AFFICHAGE ET FILTRAGE
// ==========================================
async function filtrerProduits(categorie) {
    const grille = document.getElementById("productGrid"); // ID synchronisé avec ton HTML
    if (!grille) return;

    grille.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Chargement du catalogue Doux-Doux...</p>"; 

    // On récupère les vrais produits du backend
    const catalogueBackend = await fetchProductsFromBackend();

    if (catalogueBackend.length === 0) {
        grille.innerHTML = "<p style='color: red; grid-column: 1/-1; text-align: center;'>Impossible de charger les produits. Vérifiez que le serveur backend est lancé.</p>";
        return;
    }

    grille.innerHTML = ""; 

    // Filtrage souple (on gère les minuscules/majuscules et le cas "Toutes les catégories")
    const produitsAffiches = (categorie === 'Toutes' || categorie === 'Toutes les catégories' || categorie === 'all' || !categorie) 
        ? catalogueBackend 
        : catalogueBackend.filter(p => p.category === categorie || p.cat === categorie);

    produitsAffiches.forEach(p => {
        // Remplacement par des valeurs par défaut si certaines propriétés manquent dans MongoDB
        const imageBrute = p.image || p.img || 'https://via.placeholder.com/400x400?text=Doux-Doux';
        
        // Proxy de contournement anti-blocage pour Pinterest
        const imageAffichage = (imageBrute.includes('pinterest.com') || imageBrute.includes('pinimg.com')) 
            ? `https://images.weserv.nl/?url=${encodeURIComponent(imageBrute)}` 
            : imageBrute;

        const nomProduit = p.name || p.titre;
        const prixProduit = p.price || p.prix;
        const categorieProduit = p.category || p.cat || 'Général';

        grille.innerHTML += `
            <div class="product-card" data-name="${nomProduit}">
                <div class="product-image">
                    <img src="${imageAffichage}" alt="${nomProduit}">
                </div>
                <div class="product-info">
                    <span class="category-tag">${categorieProduit}</span>
                    <h3 class="product-title">${nomProduit}</h3>
                    <p class="product-price"><strong>${Number(prixProduit).toLocaleString()} FCFA</strong></p>
                    <div class="payment-buttons" style="margin-top: 10px; display: flex; flex-direction: column; gap: 5px;">
                        <button class="btn-add-cart" onclick="ajouterAuPanier('${nomProduit}', '${prixProduit}')" style="width: 100%;">
                          Ajouter au panier
                        </button>
                        <div style="display: flex; gap: 5px;">
                            <button class="btn-pay btn-wave" onclick="ouvrirPaiement('${nomProduit}')" style="flex: 1;">Wave</button>
                            <button class="btn-pay btn-om" onclick="ouvrirPaiement('${nomProduit}')" style="flex: 1;">OM</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

// ==========================================
// 4. GESTION DU PANIER
// ==========================================
function ajouterAuPanier(titre, prix) {
    panier.push({ titre: titre, prix: prix });
    // Synchronisation avec l'ID de ton HTML (cartCount)
    const compteur = document.getElementById('cartCount');
    if (compteur) {
        compteur.innerText = panier.length;
    }
    alert(titre + " ajouté au panier !");
}

// Fonction requise par le bouton "Ajouter au panier" codé dans ton HTML initial
function addToCart() {
    alert("Produit ajouté au panier !");
}

// ==========================================
// 5. RECHERCHE SYNCHRONISÉE
// ==========================================
async function searchProducts() { // Nom calqué sur le onclick="searchProducts()" de ton HTML
    const input = document.getElementById('searchInput');
    if (!input) return;
    const saisie = input.value.toLowerCase().trim();
    
    const grille = document.getElementById("productGrid");
    grille.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Recherche en cours...</p>";

    const catalogueBackend = await fetchProductsFromBackend();
    
    const resultats = catalogueBackend.filter(p => {
        const nom = (p.name || p.titre || "").toLowerCase();
        const categorie = (p.category || p.cat || "").toLowerCase();
        return nom.includes(saisie) || categorie.includes(saisie);
    });

    grille.innerHTML = "";
    
    if (resultats.length === 0) {
        grille.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Aucun produit trouvé pour cette recherche.</p>";
        return;
    }

    resultats.forEach(p => {
       // Lecture de la propriété img ou image selon la source
        const imageBrute = p.img || p.image || 'https://via.placeholder.com/400x400?text=Doux-Doux';

        let imageAffichage = imageBrute;
        
        if (imageBrute.includes('pinterest.com') || imageBrute.includes('pinimg.com')) {
            // Utilisation du proxy pour contourner le blocage Pinterest
            imageAffichage = `https://images.weserv.nl/?url=${encodeURIComponent(imageBrute)}`;
        } else if (!imageBrute.startsWith('http://') && !imageBrute.startsWith('https://')) {
            // Gestion des images locales si présentes
            imageAffichage = `http://localhost:5000/${imageBrute.replace(/^\//, '')}`;
        }
        const nomProduit = p.name || p.titre;
        const prixProduit = p.price || p.prix;

        grille.innerHTML += `
            <div class="product-card">
                <div class="product-image"><img src="${imageAffichage}" alt="${nomProduit}"></div>
                <div class="product-info">
                    <h3 class="product-title">${nomProduit}</h3>
                    <p class="product-price"><strong>${Number(prixProduit).toLocaleString()} FCFA</strong></p>
                    <button class="btn-add-cart" onclick="ajouterAuPanier('${nomProduit}', '${prixProduit}')">Ajouter</button>
                </div>
            </div>`;
    });   
}

// ==========================================
// 6. GESTION DU SLIDER
// ==========================================
function moveSlide(n) {
    const slidesContainer = document.querySelector('.slides');
    const allSlides = document.querySelectorAll('.slide');
    if (!slidesContainer || allSlides.length === 0) return;

    slideIndex += n;
    if (slideIndex >= allSlides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = allSlides.length - 1;

    slidesContainer.style.transform = `translateX(${-slideIndex * 100}%)`;
}

function autoSlider() { 
    moveSlide(1); 
}
setInterval(autoSlider, 5000);

// ==========================================
// 7. MENUS ET MODALES
// ==========================================
function ouvrirPaiement(titre) {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.style.display = 'block';
    else alert(`Ouverture du paiement pour : ${titre}`);
}

// ... Le reste du code de localisation reste le même ...
function closePayment() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.style.display = 'none';
}

function toggleMenu() {
    const menu = document.getElementById("side-menu");
    const overlay = document.getElementById("overlay");
    if (!menu) return;

    if (menu.style.width === "280px") {
        menu.style.width = "0";
        if (overlay) overlay.style.display = "none";
    } else {
        menu.style.width = "280px";
        if (overlay) overlay.style.display = "block";
    }
}

function openNav() {
    const nav = document.getElementById("mySidenav");
    const overlay = document.getElementById("side-overlay");
    if (nav) nav.style.width = "350px";
    if (overlay) overlay.style.display = "block";
}

function closeNav() {
    const nav = document.getElementById("mySidenav");
    const overlay = document.getElementById("side-overlay");
    if (nav) nav.style.width = "0";
    if (overlay) overlay.style.display = "none";
}

// ==========================================
// 8. CARTE DU SÉNÉGAL (LIVRAISON)
// ==========================================
const senegalMap = {
    "Dakar": {
        "Dakar": ["Plateau", "Médina", "Fass-Colobane", "Fann-Point E", "Gorée", "Grand Dakar", "Biscuiterie", "HLM", "Hann Bel-Air", "Sicap Liberté", "Dieuppeul-Derklé", "Grand Yoff", "Patte d'Oie", "Parcelles Assainies", "Cambérène", "Ngor", "Ouakam", "Yoff", "Mermoz-Sacré-Cœur"],
        "Guédiawaye": ["Golf Sud", "Sam Notaire", "Ndiarème Limamoulaye", "Wakhinane Nimzatt", "Médina Gounass"],
        "Pikine": ["Pikine Est", "Pikine Nord", "Pikine Ouest", "Dalifort", "Djidah Thiaroye Kao", "Guinaw Rail Nord", "Guinaw Rail Sud", "Tivaouane Diacksao", "Diamaguène Sicap Mbao", "Mbao", "Thiaroye-sur-Mer", "Thiaroye Gare"],
        "Rufisque": ["Rufisque Est", "Rufisque Nord", "Rufisque Ouest", "Bargny", "Sendou", "Diamniadio", "Sébikotane", "Sangalkam", "Bambylor", "Yène", "Tivaouane Peulh-Niaga"],
        "Keur Massar": ["Keur Massar Nord", "Keur Massar Sud", "Malika", "Yeumbeul Nord", "Yeumbeul Sud", "Jaxaay-Parcelles"]
    },
    "Thiès": {
        "Thiès": ["Thiès Est", "Thiès Nord", "Thiès Ouest", "Khombole", "Pout", "Keur Moussa", "Fandène"],
        "Mbour": ["Mbour", "Joal-Fadiouth", "Saly Portudal", "Ngaparou", "Somone", "Nguékhokh", "Diass", "Sindia", "Malicounda"],
        "Tivaouane": ["Tivaouane", "Mékhé", "Mboro", "Darou Khoudoss", "Taïba Ndiaye"]
    },
    "Diourbel": {
        "Diourbel": ["Diourbel", "Ndindy", "Ndoulo", "Tocky Gare"],
        "Bambey": ["Bambey", "Baba Garage", "Lambaye", "Ngogom", "Réfane"],
        "Mbacké": ["Mbacké", "Touba Mosquée", "Touba Fall", "Taïf", "Sadio"]
    },
    "Saint-Louis": {
        "Saint-Louis": ["Saint-Louis", "Mpal", "Gandon", "Fass Ngom"],
        "Dagana": ["Dagana", "Richard-Toll", "Rosso Sénégal", "Ross Béthio", "Mbane"],
        "Podor": ["Podor", "Ndioum", "Mboumba", "Guédé Chantier", "Aéré Lao"]
    },
    "Fatick": {
        "Fatick": ["Fatick", "Diofior", "Niakhar", "Fimela", "Tattaguine"],
        "Foundiougne": ["Foundiougne", "Passy", "Sokone", "Karang Poste", "Toubacouta"],
        "Gossas": ["Gossas", "Colobane", "Mbar"]
    },
    "Kaolack": {
        "Kaolack": ["Kaolack", "Gandiaye", "Kahone", "Ndoffane"],
        "Nioro du Rip": ["Nioro du Rip", "Keur Madiabel", "Porokhane", "Médina Sabakh"],
        "Guinguinéo": ["Guinguinéo", "Mboss", "Fass"]
    },
    "Ziguinchor": {
        "Ziguinchor": ["Ziguinchor", "Niaguis", "Adéane", "Enampore"],
        "Bignona": ["Bignona", "Thionck-Essyl", "Diouloulou", "Kafountine", "Abéné"],
        "Oussouye": ["Oussouye", "Cap Skirring", "Mlomp"]
    },
    "Louga": {
        "Louga": ["Louga", "Coki", "Sakal", "Léona"],
        "Kébémer": ["Kébémer", "Guéoul", "Ndande", "Sagatta Gueth"],
        "Linguère": ["Linguère", "Dahra", "Barkédji", "Yang-Yang"]
    },
    "Tambacounda": {
        "Tambacounda": ["Tambacounda", "Missirah", "Sinthiou Malème"],
        "Bakel": ["Bakel", "Kidira", "Diawara"],
        "Goudiry": ["Goudiry", "Bala", "Koussan"],
        "Koumpentoum": ["Koumpentoum", "Malem Niani"]
    },
    "Matam": {
        "Matam": ["Matam", "Ourossogui", "Thilogne", "Agnam Civol"],
        "Kanel": ["Kanel", "Waoundé", "Semmé", "Orkadiéré"],
        "Ranérou": ["Ranérou", "Vélingara Ferlo"]
    },
    "Kolda": {
        "Kolda": ["Kolda", "Dabo", "Salikégné", "Saré Bidji"],
        "Vélingara": ["Vélingara", "Kounkané", "Diaobé-Kabendou", "Médina Gounass"],
        "Médina Yoro Foulah": ["Médina Yoro Foulah", "Pata"]
    },
    "Kaffrine": {
        "Kaffrine": ["Kaffrine", "Nganda", "Birkelane"],
        "Koungheul": ["Koungheul", "Missirah Wadène"],
        "Malem Hodar": ["Malem Hodar", "Sagna"]
    },
    "Sédhiou": {
        "Sédhiou": ["Sédhiou", "Marsassoum", "Bambali"],
        "Bounkiling": ["Bounkiling", "Madina Wandifa"],
        "Goudomp": ["Goudomp", "Tanaff"]
    },
    "Kédougou": {
        "Kédougou": ["Kédougou", "Bandafassi", "Salémata"],
        "Saraya": ["Saraya", "Sabodala", "Bembou"]
    }
};

function chargerDepartements() {
    const region = document.getElementById('select-region').value;
    const deptSelect = document.getElementById('select-departement');
    const commSelect = document.getElementById('select-commune');

    if(!deptSelect || !commSelect) return;

    deptSelect.innerHTML = '<option value="">-- Département --</option>';
    commSelect.innerHTML = '<option value="">-- Commune --</option>';
    commSelect.style.display = "none";

    if (region && senegalMap[region]) {
        deptSelect.style.display = "inline-block"; 
        for (let dept in senegalMap[region]) {
            let opt = document.createElement("option");
            let optVal = dept;
            opt.value = optVal;
            opt.textContent = dept;
            deptSelect.appendChild(opt);
        }
    } else {
        deptSelect.style.display = "none";
    }
}

function chargerCommunes() {
    const region = document.getElementById('select-region').value;
    const dept = document.getElementById('select-departement').value;
    const commSelect = document.getElementById('select-commune');

    if(!commSelect) return;
    commSelect.innerHTML = '<option value="">-- Commune --</option>';

    if (dept && senegalMap[region][dept]) {
        commSelect.style.display = "inline-block";
        senegalMap[region][dept].forEach(commune => {
            let opt = document.createElement("option");
            opt.value = commune;
            opt.textContent = commune;
            commSelect.appendChild(opt);
        });
    } else {
        commSelect.style.display = "none";
    }
}

// ==========================================
// 9. INITIALISATION AU DÉMARRAGE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Lancement du chargement dynamique au démarrage
    filtrerProduits('Toutes');
    
    // Écouteur pour la touche Entrée sur le champ de recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchProducts();
        });
    }
});