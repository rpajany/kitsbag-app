import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalculatorIcon } from "lucide-react";
import { format } from "date-fns";

export const CalenderModel = ({ date, setDate }) => {
  // const [date, setDate] = React.useState < Date | undefined > (new Date())
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className=" ">
            <CalculatorIcon />
            {/* {date ? format(date, "PPP") : <span>Pick a Date</span>} */}
            {date ? format(date, "dd-MM-yyyy") : <span>Pick a Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto">
          <Calendar
            mode="single"
            selected={date}
            //   onSelect={setDate}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            modifiers={{
              today: new Date(), // automatically provided, but explicitly added here
            }}
            modifiersClassNames={{
              today: "bg-gray-500 text-white rounded-full", // style today’s date
            }}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
