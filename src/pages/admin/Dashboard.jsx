
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import NotificationSection from '@/components/admin/notifications/NotificationSection';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    availabilityBlocks: 0,
    unreadMessages: 0,
    publishedPosts: 0
  });

  useEffect(() => {
    const fetchSimpleStats = async () => {
      try {
        // Count unavailable dates in availability table
        const { count: availCount } = await supabase
          .from('availability')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unavailable');

        // Count unread contact messages
        const { count: messageCount } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unread');

        // Count published blog posts
        const { count: postCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        setStats({
          availabilityBlocks: availCount || 0,
          unreadMessages: messageCount || 0,
          publishedPosts: postCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchSimpleStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Manage your site content and availability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Availability Blocks
            </CardTitle>
            <Calendar className="h-4 w-4 text-[#03c4c9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.availabilityBlocks}</div>
            <p className="text-xs text-gray-500 mt-1">
              Dates marked unavailable
            </p>
            <Link to="/admin/availability">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Manage Availability
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Unread Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-[#f5c842]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</div>
            <p className="text-xs text-gray-500 mt-1">
              Contact form submissions
            </p>
            <Link to="/admin/contacts">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                View Messages
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Published Posts
            </CardTitle>
            <BookOpen className="h-4 w-4 text-[#10b981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.publishedPosts}</div>
            <p className="text-xs text-gray-500 mt-1">
              Live blog articles
            </p>
            <Link to="/admin/blog">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Manage Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#03c4c9]" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/availability">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <Calendar className="h-5 w-5 text-[#03c4c9]" />
                <div className="text-left">
                  <div className="font-semibold">Manage Availability</div>
                  <div className="text-xs text-gray-500">Block out dates for all experiences</div>
                </div>
              </Button>
            </Link>
            <Link to="/admin/blog">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <BookOpen className="h-5 w-5 text-[#10b981]" />
                <div className="text-left">
                  <div className="font-semibold">Create Blog Post</div>
                  <div className="text-xs text-gray-500">Share stories and updates</div>
                </div>
              </Button>
            </Link>
            <Link to="/admin/contacts">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <MessageSquare className="h-5 w-5 text-[#f5c842]" />
                <div className="text-left">
                  <div className="font-semibold">View Messages</div>
                  <div className="text-xs text-gray-500">Check contact submissions</div>
                </div>
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-semibold">View Public Site</div>
                  <div className="text-xs text-gray-500">See customer-facing pages</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">System Notifications</h3>
        <NotificationSection />
      </div>
    </div>
  );
};

export default AdminDashboard;
