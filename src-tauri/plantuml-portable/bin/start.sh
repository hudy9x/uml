#!/usr/bin/env bash

# Get directory of this script
BASE="$(cd "$(dirname "$0")" && pwd)"

# Output folder (relative to bin directory)
OUT_DIR="$BASE/../output"

# Create output folder if it doesn't exist
mkdir -p "$OUT_DIR"

# Run PlantUML (Graphviz will be auto-detected via PATH)
java -jar "$BASE/plantuml-1.2025.10.jar" \
  -tsvg \
  -o "$OUT_DIR" \
  "$@"
