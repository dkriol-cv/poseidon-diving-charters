import React from 'react';
import { useNotificationStats } from '@/hooks/useNotifications';
import NotificationLogs from './NotificationLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const NotificationSection = () => {
  const { stats } = useNotificationStats();

  const pieData = [
    { name: 'Sent', value: stats.total_sent, color: '#10b981' },
    { name: 'Failed', value: stats.total_failed, color: '#ef4444' }
  ];

  if (stats.total_sent === 0 && stats.total_failed === 0) {
     pieData.push({ name: 'No Data', value: 1, color: '#e5e7eb' });
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Center</h2>
          <Link to="/admin/notifications" className="text-sm text-[#03c4c9] font-medium hover:underline">
            View All Logs &rarr;
          </Link>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-600">
                   <Mail className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Sent</p>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_sent}</h3>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Delivery Rate</p>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.delivery_rate}%</h3>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-100 dark:border-red-800">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full text-red-600">
                   <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm text-red-600 dark:text-red-400 font-medium">Failed</p>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_failed}</h3>
                </div>
             </CardContent>
          </Card>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
             <CardHeader>
                <CardTitle>Recent Notification Activity</CardTitle>
             </CardHeader>
             <CardContent>
                <NotificationLogs limit={5} />
             </CardContent>
          </Card>

          <Card>
             <CardHeader>
               <CardTitle>Delivery Overview</CardTitle>
             </CardHeader>
             <CardContent className="h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie 
                         data={pieData} 
                         dataKey="value" 
                         innerRadius={60} 
                         outerRadius={80} 
                         paddingAngle={5}
                      >
                         {pieData.map((entry, index) => (
                           <Cell key={index} fill={entry.color} />
                         ))}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </CardContent>
          </Card>
       </div>
    </div>
  );
};

export default NotificationSection;