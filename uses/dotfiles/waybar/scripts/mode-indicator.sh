#!/bin/bash
STATE_FILE="/tmp/hypr-mode"
if [ -f "$STATE_FILE" ]; then
    state=$(cat "$STATE_FILE")
else
    state="detente"
fi

case "$state" in
    "travail") echo "󰅶" ;;
    "detente") echo "󰎁" ;;
    *) echo "󰎁" ;;
esac
