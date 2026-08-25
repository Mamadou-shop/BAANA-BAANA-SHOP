const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product');

// Charger les variables d'environnement (.env)
dotenv.config();

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connecté pour le remplissage de Doux-Doux..."))
    .catch(err => {
        console.error("Erreur de connexion :", err);
        process.exit(1);
    });

// Catalogue officiel Doux-Doux (50 articles)
const catalogueDouxDoux = [
    { name: "Lot de 3 T-Shirts Coton Basiques", category: "Textile-Mode", price: 4500, description: "Ensemble de 3 t-shirts 100% coton de qualité supérieure, confortables au quotidien.", image: "https://i.pinimg.com/1200x/b0/94/02/b09402ecfc2c948f2e8782a5a68bdfe2.jpg" },
    { name: "Robe de Soirée Élégante Chic", category: "Textile-Mode", price: 18500, description: "Robe longue fluide portée par notre mannequin, idéale pour vos événements.", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80" },
    { name: "Jean Slim Stretch Quotidien", category: "Textile-Mode", price: 7500, description: "Coupe moderne et ajustée, idéal pour les sorties décontractées.", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80" },
    { name: "Costume 3 Pièces Homme Modern Fit", category: "Textile-Mode", price: 35000, description: "Costume complet porté par notre mannequin, une coupe impeccable pour grandes occasions.", image: "https://i.pinimg.com/736x/cb/a1/38/cba138e3a241680a653ddbc7d1fa8b88.jpg" },
    { name: "Chemise Bleue Classique Homme", category: "Textile-Mode", price: 5000, description: "Chemise repassage facile, coupe droite idéale pour le bureau ou événements.", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80" },
    { name: "Veste en Cuir Style Biker", category: "Textile-Mode", price: 19000, description: "Blouson en cuir de qualité sur cintre avec finitions métalliques soignées.", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80" },
    { name: "Robe d'Été Fleurie Légère", category: "Textile-Mode", price: 6500, description: "Robe fluide avec imprimé floral coloré, parfaite pour le quotidien.", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80" },
    { name: "Manteau Veste Légère Laine", category: "Textile-Mode", price: 16000, description: "Veste courte élégante offrant confort et raffinement.", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=600&q=80" },
    { name: "Short de Sport Respirant Quick-Dry", category: "Textile-Mode", price: 3000, description: "Short ultra-léger avec poche zippée, parfait pour le running et le fitness.", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80" },
    { name: "Boubou Traditionnel VIP Brodé", category: "Textile-Mode", price: 28000, description: "Magnifique ensemble tradition porté par notre mannequin, broderies artisanales.", image: "https://i.pinimg.com/1200x/b8/e8/68/b8e868eb071829bfc1d294ab8ace641b.jpg" },
    { name: "Sweat à Capuche Oversize Cotton", category: "Textile-Mode", price: 7500, description: "Hoodie molletonné coupe confortable style urbain.", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80" },
    { name: "Kimono Imprimé Satiné", category: "Textile-Mode", price: 8000, description: "Kimono élégant à porter en veste légère ou tenue d'intérieur.", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80" },
    { name: "Ensemble Polo & Short Casual", category: "Textile-Mode", price: 6500, description: "Ensemble deux pièces d'été moderne et décontracté.", image: "https://i.pinimg.com/736x/88/c9/b0/88c9b0ea9e4e7c6cc43401a2ad40f1f1.jpg" },
    { name: "Jupe Plissée Longue Satinée", category: "Textile-Mode", price: 7000, description: "Jupe tendance taille élastique avec reflets brillants.", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80" },
    { name: "Gilet en Maille Douce", category: "Textile-Mode", price: 8500, description: "Cardigan boutonné doux au toucher et très agréable à porter.", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80" },
    { name: "Pyjama 2 Pièces Sensation Soie", category: "Textile-Mode", price: 9000, description: "Ensemble nuit fluide et léger pour un sommeil confortable.", image: "https://images.unsplash.com/photo-1616885827725-7b567d288d44?auto=format&fit=crop&w=600&q=80" },
    { name: "Pantalon Cargo Multi-Poches", category: "Textile-Mode", price: 7500, description: "Style street robuste avec multiples poches de rangement.", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80" },
    { name: "Maillot de Bain Design Été", category: "Textile-Mode", price: 6000, description: "Maillot une pièce tendance avec finitions soignées.", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80" },
    { name: "Baume à Lèvres Hydratant Karité", category: "Beaute-Soins", price: 1000, description: "Soin protecteur naturel enrichi en vitamine E et karité pur.", image: "https://images.unsplash.com/photo-1625101902621-2e6462719522?auto=format&fit=crop&w=600&q=80" },
    { name: "Parfum d'Ambiance Royale 100ml", category: "Beaute-Soins", price: 12000, description: "Fragrance envoûtante aux notes d'Oud et d'Ambre précieux.", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80" },
    { name: "Savon Noir Purifiant Charbon Actif", category: "Beaute-Soins", price: 1500, description: "Nettoie en profondeur, élimine l'excès de sébum et les impuretés.", image: "https://images.unsplash.com/photo-1607006482170-137b02c8e310?auto=format&fit=crop&w=600&q=80" },
    { name: "Sérum Hydratant Éclat Visage", category: "Beaute-Soins", price: 6500, description: "Sérum concentré à l'acide hyaluronique pour un teint frais.", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" },
    { name: "Crème Hydratante Quotidienne 50ml", category: "Beaute-Soins", price: 3000, description: "Hydratation 24h texture légère pour tous types de peaux.", image: "https://static.wixstatic.com/media/956e87_2d4d743577134e0d8083a1afd057f6fc~mv2.png/v1/fill/w_1000,h_1000,al_c,q_90,enc_avif,quality_auto/956e87_2d4d743577134e0d8083a1afd057f6fc~mv2.png" },
    { name: "Coffret Maquillage Complete Palette", category: "Beaute-Soins", price: 9500, description: "Palette complète fards à paupières, blush et rouges à lèvres.", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80" },
    { name: "Huile Nourrissante Cheveux & Argan", category: "Beaute-Soins", price: 2500, description: "Mélange d'huiles d'Argan et de Jojoba pour des cheveux brillants.", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80" },
    { name: "Coffret Soin Visage Spa Hydratation", category: "Beaute-Soins", price: 14000, description: "Routine complète : nettoyant, sérum, crème et masque soin.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" },
    { name: "Gel Douche Énergisant Aloe Vera", category: "Beaute-Soins", price: 2000, description: "Aux extraits d'agrumes et d'aloe vera pour rafraîchir la peau.", image: "https://images.unsplash.com/photo-1585232351009-aa87416fec90?auto=format&fit=crop&w=600&q=80" },
    { name: "Lisseur Céramique Professionnel", category: "Beaute-Soins", price: 12000, description: "Chauffe rapide et technologie protectrice pour la fibre capillaire.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80" },
    { name: "Vernis à Ongles Gel Longue Tenue", category: "Beaute-Soins", price: 1000, description: "Finition brillante tenue longue durée sans lampe.", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80" },
    { name: "Rouge à Lèvres Mat Longue Tenue", category: "Beaute-Soins", price: 2500, description: "Couleur haute pigmentation qui ne dessèche pas les lèvres.", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80" },
    { name: "Sèche-Cheveux Ionique Silencieux", category: "Beaute-Soins", price: 15000, description: "Séchage ultra-rapide avec contrôle de la chaleur.", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80" },
    { name: "Masque Argile Purifiant Visage", category: "Beaute-Soins", price: 1500, description: "Resserre les pores et affine le grain de peau.", image: "https://images.unsplash.com/photo-1567928269937-ae146e45b428?auto=format&fit=crop&w=600&q=80" },
    { name: "Eau de Toilette Fraîcheur Marine 100ml", category: "Beaute-Soins", price: 8500, description: "Senteur dynamique et fraîche idéale pour la journée.", image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80" },
    { name: "Kit Pinceaux de Maquillage (12 pcs)", category: "Beaute-Soins", price: 3500, description: "Poils synthétiques très doux pour un maquillage réussi.", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" },
    { name: "Casquette Urban Street Coton", category: "Equipement", price: 2500, description: "Casquette ajustable 100% coton avec broderie discrète.", image: "https://i.pinimg.com/736x/fc/85/ec/fc85ec89d0c85f9b7441fd15b68e1e3d.jpg" },
    { name: "Montre Chronographe Bracelet Acier", category: "Equipement", price: 14500, description: "Cadran élégant avec verre résistant et bracelet réglable.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
    { name: "Lunettes de Soleil UV400 Style", category: "Equipement", price: 3500, description: "Monture légère et verres protecteurs anti-éblouissement.", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600" },
    { name: "Sac à Main Élégant Maroquinerie", category: "Equipement", price: 12500, description: "Sac structuré finitions soignées avec bandoulière.", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80" },
    { name: "Ceinture Reversible Noir & Marron", category: "Equipement", price: 2500, description: "Double face avec boucle classique argentée résistant.", image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80" },
    { name: "Baskets Sneakers Urban Fashion", category: "Equipement", price: 13500, description: "Baskets légères et confortables au style dynamique.", image: "https://i.pinimg.com/1200x/20/0f/03/200f031ddfe44c11fe37bae7353896cf.jpg" },
    { name: "Portefeuille Compact Mince Anti-RFID", category: "Equipement", price: 2000, description: "Protège vos cartes bancaires avec plusieurs rangements.", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80" },
    { name: "Collier Pendentif Fin Argent 925", category: "Equipement", price: 5500, description: "Chaine fine avec pendentif scintillant.", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" },
    { name: "Sac à Dos Voyage & Ordinateur USB", category: "Equipement", price: 8500, description: "Sac renforcé imperméable idéal pour trajets et voyages.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" },
    { name: "Lunettes de Soleil Cadre Doré", category: "Equipement", price: 4500, description: "Style vintage chic avec monture dorée et verres teintés.", image: "https://i.pinimg.com/1200x/16/26/ad/1626adbfdb78ffee1c87ea8d6b6f8bf2.jpg" },
    { name: "Chapeau de Paille Plage & Été", category: "Equipement", price: 3000, description: "Protection solaire élégante pour la plage et promenades.", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80" },
    { name: "Montre Homme Business Cadran Noir", category: "Equipement", price: 9500, description: "Monture en acier inoxydable noire avec affichage date.", image: "https://i.pinimg.com/736x/55/75/4f/55754f21b118cfde8e52c490eecdf264.jpg" },
    { name: "Mocassins Homme Style Suédé", category: "Equipement", price: 11000, description: "Mocassins souples et élégants pour tenue décontractée.", image: "https://i.pinimg.com/736x/dd/6f/8e/dd6f8e15d9d0cdac861883f68635292f.jpg" },
    { name: "Sandales Plates Légères", category: "Equipement", price: 4500, description: "Sandales de ville très confortables pour les chaudes journées.", image: "https://i.pinimg.com/736x/19/6a/aa/196aaa7740e1ae0ce8307ebbe3cbad38.jpg" },
    { name: "Gants Souples en Cuir Fin", category: "Equipement", price: 6000, description: "Accessoire élégant au toucher doux et finitions soignées.", image: "https://images.unsplash.com/photo-1516762689617-e1cffffd478d?auto=format&fit=crop&w=600&q=80" },
    { name: "Bracelet Perles Pierres Naturelles", category: "Equipement", price: 2000, description: "Bracelet élastique mixte très tendance.", image: "https://i.pinimg.com/736x/b6/e0/9e/b6e09e5c7f64645d63effe981b5e2732.jpg" }
];

// Fonction d'importation
const importData = async () => {
    try {
        // Supprime les anciens produits pour éviter les doublons
        await Product.deleteMany();
        console.log("Nettoyage de la base de données effectué.");

        // Ajout des 50 articles avec un stock de sécurité par défaut (10)
        const itemsToInsert = catalogueDouxDoux.map(p => ({
            ...p,
            stock: 10
        }));

        await Product.insertMany(itemsToInsert);
        console.log("Félicitations ! Vos 50 produits officiels ont été injectés dans le Cloud MongoDB Atlas de Doux-Doux avec succès ! 🛍️✨");

        process.exit();
    } catch (error) {
        console.error("Erreur lors de l'importation du catalogue :", error);
        process.exit(1);
    }
};

importData();