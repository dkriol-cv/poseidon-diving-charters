import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import { formatEUR } from '@/lib/formatters';

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`[BookingDetail] Fetching booking ${bookingId}`);
      try {
        const data = await db.bookings.getById(bookingId);

        console.log("[BookingDetail] Data received:", data);

        if (data) {
          setBooking(data);
          // Debug check for missing data
          if (!data.customer_email) console.warn("[BookingDetail] Missing customer_email!");
          if (!data.total_price) console.warn("[BookingDetail] Missing total_price!");
        } else {
          console.error("[BookingDetail] Booking not found");
          navigate('/admin/dashboard');
        }
      } catch (e) {
        console.error("[BookingDetail] Error fetching booking:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      console.log(`[BookingDetail] Updating status to ${newStatus}`);
      const updated = await db.bookings.update(bookingId, { status: newStatus });
      setBooking(updated);
      toast({ title: "Status Updated", description: `Booking marked as ${newStatus}` });
    } catch (error) {
      console.error("[BookingDetail] Status update failed:", error);
      toast({ title: "Update Failed", description: "Could not update status.", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        console.log(`[BookingDetail] Deleting booking ${bookingId}`);
        await db.bookings.delete(bookingId);
        toast({ title: "Booking Deleted", description: "Booking has been removed." });
        navigate('/admin/dashboard');
      } catch (error) {
        console.error("[BookingDetail] Delete failed:", error);
        toast({ title: "Delete Failed", description: "Could not delete booking.", variant: "destructive" });
      }
    }
  };

  if (loading) return <div className="p-8">Loading details...</div>;
  if (!booking) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Booking Details</h1>
        <Badge variant="outline" className="ml-auto text-lg px-3 py-1 font-mono">{booking.id.slice(0, 8)}</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#111a1f] rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="font-bold text-lg">{booking.service_type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Option</p>
                  <p className="font-bold">{booking.service_option}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#03c4c9]" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(booking.booking_date).toDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-[#03c4c9]" />
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium">{booking.num_guests} People</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Extras Selected</p>
                <div className="flex flex-wrap gap-2">
                  {booking.extras && booking.extras.length > 0 ? booking.extras.map(extra => (
                    <Badge key={extra} variant="secondary">{extra}</Badge>
                  )) : <span className="text-gray-400 italic">No extras selected</span>}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Special Requests</p>
                <p className="p-3 bg-gray-50 dark:bg-[#111a1f] rounded text-sm">
                  {booking.special_requests || "None"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{booking.customer_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{booking.customer_country}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${booking.customer_email}`} className="text-[#03c4c9] hover:underline">{booking.customer_email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <a href={`tel:${booking.customer_phone}`} className="text-[#03c4c9] hover:underline">{booking.customer_phone}</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <Select value={booking.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="deposit-paid">Deposit Paid</SelectItem>
                    <SelectItem value="fully-paid">Fully Paid</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Mail size={16} /> Send Reminder
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="w-full justify-start gap-2">
                  Delete Booking
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-bold">{formatEUR(booking.total_price, 2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid (Deposit)</span>
                <span>{formatEUR(booking.deposit_amount, 2)}</span>
              </div>
              <div className="flex justify-between text-red-500 font-medium border-t pt-2">
                <span>Remaining</span>
                <span>{formatEUR(booking.remaining_amount, 2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;