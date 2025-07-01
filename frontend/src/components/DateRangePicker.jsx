import React, { useState } from "react";
import { useDateRange } from "../context/DateRangeContext"; 
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { addDays, format } from "date-fns";
import { CalculatorIcon,CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";

export const DateRangePicker = () => {
  const { dateRange, setDateRange } = useDateRange(); // use context
  const [open, setOpen] = useState(false);

  // Extract from context state
  const from = dateRange[0]?.startDate;
  const to = dateRange[0]?.endDate;

  // Update context when calendar selection changes
  const handleSelect = (range) => {
    if (range?.from && range?.to) {
      setDateRange([
        {
          startDate: range.from,
          endDate: range.to,
          key: "selection",
        },
      ]);
    }
  };
  return (
    <div>
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarDays className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {/* {format(from, "LLL dd, y")} - {format(to, "LLL dd, y")} */}
                  {format(from, "dd-MM-yyyy")} - {format(to, "dd-MM-yyyy")}
                </>
              ) : (
                // format(from, "LLL dd, y")
                format(from, "dd-MM-yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={{ from, to }}
            onSelect={handleSelect}
           
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
