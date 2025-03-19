"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export default function DateSelector({
  selectedDate,
  onChange,
}: DateSelectorProps) {
  return (
    <div className="relative flex items-center justify-between p-2 w-full">
      {/* Date Picker & Arrow Buttons */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            onChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))
          }
          className="border border-slate-400 rounded h-10"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-[250px] text-lg  text-center border border-slate-400 rounded h-10"
            >
              {format(selectedDate, "EEEE, MMM d")}
              <CalendarIcon className="w-4 h-4 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            onChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))
          }
          className="border border-slate-400 rounded h-10"
        >
          <ChevronRightIcon className="w-5 h-5 rounded" />
        </Button>
      </div>

      {/* Today Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(new Date())}
        className="ml-auto"
      >
        Today
      </Button>
    </div>
  );
}
