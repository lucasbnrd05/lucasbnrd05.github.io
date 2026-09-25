#!/bin/bash

BAT="BAT0"

capacity=$(cat /sys/class/power_supply/$BAT/capacity 2>/dev/null)
status=$(cat /sys/class/power_supply/$BAT/status 2>/dev/null)

# Choix de l'icône selon le niveau
if [ "$capacity" -ge 90 ]; then icon="󰁹"
elif [ "$capacity" -ge 80 ]; then icon="󰂂"
elif [ "$capacity" -ge 70 ]; then icon="󰂁"
elif [ "$capacity" -ge 60 ]; then icon="󰂀"
elif [ "$capacity" -ge 50 ]; then icon="󰁿"
elif [ "$capacity" -ge 40 ]; then icon="󰁾"
elif [ "$capacity" -ge 30 ]; then icon="󰁽"
elif [ "$capacity" -ge 20 ]; then icon="󰁼"
elif [ "$capacity" -ge 10 ]; then icon="󰁻"
else icon="󰁺"
fi

# Si en charge, on change l'icône
if [ "$status" = "Charging" ]; then
    icon="󰂄"
fi

echo "$icon  ${capacity}%"
