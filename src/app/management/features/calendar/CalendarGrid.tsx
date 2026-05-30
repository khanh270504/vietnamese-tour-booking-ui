import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { ScheduleResponse } from "../../../services/tour/tour.types";
import { statusUI, weekdays } from "./constants";

interface CalendarGridProps {
  month: number;
  year: number;
  prevMonth: () => void;
  nextMonth: () => void;
  firstDayOffset: number;
  daysInMonth: number;
  getScheduleByDay: (day: number) => ScheduleResponse | undefined;
  setSelected: (schedule: ScheduleResponse) => void;
}

export function CalendarGrid({
  month,
  year,
  prevMonth,
  nextMonth,
  firstDayOffset,
  daysInMonth,
  getScheduleByDay,
  setSelected,
}: CalendarGridProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <Calendar size={18} />
          Lịch điều hành
        </h2>

        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <ChevronLeft />
          </button>

          <span className="text-sm font-semibold text-slate-600">
            Tháng {month} / {year}
          </span>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-3 mb-3">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-black text-slate-400 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-3">
        {/* Offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`offset-${i}`} />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const schedule = getScheduleByDay(day);

          return (
            <div
              key={i}
              onClick={() => schedule && setSelected(schedule)}
              className={cn(
                "min-h-[110px] rounded-2xl border bg-slate-50 hover:bg-white hover:shadow-md transition p-2",
                schedule && "cursor-pointer"
              )}
            >
              <p className="text-xs font-semibold text-slate-400">{day}</p>

              {schedule && (
                <div
                  className={cn(
                    "mt-2 text-[10px] px-2 py-2 rounded-xl text-white font-bold bg-gradient-to-r",
                    statusUI[schedule.status] || "from-slate-500 to-slate-400"
                  )}
                >
                  <p className="truncate">{schedule.tourName}</p>
                  <p className="mt-1 opacity-90">
                    {schedule.availableSlots}/{schedule.maxSlots} chỗ
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}