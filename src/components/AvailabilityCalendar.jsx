
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import { useBookingModal } from '@/contexts/BookingModalContext';

const MONTH_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAY_SHORT   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MAX_DAYS    = 90;

function isFullDay(start, end) {
  return (start || '08:00') <= '08:00' && (end || '18:00') >= '18:00';
}

function toLocalDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

const AvailabilityCalendar = ({ serviceName, experienceImage }) => {
  const { openModal } = useBookingModal();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // How many cards to show changes based on screen width via CSS;
  // we track offset (days from today shown at left edge)
  const [offset, setOffset]         = useState(0);
  const [slotsByDate, setSlotsByDate] = useState({});
  const [loading, setLoading]         = useState(true);
  const fetchingRef                   = useRef(false);

  // Build the full 90-day list once
  const allDates = useMemo(
    () => Array.from({ length: MAX_DAYS }, (_, i) => addDays(today, i)),
    [today]
  );

  const fetchAvailability = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('date, start_time, end_time')
        .eq('status', 'unavailable')
        .gte('date', toLocalDateStr(today))
        .lte('date', toLocalDateStr(allDates[MAX_DAYS - 1]));

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
  }, [today, allDates]);

  useEffect(() => { fetchAvailability(); }, [fetchAvailability]);

  useEffect(() => {
    const ch = supabase
      .channel('avail-strip')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, fetchAvailability)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchAvailability]);

  const getDayState = (date) => {
    const slots = slotsByDate[toLocalDateStr(date)];
    if (!slots || slots.length === 0) return 'available';
    if (slots.some(s => isFullDay(s.start_time, s.end_time))) return 'full';
    return 'partial';
  };

  // STEP controls how many cards to advance — matches the CSS-visible count
  // We use 4 on mobile, 7 on desktop via a hidden ref approach,
  // but a simpler fixed step of 7 works well enough.
  const STEP = 7;

  const canPrev = offset > 0;
  const canNext = offset + STEP < MAX_DAYS;

  const handlePrev = () => setOffset(o => Math.max(0, o - STEP));
  const handleNext = () => setOffset(o => Math.min(MAX_DAYS - STEP, o + STEP));

  // Slice enough dates to fill; CSS hides the extras on small screens
  const visible = allDates.slice(offset, offset + STEP);

  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-[#2d353b] dark:text-white tracking-tight">
          Check availability
        </span>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="w-3 h-3 animate-spin text-[#03c4c9]" />}
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Live</span>
          </div>
        </div>
      </div>

      {/* Strip */}
      <div className="flex items-stretch gap-1.5">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          aria-label="Previous dates"
          className="flex items-center justify-center w-7 flex-shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-25 disabled:cursor-not-allowed transition-colors bg-white dark:bg-[#1a2530]"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Date cards */}
        <div className="flex gap-1.5 flex-1 min-w-0">
          {visible.map((date, i) => {
            const state    = getDayState(date);
            const isToday  = offset === 0 && i === 0;
            const prevDate = visible[i - 1];
            const showMonth = i === 0 || date.getMonth() !== prevDate.getMonth();

            return (
              <div
                key={toLocalDateStr(date)}
                className={cn(
                  'flex flex-col flex-1 min-w-0',
                  // Hide later cards on small screens to avoid overflow
                  i >= 4 && 'hidden sm:flex',
                  i >= 6 && 'sm:hidden md:flex',
                )}
              >
                {/* Month label */}
                <span className={cn(
                  'text-[9px] font-bold uppercase tracking-wider text-center mb-1 leading-none',
                  showMonth ? 'text-gray-400 dark:text-gray-500' : 'text-transparent select-none'
                )}>
                  {MONTH_SHORT[date.getMonth()]} {date.getFullYear()}
                </span>

                {/* Card */}
                <button
                  onClick={() => state !== 'full' && openModal(serviceName, experienceImage)}
                  disabled={state === 'full'}
                  className={cn(
                    'flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all duration-150 gap-0.5',
                    state === 'available' && !isToday &&
                      'bg-white dark:bg-[#1a2530] border-gray-200 dark:border-gray-700 hover:border-[#03c4c9] dark:hover:border-[#03c4c9] hover:shadow-sm cursor-pointer',
                    state === 'available' && isToday &&
                      'bg-gray-50 dark:bg-[#111a1f] border-gray-200 dark:border-gray-700 cursor-pointer hover:border-[#03c4c9]',
                    state === 'partial' &&
                      'bg-amber-50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-700 hover:border-amber-500 cursor-pointer',
                    state === 'full' &&
                      'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-50',
                  )}
                >
                  <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wide leading-none',
                    isToday ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'
                  )}>
                    {isToday ? 'TODAY' : DAY_SHORT[date.getDay()]}
                  </span>
                  <span className={cn(
                    'text-lg font-bold leading-tight',
                    state === 'full' ? 'text-gray-300 dark:text-gray-600 line-through' :
                    isToday        ? 'text-gray-400 dark:text-gray-500' :
                                     'text-[#2d353b] dark:text-white'
                  )}>
                    {date.getDate()}
                  </span>
                  {/* Availability dot */}
                  {state === 'partial' && (
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
                  )}
                  {state === 'available' && !isToday && (
                    <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={!canNext}
          aria-label="Next dates"
          className="flex items-center justify-center w-7 flex-shrink-0 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-25 disabled:cursor-not-allowed transition-colors bg-white dark:bg-[#1a2530]"
        >
          <ChevronRight className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span className="text-[10px] text-gray-400">Available</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span className="text-[10px] text-gray-400">Partial</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 inline-block" />
            <span className="text-[10px] text-gray-400">Full</span>
          </span>
        </div>
        <button
          onClick={() => openModal(serviceName, experienceImage)}
          className="text-xs font-bold text-[#03c4c9] hover:text-[#f5c842] transition-colors"
        >
          BOOK NOW →
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
