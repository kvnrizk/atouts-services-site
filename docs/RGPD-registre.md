# Registre des activités de traitement — ATOUTS SERVICES

Article 30 du RGPD. À tenir à jour à chaque nouveau traitement, nouveau prestataire ou changement de durée.
À présenter à la CNIL en cas de contrôle.

- **Responsable du traitement :** ATOUTS SERVICES, SARL — SIRET 490 173 697 00049 —
  20 rue d'Estienne d'Orves, 92130 Issy-les-Moulineaux
- **Représentant légal :** Maroun ABI ATMI, gérant
- **Contact données personnelles :** contact@atouts-services.fr
- **Délégué à la protection des données (DPO) :** non désigné (non obligatoire : pas de traitement à grande
  échelle ni de données sensibles)
- **Dernière mise à jour :** 25 septembre 2026

> Les durées ci-dessous sont appliquées automatiquement par le job nocturne
> `atousservice_backend/src/retention/retention.service.ts` (03:00, Europe/Paris).
> Toute modification doit être reportée à trois endroits : ce registre, le job, et la page
> `/politique-de-confidentialite`.

---

## 1. Gestion des demandes de devis (prospects)

| | |
|---|---|
| Finalité | Répondre aux demandes de devis et de rappel, recontacter le prospect |
| Base légale | Mesures précontractuelles (art. 6-1-b) |
| Personnes concernées | Prospects (particuliers et professionnels) |
| Données | Nom, prénom, e-mail, téléphone, description du projet, type de travaux, surface, délai, budget indicatif ; paramètres de campagne (UTM) si la visite vient d'une annonce |
| Source | Formulaires du site (accueil, pages services) |
| Destinataires | Gérant et personnel habilité ; sous-traitants : Render (hébergement BDD), prestataire e-mail |
| Transferts hors UE | Render (société américaine, données hébergées à Francfort) |
| Durée | 3 ans après le dernier échange (`quote_requests.updated_at`), suppression automatique ; conservée tant qu'un projet y est rattaché |
| Sécurité | HTTPS, accès admin authentifié (JWT, cookie httpOnly), limitation 3 envois/minute/IP |

## 2. Espace client et suivi de chantier

| | |
|---|---|
| Finalité | Gestion du compte client, suivi des chantiers, partage de documents, échanges |
| Base légale | Exécution du contrat (art. 6-1-b) |
| Personnes concernées | Clients |
| Données | Identité, e-mail, téléphone, mot de passe (haché bcrypt), projets, documents, messages |
| Destinataires | Gérant et personnel habilité ; Render |
| Durée | Relation contractuelle + 5 ans (prescription civile). **Pas de suppression automatique** : le job signale les comptes inactifs depuis 5 ans pour revue manuelle (les garanties décennales peuvent justifier de conserver les documents de chantier) |

## 3. Paiements en ligne — SUSPENDU

Désactivé le 25/09/2026 : l'entreprise n'encaisse pas de paiement via le site (acomptes réglés hors site).
`FEATURES.payments = false` côté site, `FEATURE_PAYMENTS` côté API (toutes les routes, webhook compris, répondent 404).
À réactiver seulement après mise à jour de ce registre et de la politique de confidentialité.

| | |
|---|---|
| Finalité | Encaissement des acomptes et factures |
| Base légale | Contrat (6-1-b) et obligation légale comptable (6-1-c) |
| Données | Montant, date, référence, identifiants de session Stripe. **Aucune donnée bancaire** stockée par Atouts Services |
| Destinataires | Stripe Payments Europe, Ltd. (Irlande) |
| Durée | 10 ans (art. L123-22 Code de commerce) |

## 4. Newsletter

| | |
|---|---|
| Finalité | Envoi de conseils et actualités |
| Base légale | Consentement (6-1-a) — case non pré-cochée, preuve = `subscribed_at` |
| Données | E-mail, date d'inscription, jeton de désinscription |
| Destinataires | Prestataire e-mail |
| Durée | Jusqu'à la désinscription ; suppression automatique sous 24 h (`is_active = false`) |
| Retrait | Lien dans chaque e-mail → `/newsletter/desinscription?token=…` |

