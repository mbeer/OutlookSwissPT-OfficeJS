# Recherche d'horaires pour Outlook – Guide d'utilisation

**Swiss Public Transport Timetable for Outlook**

---

## Aperçu

Cet add-in vous permet de rechercher des connexions de transports publics en Suisse directement dans Outlook et de les enregistrer dans votre calendrier. En quelques clics, trouvez la meilleure connexion de votre point de départ à votre rendez-vous – et inversement.

**Fonctionnalités :**
- 🔍 Recherche en temps réel de connexions de transports publics suisses (via search.ch)
- 📅 Enregistrement automatique dans le calendrier Outlook
- ⭐ Gestion des arrêts favoris pour les arrêts fréquemment utilisés
- 🌍 5 langues : allemand, français, italien, rhéto-roman, anglais
- 📱 Fonctionne sur Outlook pour Windows, Mac et sur le Web

---

## Installation

### Étape 1 : Télécharger le fichier manifeste

L'add-in est installé via un fichier manifeste. Téléchargez-le comme suit :

1. Ouvrez cette URL dans votre navigateur : **https://timetable.mbeer.ch/v2/manifest.xml**
2. Cliquez avec le bouton droit sur la page XML
3. Sélectionnez **Enregistrer sous** (ou **Save as** en anglais)
4. Enregistrez le fichier sous le nom `manifest.xml` sur votre ordinateur (par exemple, dans le dossier Téléchargements)

![Télécharger le fichier manifeste avec « Enregistrer sous »][step-1-fr]

*Remarque : Le fichier manifeste est un fichier XML qui indique à Outlook où trouver les composants de l'add-in.*

---

### Étape 2 : Effectuer l'installation

Ouvrez https://aka.ms/olksideload et suivez ce chemin :

1. Cliquez sur **Mes add-ins**
2. Faites défiler jusqu'à **Mes add-ins personnalisés**
3. Cliquez sur **Ajouter un add-in personnalisé**
4. Sélectionnez **Ajouter à partir d'un fichier…**
5. Sélectionnez le fichier `manifest.xml` téléchargé précédemment
6. Confirmez l'installation

![Installation d'un add-in – Ajouter un fichier][step-2-fr]

Après une installation réussie, l'add-in devrait être disponible dans Outlook lorsque vous ouvrez une entrée de calendrier.

---

## Utilisation

### Étape 1 : Ouvrir un rendez-vous

Ouvrez un rendez-vous calendrier dans Outlook (existant ou nouvellement créé).

**Important :** Enregistrez d'abord les nouveaux rendez-vous (Ctrl+S ou cliquez sur « Enregistrer »). Le rendez-vous ne doit *pas* être ouvert en mode édition pour que l'add-in fonctionne correctement.

Cliquez sur le bouton **Recherche d'horaires** dans la barre de menu Outlook – la fenêtre de l'add-in s'ouvrira alors dans la barre latérale.

<img src="/assets/screenshots/step-4.png" alt="Fenêtre de rendez-vous avec le bouton Recherche d'horaires dans la barre du ruban" width="100%">

---

### Étape 2 : Rechercher des connexions

Dans la fenêtre, vous trouverez deux sections : **Aller** et **Retour**.

#### Aller (vers le rendez-vous)
Entrez :
- **Arrêt au lieu du rendez-vous** (destination) : L'arrêt de transports publics par lequel vous souhaitez atteindre le lieu du rendez-vous. Vous pouvez également entrer l'adresse du lieu du rendez-vous.
- **Aller depuis** (point de départ) : L'arrêt de transports publics ou l'adresse à partir de laquelle vous souhaitez commencer votre trajet vers le rendez-vous.
- **Temps de marche (min)** : Le temps dont vous avez besoin au lieu du rendez-vous ou au point de départ pour vous rendre à l'arrêt.
- Éventuellement, sélectionnez un favori dans la liste déroulante

Cliquez sur **Rechercher** – le système trouve des connexions qui arrivent avant le rendez-vous (avec un délai pour le temps de marche).

#### Retour (depuis le rendez-vous)
Semblable à l'aller : entrez où vous souhaitez retourner et le temps dont vous avez besoin pour vous rendre à l'arrêt.

---

### Étape 3 : Sélectionner une connexion

Les résultats de la recherche s'affichent dans un tableau :
- **Heure** : Départ et arrivée
- **Durée** : Combien de temps dure le trajet
- **Route** : Chaîne d'emojis des moyens de transport (🚆 train, 🚍 bus, 🚊 tram, etc.)

Cliquez sur une connexion pour la sélectionner (la ligne sera mise en surbrillance).

<img src="/assets/screenshots/step-5.png" alt="Sélection de connexion" width="30%">

---

### Étape 4 : Enregistrer dans le calendrier

Après avoir sélectionné une connexion, cliquez sur **Enregistrer l'aller dans le calendrier** (pour l'aller) ou **Enregistrer le retour dans le calendrier** (pour le retour).

