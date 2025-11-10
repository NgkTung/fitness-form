import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSessions } from "../hooks/session/useSessions";

// --- Type definitions (kept for context) ---
type ExerciseLog = {
  exercise_name: string;
  sets_completed: number;
  reps_completed: string;
  weight_kg: number | null;
  posture_feedback: string | null;
};

type WorkoutSession = {
  id: number;
  plan: number;
  start_time: string;
  end_time: string;
  total_calories: number;
  posture_score_avg: number;
  logs: ExerciseLog[];
};

// --- SessionCard Component (kept the same) ---
function SessionCard({ session }: { session: WorkoutSession }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);

  const startTime = new Date(session.start_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(session.end_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden transition hover:shadow-md hover:border-blue-200">
      <button
        onClick={toggle}
        className="w-full text-left p-4 flex justify-between items-center"
        aria-expanded={open}
        aria-controls={`session-${session.id}-panel`}
      >
        <div>
          <p className="text-md font-semibold text-blue-700">
            Plan #{session.plan}
          </p>
          <p className="text-sm text-gray-500">
            {startTime} - {endTime}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-700 text-sm">
            🔥 {session.total_calories} cal
          </p>
          <span className="block text-blue-600 text-lg mt-1">
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>

      <div
        id={`session-${session.id}-panel`}
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 border-t border-blue-100 bg-blue-50/30">
          <p className="text-sm font-semibold mb-2 text-gray-800">Exercises:</p>
          <ul className="space-y-2">
            {session.logs?.map((log, idx) => (
              <li
                key={idx}
                className="bg-blue-50 text-gray-700 px-3 py-1 rounded-md text-sm"
              >
                <p className="font-medium">{log.exercise_name}</p>
                <p className="text-xs text-gray-500">
                  Sets: {log.sets_completed} | Reps: {log.reps_completed}
                  {log.weight_kg && ` | ${log.weight_kg} kg`}
                  {log.posture_feedback && ` | ${log.posture_feedback}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Helper function to format date keys consistently (YYYY-MM-DD) ---
const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default function SessionHistory() {
  const { data: sessions = [], isLoading } = useSessions();

  // State for calendar view
  const [currentDate, setCurrentDate] = useState(new Date());
  const initialSelectedDate = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialSelectedDate
  );

  // Memoized data grouping and calendar calculation
  const { groupedSessions, calendarDays, monthYearLabel } = useMemo(() => {
    // 1. Group sessions by YYYY-MM-DD key
    const grouped: Record<string, WorkoutSession[]> = {};
    sessions.forEach((session) => {
      const dateKey = formatDateKey(new Date(session.start_time));
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(session);
    });

    // 2. Calendar Calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: {
      day: number | null;
      dateKey: string | null;
      hasSessions: boolean;
    }[] = [];

    // Add 'filler' days for alignment
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, dateKey: null, hasSessions: false });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      const hasSessions = !!grouped[dateKey]?.length;

      days.push({ day, dateKey, hasSessions });
    }

    const monthYearLabel = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

    return {
      groupedSessions: grouped,
      calendarDays: days,
      monthYearLabel,
    };
  }, [sessions, currentDate]);

  const displayedSessions = useMemo(() => {
    return selectedDate ? groupedSessions[selectedDate] || [] : [];
  }, [groupedSessions, selectedDate]);

  // Handlers for month navigation
  const goToMonth = (offset: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + offset,
        1
      );

      const selectedDayOfMonth = selectedDate
        ? new Date(selectedDate).getDate()
        : 1;

      const maxDaysInNewMonth = new Date(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        0
      ).getDate();
      const dayToSelect = Math.min(selectedDayOfMonth, maxDaysInNewMonth);

      const newSelectedDate = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        dayToSelect
      );
      setSelectedDate(formatDateKey(newSelectedDate));

      return newDate;
    });
  };

  // --- Loading and Empty States ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-500 text-xl">
        Loading session history...
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-center text-gray-500">
        <p className="text-xl">No sessions logged yet.</p>
        <Link to="/start-workout" className="mt-4">
          <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            Start your first workout
          </button>
        </Link>
      </div>
    );
  }

  // --- Main Calendar View ---

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 p-4 sm:p-8">
      <div className="max-w-[800px] mx-auto w-full">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-900 drop-shadow-sm mb-8">
          📅 Workout History
        </h1>

        {/* --- Calendar Panel --- */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 mb-8">
          {/* Header: Month Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => goToMonth(-1)}
              className="text-blue-600 hover:text-blue-800 transition p-2 font-semibold"
            >
              &larr; Prev
            </button>
            <h2 className="text-2xl font-bold text-blue-800">
              {monthYearLabel}
            </h2>
            <button
              onClick={() => goToMonth(1)}
              className="text-blue-600 hover:text-blue-800 transition p-2 font-semibold"
            >
              Next &rarr;
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Names */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center font-bold text-sm text-blue-900 pb-3"
              >
                {day}
              </div>
            ))}

            {/* Days */}
            {calendarDays.map((cell, index) => {
              if (!cell.day) {
                // Filler day (from prev/next month)
                return <div key={`filler-${index}`} className="h-10"></div>;
              }

              const isSelected = cell.dateKey === selectedDate;
              const todayKey = formatDateKey(new Date());
              const isToday = cell.dateKey === todayKey && !isSelected; // Today status is overridden by selected status

              // Reverted back to rounded-full for circular shape
              let classes =
                "w-10 h-10 flex items-center justify-center rounded-full transition cursor-pointer relative font-medium text-sm mx-auto";

              if (isSelected) {
                // Primary active style: Circle shape
                classes +=
                  " bg-blue-600 text-white shadow-lg border-2 border-white z-10 scale-105";
              } else if (cell.hasSessions) {
                // Day with session: Light blue background
                classes += " bg-blue-100 text-blue-700 hover:bg-blue-200";
              } else if (isToday) {
                // Today but no sessions: Border
                classes +=
                  " border-2 border-blue-400 text-gray-800 hover:bg-gray-100";
              } else {
                // Regular day
                classes += " text-gray-700 hover:bg-gray-50";
              }

              return (
                <button
                  key={cell.dateKey}
                  className={classes}
                  onClick={() => setSelectedDate(cell.dateKey)}
                  title={
                    cell.hasSessions ? "View sessions" : "No sessions logged"
                  }
                >
                  {cell.day}
                  {/* Small dot indicator for sessions, visible when NOT selected. */}
                  {cell.hasSessions && !isSelected && (
                    <span className="absolute bottom-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full ring-1 ring-white"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Session List Panel (Below Calendar) --- */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b pb-2">
            Logs for{" "}
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Selected Day"}
          </h2>

          <div className="space-y-4">
            {displayedSessions.length > 0 ? (
              displayedSessions
                .sort(
                  (a, b) =>
                    new Date(a.start_time).getTime() -
                    new Date(b.start_time).getTime()
                ) // Sort by start time
                .map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))
            ) : (
              <div className="p-6 bg-white rounded-xl text-center text-gray-500 shadow-md border border-blue-100">
                You did not log any workouts on this day. Time to hit the gym!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
