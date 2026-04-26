import { useState, useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export const useScriptLoader = (scriptUrl, scriptId, requiredCategory = 'essential') => {
  const { preferences, consentState } = useCookieConsent();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If consent not given yet or category not allowed, do nothing (or unload)
    if (consentState === 'pending' || !preferences[requiredCategory]) {
      setLoading(false);
      return;
    }

    // Check if script already exists
    if (document.getElementById(scriptId)) {
      setIsLoaded(true);
      setLoading(false);
      return;
    }

    try {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = scriptUrl;
      script.async = true;

      const onScriptLoad = () => {
        setIsLoaded(true);
        setLoading(false);
      };

      const onScriptError = (err) => {
        setError(err);
        setLoading(false);
      };

      script.addEventListener('load', onScriptLoad);
      script.addEventListener('error', onScriptError);

      document.body.appendChild(script);

      return () => {
        script.removeEventListener('load', onScriptLoad);
        script.removeEventListener('error', onScriptError);
        // Optional: Remove script on unmount or consent revocation?
        // Usually we keep scripts loaded for the session even if consent changes 
        // until refresh to avoid breaking functionality, but here's how to remove:
        // document.body.removeChild(script);
      };
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [scriptUrl, scriptId, requiredCategory, preferences, consentState]);

  return { loading, error, isLoaded };
};