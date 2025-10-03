export type TokenPair = {
  accessToken: string | null;
  refreshToken: string | null;
};

export function extractTokens(response: unknown): TokenPair {
  const r = response as Record<string, unknown> | null | undefined;
  const nested = (r as { tokens?: { accessToken?: string; refreshToken?: string } })?.tokens;

  const accessToken = (r as { accessToken?: string })?.accessToken ?? nested?.accessToken ?? null;
  const refreshToken = (r as { refreshToken?: string })?.refreshToken ?? nested?.refreshToken ?? null;

  return { accessToken, refreshToken };
}
