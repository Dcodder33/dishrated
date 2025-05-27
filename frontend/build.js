#!/usr/bin/env node

const { build } = require('vite');
const path = require('path');

async function buildApp() {
  try {
    console.log('Starting Vite build...');
    
    await build({
      configFile: path.resolve(__dirname, 'vite.config.ts'),
      mode: 'production'
    });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();
