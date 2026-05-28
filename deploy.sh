#!/bin/bash
# 构建并部署到 GitHub Pages
# 仓库：daitree42/hiking
# 访问：https://daitree42.github.io/hiking/

set -e

echo "🏗️ 构建..."
npm run build

echo "🚀 部署到 gh-pages 分支..."
npx gh-pages -d dist -b gh-pages

echo "✓ 部署完成：https://daitree42.github.io/hiking/"
