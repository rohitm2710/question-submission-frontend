const vercelProtectionBypass =
    import.meta.env.VITE_VERCEL_PROTECTION_BYPASS;

export const apiHeaders = {
    'Content-Type': 'application/json',
    ...(vercelProtectionBypass ? { 'x-vercel-protection-bypass': vercelProtectionBypass } : {}),
};