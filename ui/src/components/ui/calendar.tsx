"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0";
import { DayPicker } from "react-day-picker@8.10.1";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  // Extract specific props to avoid passing them to DOM elements
  const {
    mode,
    selected,
    onSelect,
    disabled,
    weekStartsOn,
    fixedWeeks,
    ...otherProps
  } = props;

  return (
    <DayPicker
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      weekStartsOn={weekStartsOn}
      fixedWeeks={fixedWeeks}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-right", className)}
      dir="rtl"
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute right-1", // Swapped for RTL
        nav_button_next: "absolute left-1", // Swapped for RTL
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
          mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-l-md [&:has(>.day-range-start)]:rounded-r-md first:[&:has([aria-selected])]:rounded-r-md last:[&:has([aria-selected])]:rounded-l-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100 text-center",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className }) => (
          <ChevronRight className={cn("size-4", className)} />
        ),
        IconRight: ({ className }) => (
          <ChevronLeft className={cn("size-4", className)} />
        ),
      }}
      {...otherProps}
    />
  );
}

export { Calendar };
