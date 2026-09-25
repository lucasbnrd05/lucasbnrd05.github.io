#!/bin/bash

# Vérifie si le Wi-Fi est activé
wifi_state=$(nmcli radio wifi)

if [ "$wifi_state" = "disabled" ]; then
    echo "󰖪  Wi-Fi off"
    exit 0
fi

# Wi-Fi activé : vérifie la connexion
connection=$(nmcli -t -f TYPE,STATE device | grep "^wifi:connected" 2>/dev/null)

if [ -n "$connection" ]; then
    ssid=$(nmcli -t -f ACTIVE,SSID device wifi | grep "^yes" | cut -d: -f2)
    echo "󰤨  $ssid"
else
    echo "󰤯  Non connecté"
fi
