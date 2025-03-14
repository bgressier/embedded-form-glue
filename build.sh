#!/bin/bash

mkdir -p examples_build/react
mkdir examples_build/next
mkdir examples_build/server
mkdir examples_build/svelte

cd examples

npm ci --prefix server && 
npm ci --prefix angular/minimal-example && 
npm ci --prefix emberjs && 
npm ci --legacy-peer-deps --prefix ionic/minimal-example && 
npm ci --prefix react/minimal-example && 
npm ci --prefix react/next-minimal && 
npm ci --prefix vuejs/minimal-example && 
npm ci --prefix svelte/minimal-example 

wait

npm run build:example --prefix angular/minimal-example &&
npm run build:example --prefix emberjs &&
npm run build:example --prefix ionic/minimal-example &&
npm run build:example --prefix react/minimal-example &&
npm run build:example --prefix react/next-minimal &&
npm run build:example --prefix vuejs/minimal-example &&
npm run build:example --prefix svelte/minimal-example 

wait

cp -R server ../examples_build/

gulp replaceKeys
