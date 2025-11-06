import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSessions } from "../hooks/session/useSessions";

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

export default function SessionHistory() {
  const { data: sessions = [], isLoading } = useSessions();

  const groupedSessions = useMemo(() => {
    const grouped: Record<string, WorkoutSession[]> = {};
    sessions.forEach((session: WorkoutSession) => {
      const dateKey = new Date(session.start_time).toLocaleDateString("en-CA");
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(session);
    });
    return grouped;
  }, [sessions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-500 text-xl">
        Loading session history...
      </div>
    );
  }

  if (!sessions) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 max-w-[1200px] mx-auto w-full space-y-5">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-900 drop-shadow-sm">
          🏋️‍♂️ Session Logs
        </h1>
        <Link to={"/start-workout"}>
          <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-full sm:w-auto">
            Start Workout
          </button>
        </Link>
      </div>

      <div className="max-w-[1200px] mx-auto w-full space-y-10">
        {Object.keys(groupedSessions)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map((day) => (
            <div key={day}>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                📅{" "}
                {new Date(day).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedSessions[day].map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 transition hover:shadow-lg hover:border-blue-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                      <div>
                        <p className="text-lg font-semibold text-blue-700">
                          Plan #{session.plan}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(session.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(session.end_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right mt-3 sm:mt-0">
                        <p className="text-gray-700 text-sm">
                          🔥 {session.total_calories} cal
                        </p>
                        <p className="text-gray-700 text-sm">
                          🎯 Posture: {session.posture_score_avg}%
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 mt-3 pt-3">
                      <p className="text-md font-semibold mb-2 text-gray-800">
                        Exercises:
                      </p>
                      <ul className="space-y-2">
                        {session.logs?.map((log, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center bg-blue-50 text-gray-700 px-4 py-2 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{log.exercise_name}</p>
                              <p className="text-sm text-gray-500">
                                Sets: {log.sets_completed} | Reps:{" "}
                                {log.reps_completed}
                                {log.weight_kg && ` | ${log.weight_kg} kg`}
                              </p>
                            </div>
                            {log.posture_feedback && (
                              <span className="text-sm text-blue-700 italic">
                                {log.posture_feedback}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
