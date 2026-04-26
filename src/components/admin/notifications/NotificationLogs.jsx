import React, { useState } from 'react';
import { useEmailLogs } from '@/hooks/useNotifications';
import { EmailStatusBadge, ResendNotificationModal } from './NotificationComponents';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notificationService } from '@/services/notificationService';
import { RefreshCw, Search } from 'lucide-react';

const NotificationLogs = ({ limit }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const { logs: emailLogs, loading, refetch: refetchEmail } = useEmailLogs();

  // Sort
  const allLogs = (emailLogs || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Filter
  const filtered = allLogs.filter(log => {
    if (searchId && !log.booking_id?.includes(searchId) && !log.recipient_email?.includes(searchId)) return false;
    return true;
  });

  const displayLogs = limit ? filtered.slice(0, limit) : filtered;

  const handleResendSuccess = () => {
     refetchEmail();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full sm:w-auto">
          <Input 
             placeholder="Search Booking ID or Email..." 
             className="max-w-xs"
             value={searchId}
             onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => refetchEmail()}>
           <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="bg-white dark:bg-[#162026] rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Booking Ref</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={5} className="text-center py-8">Loading logs...</TableCell>
                </TableRow>
              ) : displayLogs.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={5} className="text-center py-8">No notification logs found.</TableCell>
                </TableRow>
              ) : (
                displayLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-gray-500">
                      {notificationService.formatNotificationTime(log.created_at)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {log.recipient_email}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                       {log.booking_id?.slice(0,8)}...
                    </TableCell>
                    <TableCell>
                       <EmailStatusBadge status={log.status} error={log.error_message} />
                    </TableCell>
                    <TableCell className="text-right">
                       {log.status === 'failed' && (
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 text-blue-600 hover:text-blue-800"
                           onClick={() => setSelectedLog(log)}
                         >
                           Resend
                         </Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedLog && (
        <ResendNotificationModal 
           isOpen={!!selectedLog}
           onClose={() => setSelectedLog(null)}
           log={selectedLog}
           onSuccess={handleResendSuccess}
        />
      )}
    </div>
  );
};

export default NotificationLogs;