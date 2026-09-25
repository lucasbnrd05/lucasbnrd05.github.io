#!/bin/bash

cpu=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{printf "%.0f", 100 - $1}')
mem=$(free -h | awk '/^Mem:/ {print $3 " / " $2}')
temp=$(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null | awk '{printf "%.0f", $1/1000}')
[ -z "$temp" ] && temp="N/A"

# Disque (partition racine)
disk=$(df -h / | awk 'NR==2 {print $3 " / " $2 " (" $5 ")"}')

# Uptime
uptime=$(uptime -p | sed 's/up //')

# GPU (si disponible via nvidia-smi ou autre)
if command -v nvidia-smi &>/dev/null; then
    gpu=$(nvidia-smi --query-gpu=utilization.gpu,temperature.gpu --format=csv,noheader,nounits | awk -F', ' '{print $1 "% (" $2 "°C)"}')
else
    gpu="N/A"
fi

# Affichage dans Wofi
echo -e "  CPU: ${cpu}%\n  RAM: ${mem}\n  Temp: ${temp}°C\n  GPU: ${gpu}\n  Disque: ${disk}\n  Uptime: ${uptime}\n\n  Ouvrir btop" | wofi --dmenu --prompt "Système" --width 350 --height 300
