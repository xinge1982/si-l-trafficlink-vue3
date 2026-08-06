#!/bin/bash

# usage:
# ./clean_blank.sh input.py output.py

if [ $# -ne 2 ]; then
    echo "Usage: $0 input.py output.py"
    exit 1
fi

awk '
{
    if ($0 ~ /^[[:space:]]*$/) {
        blank++
    } else {
        if (blank >= 2) {
            print ""
        }
        blank=0
        print
    }
}
' "$1" > "$2"

echo "Done: $2"