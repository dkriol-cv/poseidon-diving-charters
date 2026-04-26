import supabase from '@/lib/customSupabaseClient';
import { Ship, Anchor, LifeBuoy } from 'lucide-react';

/**
 * Fallback catalog data used when Supabase is unreachable or returns error.
 * Matches the structure of the database response: Service -> Options
 */
export const FALLBACK_CATALOG = [
  {
    id: 'fallback-private-charter',
    name: 'Private Boat Charter',
    slug: 'private-boat-charter',
    description: 'Our boat charter offers a private exclusivity. Discover the water on your terms. When you charter with us the boat, the crew, and the adventure are entirely yours.',
    service_type: 'private-boat-charter',
    base_price: 500,
    icon: 'Ship',
    is_active: true,
    display_order: 1,
    options: [
      {
        id: 'opt-sunset',
        label: 'Sunset Boat Charter',
        tag: 'sunset',
        price: 500,
        duration_hours: 2.5,
        start_time: '18:00',
        end_time: '20:30',
        display_order: 1,
        is_active: true
      },
      {
        id: 'opt-morning',
        label: 'Morning Boat Charter',
        tag: 'morning',
        price: 600,
        duration_hours: 3.5,
        start_time: '09:30',
        end_time: '13:00',
        display_order: 2,
        is_active: true
      },
      {
        id: 'opt-afternoon',
        label: 'Afternoon Boat Charter',
        tag: 'afternoon',
        price: 600,
        duration_hours: 3.5,
        start_time: '13:30',
        end_time: '17:00',
        display_order: 3,
        is_active: true
      },
      {
        id: 'opt-3quarter',
        label: '¾ Day Boat Charter',
        tag: '3quarter',
        price: 700,
        duration_hours: 5.5,
        start_time: '09:30',
        end_time: '15:00',
        display_order: 4,
        is_active: true
      }
    ]
  },
  {
    id: 'fallback-pre-designed',
    name: 'Pre-Designed Diving Charter',
    slug: 'pre-designed',
    description: 'Let us plan your charter for the day. This diving trip is easy to book, all-inclusive and clear in its offering. Maximum adventure with minimum fuss.',
    service_type: 'pre-designed',
    base_price: 1250,
    icon: 'Anchor',
    is_active: true,
    display_order: 2,
    options: [
      {
        id: 'opt-5.5',
        label: '¾ Day Diving Charter',
        tag: '5.5',
        price: 1250,
        duration_hours: 5.5,
        start_time: '09:00',
        end_time: '14:30',
        display_order: 1,
        is_active: true
      },
      {
        id: 'opt-7.5',
        label: 'Full Day Diving Charter',
        tag: '7.5',
        price: 1500,
        duration_hours: 7.5,
        start_time: '09:00',
        end_time: '16:30',
        display_order: 2,
        is_active: true
      }
    ]
  }
];

export const getCatalog = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        options:service_options(*)
      `)
      .eq('is_active', true)
      .eq('options.is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    // Filter out services that might have been returned but have null options due to inner join quirks if any,
    // though Supabase uses left join by default for relations.
    // We also sort the options here just in case.
    const processedData = data.map(service => ({
      ...service,
      // Map icon string to Lucide component if needed, or handle in UI
      options: (service.options || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    }));

    return processedData;
  } catch (err) {
    console.warn('CatalogService: Failed to fetch catalog, using fallback.', err.message);
    return FALLBACK_CATALOG;
  }
};

export const getServiceBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        options:service_options(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;

    // Sort options
    if (data && data.options) {
      data.options.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }

    return data;
  } catch (err) {
    console.warn(`CatalogService: Failed to fetch service ${slug}, using fallback.`, err.message);
    return FALLBACK_CATALOG.find(s => s.slug === slug) || null;
  }
};