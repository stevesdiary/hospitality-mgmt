/**
 * Fail-fast environment validation.
 * Call this before anything else at startup — the server will not start
 * if a required variable is missing or clearly invalid.
 */

interface EnvRule {
  key: string;
  validator?: (value: string) => boolean;
  hint?: string;
}

const REQUIRED: EnvRule[] = [
  { key: 'DB_NAME' },
  { key: 'DB_USER' },
  { key: 'DB_PASSWORD' },
  { key: 'DB_HOST' },
  { key: 'DB_PORT', validator: (v) => /^\d+$/.test(v) && Number(v) > 0, hint: 'must be a positive integer' },
  { key: 'DB_DIALECT', validator: (v) => ['postgres', 'mysql', 'sqlite', 'mssql'].includes(v), hint: 'must be postgres|mysql|sqlite|mssql' },
  { key: 'JWT_SECRET', validator: (v) => v.length >= 32, hint: 'must be at least 32 characters' },
  { key: 'B2_KEY_ID' },
  { key: 'B2_APPLICATION_KEY' },
  { key: 'B2_BUCKET_ID' },
  { key: 'B2_BUCKET_NAME' },
];

const PRODUCTION_ONLY: EnvRule[] = [
  { key: 'CORS_ORIGIN', hint: 'must not be wildcard in production' },
  { key: 'PUBLIC_URL' },
  { key: 'EMAIL_USER' },
  { key: 'EMAIL_PASS' },
];

export function validateEnv(): void {
  const errors: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';

  for (const rule of REQUIRED) {
    const value = process.env[rule.key];
    if (!value || value.trim() === '') {
      errors.push(`Missing required env var: ${rule.key}`);
      continue;
    }
    if (rule.validator && !rule.validator(value)) {
      errors.push(`Invalid env var ${rule.key}: ${rule.hint}`);
    }
  }

  if (isProduction) {
    for (const rule of PRODUCTION_ONLY) {
      const value = process.env[rule.key];
      if (!value || value.trim() === '') {
        errors.push(`Missing required env var (production): ${rule.key}${rule.hint ? ` — ${rule.hint}` : ''}`);
      }
    }

    // Wildcard CORS is dangerous in production
    if (process.env.CORS_ORIGIN === '*') {
      errors.push('CORS_ORIGIN must not be "*" in production');
    }

    // Weak JWT secret
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 64) {
      errors.push('JWT_SECRET should be at least 64 characters in production');
    }
  }

  if (errors.length > 0) {
    console.error('\n[STARTUP] Environment validation failed:\n');
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    console.error('\nFix the above issues before starting the server.\n');
    process.exit(1);
  }
}
