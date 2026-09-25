#!/bin/bash

# Vérifie si le Bluetooth est activé ou non
if bluetoothctl show | grep -q "Powered: yes"; then
    state="Activé"
    action="Désactiver"
else
    state="Désactivé"
    action="Activer"
fi

# Propose les options principales + la liste des appareils connus
options="$action le Bluetooth\nMode Avion\n---\n"

# Ajoute la liste des appareils connus
devices=$(bluetoothctl devices | sed 's/Device \([^ ]*\) \(.*\)/\2 (\1)/')
if [ -n "$devices" ]; then
    options="$options$devices"
fi

chosen=$(echo -e "$options" | wofi --dmenu --prompt "Bluetooth ($state)" --width 350 --height 400)

[ -z "$chosen" ] && exit 0

case "$chosen" in
    "Activer le Bluetooth")
        bluetoothctl power on
        notify-send "Bluetooth" "Activé"
        ;;
    "Désactiver le Bluetooth")
        bluetoothctl power off
        notify-send "Bluetooth" "Désactivé"
        ;;
    "Mode Avion")
        # Active le mode avion via rfkill
        rfkill block all
        notify-send "Système" "Mode Avion activé"
        ;;
    ---)
        exit 0
        ;;
    *)
        # C'est un appareil, on extrait la MAC et on tente la connexion
        mac=$(echo "$chosen" | sed -n 's/.*(\(.*\))/\1/p')
        if [ -n "$mac" ]; then
            if bluetoothctl info "$mac" | grep -q "Connected: yes"; then
                bluetoothctl disconnect "$mac"
                notify-send "Bluetooth" "Déconnecté de $chosen"
            else
                bluetoothctl connect "$mac"
                notify-send "Bluetooth" "Connexion à $chosen..."
            fi
        fi
        ;;
esac
