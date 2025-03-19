"use client";

import { Button } from "@/components/ui/button";
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

interface WeeklySelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function WeeklySelector({
  selectedDate,
  onSelectDate,
}: WeeklySelectorProps) {
  const [displayedWeekStart, setDisplayedWeekStart] = useState(
    startOfWeek(selectedDate, { weekStartsOn: 1 })
  );

  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    addDays(displayedWeekStart, i)
  );
  return (
    <div className="flex items-center justify-center gap-3 p-2">
      {/* Left Arrow - Last Week */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setDisplayedWeekStart(subWeeks(displayedWeekStart, 1))}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </Button>

      {/* Week Day Labels & Buttons */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {daysOfWeek.map((day) => (
          <Button
            key={day.toISOString()}
            variant={isSameDay(selectedDate, day) ? "outline" : "ghost"}
            onClick={() => onSelectDate(day)}
            className="w-12 h-14 text-center flex flex-col gap-y-0.5"
          >
            <span className="uppercase text-sm">{format(day, "EEE")}</span>
            <span className="font-semibold text-lg leading-tight">
              {format(day, "d")}
            </span>
          </Button>
        ))}
      </div>

      {/* Right Arrow - Next Week */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setDisplayedWeekStart(addWeeks(displayedWeekStart, 1))}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
