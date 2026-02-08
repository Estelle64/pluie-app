# 🌦️ Journal Météo

Application web pour suivre divers paramètres météorologiques et énergétiques quotidiens, ainsi que des commentaires personnalisés.

## ✨ Fonctionnalités

-   ✅ **Suivi complet :** Enregistrement des précipitations (mm), des températures (matin/après-midi en °C), et de la production solaire (kWh).
-   ✅ **Commentaires quotidiens :** Ajoutez des notes ou observations pour chaque jour.
-   ✅ **Interface à onglets :** Navigation facile entre les sections "Pluie", "Température", "Production solaire" et "Commentaire".
-   ✅ **Statistiques en temps réel :** Aperçu rapide des données pour "aujourd'hui", "ce mois" et "cette année" sur chaque onglet pertinent.
-   ✅ **Graphiques interactifs :** Visualisation des tendances mensuelles et annuelles pour les précipitations, les températures (matin/après-midi) et la production solaire.
-   ✅ **Sélecteurs de date intuitifs :** Choisissez facilement la date d'enregistrement pour toutes les saisies.
-   ✅ **Historiques détaillés :** Affichez les dernières entrées pour chaque type de donnée.
-   ✅ **Export/Import des données :** Sauvegardez et restaurez toutes vos données au format JSON.
-   ✅ **Rappels de sauvegarde automatiques :** Une notification vous invite à exporter vos données si elles n'ont pas été sauvegardées récemment.
-   ✅ **Interface responsive :** Adaptée aux téléphones, tablettes et ordinateurs.
-   ✅ **Fonctionne hors ligne :** Après le premier chargement, l'application est opérationnelle sans connexion internet.

## 🛠️ Technologies utilisées

-   **HTML5** : Structure de l'application.
-   **CSS3** : Styles visuels modernes.
-   **JavaScript** : Logique front-end de l'application.
-   **Chart.js** : Bibliothèque pour la création des graphiques interactifs.
-   **IndexedDB API** : Pour un stockage local persistant et robuste des données structurées.
-   **LocalStorage API** : Utilisé pour stocker des informations légères comme la date de la dernière sauvegarde.

## 🚀 Installation

Accédez à l'application via votre navigateur en saisissant l'URL suivante : https://estelle64.github.io/journal_meteo-app/.

## 📁 Structure du projet

```
pluie-app/
├── index.html           # Page HTML principale et structure des onglets
├── css/
│   └── style.css        # Tous les styles CSS de l'application
├── js/
│   ├── app.js           # Point d'entrée principal, initialise l'application et gère les onglets
│   ├── idb.js           # Wrapper pour les opérations IndexedDB
│   ├── storage.js       # Gestion du stockage des données (IndexedDB et localStorage)
│   ├── ui.js            # Gestion de l'interface utilisateur et événements
│   ├── chart.js         # Logique spécifique aux graphiques de pluie (Chart.js)
│   ├── temperature.js   # Logique spécifique aux graphiques de température (Chart.js)
│   └── watts.js         # Logique spécifique aux graphiques de production solaire (Chart.js)
└── README.md            # Ce fichier
```

## 💾 Stockage des données

L'application utilise une combinaison de **IndexedDB** et **LocalStorage** pour un stockage des données robuste et performant :

-   **IndexedDB** : C'est le moteur de stockage principal pour toutes vos données météorologiques et commentaires (précipitations, températures, production solaire, commentaires). Il offre une grande capacité de stockage et est optimisé pour les données structurées. Vos données sont conservées localement dans votre navigateur, garantissant la persistance entre les sessions et la fonctionnalité hors ligne.
-   **LocalStorage** : Utilisé pour des informations légères et non critiques, comme la date de votre dernière exportation de données.

**Migration automatique :** Si vous utilisiez une version précédente de l'application stockant toutes les données dans LocalStorage, l'application migrera automatiquement vos données vers IndexedDB lors du premier chargement.

## ⚠️ Précautions concernant le stockage local

Bien que IndexedDB soit plus robuste que LocalStorage, toutes les données stockées côté client peuvent être perdues si :
-   Vous videz le cache et les données de site de votre navigateur.
-   Vous changez d'appareil ou utilisez un navigateur différent.
-   Vous utilisez la navigation privée (les données y sont temporaires).

**Solution** : Utilisez la fonctionnalité "📥 Exporter mes données" régulièrement pour sauvegarder vos informations sous forme de fichier JSON !

## 📱 Utilisation mobile

L'application est conçue pour être entièrement responsive et fonctionne parfaitement sur mobile. Pour une expérience d'application native, vous pouvez l'ajouter à votre écran d'accueil :

**iOS (Safari)** :
1.  Ouvrez l'application dans Safari.
2.  Appuyez sur l'icône de partage (le carré avec une flèche vers le haut).
3.  Sélectionnez "Sur l'écran d'accueil".

**Android (Chrome)** :
11. Ouvrez l'application dans Chrome.
12. Appuyez sur le menu (les trois points verticaux en haut à droite).
13. Sélectionnez "Ajouter à l'écran d'accueil".

## 📄 Licence

Libre d'utilisation et de modification.

## 👤 Auteur

Créé pour suivre les paramètres météorologiques quotidiens de manière simple et élégante.
