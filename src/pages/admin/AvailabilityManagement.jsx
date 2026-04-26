
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';

const AvailabilityManagement = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchBlockedDates = useCallback(async () => {
    if (isFetching) return;
    
    setIsFetching(true);
    try {
      // Optimized query: select only 'date' column
      const { data, error } = await supabase
        .from('availability')
        .select('date')
        .eq('status', 'unavailable')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching blocked dates:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load blocked dates. Please refresh the page.",
          variant: "destructive"
        });
        return;
      }

      const dates = (data || []).map(item => item.date);
      setBlockedDates(dates);
    } catch (error) {
      console.error('Unexpected error fetching blocked dates:', error);
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [toast, isFetching]);

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  useEffect(() => {
    // Set up real-time subscription for availability changes
    const channel = supabase
      .channel('admin-availability-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availability'
        },
        (payload) => {
          console.log('Availability change detected:', payload);
          fetchBlockedDates();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBlockedDates]);

  const handleDateClick = (dateStr) => {
    const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));
    if (isPast) return;

    const isBlocked = blockedDates.includes(dateStr);
    if (isBlocked) return;

    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  const removeSelectedDate = (dateStr) => {
    setSelectedDates(prev => prev.filter(d => d !== dateStr));
  };

  const clearSelection = () => {
    setSelectedDates([]);
  };

  const blockSelectedDates = async () => {
    if (selectedDates.length === 0 || isProcessing) return;

    setIsProcessing(true);
    
    try {
      // Filter out dates that are already blocked
      const newDates = selectedDates.filter(date => !blockedDates.includes(date));
      
      if (newDates.length === 0) {
        toast({
          title: "All Dates Already Blocked",
          description: "All selected dates are already blocked in the system.",
          variant: "destructive"
        });
        clearSelection();
        setIsProcessing(false);
        return;
      }

      // Optimistic update: immediately add to blocked dates
      setBlockedDates(prev => [...prev, ...newDates].sort());

      // Prepare bulk insert data - ONLY date and status (no experience_id)
      const insertData = newDates.map(date => ({
        date,
        status: 'unavailable'
      }));

      const { error } = await supabase
        .from('availability')
        .insert(insertData);

      if (error) {
        // Revert optimistic update on error
        setBlockedDates(prev => prev.filter(d => !newDates.includes(d)));
        
        // Check if error is due to unique constraint violation
        if (error.code === '23505') {
          const conflictDates = newDates.filter(date => blockedDates.includes(date));
          toast({
            title: "Some Dates Already Blocked",
            description: `The following dates are already blocked: ${conflictDates.join(', ')}`,
            variant: "destructive"
          });
        } else {
          console.error('Error blocking dates:', error);
          toast({
            title: "Failed to Block Dates",
            description: "Please try again. If the problem persists, contact support.",
            variant: "destructive"
          });
        }
        
        setIsProcessing(false);
        return;
      }

      const alreadyBlockedCount = selectedDates.length - newDates.length;
      let message = `${newDates.length} date${newDates.length > 1 ? 's' : ''} blocked successfully`;
      
      if (alreadyBlockedCount > 0) {
        message = `${alreadyBlockedCount} date${alreadyBlockedCount > 1 ? 's' : ''} already blocked, ${newDates.length} date${newDates.length > 1 ? 's' : ''} added`;
      }

      toast({
        title: "Success",
        description: message,
      });

      clearSelection();
      
      // Refetch to ensure data consistency
      await fetchBlockedDates();
      
    } catch (error) {
      // Revert optimistic update on network error
      const newDates = selectedDates.filter(date => !blockedDates.includes(date));
      setBlockedDates(prev => prev.filter(d => !newDates.includes(d)));
      
      console.error('Unexpected error blocking dates:', error);
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeBlockedDate = async (dateStr) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Optimistic update: immediately remove from blocked dates
      const previousBlockedDates = [...blockedDates];
      setBlockedDates(prev => prev.filter(d => d !== dateStr));

      const { error } = await supabase
        .from('availability')
        .delete()
        .eq('date', dateStr);

      if (error) {
        // Revert optimistic update on error
        setBlockedDates(previousBlockedDates);
        
        console.error('Error removing blocked date:', error);
        toast({
          title: "Failed to Remove Date",
          description: "Please try again. If the problem persists, contact support.",
          variant: "destructive"
        });
        
        setIsProcessing(false);
        return;
      }

      toast({
        title: "Success",
        description: "Date unblocked successfully.",
      });

      // Refetch to ensure data consistency
      await fetchBlockedDates();
      
    } catch (error) {
      // Revert optimistic update on network error
      console.error('Unexpected error removing blocked date:', error);
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const isPast = date < today;
      const isSelected = selectedDates.includes(dateStr);
      const isBlocked = blockedDates.includes(dateStr);

      let bgColor = 'bg-green-50 hover:bg-green-100 border-green-200';
      let textColor = 'text-green-700';
      let borderColor = 'border-green-200';

      if (isPast) {
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-400';
        borderColor = 'border-gray-200';
      } else if (isBlocked) {
        bgColor = 'bg-red-50';
        textColor = 'text-red-700';
        borderColor = 'border-red-200';
      } else if (isSelected) {
        bgColor = 'bg-blue-100 hover:bg-blue-200 border-blue-300';
        textColor = 'text-blue-700';
        borderColor = 'border-blue-300';
      }

      days.push(
        <motion.button
          key={dateStr}
          whileTap={!isPast && !isBlocked ? { scale: 0.95 } : {}}
          onClick={() => handleDateClick(dateStr)}
          disabled={isPast || isBlocked || isProcessing}
          className={cn(
            "aspect-square flex items-center justify-center border-2 rounded-lg transition-all font-semibold text-sm",
            bgColor,
            textColor,
            borderColor,
            (isPast || isBlocked) && "cursor-not-allowed opacity-60",
            !isPast && !isBlocked && !isProcessing && "cursor-pointer",
            isProcessing && "opacity-50 cursor-wait"
          )}
        >
          {day}
        </motion.button>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2d353b] dark:text-white flex items-center gap-3">
            <Calendar className="text-[#03c4c9]" size={32} />
            Availability Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Block dates to mark them as unavailable for all experiences
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#03c4c9]" />
            <p className="text-sm text-gray-500">Loading availability data...</p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePrevMonth}
                  disabled={isProcessing}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <CardTitle className="text-xl">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNextMonth}
                  disabled={isProcessing}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-bold text-gray-500 uppercase">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
              </div>

              {/* Legend */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-200" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-50 border-2 border-red-200" />
                    <span>Blocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-200" />
                    <span>Past</span>
                  </div>
                </div>
              </div>

              {isProcessing && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-700">Processing your request...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected & Blocked Dates Section */}
          <div className="space-y-6">
            {/* Selected Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Selected Dates ({selectedDates.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDates.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No dates selected
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedDates.sort().map(dateStr => (
                      <div 
                        key={dateStr}
                        className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <span className="text-sm font-medium text-blue-700">
                          {formatDate(dateStr)}
                        </span>
                        <button
                          onClick={() => removeSelectedDate(dateStr)}
                          disabled={isProcessing}
                          className="text-blue-700 hover:text-blue-900 disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <Button
                    onClick={blockSelectedDates}
                    disabled={selectedDates.length === 0 || isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Block Selected Dates (${selectedDates.length})`
                    )}
                  </Button>
                  <Button
                    onClick={clearSelection}
                    disabled={selectedDates.length === 0 || isProcessing}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blocked Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Blocked Dates ({blockedDates.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {blockedDates.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No blocked dates
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {blockedDates.map(dateStr => (
                      <div 
                        key={dateStr}
                        className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200"
                      >
                        <span className="text-sm font-medium text-red-700">
                          {formatDate(dateStr)}
                        </span>
                        <Button
                          onClick={() => removeBlockedDate(dateStr)}
                          disabled={isProcessing}
                          variant="ghost"
                          size="sm"
                          className="text-red-700 hover:text-red-900 hover:bg-red-100 h-7 px-2"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManagement;
