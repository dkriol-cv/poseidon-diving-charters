
import React, { useState, useEffect } from 'react';
import { Loader2, DollarSign, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/customSupabaseClient';

const REQUIRED_SERVICES = [
  { slug: 'tailor-made', name: 'Tailor-Made Diving Charter', base_price: 1600 },
  { slug: 'pre-designed', name: 'Pre-Designed Diving Charter', base_price: 1250 },
  { slug: 'exclusive-charter', name: 'Exclusive Charter', base_price: 500 },
  { slug: 'beach-charter', name: 'Beach Charter', base_price: 500 },
  { slug: 'private-boat-charter', name: 'Private Boat Charter', base_price: 500 },
  { slug: 'sunset-charter', name: 'Sunset Boat Charter', base_price: 500 },
  { slug: 'morning-charter', name: 'Morning Boat Charter', base_price: 600 },
  { slug: 'afternoon-charter', name: 'Afternoon Boat Charter', base_price: 600 },
  { slug: 'boat-3-4-day-charter', name: '¾ Day Boat Charter', base_price: 700 }
];

const ServicesManagement = () => {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // DIAGNOSTIC LOGS
      const { data: { user } } = await supabase.auth.getUser();
      console.log('CURRENT USER:', user);
      console.log('SUPABASE URL:', supabase.supabaseUrl || 'https://hcypqomjisyqrczwjrgc.supabase.co');

      let { data, error } = await supabase
        .from('services')
        .select('id, slug, name, base_price, duration, is_active')
        .order('name', { ascending: true });

      if (error && error.code === '42703' && error.message.includes('duration')) {
        console.warn('Column "duration" not found, retrying without it...');
        const retry = await supabase
          .from('services')
          .select('id, slug, name, base_price, is_active')
          .order('name', { ascending: true });
        data = retry.data;
        error = retry.error;
      }

      console.log('SUPABASE SERVICES RESPONSE:', { data, error });

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
      const defaultServices = [
        { slug: 'tailor-made', name: 'Tailor-Made Diving Charter', base_price: 450, duration: 'Flexible', is_active: true, title: 'Tailor-Made Diving Charter' },
        { slug: 'pre-designed', name: 'Pre-Designed Diving Charter', base_price: 350, duration: 'Half / Full day', is_active: true, title: 'Pre-Designed Diving Charter' },
        { slug: 'exclusive-charter', name: 'Private Boat Charter', base_price: 1200, duration: 'Flexible', is_active: true, title: 'Private Boat Charter' },
        { slug: 'beach-charter', name: 'Beach Charter', base_price: 600, duration: 'Flexible', is_active: true, title: 'Beach Charter' },
        { slug: 'private-boat-charter', name: 'Private Boat Charter', base_price: 800, duration: 'Flexible', is_active: true, title: 'Private Boat Charter' }
      ];

      const { error } = await supabase
        .from('services')
        .upsert(defaultServices, { onConflict: 'slug' });

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


  const handlePriceChange = (id, value) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, base_price: value } : s));
  };

  const handleStatusToggle = (id, checked) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: checked } : s));
  };

  const handleSave = async (service) => {
    try {
      setSavingId(service.id);
      
      const { error } = await supabase
        .from('services')
        .update({
          base_price: Number(service.base_price),
          is_active: service.is_active,
          name: service.name
        })
        .eq('id', service.id);

      if (error) throw error;

      toast({
        title: "Saved",
        description: `${service.name} updated successfully.`,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2d353b] dark:text-white flex items-center gap-3">
            <DollarSign className="text-[#03c4c9]" size={28} />
            Experience Pricing Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Update prices and visibility for all charter experiences.
          </p>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <Button 
            variant="outline" 
            onClick={createDefaultServices} 
            disabled={isSyncing}
            className="gap-2"
          >
            <RefreshCw className={isSyncing ? "animate-spin" : ""} size={16} />
            Initialize/Sync Services
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#03c4c9]" />
        </div>
      ) : (
        <div className="grid gap-4">
          {services.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <p className="text-gray-500">No services found in the database.</p>
                <Button onClick={createDefaultServices} disabled={isSyncing} className="bg-[#03c4c9] text-white">
                  {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Default Services
                </Button>
              </CardContent>
            </Card>
          ) : (
            services.map((service) => (
              <Card key={service.id} className="overflow-hidden border-gray-200 dark:border-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-grow">
                      <h3 className="font-bold text-lg text-[#2d353b] dark:text-white">
                        {service.name || 'Unnamed Service'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          slug: {service.slug || 'no-slug'}
                        </span>
                        {service.duration && (
                          <span className="text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                            {service.duration}
                          </span>
                        )}
                        {!service.is_active && (
                          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Inactive</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                        <span className="text-sm font-medium text-gray-500">Active</span>
                        <Switch 
                          checked={service.is_active}
                          onCheckedChange={(checked) => handleStatusToggle(service.id, checked)}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                          <Input 
                            type="number"
                            value={service.base_price}
                            onChange={(e) => handlePriceChange(service.id, e.target.value)}
                            className="pl-7 w-32 font-bold text-[#03c4c9]"
                            placeholder="0.00"
                          />
                        </div>
                        <Button 
                          onClick={() => handleSave(service)} 
                          disabled={savingId === service.id || loading}
                          className="bg-[#03c4c9] hover:bg-[#02a8ad] text-white min-w-[100px] transition-all"
                        >
                          {savingId === service.id ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </span>
                          ) : (
                            <><Save size={16} className="mr-2" /> Save</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
