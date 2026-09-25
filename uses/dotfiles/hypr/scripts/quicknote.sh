#!/bin/bash

# Crée le dossier s'il n'existe pas
NOTE_DIR="$HOME/notes"
mkdir -p "$NOTE_DIR"

# Nom du fichier : jour-mois-année_heure-minute.txt
NOTE_FILE="$NOTE_DIR/$(date '+%d-%m-%Y_%H-%M').txt"

# Crée le fichier s'il n'existe pas
touch "$NOTE_FILE"

# Ouvre Vim dans Kitty, directement à la fin du fichier
kitty --title "Note - $(date '+%d-%m-%Y %H:%M')" vim "+normal G" "$NOTE_FILE"
