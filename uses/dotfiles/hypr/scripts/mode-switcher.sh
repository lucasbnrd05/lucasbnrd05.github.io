#!/bin/bash

STATE_FILE="/tmp/hypr-mode"

# --- Fonctions utilitaires ---

close_class() {
    local class="$1"
    hyprctl clients -j | jq -r ".[] | select(.class == \"$class\") | .address" | while read -r addr; do
        [ -n "$addr" ] && hyprctl dispatch "hl.dsp.window.close({ window = \"address:$addr\" })"
    done
}

place_or_launch() {
    local class="$1"
    local workspace="$2"
    local command="$3"

    local addr=$(hyprctl clients -j | jq -r ".[] | select(.class == \"$class\") | .address" | head -n 1)

    if [ -n "$addr" ]; then
        hyprctl dispatch "hl.dsp.window.move({ window = \"address:$addr\", workspace = \"$workspace\" })"
    else
        hyprctl dispatch "hl.dsp.exec_cmd(\"$command\")"
        sleep 1.5
        addr=$(hyprctl clients -j | jq -r ".[] | select(.class == \"$class\") | .address" | head -n 1)
        [ -n "$addr" ] && hyprctl dispatch "hl.dsp.window.move({ window = \"address:$addr\", workspace = \"$workspace\" })"
    fi
}

ensure_two_kitty() {
    local workspace="1"
    local count=$(hyprctl clients -j | jq '[.[] | select(.class == "kitty")] | length')

    if [ "$count" -eq 0 ]; then
        hyprctl dispatch 'hl.dsp.exec_cmd("kitty")'
        sleep 1.5
        hyprctl dispatch 'hl.dsp.exec_cmd("kitty")'
        sleep 1.5
    elif [ "$count" -eq 1 ]; then
        hyprctl dispatch 'hl.dsp.exec_cmd("kitty")'
        sleep 1.5
    fi

    hyprctl clients -j | jq -r '.[] | select(.class == "kitty") | .address' | while read -r addr; do
        hyprctl dispatch "hl.dsp.window.move({ window = \"address:$addr\", workspace = \"$workspace\" })"
    done
}

# --- Modes ---

apply_travail() {
    echo "travail" > "$STATE_FILE"

    close_class "spotify"

    ensure_two_kitty
    place_or_launch "code" "2" "code"
    place_or_launch "firefox" "3" "firefox"
    place_or_launch "discord" "4" "discord"

    hyprctl dispatch 'hl.dsp.focus({ workspace = "1" })'
}

apply_detente() {
    echo "detente" > "$STATE_FILE"

    close_class "kitty"
    close_class "code"

    place_or_launch "firefox" "1" "firefox"
    place_or_launch "discord" "2" "discord"

    hyprctl dispatch 'hl.dsp.focus({ workspace = "1" })'
}

# --- Gestion du mode par défaut ---

if [ "$1" = "--default" ] && [ "$2" = "detente" ]; then
    echo "detente" > "$STATE_FILE"
    exit 0
fi

# --- Menu Wofi ---

MODE=$(printf "󰈙 Travail\n󰎁 Détente" | wofi --dmenu --prompt "Mode" --width 300 --height 200)

case "$MODE" in
    "󰈙 Travail") apply_travail ;;
    "󰎁 Détente") apply_detente ;;
esac
