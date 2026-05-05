// 1. Ta liste de 50 produits avec des prix réalistes
const catalogueDouxDoux = [
    { id: 1, titre: "Écouteurs Bluetooth", prix: "15.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/f1/43/da/f143da04925eed47c677e31d5c2149d4.jpg" },
    { id: 2, titre: "Montre Quartz", prix: "10.000", cat: "Textile-Mode", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600" },
    { id: 3, titre: "Chargeur Rapide Type-C", prix: "5.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/e5/41/24/e54124d86ab0362870d271ffb78e275b.jpg" },
    { id: 4, titre: "Clé USB 64Go", prix: "4.500",cat: "Equipement", img: "https://i.pinimg.com/736x/79/d6/bd/79d6bd675ec0090fdd54fc65ec9e00db.jpg" },
    { id: 5, titre: "Powerbank 10000mAh", prix: "12.500", cat: "Equipement", img: "https://i.pinimg.com/736x/48/bb/af/48bbaf4548f7c0d45026b3741bcf3132.jpg" },
    { id: 6, titre: "Souris Sans Fil", prix: "3.500", cat: "Equipement", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },
    { id: 7, titre: "T-shirt Coton", prix: "4.000", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/27/4c/78/274c78deb9aaec0dbea20f60d6e8133a.jpg" },
    { id: 8, titre: "Casquette Sport", prix: "2.500", cat: "Textile-Mode", img: "https://i.pinimg.com/1200x/18/e6/80/18e68041cd04caa5a17268a56cfac252.jpg" },
    { id: 9, titre: "Coque iPhone", prix: "3.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/27/90/e4/2790e4a0d84d5a72ba8a66ff7a986f99.jpg" },
    { id: 10, titre: "Sac à dos USB", prix: "15.000", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/36/18/69/36186951c2ef99813ddf669516540d1a.jpg" },
    { id: 11, titre: "Ring Light Selfie", prix: "8.500", cat: "Equipement", img: "https://i.pinimg.com/736x/ac/71/3a/ac713afa1cadb288340af4542a0e1213.jpg" },
    { id: 12, titre: "Support Téléphone Auto", prix: "2.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/01/c9/ad/01c9ad11758dc615de1b3bc90e15832e.jpg" },
    { id: 13, titre: "Écran de protection", prix: "1.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/ff/8c/47/ff8c4742aa796f4b51d25de67d579364.jpg" },
    { id: 14, titre: "Enceinte Mini", prix: "7.000", cat: "Equipement", img: "https://www.rekfi.com/storage/2024/07/Enceinte-Portable-Bluetooth-Tronsmart-T7-mini-GRIS.jpg" },
    { id: 15, titre: "Câble HDMI 2m", prix: "3.500", cat: "Equipement", img: "https://i.pinimg.com/1200x/f9/fa/e4/f9fae45e903d9fe2c73be22fb91ccc5b.jpg" },
    { id: 16, titre: "Clavier Bureautique", prix: "6.500", cat: "Equipement", img: "https://i.pinimg.com/736x/a2/b2/af/a2b2af4c5cc18b7f134d8b472384626a.jpg" },
    { id: 17, titre: "Ventilateur USB", prix: "4.500", cat: "Equipement", img: "https://i.pinimg.com/736x/69/80/07/698007602bc12b99d2fdb06687f05dd4.jpg" },
    { id: 18, titre: "Lunettes de soleil", prix: "5.000", cat: "Textile-Mode", img: "https://i.pinimg.com/1200x/09/f6/89/09f689dac200296080a6f7831af3def4.jpg" },
    { id: 19, titre: "Trépied Flexible", prix: "4.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/cd/01/47/cd01476131736bc70ddd2059c9290565.jpg" },
    { id: 20, titre: "Ampoule LED Connectée", prix: "9.000", cat: "Equipement", img: "https://i.pinimg.com/736x/6f/f3/6b/6ff36b1029308d3590d52060f21c188f.jpg" },
    { id: 21, titre: "Parfum Homme 50ml", prix: "12.000", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/ac/6e/7c/ac6e7c34bb818963af1d1bce9752a19f.jpg" },
    { id: 22, titre: "Crème Hydratante", prix: "3.500", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/8e/bc/55/8ebc5596743eb7221c2d1878c3d4492b.jpg" },
    { id: 23, titre: "Baskets Urbaines", prix: "18.500", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/f1/eb/a2/f1eba2da56e538a8b38ed46193bb7648.jpg" },
    { id: 24, titre: "Adaptateur Secteur", prix: "2.500", cat: "Equipement", img: "https://i.pinimg.com/1200x/16/fa/be/16fabe45085600244c7f5bf32675ea04.jpg" },
    { id: 25, titre: "Gourde Isotherme", prix: "6.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/ad/90/6c/ad906c92e7e5fce93b92268928bad22e.jpg" },
    { id: 26, titre: "Tapis de souris XXL", prix: "5.500", cat: "Equipement", img: "https://i.pinimg.com/1200x/95/6e/b3/956eb31db7e85e26175700dce546b700.jpg" },
    { id: 27, titre: "Micro Cravate", prix: "4.500", cat: "Equipement", img: "https://i.pinimg.com/736x/dd/3b/8f/dd3b8f25c2aecc3cf17cd52b7cb38a0a.jpg" },
    { id: 28, titre: "Manette PC/Android", prix: "11.000", cat: "Equipement", img: "https://i.pinimg.com/736x/28/8e/29/288e29982e1cdfa01e1aba6b62e74d3c.jpg" },
    { id: 29, titre: "Webcam HD", prix: "14.500", cat: "Equipement", img: "https://dakarstock.com/wp-content/uploads/2024/04/logitech-webcam-c920-hd-pro-2.jpg" },
    { id: 30, titre: "Répéteur WiFi", prix: "13.000", cat: "Equipement", img: "https://i.pinimg.com/736x/c2/4b/32/c24b32f44fad8b40c6d7d4e923ddebf9.jpg" },
    { id: 31, titre: "Livre de poche  ", prix: "3.000", cat: "Equipement", img: "https://i.pinimg.com/736x/df/27/c9/df27c9b5c6437116b4c94b0d5f9bc1e2.jpg" },
    { id: 32, titre: "Porte-monnaie Cuir", prix: "7.500", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/95/d7/c0/95d7c0bb7a3f211b5634a7b02c4b9fd2.jpg" },
    { id: 33, titre: "Ceinture Homme", prix: "4.500", cat: "Textile-Mode", img: "https://i.pinimg.com/1200x/62/15/e8/6215e89fde2608f85f154d3b0dd24ba7.jpg" },
    { id: 34, titre: "Kit Pinceaux Maquillage", prix: "6.500", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/d6/7f/a8/d67fa83aa0a1819476f057152cd88fa3.jpg" },
    { id: 35, titre: "Miroir LED", prix: "8.000", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/83/a2/36/83a236865a36f24b6d0e4e6ac0945606.jpg" },
    { id: 36, titre: "Support PC Ventilé", prix: "10.500", cat: "Equipement", img: "https://i.pinimg.com/1200x/8c/74/16/8c7416a710f9c1fcc162c95ab0246e07.jpg" },
    { id: 37, titre: "Sacoche Ordinateur", prix: "5000", cat: "Equipement", img: "https://i.pinimg.com/736x/3c/cb/c7/3ccbc725b7eda52eca5e0ab8197b19b1.jpg" },
    { id: 38, titre: "Balance de cuisine", prix: "5.500", cat: "Equipement", img: "https://i.pinimg.com/736x/2d/c7/6b/2dc76bb7c070cc8fabfc9cb1e2a55a2c.jpg" },
    { id: 39, titre: "Machine à café Mini", prix: "25.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/49/f8/73/49f8734f57df45b0394cbb396cc4b475.jpg" },
    { id: 40, titre: "Rasoir Électrique", prix: "14.000", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/aa/e1/3c/aae13c5ca3cf5654b96900d9ab518397.jpg" },
    { id: 41, titre: "Veilleuse Enfant", prix: "4.000", cat: "Equipement", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvGeeAa2gZ2P5UT8rqRHxuQJTy1Bj3_fqzoA&s" },
    { id: 42, titre: "Hub USB 4 Ports", prix: "3.500", cat: "Equipement",img: "https://i.pinimg.com/1200x/94/52/68/9452689f07b39335e99c7f236b600ee9.jpg" },
    { id: 43, titre: "Carte Mémoire 32Go", prix: "3.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/e6/f6/03/e6f603dc0eaeae17b3995ae0b3630d7e.jpg" },
    { id: 44, titre: "Bracelet Sport", prix: "2.000", cat: "Textile-Mode", img: "https://i.pinimg.com/736x/1c/42/41/1c42417c12dd8be429cc0f102d3b6a48.jpg" },
    { id: 45, titre: "Organisateur de câbles", prix: "1.500", cat: "Equipement", img: "https://i.pinimg.com/1200x/a5/15/e4/a515e492067a515034bf8c91388b3a6d.jpg" },
    { id: 46, titre: "Cutter de précision", prix: "1.200", cat: "Equipement", img: "https://i.pinimg.com/1200x/74/7b/52/747b52214fb4d6ca2213a7d0a9d39c94.jpg" },
    { id: 47, titre: "Colle forte Tube", prix: "1.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/3b/30/93/3b3093b520f36a5a6337a46032b3658a.jpg" },
    { id: 48, titre: "Piles Rechargeables x4", prix: "5.000", cat: "Equipement", img: "https://i.pinimg.com/1200x/89/60/92/896092e2b9353a4b398543d6bc938f81.jpg" },
    { id: 49, titre: "Radio Portable", prix: "8.500", cat: "Equipement", img: "https://i.pinimg.com/736x/f9/32/cb/f932cbcd7fa328efbe07d1fb500cd064.jpg" },
    { id: 50, titre: "Thermomètre Digital", prix: "2.500", cat: "Equipement", img: "https://i.pinimg.com/1200x/3f/5b/ce/3f5bce6a09f7ac7cd71e5f6c26780131.jpg" }
    { id: 51, titre: "Mouton Ladoum", prix: "350.000", cat: "Marche-Frais", img: "https://images.unsplash.com/photo-1511117833452-472d9d2d7617?w=300" },
    { id: 52, titre: "Sac de Riz 50kg", prix: "22.500", cat: "Alimentation", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300" },
    { id: 53, titre: "Thiof Frais (KG)", prix: "6.500", cat: "Marche-Frais", img: "https://images.unsplash.com/photo-1534604973900-c41ab4c58f96?w=300" },
    { id: 54, titre: "Panneau Solaire 200W", prix: "75.000", cat: "BTP-Energie", img: "https://images.unsplash.com/photo-1509391366360-fe5bb6583e23?w=300" }
    
];

// 1. Fonction pour filtrer et afficher les produits
function filtrerProduits(categorie) {
    const grille = document.getElementById("product-grid");
    if (!grille) return;

    grille.innerHTML = ""; // On vide la grille pour charger les nouveaux produits

    const produitsAffiches = categorie === 'Tous' 
        ? catalogueDouxDoux 
        : catalogueDouxDoux.filter(p => p.cat === categorie);

    produitsAffiches.forEach(p => {
        grille.innerHTML += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${p.img}" alt="${p.titre}">
                </div>
                <div class="product-info">
                    <span class="category-tag">${p.cat}</span>
                    <h3 class="product-title">${p.titre}</h3>
                    <p class="product-price"><strong>${p.prix} FCFA</strong></p>
                    <div class="payment-buttons">
                        <button class="btn-pay btn-wave" onclick="window.location.href='#'">Wave</button>
                        <button class="btn-pay btn-om" onclick="window.location.href='#'">Orange Money</button>
                    </div>
                </div>
            </div>`;
    });
}

// 2. Lancement automatique au chargement de la page
window.onload = () => filtrerProduits('Tous');

// 3. Gestion du menu mobile
function toggleMenu() {
    const menu = document.getElementById("side-menu");
    const overlay = document.getElementById("overlay");
    if (menu) {
        if (menu.style.width === "280px") {
            menu.style.width = "0";
            if (overlay) overlay.style.display = "none";
        } else {
            menu.style.width = "280px";
            if (overlay) overlay.style.display = "block";
        }
    }
}
