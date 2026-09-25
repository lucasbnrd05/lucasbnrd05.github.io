#!/bin/bash

# Vérifie si le Wi-Fi est activé
if nmcli radio wifi | grep -q "enabled"; then
    state="Activé"
    action="Désactiver le Wi-Fi"
else
    state="Désactivé"
    action="Activer le Wi-Fi"
fi

# Liste les réseaux disponibles, filtrés et sans doublons
networks=$(nmcli -t -f SSID,SECURITY device wifi list | awk -F: 'NF && $1 != "" {print $1 " (" $2 ")"}' | sort -u)

# Options fixes en haut, puis les réseaux
options="$action\nMode Avion\n---\n$networks"

chosen=$(echo -e "$options" | wofi --dmenu --prompt "Wi-Fi ($state)" --width 400 --height 400)

[ -z "$chosen" ] && exit 0

case "$chosen" in
    "Activer le Wi-Fi")
        nmcli radio wifi on
        notify-send "Wi-Fi" "Activé"
        ;;
    "Désactiver le Wi-Fi")
        nmcli radio wifi off
        notify-send "Wi-Fi" "Désactivé"
        ;;
    "Mode Avion")
        rfkill block all
        notify-send "Système" "Mode Avion activé"
        ;;
    ---)
        exit 0
        ;;
    *)
        # C'est un réseau, on extrait le SSID
        ssid=$(echo "$chosen" | sed 's/ (.*//')
        security=$(echo "$chosen" | sed -n 's/.*(\(.*\))/\1/p')

        if [ -n "$security" ] && [ "$security" != "--" ] && [ "$security" != "" ]; then
            pass=$(echo "" | wofi --dmenu --prompt "Mot de passe pour $ssid" --password)
            [ -z "$pass" ] && exit 0
            nmcli device wifi connect "$ssid" password "$pass"
        else
            nmcli device wifi connect "$ssid"
        fi

        if [ $? -eq 0 ]; then
            notify-send "Wi-Fi" "Connecté à $ssid"
        else
            notify-send "Wi-Fi" "Échec de connexion à $ssid"
        fi
        ;;
esac
