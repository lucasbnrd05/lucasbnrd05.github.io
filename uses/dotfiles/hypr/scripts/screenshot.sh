#!/bin/bash
# Take the screenshot and copy to clipboard
grim -g "$(slurp)" - | wl-copy

# Send a notification
notify-send "Screenshot Taken" "Copied to your clipboard!" -i camera