L'add-in crée automatiquement une entrée de calendrier avec :
- **Titre** : « Transfert [De] – [À] »
- **Lieu** : Chaîne d'emojis de la route (par exemple, « 🚶‍➡️15′ 🚆S2 🚍130 »)
- **Heure de début** : Heure de départ (moins temps de marche)
- **Heure de fin** : Heure d'arrivée (plus temps de marche)
- **Description** : Informations d'itinéraire détaillées avec tous les arrêts

Une fenêtre de création d'un nouvel événement s'ouvrira, préremplie avec ces informations. Vous pouvez ensuite enregistrer ce nouvel événement dans votre calendrier en cliquant sur **Enregistrer**.

<img src="/assets/screenshots/step-6.png" alt="Enregistrer un événement dans le calendrier" width="60%">

⚠️ **Remarque** : L'ouverture automatique de la fenêtre de l'événement ne fonctionne que si le rendez-vous de référence est en **mode lecture** (voir la section « Limitations lors de l'enregistrement dans le calendrier » ci-dessous). Si vous êtes en mode édition, enregistrez d'abord le rendez-vous et ouvrez-le à nouveau dans le calendrier. Vous pouvez également copier manuellement les informations de connexion dans un nouvel événement.

---

### Épingler le bouton Recherche d'horaires à la barre d'outils du calendrier

Dans le nouveau Outlook sur le Web et le nouveau Outlook pour Windows, le bouton de l'add-in peut d'abord être affiché uniquement dans le menu **Autres applications (…)** du formulaire de calendrier au lieu d'être directement dans la barre d'outils.

Vous pouvez épingler le bouton à la barre d'outils du calendrier pour le rendre toujours visible :

1. Ouvrez un rendez-vous calendrier quelconque.
2. Cliquez sur l'icône **Paramètres** (engrenage) dans le coin supérieur droit.
3. Accédez à **Calendrier → Personnaliser les actions**.
4. Dans la section **Surface du calendrier** (barre d'outils), cochez la case pour l'add-in (par exemple, « Recherche d'horaires »).
5. Enregistrez vos modifications et rechargez Outlook si nécessaire.

Le bouton de l'add-in s'affichera désormais directement dans la barre d'outils du calendrier, tant que l'espace le permet. Si la fenêtre Outlook est très étroite, Outlook peut automatiquement déplacer le bouton vers le menu **Autres applications (…)**.

---

## Paramètres

### Arrêts favoris

Vous pouvez enregistrer les arrêts fréquemment utilisés comme favoris pour les sélectionner plus rapidement.

1. Cliquez sur **Paramètres** (icône d'engrenage en haut à droite) dans la fenêtre de l'add-in
2. Sous **Arrêts par défaut**, vous pouvez :
   - Ajouter un nouvel arrêt : entrez le nom + temps de marche en minutes
   - Modifier ou supprimer les favoris
   - Modifier l'ordre (déplacer vers le haut/bas)

Les favoris sont stockés localement dans votre navigateur.

### Changer de langue

L'add-in détecte automatiquement la langue de votre Outlook et passe à celle-ci en conséquence :
- 🇩🇪 Allemand (Suisse, Allemagne)
- 🇫🇷 Français (Suisse, France)
- 🇮🇹 Italien (Suisse, Italie)
- 🇨🇭 Rhéto-roman (Suisse)
- 🇬🇧 Anglais

Pour changer manuellement de langue :
1. Cliquez sur **Paramètres**
2. Sous **Langue**, sélectionnez votre langue préférée
3. L'add-in se rechargera immédiatement

<img src="/assets/screenshots/step-7.png" alt="Paramètres de langue et gestion des favoris" width="30%">

---

## Limitations lors de l'enregistrement dans le calendrier

### Variantes Outlook supportées

L'enregistrement de trajets directement dans le calendrier fonctionne sur les plates-formes suivantes :
- ✅ **Outlook pour Windows (Bureau)** – entièrement supporté
- ✅ **Outlook sur le Web (Outlook.com, Office 365)** – entièrement supporté
- ✅ **Nouveau Outlook** (Aperçu) – entièrement supporté
- ❌ **Outlook pour macOS** – actuellement non supporté
- ❌ **Outlook pour iOS/Android (appareils mobiles)** – non supporté

### Mode lecture vs Mode édition

L'add-in ne peut enregistrer les trajets dans le calendrier que lorsque le rendez-vous est en **mode lecture**. Cela se produit lorsque le rendez-vous a déjà été enregistré et que vous l'ouvrez depuis votre calendrier.

**Mode lecture (fonctionne) :**
- Le rendez-vous a déjà été enregistré
- Vous l'ouvrez depuis la vue de calendrier
- Vous voyez un bouton « Modifier » au lieu de champs de texte directement modifiables
- L'add-in peut enregistrer les trajets directement dans le calendrier

**Mode édition (ne fonctionne pas) :**
- Vous créez un nouveau rendez-vous
- Vous modifiez un rendez-vous existant (brouillon)
- Le rendez-vous n'a pas encore été enregistré
- L'add-in ne peut pas enregistrer les trajets

### Comment passer en mode lecture

1. **Enregistrez le rendez-vous** auquel se rapporte la planification de voyage
2. **Ouvrez votre calendrier** dans Outlook
3. **Cliquez sur le rendez-vous enregistré** pour l'ouvrir
4. **Vérifiez que vous êtes en mode lecture** : vous devriez voir un bouton « Modifier » (pas de champ de texte à modifier directement)
5. **Vous pouvez maintenant utiliser l'add-in** et enregistrer les trajets dans le calendrier

---

## Dépannage

### L'add-in ne s'affiche pas

**Causes possibles :**
- L'installation est incomplète. Essayez de réinstaller l'add-in.
- Vous avez ouvert un rendez-vous ? L'add-in s'affiche uniquement lorsqu'une entrée de calendrier est ouverte.
- Cache du navigateur : videz le cache et rechargez Outlook.

### Le rendez-vous ne s'est pas créé

**Vérifiez :**
- Vous avez sélectionné une connexion (la ligne est mise en surbrillance)
- Votre Outlook a l'accès en écriture au calendrier
- Essayez à nouveau ou redémarrez Outlook

### L'add-in se charge lentement

- L'add-in a besoin d'une connexion Internet active (pour l'API search.ch)
- Vérifiez votre connexion réseau

---

## Questions fréquemment posées

**Q : Mes données sont-elles enregistrées ?**  
R : Non. L'add-in ne stocke que localement dans votre navigateur :
- Vos arrêts favoris
- Votre paramètre de langue

Toutes les recherches vont à l'API publique de search.ch. Michael Beer (développeur) ne voit pas vos demandes de recherche.

**Q : L'add-in fonctionne-t-il sur Outlook sur mon téléphone ?**  
R : De manière limitée. Outlook pour iOS/Android ne supporte actuellement pas toutes les fonctionnalités d'Office.js. Les versions de bureau (Windows, Mac) et Outlook sur le Web fonctionnent complètement.

**Q : Puis-je utiliser l'add-in hors ligne ?**  
R : Non, car les données de connexion sont récupérées depuis search.ch. Vous avez besoin d'une connexion Internet.

**Q : Quels pays sont supportés ?**  
R : Actuellement, seule la Suisse (via search.ch). D'autres pays pourront être ajoutés ultérieurement.

---

## Contact & Support

**Problèmes ou suggestions ?**

Ouvrez un problème sur GitHub :  
https://github.com/mbeer/OutlookSwissPT-OfficeJS/issues

---

## Licence

Cet add-in est publié sous la licence MIT.

- **Code source** : https://github.com/mbeer/OutlookSwissPT-OfficeJS
- **API d'horaires** : search.ch (API publique, aucune authentification requise)
- **Icônes** : Lucide (licence ISC)

---

**Développeur** : Michael Beer  
**Version** : 2.0.1  
**Dernière mise à jour** : Décembre 2025

---

## Références d'images

[step-1-fr]: /assets/screenshots/step-1-de.png "Télécharger le manifeste"
[step-2-fr]: /assets/screenshots/step-2-de.png "Outlook Bureau – Installation de l'add-in"
[step-3-fr]: /assets/screenshots/step-3-de.png "Outlook Web – Installation de l'add-in"
