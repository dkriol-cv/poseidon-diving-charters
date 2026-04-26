import React from 'react';
import { useContacts } from '@/hooks/adminHooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge, LoadingSpinner } from '@/components/admin/AdminComponents';
import { Archive, MailOpen, Mail } from 'lucide-react';

const ContactsPage = () => {
  const { contacts, loading, markRead, archive } = useContacts();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inbox</h1>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className={`${contact.status === 'unread' ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{contact.subject || 'No Subject'}</h3>
                    <StatusBadge status={contact.status} />
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    From: <span className="font-medium text-gray-900">{contact.name}</span> ({contact.email})
                  </div>
                  <p className="text-gray-700 line-clamp-2 md:line-clamp-none">
                    {contact.message}
                  </p>
                  <div className="text-xs text-gray-400 mt-2">
                    Received: {new Date(contact.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {contact.status === 'unread' && (
                    <Button variant="outline" size="sm" onClick={() => markRead(contact.id)}>
                      <MailOpen className="mr-2 h-4 w-4" /> Mark Read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => window.location.href = `mailto:${contact.email}`}>
                    <Mail className="h-4 w-4" /> Reply
                  </Button>
                  {contact.status !== 'archived' && (
                    <Button variant="ghost" size="sm" className="text-gray-500" onClick={() => archive(contact.id)}>
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {contacts.length === 0 && <div className="text-center text-gray-500 py-10">No messages found.</div>}
      </div>
    </div>
  );
};

export default ContactsPage;