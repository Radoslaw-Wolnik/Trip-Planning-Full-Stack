// src/config/get-env-value.ts

import fs from 'fs';

export function getEnvValue(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}