
import React, { useState, useEffect } from 'react';
import { Loader2, Edit, DollarSign, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import supabase from '@/lib/customSupabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ServicesManagement = () => {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    base_price: '',
    description: '',
    duration: '',
    is_active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('id, slug, title, base_price, description, duration, is_active, created_at, updated_at')
        .order('slug', { ascending: true });

      if (error) throw error;

      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error Loading Services",
        description: "Failed to load services. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      base_price: service.base_price?.toString() || '',
      description: service.description || '',
      duration: service.duration || '',
      is_active: service.is_active ?? true
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingService) return;

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.base_price || isNaN(parseFloat(formData.base_price)) || parseFloat(formData.base_price) < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('services')
        .update({
          title: formData.title.trim(),
          base_price: parseFloat(formData.base_price),
          description: formData.description.trim(),
          duration: formData.duration.trim(),
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingService.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service updated successfully.",
      });

      setIsDialogOpen(false);
      setEditingService(null);
      await fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({
      title: '',
      base_price: '',
      description: '',
      duration: '',
      is_active: true
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2d353b] dark:text-white flex items-center gap-3">
            <DollarSign className="text-[#03c4c9]" size={32} />
            Services & Pricing Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage service details and pricing for all experiences
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#03c4c9]" />
            <p className="text-sm text-gray-500">Loading services...</p>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No services found
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr
                        key={service.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        onClick={() => handleEdit(service)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2d353b] dark:text-white">
                          {service.slug}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {service.title || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#03c4c9]">
                          €{service.base_price?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {service.duration || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {service.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <Check size={12} className="mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <X size={12} className="mr-1" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(service.updated_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(service);
                            }}
                            className="text-[#03c4c9] hover:text-[#02aeb3] hover:bg-[#03c4c9]/10"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update service details and pricing. Changes will be reflected on the website immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter service title"
                className="text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base_price">Price (€) *</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  placeholder="0.00"
                  className="text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3-4 hours"
                  className="text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter service description"
                rows={4}
                className="text-gray-900"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="is_active" className="text-base">
                  Active Status
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.is_active ? 'Service is currently active and visible' : 'Service is currently inactive and hidden'}
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#03c4c9] hover:bg-[#02aeb3] text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesManagement;
