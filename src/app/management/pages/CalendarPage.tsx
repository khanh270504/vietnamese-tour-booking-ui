import { useCalendar } from "../features/calendar/hooks/useCalendar";
import { CalendarSidebar } from "../features/calendar/CalendarSidebar";
import { CalendarGrid } from "../features/calendar/CalendarGrid";
import { CalendarDetail } from "../features/calendar/CalendarDetail";
import { CreateScheduleModal } from "../features/calendar/CreateScheduleModal";
import { CalendarStats } from "../features/calendar/CalendarStats";

export function CalendarPage() {
  const {
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
  } = useCalendar();
  
  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-6 flex flex-col gap-6">
      
      {/* <CalendarStats schedules={schedules} />  */}

      {/* Cụm Layout 3 cột bên dưới */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        
        {/* Cột 1: Sidebar */}
        <CalendarSidebar 
          schedules={schedules} 
          loading={loading} 
          selected={selected}
          onOpenCreate={() => setIsCreateModalOpen(true)}
          setSelected={setSelected} 
        />
        
        {/* Cột 2: Lịch (Chỉ còn chứa lưới lịch) */}
        <CalendarGrid
          month={month}
          year={year}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          firstDayOffset={firstDayOffset}
          daysInMonth={daysInMonth}
          getScheduleByDay={getScheduleByDay}
          setSelected={setSelected}
        />
        
        {/* Cột 3: Chi tiết ngày */}
        <CalendarDetail selected={selected} />
      </div>

      {/* Modal tạo lịch */}
      <CreateScheduleModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchSchedules(); 
        }}
      />
    </div>
  );
}