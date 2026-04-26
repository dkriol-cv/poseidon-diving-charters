import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCatalog } from '@/services/catalogService';
import { Ship, Anchor, LifeBuoy } from 'lucide-react';

const ICON_MAP = {
  'Ship': Ship,
  'Anchor': Anchor,
  'LifeBuoy': LifeBuoy,
  // Fallbacks for direct object usage if icon is passed as string
  'private-boat-charter': Ship,
  'pre-designed': Anchor,
  'tailor-made': LifeBuoy
};

export const useCatalog = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCatalog();
      setServices(data || []);
      setError(null);
    } catch (err) {
      console.error("useCatalog: Failed to load catalog", err);
      setError(err);
      // getCatalog already handles fallback, but if something catastrophic happens:
      setServices([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const getServiceBySlug = useCallback((slug) => {
    return services.find(s => s.slug === slug) || null;
  }, [services]);

  const getOptionByTag = useCallback((serviceSlug, optionTag) => {
    const service = services.find(s => s.slug === serviceSlug);
    if (!service || !service.options) return null;
    return service.options.find(o => o.tag === optionTag) || null;
  }, [services]);

  // Compatibility helpers for BookingPage
  const getServiceConfig = useCallback((slug) => {
    const service = getServiceBySlug(slug);
    if (!service) return null;

    // Transform array of options to object map for legacy compatibility if needed, 
    // or just attach icon component
    const IconComponent = ICON_MAP[service.icon] || ICON_MAP[service.slug] || Ship;
    
    // Convert options array to map for easier lookup by tag if necessary, 
    // but we can also just return the service object as is. 
    // The current BookingPage logic accesses options via iteration or direct lookup.
    // If it uses service.options[tag], we need an object.
    
    const optionsMap = {};
    if (service.options) {
      service.options.forEach(opt => {
        optionsMap[opt.tag] = {
          ...opt,
          // Ensure compatibility with old property names if they differ
          duration_hours: opt.duration_hours,
          start_time: opt.start_time ? opt.start_time.slice(0, 5) : null,
          end_time: opt.end_time ? opt.end_time.slice(0, 5) : null,
        };
      });
    }

    return {
      ...service,
      basePrice: service.base_price, // CamelCase alias
      icon: IconComponent,
      options: optionsMap, // Provide object map for direct tag access
      optionsArray: service.options // Keep array for iteration
    };
  }, [getServiceBySlug]);

  const getOptionPrice = useCallback((serviceSlug, optionTag) => {
    const service = services.find(s => s.slug === serviceSlug);
    if (!service) return 0;

    const option = service.options?.find(o => o.tag === optionTag);
    if (option) return Number(option.price);

    return Number(service.base_price || 0);
  }, [services]);

  return {
    services,
    loading,
    error,
    refresh: loadCatalog, // Alias for loadCatalog if manual refresh needed
    getServiceBySlug,
    getOptionByTag,
    getServiceConfig,
    getOptionPrice
  };
};