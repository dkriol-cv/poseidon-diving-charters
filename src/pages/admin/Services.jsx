import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { formatEUR } from '@/lib/formatters';

const Services = () => {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [expandedServices, setExpandedServices] = useState({});

  // Modal States
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, type: null, id: null });

  // Form States
  const [editingService, setEditingService] = useState(null);
  const [editingOption, setEditingOption] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    base_price: '',
  });

  const [optionForm, setOptionForm] = useState({
    label: '',
    price: '',
    duration_hours: '',
  });

  // Fetch Data
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          service_options (
            *
          )
        `)
        .order('display_order', { ascending: true });

      if (servicesError) throw servicesError;

      // Sort options by display_order or created_at locally if needed, 
      // though supabase sort on foreign table needs specific syntax or client-side sort
      const sortedData = servicesData.map(service => ({
        ...service,
        service_options: service.service_options?.sort((a, b) => 
          (a.display_order || 0) - (b.display_order || 0)
        ) || []
      }));

      setServices(sortedData || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load services. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Helper Functions
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-');  // Replace multiple - with single -
  };

  const toggleServiceExpand = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  // Service CRUD Handlers
  const handleOpenServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        description: service.description || '',
        base_price: service.base_price,
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: '',
        description: '',
        base_price: '',
      });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async () => {
    if (!serviceForm.name || !serviceForm.base_price) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name and Base Price are required.",
      });
      return;
    }

    try {
      setIsActionLoading(true);
      
      const isEditing = !!editingService;
      let slug;

      // Handle Slug Generation logic
      if (isEditing) {
        // Keep existing slug when editing to prevent URL breakage
        slug = editingService.slug; 
        console.log('Editing service - keeping existing slug:', slug);
      } else {
        // Generate new slug for creation
        slug = slugify(serviceForm.name);
        
        // Simple client-side check for duplicate slugs in currently loaded services
        // Ideally this should also be handled by DB constraint, but good for UX
        const slugExists = services.some(s => s.slug === slug);
        if (slugExists) {
           // Append random string to ensure uniqueness if basic slug is taken
           slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }
        console.log('Creating service - generated slug:', slug);
      }
      
      const payload = {
        name: serviceForm.name,
        description: serviceForm.description,
        base_price: parseFloat(serviceForm.base_price),
        slug: slug,
      };

      // Ensure service_type is set for new records (using slug as default)
      if (!isEditing) {
        payload.service_type = slug;
        payload.is_active = true;
        payload.display_order = services.length + 1;
      }

      console.log(`Attempting to ${isEditing ? 'UPDATE' : 'INSERT'} service:`, { 
        id: isEditing ? editingService.id : 'new', 
        payload 
      });

      let response;
      if (isEditing) {
        response = await supabase
          .from('services')
          .update(payload)
          .eq('id', editingService.id)
          .select();
      } else {
        response = await supabase
          .from('services')
          .insert(payload)
          .select();
      }

      const { data, error } = response;
      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Save error:', { 
          message: error.message, 
          code: error.code, 
          details: error 
        });

        if (error.code === 'PGRST116' || error.message?.includes('RLS') || error.message?.includes('policy')) {
          console.error('RLS Policy blocking operation - Check Supabase policies for "services" table');
        }

        if (error.message?.includes('duplicate key') || error.message?.includes('unique')) {
           console.error('Slug/Key conflict detected');
           throw new Error('A service with this name or ID already exists. Please try a different name.');
        }

        throw error;
      }

      toast({ 
        title: "Success", 
        description: `Service ${isEditing ? 'updated' : 'created'} successfully.` 
      });

      setIsServiceModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Final error caught in handleSaveService:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save service: " + (error.message || "Unknown error occurred"),
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Option CRUD Handlers
  const handleOpenOptionModal = (serviceId, option = null) => {
    setSelectedServiceId(serviceId);
    if (option) {
      setEditingOption(option);
      setOptionForm({
        label: option.label,
        price: option.price,
        duration_hours: option.duration_hours || '',
      });
    } else {
      setEditingOption(null);
      setOptionForm({
        label: '',
        price: '',
        duration_hours: '',
      });
    }
    setIsOptionModalOpen(true);
  };

  const handleSaveOption = async () => {
    if (!optionForm.label) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Label is required.",
      });
      return;
    }

    try {
      setIsActionLoading(true);
      const isEditing = !!editingOption;
      
      const payload = {
        label: optionForm.label,
        price: optionForm.price ? parseFloat(optionForm.price) : null,
        duration_hours: optionForm.duration_hours ? parseFloat(optionForm.duration_hours) : null,
        tag: slugify(optionForm.label) // Generate tag from label
      };

      if (!isEditing) {
        // Find current max display order for this service to append correctly
        const service = services.find(s => s.id === selectedServiceId);
        const maxOrder = service?.service_options?.reduce((max, curr) => Math.max(max, curr.display_order || 0), 0) || 0;
        
        payload.service_id = selectedServiceId;
        payload.is_active = true;
        payload.display_order = maxOrder + 1;
      }

      console.log(`Attempting to ${isEditing ? 'UPDATE' : 'INSERT'} option:`, { 
        id: isEditing ? editingOption.id : 'new', 
        payload 
      });

      let response;
      if (isEditing) {
        response = await supabase
          .from('service_options')
          .update(payload)
          .eq('id', editingOption.id)
          .select();
      } else {
        response = await supabase
          .from('service_options')
          .insert(payload)
          .select();
      }

      const { data, error } = response;
      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Save error:', { 
          message: error.message, 
          code: error.code, 
          details: error 
        });

        if (error.code === 'PGRST116' || error.message?.includes('RLS') || error.message?.includes('policy')) {
          console.error('RLS Policy blocking operation - Check Supabase policies for "service_options" table');
        }

        throw error;
      }

      toast({ 
        title: "Success", 
        description: `Option ${isEditing ? 'updated' : 'created'} successfully.` 
      });

      setIsOptionModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Final error caught in handleSaveOption:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save option: " + (error.message || "Unknown error occurred"),
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Delete Handlers
  const requestDelete = (type, id) => {
    setDeleteConfirmation({ isOpen: true, type, id });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirmation;
    try {
      setIsActionLoading(true);
      const table = type === 'service' ? 'services' : 'service_options';
      
      console.log(`Attempting to DELETE ${type}:`, { id, table });
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      toast({
        title: "Deleted",
        description: `${type === 'service' ? 'Service' : 'Option'} deleted successfully.`,
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete ${type}. It might be referenced by bookings.`,
      });
    } finally {
      setIsActionLoading(false);
      setDeleteConfirmation({ isOpen: false, type: null, id: null });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#03c4c9]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Services & Pricing</h2>
          <p className="text-muted-foreground">Manage your catalog services and their configuration options.</p>
        </div>
        <Button onClick={() => handleOpenServiceModal()} className="bg-[#03c4c9] hover:bg-[#02a8ad]">
          <Plus className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </div>

      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead>Price (Base)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No services found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <React.Fragment key={service.id}>
                  <TableRow className={expandedServices[service.id] ? "bg-slate-50/50" : ""}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleServiceExpand(service.id)}
                      >
                        {expandedServices[service.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[300px]" title={service.description}>
                      {service.description || '-'}
                    </TableCell>
                    <TableCell className="font-mono text-[#03c4c9] font-bold">
                      {formatEUR(service.base_price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                         <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenOptionModal(service.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Option
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenServiceModal(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => requestDelete('service', service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedServices[service.id] && (
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableCell colSpan={5} className="p-4 pt-0">
                        <Card className="ml-8 border shadow-sm">
                          <CardHeader className="py-3 px-4 border-b bg-white">
                            <CardTitle className="text-sm font-semibold text-gray-700">Service Options</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-b-0">
                                  <TableHead>Label</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(!service.service_options || service.service_options.length === 0) ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="h-16 text-center text-sm text-muted-foreground">
                                      No options configured for this service.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  service.service_options.map((option) => (
                                    <TableRow key={option.id}>
                                      <TableCell className="font-medium text-sm">{option.label}</TableCell>
                                      <TableCell className="text-sm">
                                        {option.price ? formatEUR(option.price) : <span className="text-muted-foreground italic">Use base</span>}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {option.duration_hours ? `${option.duration_hours}h` : '-'}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleOpenOptionModal(service.id, option)}
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => requestDelete('option', option.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Service Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {editingService ? 'Update the details of your service.' : 'Create a new service offering.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Name <span className="text-red-500">*</span></Label>
              <Input 
                id="service-name" 
                value={serviceForm.name} 
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="e.g. Sunset Cruise" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-desc">Description</Label>
              <Textarea 
                id="service-desc" 
                value={serviceForm.description} 
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Brief description of what this service entails" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-price">Base Price (€) <span className="text-red-500">*</span></Label>
              <Input 
                id="service-price" 
                type="number"
                step="0.01"
                value={serviceForm.base_price} 
                onChange={(e) => setServiceForm({ ...serviceForm, base_price: e.target.value })}
                placeholder="0.00" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveService} disabled={isActionLoading}>
              {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Option Modal */}
      <Dialog open={isOptionModalOpen} onOpenChange={setIsOptionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingOption ? 'Edit Option' : 'Add Option'}</DialogTitle>
            <DialogDescription>
              Configure specific variations for this service.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="option-label">Label <span className="text-red-500">*</span></Label>
              <Input 
                id="option-label" 
                value={optionForm.label} 
                onChange={(e) => setOptionForm({ ...optionForm, label: e.target.value })}
                placeholder="e.g. 2 Hour Trip" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="option-price">Price (€)</Label>
                <Input 
                  id="option-price" 
                  type="number"
                  step="0.01"
                  value={optionForm.price} 
                  onChange={(e) => setOptionForm({ ...optionForm, price: e.target.value })}
                  placeholder="Override base price" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="option-duration">Duration (Hours)</Label>
                <Input 
                  id="option-duration" 
                  type="number"
                  step="0.5"
                  value={optionForm.duration_hours} 
                  onChange={(e) => setOptionForm({ ...optionForm, duration_hours: e.target.value })}
                  placeholder="e.g. 2.5" 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOptionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveOption} disabled={isActionLoading}>
              {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Option
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => !open && setDeleteConfirmation({ isOpen: false, type: null, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              {deleteConfirmation.type} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); confirmDelete(); }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isActionLoading}
            >
              {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Services;