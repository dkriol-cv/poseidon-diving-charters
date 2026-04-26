import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Mail, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    unread: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  };

  const defaultStyle = "bg-gray-100 text-gray-800";
  const normalizedStatus = status?.toLowerCase() || 'pending';

  return (
    <Badge className={`uppercase text-[10px] tracking-wider ${styles[normalizedStatus] || defaultStyle}`}>
      {status}
    </Badge>
  );
};

export const BookingCard = ({ booking, onAction }) => (
  <Card className="mb-4 overflow-hidden border-l-4 border-l-[#03c4c9] hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <StatusBadge status={booking.status} />
        <span className="text-xs text-gray-400 font-mono">{booking.id.slice(0, 8)}</span>
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{booking.customer_name}</h3>
      <div className="text-sm text-gray-500 space-y-1">
        <div className="flex items-center gap-2">
           <Calendar size={14} />
           <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
           <Clock size={14} />
           <span>{booking.departure_time || 'TBD'} - {booking.return_time || 'TBD'}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={() => onAction('view', booking)}>Details</Button>
      </div>
    </CardContent>
  </Card>
);

export const LoadingSpinner = () => (
  <div className="flex justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#03c4c9]"></div>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
    <p className="text-gray-600 dark:text-gray-400 mb-4">{message || "Something went wrong"}</p>
    {onRetry && <Button onClick={onRetry}>Try Again</Button>}
  </div>
);