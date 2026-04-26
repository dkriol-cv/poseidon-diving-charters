import React from 'react';
import NotificationLogs from '@/components/admin/notifications/NotificationLogs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const NotificationsPage = () => {
  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500">Manage and monitor email delivery logs.</p>
          </div>
          <Button variant="outline">
             <Download className="w-4 h-4 mr-2" /> Export Logs
          </Button>
       </div>

       <Card>
          <CardHeader>
             <CardTitle>All Notification Logs</CardTitle>
             <CardDescription>Comprehensive history of all automated email communications sent to customers.</CardDescription>
          </CardHeader>
          <CardContent>
             <NotificationLogs />
          </CardContent>
       </Card>
    </div>
  );
};

export default NotificationsPage;