import { useScriptLoader } from './useScriptLoader';

const SCRIPTS = {
  stripe: {
    url: 'https://js.stripe.com/v3/',
    id: 'stripe-js',
    category: 'marketing' // Often Stripe needs fraud detection which falls under necessary/marketing overlap, putting in marketing for this example
  },
  googleAnalytics: {
    url: 'https://www.googletagmanager.com/gtag/js?id=YOUR-ID',
    id: 'google-analytics',
    category: 'analytics'
  }
};

export const useConsentedScript = (scriptName) => {
  const scriptConfig = SCRIPTS[scriptName];
  
  // Hook must be called unconditionally
  // We pass undefined if config is missing, assuming useScriptLoader handles it gracefully
  // or simply doesn't run the effect if url is missing.
  const scriptState = useScriptLoader(
    scriptConfig?.url, 
    scriptConfig?.id, 
    scriptConfig?.category
  );
  
  if (!scriptConfig) {
    console.warn(`Script configuration for "${scriptName}" not found.`);
    return { loading: false, error: 'Script config not found', isLoaded: false };
  }

  return scriptState;
};