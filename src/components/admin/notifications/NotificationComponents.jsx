import React, { useState } from 'react';
import { Mail, AlertCircle, CheckCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { notificationService } from '@/services/notificationService';
import { useToast } from '@/components/ui/use-toast';

export const EmailStatusBadge = ({ status, error }) => {
  const colorClass = notificationService.getStatusColor(status);
  
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} group relative cursor-help`}>
      <Mail className="w-3 h-3 mr-1" />
      <span className="capitalize">{status}</span>
      {error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-xs rounded hidden group-hover:block z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export const ResendNotificationModal = ({ log, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResend = async () => {
    setLoading(true);
    try {
      await notificationService.resendNotification(log.id, 'email');
      toast({ title: "Success", description: "Notification resent successfully." });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resend Notification</DialogTitle>
          <DialogDescription>
            Are you sure you want to resend this notification to 
            <span className="font-bold text-gray-900 ml-1">
              {log?.recipient_email}
            </span>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Original Date:</span>
            <span>{notificationService.formatNotificationTime(log?.created_at)}</span>
          </div>
          <div className="flex justify-between text-sm">
             <span className="text-gray-500">Last Status:</span>
             <Badge variant={log?.status === 'sent' ? 'success' : 'destructive'}>{log?.status}</Badge>
          </div>
          {log?.error_message && (
             <div className="bg-red-50 p-3 rounded text-xs text-red-600 border border-red-100 mt-2">
               Error: {log.error_message}
             </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleResend} disabled={loading} className="bg-[#03c4c9]">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Confirm Resend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};