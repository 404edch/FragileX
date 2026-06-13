#!/bin/bash
echo "Finding top 20 longest files (excluding node_modules, .git, etc.)..."
find . -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" \
  -not -path "*/.next/*" \
  -not -path "*/coverage/*" \
  -not -path "*/.agents/*" \
  -not -path "*/.vscode/*" \
  -not -name "package-lock.json" \
  -not -name "yarn.lock" \
  -not -name "pnpm-lock.yaml" \
  -not -iname "*.png" \
  -not -iname "*.gif" \
  -not -iname "*.ico" \
  -exec wc -l {} + | grep -v " total$" | sort -rn | head -n 20
