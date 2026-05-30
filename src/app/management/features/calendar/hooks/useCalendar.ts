import { useState, useEffect, useMemo } from "react";
import { tourService } from "../../../../services/tour/tour.service";
import { ScheduleResponse } from "../../../../services/tour/tour.types";

export function useCalendar() {
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [selected, setSelected] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Demo month/year
  const [month, setMonth] = useState(5);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await tourService.getAllToursForAdmin();
      const allSchedules = res.result?.flatMap((tour) => tour.schedules || []) || [];
      setSchedules(allSchedules);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = useMemo(() => {
    return new Date(year, month, 0).getDate();
  }, [month, year]);

  const firstDayOffset = useMemo(() => {
    return new Date(year, month - 1, 1).getDay();
  }, [month, year]);

  const getScheduleByDay = (day: number) => {
    return schedules.find((s) => {
      const d = new Date(s.departureDate).getDate();
      const m = new Date(s.departureDate).getMonth() + 1;
      const y = new Date(s.departureDate).getFullYear();
      return d === day && m === month && y === year;
    });
  };

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((prev) => prev - 1);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((prev) => prev + 1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  return {
    schedules,
    selected,
    setSelected,
    loading,
    month,
    year,
    daysInMonth,
    firstDayOffset,
    getScheduleByDay,
    prevMonth,
    nextMonth,
    isCreateModalOpen,
  setIsCreateModalOpen,
  fetchSchedules,
  };
}