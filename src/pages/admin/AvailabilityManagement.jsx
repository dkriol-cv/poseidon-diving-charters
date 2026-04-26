
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';

const BLOCK_TYPES = [
  { id: 'full_day',  label: 'Full Day',       start: '08:00', end: '18:00' },
  { id: 'morning',   label: 'Morning',         start: '08:00', end: '13:00' },
  { id: 'afternoon', label: 'Afternoon',       start: '13:00', end: '18:00' },
  { id: 'custom',    label: 'Custom Hours',    start: '',      end: ''      },
];

function timesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

function isFullDay(start, end) {
  return (start || '08:00') <= '08:00' && (end || '18:00') >= '18:00';
}

function getBlockLabel(start, end) {
  const s = start || '08:00';
  const e = end || '18:00';
  if (s === '08:00' && e === '13:00') return 'Morning';
  if (s === '13:00' && e === '18:00') return 'Afternoon';
  if (isFullDay(s, e)) return 'Full Day';
  return `${s}–${e}`;
}

const AvailabilityManagement = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [blockType, setBlockType] = useState('full_day');
  const [customStart, setCustomStart] = useState('09:00');
  const [customEnd, setCustomEnd] = useState('12:00');
  const [note, setNote] = useState('');

  const fetchBlockedSlots = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('availability')
        .select('id, date, start_time, end_time, note, status')
        .eq('status', 'unavailable')
        .order('date', { ascending: true });
      if (error) throw error;
      setBlockedSlots(data || []);
    } catch (err) {
      toast({ title: 'Error loading data', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchBlockedSlots(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-avail-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability' }, fetchBlockedSlots)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchBlockedSlots]);

  const getStartTime = () => blockType === 'custom' ? customStart : BLOCK_TYPES.find(t => t.id === blockType).start;
  const getEndTime   = () => blockType === 'custom' ? customEnd   : BLOCK_TYPES.find(t => t.id === blockType).end;

  const getSlotsForDate = (dateStr) => blockedSlots.filter(s => s.date === dateStr);

  const getDayState = (dateStr) => {
    const slots = getSlotsForDate(dateStr);
    if (slots.length === 0) return 'available';
    if (slots.some(s => isFullDay(s.start_time, s.end_time))) return 'full';
    return 'partial';
  };

  const handleDateClick = (dateStr) => {
    const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));
    if (isPast || getDayState(dateStr) === 'full' || isProcessing) return;
    setSelectedDates(prev =>
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    );
  };

  const blockSelectedDates = async () => {
    if (selectedDates.length === 0 || isProcessing) return;
    const newStart = getStartTime();
    const newEnd   = getEndTime();

    if (!newStart || !newEnd || newStart >= newEnd) {
      toast({ title: 'Invalid time range', description: 'Start time must be before end time.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    const conflicts = [];
    const toInsert  = [];

    for (const date of selectedDates) {
      const existing = getSlotsForDate(date);

      if (isFullDay(newStart, newEnd) && existing.length > 0) {
        conflicts.push(`${date} (has existing blocks — remove them first)`);
        continue;
      }
      if (existing.some(s => isFullDay(s.start_time, s.end_time))) {
        conflicts.push(`${date} (full day already blocked)`);
        continue;
      }
      const overlap = existing.filter(s =>
        timesOverlap(newStart, newEnd, s.start_time || '08:00', s.end_time || '18:00')
      );
      if (overlap.length > 0) {
        conflicts.push(`${date} (overlaps ${overlap.map(s => `${s.start_time}–${s.end_time}`).join(', ')})`);
        continue;
      }
      toInsert.push({ date, start_time: newStart, end_time: newEnd, status: 'unavailable', note: note.trim() || null });
    }

    if (toInsert.length > 0) {
      const { error } = await supabase.from('availability').insert(toInsert);
      if (error) {
        toast({ title: 'Failed to block dates', description: error.message, variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
    }

    if (conflicts.length > 0) {
      toast({
        title: `${toInsert.length} blocked, ${conflicts.length} conflict${conflicts.length > 1 ? 's' : ''}`,
        description: conflicts.join(' | '),
        variant: toInsert.length === 0 ? 'destructive' : 'default',
      });
    } else {
      toast({ title: 'Success', description: `${toInsert.length} block${toInsert.length !== 1 ? 's' : ''} added.` });
    }

    setSelectedDates([]);
    setNote('');
    await fetchBlockedSlots();
    setIsProcessing(false);
  };

  const removeBlockedSlot = async (id) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const { error } = await supabase.from('availability').delete().eq('id', id);
    if (error) {
      toast({ title: 'Failed to remove block', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Block removed successfully.' });
      await fetchBlockedSlots();
    }
    setIsProcessing(false);
  };

  const getDaysInMonth   = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay    = getFirstDayOfMonth(currentMonth);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`e-${i}`} className="aspect-square" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const date    = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isPast  = date < today;
      const state   = getDayState(dateStr);
      const isSel   = selectedDates.includes(dateStr);
      const isDisabled = isPast || state === 'full' || isProcessing;

      let cls = 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700 cursor-pointer';
      if (isPast)            cls = 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60';
      else if (state === 'full')    cls = 'bg-red-50 border-red-200 text-red-700 cursor-not-allowed opacity-80';
      else if (state === 'partial') cls = 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-700 cursor-pointer';
      if (isSel && !isPast && state !== 'full') cls = 'bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700 cursor-pointer';

      days.push(
        <motion.button
          key={dateStr}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
          onClick={() => handleDateClick(dateStr)}
          disabled={isDisabled}
          className={cn("aspect-square flex flex-col items-center justify-center border-2 rounded-lg transition-all font-semibold text-sm", cls, isProcessing && "opacity-50 cursor-wait")}
        >
          <span>{day}</span>
          {state === 'partial' && !isPast && <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-0.5" />}
          {state === 'full'    && !isPast && <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-0.5" />}
        </motion.button>
      );
    }
    return days;
  };

  const formatDate = (dateStr) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2d353b] dark:text-white flex items-center gap-3">
          <Calendar className="text-[#03c4c9]" size={32} />
          Availability Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Block time slots to mark them unavailable. Applies globally to all experiences (one boat).
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#03c4c9]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))} disabled={isProcessing}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-xl">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))} disabled={isProcessing}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(d => <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1.5">{renderCalendarDays()}</div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {[
                  { cls: 'bg-green-50 border-green-200',   label: 'Available' },
                  { cls: 'bg-blue-100 border-blue-300',    label: 'Selected'  },
                  { cls: 'bg-orange-50 border-orange-200', label: 'Partial'   },
                  { cls: 'bg-red-50 border-red-200',       label: 'Full Day'  },
                ].map(({ cls, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 ${cls}`} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              {isProcessing && (
                <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700">Processing...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Block Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock size={18} className="text-[#03c4c9]" /> Block Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {BLOCK_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setBlockType(t.id)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all text-left",
                        blockType === t.id
                          ? "border-[#03c4c9] bg-[#03c4c9]/10 text-[#03c4c9]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      )}
                    >
                      <div>{t.label}</div>
                      {t.start && <div className="text-xs opacity-60 mt-0.5">{t.start}–{t.end}</div>}
                    </button>
                  ))}
                </div>

                {blockType === 'custom' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <Label className="text-xs mb-1 block">Start time</Label>
                      <Input type="time" value={customStart} onChange={e => setCustomStart(e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">End time</Label>
                      <Input type="time" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="text-sm" />
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-xs mb-1 block">Note (optional)</Label>
                  <Input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Maintenance, private event" className="text-sm" />
                </div>
              </CardContent>
            </Card>

            {/* Selected Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected ({selectedDates.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDates.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-3">Click dates on the calendar</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto mb-3">
                    {[...selectedDates].sort().map(d => (
                      <div key={d} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-xs font-medium text-blue-700">{formatDate(d)}</span>
                        <button onClick={() => setSelectedDates(p => p.filter(x => x !== d))} className="text-blue-500 hover:text-blue-700 ml-2">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <Button
                    onClick={blockSelectedDates}
                    disabled={selectedDates.length === 0 || isProcessing}
                    className="w-full bg-[#03c4c9] hover:bg-[#02aeb3] text-white"
                  >
                    {isProcessing
                      ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                      : `Block ${selectedDates.length || ''} Date${selectedDates.length !== 1 ? 's' : ''}`
                    }
                  </Button>
                  <Button onClick={() => setSelectedDates([])} disabled={selectedDates.length === 0 || isProcessing} variant="outline" className="w-full">
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Blocked Slots List */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle>Blocked Slots ({blockedSlots.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {blockedSlots.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No blocked slots yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase border-b dark:border-gray-700">
                      <th className="text-left pb-2 pr-4 font-semibold">Date</th>
                      <th className="text-left pb-2 pr-4 font-semibold">Hours</th>
                      <th className="text-left pb-2 pr-4 font-semibold">Type</th>
                      <th className="text-left pb-2 pr-4 font-semibold">Note</th>
                      <th className="text-right pb-2 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {blockedSlots.map(slot => {
                      const s = slot.start_time || '08:00';
                      const e = slot.end_time   || '18:00';
                      const full = isFullDay(s, e);
                      return (
                        <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                          <td className="py-2.5 pr-4 font-medium text-[#2d353b] dark:text-white whitespace-nowrap">{formatDate(slot.date)}</td>
                          <td className="py-2.5 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{s}–{e}</td>
                          <td className="py-2.5 pr-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
                              full ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                            )}>
                              {getBlockLabel(s, e)}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 text-gray-500 dark:text-gray-400 italic text-xs">{slot.note || '—'}</td>
                          <td className="py-2.5 text-right">
                            <Button
                              onClick={() => removeBlockedSlot(slot.id)}
                              disabled={isProcessing}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 h-7 px-2"
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailabilityManagement;
