#!/bin/sh
npm run build
rm -rf ../puhelinluettelo/build
cp -r build ../puhelinluettelo/