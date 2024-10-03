// src/config/get-env-value.ts

import fs from 'fs';

/*
function readSecret(path: string): string {
  try {
    return fs.readFileSync(path, 'utf8').trim();
  } catch (error) {
    console.error(`Error reading secret from ${path}:`, error);
    return '';
  }
}
*/

export function getEnvValue(key: string, defaultValue: string = ''): string {
  const secretPath = process.env[`${key}_FILE`];
  if (secretPath) {
    try {
      return fs.readFileSync(secretPath, 'utf8').trim();
    } catch (error) {
      console.error(`Error reading secret from ${secretPath}:`, error);
    }
  }
  // If secret file doesn't exist or couldn't be read, return the environment variable or default value
  return process.env[key] || defaultValue;
}