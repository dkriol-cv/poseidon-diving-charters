
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';

function isFullDay(start, end) {
  return (start || '08:00') <= '08:00' && (end || '18:00') >= '18:00';
}

const AvailabilityCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slotsByDate, setSlotsByDate]   = useState({});
  const [loading, setLoading]           = useState(true);
  const [isFetching, setIsFetching]     = useState(false);

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
        .lte('date', endDate);

      if (error) { console.error('Error:', error); return; }

      const map = {};
      (data || []).forEach(item => {
        if (!map[item.date]) map[item.date] = [];
        map[item.date].push({ start_time: item.start_time, end_time: item.end_time });
      });
      setSlotsByDate(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [currentMonth, isFetching]);

  useEffect(() => { fetchAvailability(); }, [currentMonth]);

  useEffect(() => {
    const ch = supabase
      .channel('public-avail-calendar')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, () => fetchAvailability())
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [fetchAvailability]);

  const getDayState = (dateStr) => {
    const slots = slotsByDate[dateStr];
    if (!slots || slots.length === 0) return 'available';
    if (slots.some(s => isFullDay(s.start_time, s.end_time))) return 'full';
    return 'partial';
  };

  const getDaysInMonth     = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
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

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay    = getFirstDayOfMonth(currentMonth);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`e-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date    = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isPast  = date < today;
      const state   = getDayState(dateStr);

      cells.push(
        <div key={dateStr} className="flex items-center justify-center py-0.5">
          <div className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors",
            isPast                               && "text-gray-300 dark:text-gray-600",
            !isPast && state === 'available'     && "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
            !isPast && state === 'partial'       && "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
            !isPast && state === 'full'          && "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 line-through opacity-60",
          )}>
            {day}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-[#162026] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <Button
          variant="ghost" size="icon" onClick={handlePrevMonth}
          disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
          className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#2d353b] dark:text-white">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          {loading && <Loader2 className="w-3 h-3 animate-spin text-[#03c4c9]" />}
        </div>

        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-800">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </Button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 px-2 pt-2">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-gray-400 uppercase pb-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 px-2 pb-3">
        {renderDays()}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-black/10">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-orange-300" />
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Partial</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-[11px] text-gray-500 dark:text-gray-400">Unavailable</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
          Contact us via WhatsApp or email to check availability and confirm your reservation.
        </p>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
