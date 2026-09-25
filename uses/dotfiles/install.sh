#!/bin/bash

# Script d'installation des dotfiles
# Usage : ./install.sh

DOTFILES_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="$HOME/.dotfiles-backup-$(date +%Y%m%d-%H%M%S)"

echo "=== Installation des dotfiles ==="
echo "Dépôt : $DOTFILES_DIR"
echo "Sauvegarde : $BACKUP_DIR"
echo ""

# Sauvegarde des fichiers existants
mkdir -p "$BACKUP_DIR"
for item in .config .zshrc .gitconfig; do
    if [ -e "$HOME/$item" ]; then
        echo "Sauvegarde de $item"
        cp -r "$HOME/$item" "$BACKUP_DIR/"
    fi
done

# Copie des dotfiles
echo ""
echo "Copie des dotfiles..."
cp -r "$DOTFILES_DIR/.config/"* "$HOME/.config/"
cp "$DOTFILES_DIR/.zshrc" "$HOME/.zshrc"
[ -f "$DOTFILES_DIR/.gitconfig" ] && cp "$DOTFILES_DIR/.gitconfig" "$HOME/.gitconfig"

echo ""
echo "=== Installation terminée ==="
echo "Redémarre ta session pour appliquer les changements."
