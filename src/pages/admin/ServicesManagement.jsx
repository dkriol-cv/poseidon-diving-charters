
import React, { useState, useEffect } from 'react';
import { Loader2, DollarSign, Save, RefreshCw, ShoppingBag, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/customSupabaseClient';

const REQUIRED_SERVICES = [
  // Tailor-Made
  { slug: 'tailor-made', name: 'Tailor-Made Diving Charter', base_price: 1600 },
  
  // Pre-Designed Diving
  { slug: 'diving-3-4-day', name: '¾ Day Diving Charter', base_price: 1250 },
  { slug: 'diving-full-day', name: 'Full Day Diving Charter', base_price: 1500 },
  
  // Private Boat Charter
  { slug: 'sunset-charter', name: 'Sunset Boat Charter', base_price: 500 },
  { slug: 'morning-charter', name: 'Morning Boat Charter', base_price: 600 },
  { slug: 'afternoon-charter', name: 'Afternoon Boat Charter', base_price: 600 },
  { slug: 'boat-3-4-day-charter', name: '¾ Day Boat Charter', base_price: 700 },
  { slug: 'exclusive-charter', name: 'Private Boat Header (Optional)', base_price: 0 },
  
  // Others
  { slug: 'beach-charter', name: 'Beach Charter', base_price: 500 }
];

const ServicesManagement = () => {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    fetchServices();
    // One-time cleanup of duplicated service as requested
    const cleanupDuplicates = async () => {
      await supabase.from('services').delete().eq('slug', 'pre-designed-diving-charter');
      await supabase.from('services').delete().eq('slug', 'pre-designed');
    };
    cleanupDuplicates();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Attempt to fetch, falling back if promo_price is missing (user might not have run SQL yet)
      let { data, error } = await supabase
        .from('services')
        .select('id, slug, name, base_price, promo_price, is_active')
        .order('name', { ascending: true });

      if (error && error.code === '42703' && error.message.includes('promo_price')) {
        console.warn('promo_price column missing, retrying without it');
        const retry = await supabase
          .from('services')
          .select('id, slug, name, base_price, is_active')
          .order('name', { ascending: true });
        data = retry.data;
        error = retry.error;
      }

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error Loading Services",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultServices = async () => {
    try {
      setIsSyncing(true);
      const servicesToUpsert = REQUIRED_SERVICES.map(service => ({
        slug: service.slug,
        name: service.name,
        base_price: service.base_price,
        is_active: true
      }));

      const { error } = await supabase
        .from('services')
        .upsert(servicesToUpsert, { onConflict: 'slug' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Default services created/synchronized.",
      });
      await fetchServices();
    } catch (error) {
      console.error('Error creating defaults:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFieldChange = (id, field, value) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    
    // Clear "Saved" state when user starts typing again
    if (savedIds.has(id)) {
      setSavedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleSave = async (service) => {
    try {
      setSavingId(service.id);
      
      const updateData = {
        name: service.name,
        base_price: Number(service.base_price) || 0,
        is_active: service.is_active
      };

      // Only include promo_price if it's not undefined (meaning column exists)
      if (service.promo_price !== undefined) {
        updateData.promo_price = service.promo_price === '' ? null : Number(service.promo_price);
      }

      const { error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', service.id);

      if (error) throw error;

      // Mark as saved
      setSavedIds(prev => new Set(prev).add(service.id));

      toast({
        title: "Saved!",
        description: `${service.name} updated.`,
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error Saving",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2d353b] dark:text-white flex items-center gap-3">
            <ShoppingBag className="text-[#03c4c9]" size={32} />
            Experience Store Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your experiences like products in a shop. Change names, prices, and promotions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={createDefaultServices} 
            disabled={isSyncing}
            className="gap-2 border-[#03c4c9] text-[#03c4c9] hover:bg-[#03c4c9]/10"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            Sync Store
          </Button>
          <Button 
            variant="outline" 
            onClick={fetchServices} 
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-[#03c4c9]" />
        </div>
      ) : (
        <div className="space-y-4">
          {services.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center space-y-6">
                <p className="text-gray-500 text-lg">No experiences found in your store.</p>
                <Button onClick={createDefaultServices} disabled={isSyncing} size="lg" className="bg-[#03c4c9] text-white font-bold px-8">
                  {isSyncing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  INITIALIZE STORE
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {[

                { title: "Pre-Designed Diving Charters", slugs: ['diving-3-4-day', 'diving-full-day'] },
                { title: "Private Boat Charters", slugs: ['sunset-charter', 'morning-charter', 'afternoon-charter', 'boat-3-4-day-charter', 'exclusive-charter'] }
              ].map((group, gIdx) => {
                const groupServices = services.filter(s => group.slugs.includes(s.slug));


                return (
                  <div key={gIdx} className="space-y-4">
                    <h2 className="text-xl font-bold text-[#2d353b] dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2 px-2 flex items-center gap-2">
                      <div className="w-2 h-6 bg-[#03c4c9] rounded-full"></div>
                      {group.title}
                    </h2>
                    
                    {groupServices.length === 0 ? (
                      <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                        <p className="text-gray-400 text-sm italic">No services found in this category. Click "Sync Store" to initialize them.</p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                      {/* Header Row - Hidden on mobile */}
                      <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_100px_120px] gap-4 px-6 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        <span>Experience Name</span>
                        <span>Normal Price (€)</span>
                        <span>Promo Price (€)</span>
                        <span className="text-center">Status</span>
                        <span></span>
                      </div>

                      {groupServices.map((service) => (
                        <Card key={service.id} className={`overflow-hidden transition-all border-gray-100 dark:border-gray-800 ${!service.is_active ? 'opacity-60 bg-gray-50 dark:bg-gray-900/40' : 'hover:shadow-md hover:border-[#03c4c9]/30'}`}>
                          <CardContent className="p-3 sm:p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_100px_120px] items-center gap-4">
                              {/* Name */}
                              <div className="relative">
                                <Input 
                                  value={service.name || ''} 
                                  onChange={(e) => handleFieldChange(service.id, 'name', e.target.value)}
                                  className="font-bold text-lg border-transparent hover:border-gray-200 focus:border-[#03c4c9] focus:ring-0 bg-transparent"
                                  placeholder="Experience name..."
                                />
                                <div className="absolute left-3 -top-2 px-1 bg-white dark:bg-[#111a1f] text-[10px] text-gray-400 font-mono lg:hidden">NAME</div>
                              </div>

                              {/* Base Price */}
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">€</div>
                                <Input 
                                  type="number"
                                  value={service.base_price || ''}
                                  onChange={(e) => handleFieldChange(service.id, 'base_price', e.target.value)}
                                  className="pl-7 font-mono font-bold text-[#03c4c9] bg-transparent"
                                  placeholder="0.00"
                                />
                                <div className="absolute left-3 -top-2 px-1 bg-white dark:bg-[#111a1f] text-[10px] text-gray-400 lg:hidden">NORMAL PRICE</div>
                              </div>

                              {/* Promo Price */}
                              <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">€</div>
                                <Input 
                                  type="number"
                                  value={service.promo_price || ''}
                                  onChange={(e) => handleFieldChange(service.id, 'promo_price', e.target.value)}
                                  className="pl-7 font-mono font-bold text-orange-500 bg-transparent"
                                  placeholder="Optional"
                                />
                                <div className="absolute left-3 -top-2 px-1 bg-white dark:bg-[#111a1f] text-[10px] text-gray-400 lg:hidden">PROMO PRICE</div>
                              </div>

                              {/* Status Toggle */}
                              <div className="flex items-center justify-center gap-2 py-2 lg:py-0">
                                {service.is_active ? <Eye size={16} className="text-[#03c4c9]" /> : <EyeOff size={16} className="text-gray-400" />}
                                <Switch 
                                  checked={service.is_active}
                                  onCheckedChange={(checked) => handleFieldChange(service.id, 'is_active', checked)}
                                />
                              </div>

                              {/* Action */}
                              <Button 
                                onClick={() => handleSave(service)} 
                                disabled={savingId === service.id}
                                size="sm"
                                className={`font-bold w-full transition-all duration-300 ${
                                  savedIds.has(service.id) 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white'
                                }`}
                              >
                                {savingId === service.id ? (
                                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                ) : savedIds.has(service.id) ? (
                                  <><Check size={16} className="mr-2" /> Saved</>
                                ) : (
                                  <><Save size={16} className="mr-2" /> Save</>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
