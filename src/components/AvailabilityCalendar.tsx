
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, parseISO, isWithinInterval } from "date-fns";

interface AvailabilityCalendarProps {
  selectedDates: string[];
  onDatesChange: (dates: string[]) => void;
}

const AvailabilityCalendar = ({ selectedDates, onDatesChange }: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectionMode, setSelectionMode] = useState<'single' | 'range'>('single');
  const [rangeStart, setRangeStart] = useState<Date | null>(null);

  const selectedDateObjects = selectedDates.map(date => parseISO(date));

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const dateString = format(date, 'yyyy-MM-dd');

    if (selectionMode === 'single') {
      if (selectedDates.includes(dateString)) {
        // Remove the date if it's already selected
        onDatesChange(selectedDates.filter(d => d !== dateString));
      } else {
        // Add the date
        onDatesChange([...selectedDates, dateString]);
      }
    } else if (selectionMode === 'range') {
      if (!rangeStart) {
        // Start a new range
        setRangeStart(date);
      } else {
        // Complete the range
        const start = rangeStart < date ? rangeStart : date;
        const end = rangeStart < date ? date : rangeStart;
        
        // Generate all dates in the range
        const rangeDates: string[] = [];
        const currentDate = new Date(start);
        
        while (currentDate <= end) {
          rangeDates.push(format(currentDate, 'yyyy-MM-dd'));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Add range dates to existing selection
        const newDates = [...new Set([...selectedDates, ...rangeDates])];
        onDatesChange(newDates);
        setRangeStart(null);
      }
    }
  };

  const clearAllDates = () => {
    onDatesChange([]);
    setRangeStart(null);
  };

  const isDateSelected = (date: Date) => {
    return selectedDateObjects.some(selectedDate => 
      format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isDateInPreviewRange = (date: Date) => {
    if (!rangeStart || selectionMode !== 'range') return false;
    
    const start = rangeStart < date ? rangeStart : date;
    const end = rangeStart < date ? date : rangeStart;
    
    return isWithinInterval(date, { start, end });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={selectionMode === 'single' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSelectionMode('single');
              setRangeStart(null);
            }}
          >
            Single Dates
          </Button>
          <Button
            type="button"
            variant={selectionMode === 'range' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSelectionMode('range');
              setRangeStart(null);
            }}
          >
            Date Ranges
          </Button>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearAllDates}
        >
          Clear All
        </Button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-lg p-3">
        <Calendar
          mode="single"
          selected={undefined}
          onSelect={handleDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="pointer-events-auto"
          modifiers={{
            selected: isDateSelected,
            preview: isDateInPreviewRange,
          }}
          modifiersStyles={{
            selected: {
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            },
            preview: {
              backgroundColor: 'hsl(var(--primary) / 0.3)',
            },
          }}
          disabled={(date) => date < new Date()}
        />
      </div>

      {rangeStart && selectionMode === 'range' && (
        <p className="text-sm text-muted-foreground">
          Range start: {format(rangeStart, 'MMM dd, yyyy')}. Click another date to complete the range.
        </p>
      )}

      {selectedDates.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <strong>{selectedDates.length}</strong> date{selectedDates.length === 1 ? '' : 's'} selected
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
