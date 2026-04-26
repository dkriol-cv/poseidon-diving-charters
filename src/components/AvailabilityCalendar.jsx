
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import { useBookingModal } from '@/contexts/BookingModalContext';

function isFullDay(start, end) {
  return (start || '08:00') <= '08:00' && (end || '18:00') >= '18:00';
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function MonthGrid({ year, month, slotsByDate }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const daysInMonth     = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const getDayState = (dateStr) => {
    const slots = slotsByDate[dateStr];
    if (!slots || slots.length === 0) return 'available';
    if (slots.some(s => isFullDay(s.start_time, s.end_time))) return 'full';
    return 'partial';
  };

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(<div key={`e-${i}`} />);

  for (let day = 1; day <= daysInMonth; day++) {
    const date    = new Date(year, month, day);
    // Use local date string to avoid UTC offset issues
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isPast  = date < today;
    const state   = getDayState(dateStr);

    cells.push(
      <div key={dateStr} className="flex items-center justify-center py-0.5">
        <div className={cn(
          'w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium select-none',
          isPast && 'text-gray-300 dark:text-gray-600',
          !isPast && state === 'available' && 'bg-emerald-500 text-white font-semibold',
          !isPast && state === 'partial'   && 'bg-amber-400 text-white font-semibold',
          !isPast && state === 'full'      && 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 line-through',
        )}>
          {day}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#2d353b] dark:text-white text-center mb-3 tracking-wide">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">{cells}</div>
    </div>
  );
}

const AvailabilityCalendar = ({ serviceName, experienceImage }) => {
  const { openModal } = useBookingModal();
  const today         = new Date();
  const [baseMonth, setBaseMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [slotsByDate, setSlotsByDate] = useState({});
  const [loading, setLoading]         = useState(true);
  const fetchingRef = useRef(false);

  const second = baseMonth.month === 11
    ? { year: baseMonth.year + 1, month: 0 }
    : { year: baseMonth.year,     month: baseMonth.month + 1 };

  const fetchAvailability = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const startDate = `${baseMonth.year}-${String(baseMonth.month + 1).padStart(2, '0')}-01`;
      const endDate   = (() => {
        const d = new Date(second.year, second.month + 1, 0);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })();

      const { data, error } = await supabase
        .from('availability')
        .select('date, start_time, end_time')
        .eq('status', 'unavailable')
        .gte('date', startDate)
        .lte('date', endDate);

      if (!error) {
        const map = {};
        (data || []).forEach(item => {
          if (!map[item.date]) map[item.date] = [];
          map[item.date].push({ start_time: item.start_time, end_time: item.end_time });
        });
        setSlotsByDate(map);
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [baseMonth.year, baseMonth.month]);

  useEffect(() => {
    setLoading(true);
    fetchAvailability();
  }, [fetchAvailability]);

  useEffect(() => {
    const ch = supabase
      .channel(`avail-calendar-${baseMonth.year}-${baseMonth.month}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, () => fetchAvailability())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [baseMonth.year, baseMonth.month]);

  const handlePrev = () => {
    const now = new Date();
    if (baseMonth.year === now.getFullYear() && baseMonth.month === now.getMonth()) return;
    setBaseMonth(prev =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year,     month: prev.month - 1 }
    );
  };

  const handleNext = () => {
    const max = new Date(); max.setMonth(max.getMonth() + 11);
    const nextYear  = baseMonth.month === 11 ? baseMonth.year + 1 : baseMonth.year;
    const nextMonth = baseMonth.month === 11 ? 0 : baseMonth.month + 1;
    if (new Date(nextYear, nextMonth, 1) > max) return;
    setBaseMonth({ year: nextYear, month: nextMonth });
  };

  const isAtStart = baseMonth.year === today.getFullYear() && baseMonth.month === today.getMonth();

  return (
    <div className="w-full bg-white dark:bg-[#1a2530] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/80 dark:bg-black/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Live Availability</span>
          </div>
          {loading && <Loader2 className="w-3 h-3 animate-spin text-[#03c4c9]" />}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={isAtStart}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              isAtStart ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two-month grid */}
      <div className="flex flex-col sm:flex-row gap-6 px-5 py-4">
        <MonthGrid year={baseMonth.year} month={baseMonth.month} slotsByDate={slotsByDate} />
        <div className="hidden sm:block w-px bg-gray-100 dark:bg-gray-700/50 self-stretch" />
        <MonthGrid year={second.year} month={second.month} slotsByDate={slotsByDate} />
      </div>

      {/* Footer: legend + CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/80 dark:bg-black/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">Unavailable</span>
          </div>
        </div>
        <button
          onClick={() => openModal(serviceName, experienceImage)}
          className="shrink-0 px-5 py-2 bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white text-sm font-bold rounded-lg transition-all duration-200 whitespace-nowrap"
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
