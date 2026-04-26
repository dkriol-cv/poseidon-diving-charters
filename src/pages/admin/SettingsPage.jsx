import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Settings, Lock, Unlock } from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [bookingDisabled, setBookingDisabled] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'booking_disabled')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data && data.value) {
        setBookingDisabled(data.value.disabled === true);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBookingStatus = async () => {
    try {
      setUpdating(true);
      const newValue = !bookingDisabled;
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'booking_disabled', 
          value: { disabled: newValue },
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setBookingDisabled(newValue);
      toast({
        title: 'Success',
        description: `Booking system has been ${newValue ? 'disabled' : 'enabled'}.`,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update booking status. Ensure you have admin privileges.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#03c4c9]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Settings | Admin Dashboard</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="h-8 w-8 text-[#03c4c9]" />
          System Settings
        </h1>
        <p className="text-gray-500 mt-2">Manage global configuration for your website.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking System Status</CardTitle>
            <CardDescription>
              Control whether customers can make new bookings. When disabled, customers will be prompted to contact you directly.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${bookingDisabled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {bookingDisabled ? <Lock className="h-6 w-6" /> : <Unlock className="h-6 w-6" />}
              </div>
              <div>
                <p className="font-semibold text-lg">
                  Status: <span className={bookingDisabled ? 'text-red-600' : 'text-green-600'}>
                    {bookingDisabled ? 'Desativado' : 'Ativo'}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {bookingDisabled 
                    ? 'Customers cannot complete the checkout process.' 
                    : 'Customers can book and pay normally.'}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={toggleBookingStatus} 
              disabled={updating}
              variant={bookingDisabled ? "default" : "destructive"}
              className={bookingDisabled ? "bg-[#03c4c9] hover:bg-[#03c4c9]/90" : ""}
            >
              {updating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {bookingDisabled ? 'Desbloquear Booking' : 'Bloquear Booking'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;