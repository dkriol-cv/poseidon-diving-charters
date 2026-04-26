
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Check, X, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';

function isFullDay(start, end) {
  return (start || '08:00') <= '08:00' && (end || '18:00') >= '18:00';
}

function getSlotLabel(start, end) {
  const s = start || '08:00';
  const e = end   || '18:00';
  if (s === '08:00' && e === '13:00') return 'Morning unavailable';
  if (s === '13:00' && e === '18:00') return 'Afternoon unavailable';
  if (isFullDay(s, e)) return 'Fully booked';
  return `${s}–${e} unavailable`;
}

const AvailabilityCalendar = () => {
  const [currentMonth, setCurrentMonth]   = useState(new Date());
  const [slotsByDate, setSlotsByDate]     = useState({});
  const [loading, setLoading]             = useState(true);
  const [isFetching, setIsFetching]       = useState(false);

  const fetchAvailability = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);
    setLoading(true);
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
      const endDate   = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('availability')
        .select('date, start_time, end_time')
        .eq('status', 'unavailable')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) { console.error('Error fetching availability:', error); return; }

      const map = {};
      (data || []).forEach(item => {
        if (!map[item.date]) map[item.date] = [];
        map[item.date].push({ start_time: item.start_time, end_time: item.end_time });
      });
      setSlotsByDate(map);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [currentMonth, isFetching]);

  useEffect(() => { fetchAvailability(); }, [currentMonth]);

  useEffect(() => {
    const channel = supabase
      .channel('public-avail-calendar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, () => fetchAvailability())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchAvailability]);

  const getDayState = (dateStr) => {
    const slots = slotsByDate[dateStr];
    if (!slots || slots.length === 0) return 'available';
    if (slots.some(s => isFullDay(s.start_time, s.end_time))) return 'full';
    return 'partial';
  };

  const getDaysInMonth    = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const handlePrevMonth = () => {
    const prev  = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    const today = new Date();
    if (prev.getFullYear() < today.getFullYear() || (prev.getFullYear() === today.getFullYear() && prev.getMonth() < today.getMonth())) return;
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    const max = new Date(); max.setMonth(max.getMonth() + 12);
    if (next > max) return;
    setCurrentMonth(next);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay    = getFirstDayOfMonth(currentMonth);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`e-${i}`} className="h-16 md:h-20 bg-gray-50/50 dark:bg-gray-900/50 border border-transparent rounded-md" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date    = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isPast  = date < today;
      const state   = getDayState(dateStr);
      const slots   = slotsByDate[dateStr] || [];

      const isAvail   = state === 'available' && !isPast;
      const isFull    = state === 'full'      && !isPast;
      const isPartial = state === 'partial'   && !isPast;

      days.push(
        <motion.div
          key={dateStr}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: day * 0.01 }}
          className={cn(
            "relative flex flex-col items-center justify-start pt-2 h-16 md:h-20 border transition-all duration-200 rounded-md cursor-default",
            isAvail   && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:border-green-400",
            isFull    && "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800",
            isPartial && "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700",
            isPast && state === 'available' && "bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
          )}
        >
          <span className={cn(
            "font-futura text-base md:text-lg font-bold",
            isAvail   && "text-green-700 dark:text-green-400",
            isFull    && "text-red-700 dark:text-red-400",
            isPartial && "text-orange-700 dark:text-orange-400",
            isPast && state === 'available' && "text-gray-400 dark:text-gray-600"
          )}>
            {day}
          </span>

          {isAvail && <>
            <div className="hidden sm:flex absolute bottom-2 items-center text-[10px] font-bold uppercase text-green-600 dark:text-green-400">
              <Check size={10} className="mr-1" />Available
            </div>
            <div className="sm:hidden absolute bottom-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </>}

          {isFull && <>
            <div className="hidden sm:flex absolute bottom-2 items-center text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
              <X size={10} className="mr-1" />Full Day
            </div>
            <div className="sm:hidden absolute bottom-1 w-2 h-2 rounded-full bg-red-500" />
          </>}

          {isPartial && <>
            <div className="hidden sm:flex absolute bottom-2 items-center text-[9px] font-bold uppercase text-orange-600 dark:text-orange-400">
              <Clock size={9} className="mr-1" />Partial
            </div>
            <div className="sm:hidden absolute bottom-1 w-2 h-2 rounded-full bg-orange-400" />
          </>}
        </motion.div>
      );
    }
    return days;
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const partialDays = Object.entries(slotsByDate)
    .filter(([date, slots]) => {
      const d = new Date(date + 'T00:00:00');
      return d >= today && !slots.some(s => isFullDay(s.start_time, s.end_time));
    })
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="w-full bg-white dark:bg-[#162026] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-[#03c4c9]/5 to-transparent dark:from-[#03c4c9]/10">
        <Button
          variant="ghost" size="sm" onClick={handlePrevMonth}
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
              <Loader2 className="w-3 h-3 animate-spin mr-1" />Loading...
            </div>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleNextMonth} className="hover:bg-[#03c4c9]/10">
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="py-3 text-center text-xs md:text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1.5 md:gap-2 p-2 md:p-4 bg-gray-50 dark:bg-black/10">
        {renderCalendarDays()}
      </div>

      {/* Partial availability detail */}
      {partialDays.length > 0 && (
        <div className="px-4 md:px-6 pb-4 space-y-1.5">
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">Partial Availability</p>
          {partialDays.slice(0, 5).map(([date, slots]) => (
            <div key={date} className="flex items-start gap-2 p-2 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
              <Clock size={13} className="text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-orange-700 dark:text-orange-300">
                <span className="font-semibold">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}:{' '}
                </span>
                {slots.map((s, i) => <span key={i}>{i > 0 && ', '}{getSlotLabel(s.start_time, s.end_time)}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend + info */}
      <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white dark:from-black/20 dark:to-[#162026] border-t border-gray-200 dark:border-gray-800">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4 md:gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-green-100 dark:bg-green-900/30 border-2 border-green-500 flex items-center justify-center">
                <Check size={10} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400 flex items-center justify-center">
                <Clock size={10} className="text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Partially booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-red-100 dark:bg-red-900/30 border-2 border-red-500 flex items-center justify-center">
                <X size={10} className="text-red-600 dark:text-red-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Fully booked</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-[#03c4c9]">
            <Info size={16} className="text-[#03c4c9] mt-0.5 flex-shrink-0" />
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              This calendar shows real-time availability.{' '}
              <span className="font-bold text-[#2d353b] dark:text-white">Green dates are open for booking.</span>{' '}
              Contact us via WhatsApp, phone, or email to confirm your reservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
