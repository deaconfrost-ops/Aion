/** Typed environment access. Fail fast on missing required vars at boot. */

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function opt(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

export const config = {
  databaseUrl: () => req('DATABASE_URL'),
  apiPort: () => Number(opt('API_PORT', '4000')),
  jwtSecret: () => req('JWT_SECRET'),
  ai: {
    provider: () => opt('AI_PROVIDER', 'anthropic'),
    anthropicApiKey: () => opt('ANTHROPIC_API_KEY'),
  },
  stripe: {
    secretKey: () => opt('STRIPE_SECRET_KEY'),
    webhookSecret: () => opt('STRIPE_WEBHOOK_SECRET'),
  },
};
