#!/bin/bash

set -euo pipefail

CURRENT=`git symbolic-ref -q --short HEAD || git describe --tags --exact-match`

git branch -D github-pages || true
git checkout -b github-pages

mkdir -p docs/
cp -a dist/* docs/

git add docs/
git commit -m 'build github-pages'

git checkout ${CURRENT}