## 5. Avis clients

| | |
|---|---|
| Finalité | Publication de témoignages |
| Base légale | Consentement (6-1-a) |
| Données | Prénom + initiale, ville, note, commentaire |
| Durée | Jusqu'au retrait du consentement |

## 6. Mesure d'audience

| | |
|---|---|
| Finalité | Statistiques de fréquentation anonymes |
| Base légale | Intérêt légitime (6-1-f) ; exemption de consentement CNIL (outil sans cookie, sans conservation d'IP) |
| Outil | Outil interne (tables `page_views`, `site_events`) — relais anonymisant `app/api/collect/route.ts` sur Vercel, stockage Render (Francfort) |
| Données | Page, ville/pays (en-têtes de géolocalisation Vercel), appareil, provenance/campagne, clics téléphone et envois de devis, identifiant anonyme quotidien (hash IP + navigateur + sel du jour). **Ni IP, ni navigateur complet, ni URL de provenance complète, ni gclid conservés** |
| Garanties | Pas de cookie ni de stockage sur l'appareil ; pas de suivi d'un jour à l'autre ; robots exclus ; pas de recoupement avec les demandes de devis nominatives ; accès admin uniquement |
| Durée | 25 mois maximum |

## 7. Cookies soumis à consentement

| Catégorie | Outil | Statut |
|---|---|---|
| Contenus tiers | Google Maps | Chargé uniquement après consentement « Contenus tiers » |
| Publicité | Google Ads (mesure de conversion) | Pas encore installé ; chargé uniquement après consentement « Publicité » |

Consentement : stocké dans `localStorage` (`atouts_consent`) avec date et version, valable 6 mois.
Implémentation : `atousservice-next/lib/consent.ts`.

## 8. Simulateur de prix — SUSPENDU

Désactivé le 25/09/2026 (`FEATURES.simulator = false` côté site, `FEATURE_SIMULATOR` côté API : l'API répond 404).
Données éventuellement existantes supprimées 3 ans après leur dernière mise à jour.

---

## Sous-traitants (art. 28)

| Prestataire | Rôle | Localisation des données | Encadrement |
|---|---|---|---|
| Vercel Inc. | Hébergement du site | États-Unis / CDN mondial | Certifié EU-US Data Privacy Framework |
| Render Services, Inc. | API + base de données | Francfort (UE) | DPA Render (à signer / vérifier) |
| ~~Stripe Payments Europe, Ltd.~~ | Paiement — **suspendu** | Irlande (UE) | DPA Stripe (si réactivé) |
| **[À COMPLÉTER]** | Envoi des e-mails (SMTP) | ? | DPA à vérifier |
| Google (si consentement) | Carte, conversions Ads | États-Unis | EU-US Data Privacy Framework |

## Procédure — demande d'exercice de droits

1. Réception par e-mail ou courrier → noter la date (délai de réponse : **1 mois**, prorogeable de 2 mois si complexe, en prévenant la personne).
2. Vérifier l'identité **seulement en cas de doute raisonnable** (ne pas exiger systématiquement une pièce d'identité).
3. Rechercher la personne par e-mail dans : demandes de devis, comptes clients, newsletter, avis (admin).
4. Accès / portabilité : exporter les données (admin → demandes de devis : export CSV).
5. Effacement : supprimer via l'admin, **sauf** données de paiement (10 ans) et documents de chantier sous garantie.
6. Répondre par écrit et conserver la trace de la demande et de la réponse.

## Procédure — violation de données

Si des données personnelles sont perdues, volées ou exposées : notifier la CNIL **sous 72 h**
(notifications.cnil.fr) et, si le risque est élevé, informer les personnes concernées. Consigner l'incident ici.

| Date | Incident | Données concernées | Mesures prises | Notifié CNIL |
|---|---|---|---|---|
| — | — | — | — | — |
