
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import { useBookingModal } from '@/contexts/BookingModalContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const MONTH_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAY_MIN     = ['S','M','T','W','T','F','S'];
const MAX_DAYS    = 90;
// Operating window — first activity 09:30, last activity ends 20:30
const DAY_START   = '09:30';
const DAY_END     = '20:30';

function isFullDay(start, end) {
  return (start || DAY_START) <= DAY_START && (end || DAY_END) >= DAY_END;
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
  const [fullOpen, setFullOpen]       = useState(false);
  const [viewMonth, setViewMonth]     = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
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

  const visible = allDates.slice(offset, offset + 7);

  const firstDate = visible[0];
  const lastDate  = visible[visible.length - 1];
  const monthLabel = firstDate.getMonth() === lastDate.getMonth()
    ? `${MONTH_SHORT[firstDate.getMonth()]} ${firstDate.getFullYear()}`
    : `${MONTH_SHORT[firstDate.getMonth()]} – ${MONTH_SHORT[lastDate.getMonth()]} ${lastDate.getFullYear()}`;

  // Full month grid for modal
  const buildMonthGrid = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = firstOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const monthGrid = buildMonthGrid(viewMonth);
  const lastBookableDay = allDates[MAX_DAYS - 1];

  const canPrevMonth = viewMonth.getFullYear() > today.getFullYear()
    || (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());
  const canNextMonth = (() => {
    const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
    return next <= lastBookableDay;
  })();

  const handlePrevMonth = () => {
    if (!canPrevMonth) return;
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    if (!canNextMonth) return;
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  };

  const isPastOrOutOfRange = (date) => {
    if (!date) return true;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today || d > lastBookableDay;
  };

  return (
    <div className="w-full">
      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        <CalendarIcon className="w-4 h-4 text-[#03c4c9]" />
        <h3 className="text-base font-bold text-[#2d353b] dark:text-white">
          Check availability
        </h3>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Browse upcoming dates to plan your charter
      </p>

      {/* Month label */}
      <div className="mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {monthLabel}
        </span>
      </div>

      {/* Strip */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          aria-label="Previous dates"
          className="flex items-center justify-center w-8 h-12 flex-shrink-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex gap-2 flex-1 min-w-0">
          {visible.map((date, i) => {
            const state = getDayState(date);

            return (
              <div
                key={toLocalDateStr(date)}
                aria-label={`${DAY_SHORT[date.getDay()]} ${date.getDate()} — ${state}`}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 min-w-0 h-14 rounded-lg border transition-colors duration-150 select-none',
                  i >= 4 && 'hidden sm:flex',
                  i >= 5 && 'sm:hidden md:flex',
                  i >= 6 && 'md:hidden lg:flex',
                  state === 'available' &&
                    'border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent',
                  state === 'partial' &&
                    'bg-amber-50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-700',
                  state === 'full' &&
                    'border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/60 opacity-60',
                )}
              >
                <span className={cn(
                  'text-[10px] font-medium uppercase tracking-wide leading-none mb-1',
                  state === 'full' && 'text-gray-400 dark:text-gray-600',
                  state === 'partial' && 'text-amber-700 dark:text-amber-300',
                  state === 'available' && 'text-gray-500 dark:text-gray-400',
                )}>
                  {DAY_SHORT[date.getDay()]}
                </span>
                <span className={cn(
                  'text-base font-semibold leading-none',
                  state === 'full' && 'text-gray-400 dark:text-gray-600 line-through',
                  state === 'partial' && 'text-amber-900 dark:text-amber-200',
                  state === 'available' && 'text-gray-900 dark:text-white',
                )}>
                  {date.getDate()}
                </span>
                {state === 'partial' && (
                  <span className="w-1 h-1 rounded-full bg-amber-500 mt-1" />
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={!canNext}
          aria-label="Next dates"
          className="flex items-center justify-center w-8 h-12 flex-shrink-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Actions: More dates + Book Now */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={() => {
            setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
            setFullOpen(true);
          }}
          className="text-sm font-medium text-[#03c4c9] hover:underline self-start sm:self-auto"
        >
          More dates →
        </button>
        <Button
          onClick={() => openModal(serviceName, experienceImage)}
          className="sm:ml-auto bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white font-bold"
        >
          BOOK NOW
        </Button>
      </div>

      {/* Full calendar modal */}
      <Dialog open={fullOpen} onOpenChange={setFullOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#03c4c9]" />
              Availability Calendar
            </DialogTitle>
            <DialogDescription>
              Browse available dates. Greyed dates are fully booked.
            </DialogDescription>
          </DialogHeader>

          {/* Month nav */}
          <div className="flex items-center justify-between py-2">
            <button
              onClick={handlePrevMonth}
              disabled={!canPrevMonth}
              aria-label="Previous month"
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="text-sm font-bold text-[#2d353b] dark:text-white">
              {MONTH_LONG[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </span>
            <button
              onClick={handleNextMonth}
              disabled={!canNextMonth}
              aria-label="Next month"
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_MIN.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((date, i) => {
              if (!date) return <div key={i} className="h-10" />;
              const out      = isPastOrOutOfRange(date);
              const state    = out ? 'out' : getDayState(date);
              const isToday  = toLocalDateStr(date) === toLocalDateStr(today);

              return (
                <div
                  key={i}
                  aria-label={out ? 'unavailable' : `${date.getDate()} — ${state}`}
                  className={cn(
                    'h-10 rounded-lg text-sm font-medium border flex items-center justify-center select-none',
                    out && 'text-gray-300 dark:text-gray-700 border-transparent',
                    !out && state === 'available' &&
                      'bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white',
                    !out && state === 'partial' &&
                      'bg-amber-50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200',
                    !out && state === 'full' &&
                      'bg-gray-100 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 line-through opacity-60',
                    isToday && !out && 'ring-2 ring-[#03c4c9] ring-offset-1 dark:ring-offset-[#0b1216]',
                  )}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent" />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Available</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Partial</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full</span>
            </span>
          </div>

          {/* Booking button */}
          <Button
            onClick={() => {
              setFullOpen(false);
              openModal(serviceName, experienceImage);
            }}
            className="w-full bg-[#03c4c9] hover:bg-[#f5c842] hover:text-[#2d353b] text-white font-bold mt-2"
          >
            BOOK NOW
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailabilityCalendar;
