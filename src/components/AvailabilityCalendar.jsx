
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Check, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';

const AvailabilityCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const fetchAvailability = useCallback(async () => {
    if (isFetching) return;
    
    setIsFetching(true);
    setLoading(true);
    
    try {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const startDate = startOfMonth.toISOString().split('T')[0];
      const endDate = endOfMonth.toISOString().split('T')[0];

      // Optimized query: select only 'date' column, filter by status
      const { data, error } = await supabase
        .from('availability')
        .select('date')
        .eq('status', 'unavailable')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching availability:', error);
        return;
      }

      const availMap = {};
      (data || []).forEach(item => {
        availMap[item.date] = 'unavailable';
      });

      setAvailabilityData(availMap);
    } catch (error) {
      console.error('Unexpected error fetching availability:', error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [currentMonth, isFetching]);

  useEffect(() => {
    fetchAvailability();
  }, [currentMonth]);

  useEffect(() => {
    // Set up real-time subscription for availability changes
    const channel = supabase
      .channel('public-availability-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availability',
          filter: 'status=eq.unavailable'
        },
        () => {
          fetchAvailability();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAvailability]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    
    const today = new Date();
    if (prev.getMonth() < today.getMonth() && prev.getFullYear() <= today.getFullYear()) {
      return;
    }
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    
    const today = new Date();
    const maxFutureDate = new Date(today);
    maxFutureDate.setMonth(today.getMonth() + 12);
    
    if (next > maxFutureDate) return;
    
    setCurrentMonth(next);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 md:h-20 bg-gray-50/50 dark:bg-gray-900/50 border border-transparent rounded-md" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const isUnavailable = availabilityData[dateStr] === 'unavailable';
      const isAvailable = !isUnavailable && !isPast;

      days.push(
        <motion.div
          key={dateStr}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: day * 0.01 }}
          className={cn(
            "relative flex flex-col items-center justify-start pt-2 h-16 md:h-20 border transition-all duration-200 rounded-md cursor-default",
            isAvailable && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 hover:shadow-sm",
            isUnavailable && "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 hover:border-red-400",
            isPast && !isUnavailable && "bg-gray-100 dark:bg-gray-900/50 text-gray-400 border-gray-200 dark:border-gray-800"
          )}
        >
          <span className={cn(
            "font-futura text-base md:text-lg font-bold",
            isAvailable && "text-green-700 dark:text-green-400",
            isUnavailable && "text-red-700 dark:text-red-400",
            isPast && !isUnavailable && "text-gray-400 dark:text-gray-600"
          )}>
            {day}
          </span>
          
          {isAvailable && (
            <div className="hidden sm:flex absolute bottom-2 items-center text-[10px] md:text-xs font-bold uppercase text-green-600 dark:text-green-400">
              <Check size={12} className="mr-1" /> Available
            </div>
          )}
          
          {isAvailable && (
            <div className="sm:hidden absolute bottom-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          )}
          
          {isUnavailable && (
            <div className="hidden sm:flex absolute bottom-2 items-center text-[10px] md:text-xs font-bold uppercase text-red-600 dark:text-red-400">
              <X size={12} className="mr-1" /> Booked
            </div>
          )}
          
          {isUnavailable && (
            <div className="sm:hidden absolute bottom-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          )}
        </motion.div>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="w-full bg-white dark:bg-[#162026] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-[#03c4c9]/5 to-transparent dark:from-[#03c4c9]/10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePrevMonth}
          disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
          className="hover:bg-[#03c4c9]/10"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Button>
        
        <div className="text-center">
          <h3 className="font-futura text-xl md:text-2xl font-bold text-[#2d353b] dark:text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          {loading && (
            <div className="flex items-center justify-center text-xs text-[#03c4c9] mt-1">
              <Loader2 className="w-3 h-3 animate-spin mr-1" /> Loading...
            </div>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNextMonth}
          className="hover:bg-[#03c4c9]/10"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 text-center text-xs md:text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 md:gap-2 p-2 md:p-4 bg-gray-50 dark:bg-black/10">
        {renderCalendarDays()}
      </div>

      <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white dark:from-black/20 dark:to-[#162026] border-t border-gray-200 dark:border-gray-800">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-6 md:gap-8 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-green-100 dark:bg-green-900/30 border-2 border-green-500 flex items-center justify-center">
                <Check size={12} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-red-100 dark:bg-red-900/30 border-2 border-red-500 flex items-center justify-center">
                <X size={12} className="text-red-600 dark:text-red-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-gray-200 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Past</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-[#03c4c9]">
            <Info size={16} className="text-[#03c4c9] mt-0.5 flex-shrink-0" />
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              This calendar shows real-time availability. <span className="font-bold text-[#2d353b] dark:text-white">Green dates are open for booking.</span> Contact us via WhatsApp, phone, or email to confirm your reservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
