---
layout: post
title: "Ma Gestion des photos et videos"
date: 2014-07-03 21:24:19 +0200
comments: true
categories: photo
resources: resources/2014-07-03-ma-gestion-des-photos
---

# Stockage

Sur le disque, je stocke mes photos / videos comme ceci :

* `media`: répertoire racine
  * `masters`: répertoire contenant les fichiers bruts, copiés des cartes SD des appareils
  * `photos`: répertoire contenant les photos JPG converties à partir des RAW dans `masters`
  * `videos`: répertoire contenant les vidéos copiées de `masters`

Dans les sous répertoires `masters`, `photos` et `videos`, les fichiers sont organisés par date de
prise de vue : `<annee>/<mois>/<annee>-<mois>-<jour>`.


# Workflow

Les étapes principales de mon *workflow* sont :

* Prise de vue en RAW
* Copie des fichiers de la carte SD de l'appareil dans le répertoire `media/masters`
* Post-traitement avec [RawTherapee](http://rawtherapee.com/)
* Conversion des RAW en JPEG et sortie vers `photos` en utilisant [RawTherapee](http://rawtherapee.com/) en mode ligne de commande
* Copie des vidéos vers `video`
* Partage des photos JPEG avec [Picasa](http://picasa.google.com/)
* Sauvegarde de l'ensemble des fichiers sur un NAS

# Outils

J'utilise les outils suivants :

* [RawTherapee](http://rawtherapee.com/) pour le post-traitement des RAW
* [Picasa](http://picasa.google.com/) pour la création d'albums et le partage de ces albums
* [ExifTool](http://www.sno.phy.queensu.ca/~phil/exiftool/) pour l'extraction 
de la date de prise de vue; fonctionne aussi avec les vidéos
* [Rsync](http://rsync.samba.org/) pour la sauvegarde sur le NAS
* [BitTorrent Sync](http://www.bittorrent.com/sync/) en cours d'expérimentation pour remplacer `rsync`

Et un outil maison pour automatiser la plupart des tâches...



