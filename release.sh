#!/bin/bash

set -euo pipefail

CURRENT=`git symbolic-ref -q --short HEAD || git describe --tags --exact-match`

git branch -D github-pages || true
git checkout -b github-pages

mkdir -p www/
cp -a dist/* www/

git add www/
git commit -m 'build github-pages'

git checkout ${CURRENT}

