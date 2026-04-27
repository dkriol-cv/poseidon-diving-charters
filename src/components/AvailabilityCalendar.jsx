
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import { useBookingModal } from '@/contexts/BookingModalContext';

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
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

  const [offset, setOffset]           = useState(0);
  const [slotsByDate, setSlotsByDate] = useState({});
  const fetchingRef                   = useRef(false);

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

  const STEP = 4;
  const VISIBLE = 4;

  const canPrev = offset > 0;
  const canNext = offset + VISIBLE < MAX_DAYS;

  const handlePrev = () => setOffset(o => Math.max(0, o - STEP));
  const handleNext = () => setOffset(o => Math.min(MAX_DAYS - VISIBLE, o + STEP));

  // Show 4 on mobile, more on larger screens via CSS hidden classes
  const visible = allDates.slice(offset, offset + 7);

  // Determine month label from first visible date
  const firstDate = visible[0];
  const lastDate  = visible[visible.length - 1];
  const monthLabel = firstDate.getMonth() === lastDate.getMonth()
    ? `${MONTH_SHORT[firstDate.getMonth()]} ${firstDate.getFullYear()}`
    : `${MONTH_SHORT[firstDate.getMonth()]} – ${MONTH_SHORT[lastDate.getMonth()]} ${lastDate.getFullYear()}`;

  return (
    <div className="w-full">
      {/* Month label */}
      <div className="mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {monthLabel}
        </span>
      </div>

      {/* Strip */}
      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          aria-label="Previous dates"
          className="flex items-center justify-center w-8 h-12 flex-shrink-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Date cards */}
        <div className="flex gap-2 flex-1 min-w-0">
          {visible.map((date, i) => {
            const state   = getDayState(date);
            const isToday = offset === 0 && i === 0;
            const disabled = state === 'full';

            return (
              <button
                key={toLocalDateStr(date)}
                onClick={() => !disabled && openModal(serviceName, experienceImage)}
                disabled={disabled}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 min-w-0 h-14 rounded-lg border transition-all duration-150',
                  // Hide cards beyond what fits
                  i >= 4 && 'hidden sm:flex',
                  i >= 5 && 'sm:hidden md:flex',
                  i >= 6 && 'md:hidden lg:flex',
                  // States
                  !disabled && 'border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white cursor-pointer bg-white dark:bg-transparent',
                  disabled && 'border-gray-100 dark:border-gray-800 cursor-not-allowed bg-gray-50 dark:bg-gray-900/40',
                )}
              >
                <span className={cn(
                  'text-[10px] font-medium uppercase tracking-wide leading-none mb-1',
                  disabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {DAY_SHORT[date.getDay()]}
                </span>
                <span className={cn(
                  'text-base font-semibold leading-none',
                  disabled
                    ? 'text-gray-300 dark:text-gray-600 line-through'
                    : 'text-gray-900 dark:text-white'
                )}>
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={!canNext}
          aria-label="Next dates"
          className="flex items-center justify-center w-8 h-12 flex-shrink-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* More dates link */}
      <div className="mt-3">
        <button
          onClick={() => openModal(serviceName, experienceImage)}
          className="text-sm font-medium text-[#03c4c9] hover:underline"
        >
          More dates
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
