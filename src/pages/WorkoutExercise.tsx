import { useState, useEffect, useRef } from "react";
import { usePlanDetail } from "../hooks/plan/usePlanDetail";
import { useSaveSession } from "../hooks/session/useSaveSession";
import { useParams } from "react-router-dom";

type ExerciseLog = {
  exercise_name: string;
  sets_completed: number;
  reps_completed: string;
};

export default function WorkoutSession() {
  const { id } = useParams();
  const { data: plan, isLoading } = usePlanDetail(Number(id));
  const saveMutation = useSaveSession();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<
    "detail" | "countdown" | "inProgress" | "break" | "saving" | "finished"
  >("detail");
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);

  // Break state
  const [breakRemaining, setBreakRemaining] = useState(60);
  const [breakTotal, setBreakTotal] = useState(60);
  const breakStart = useRef<number | null>(null);
  const breakEnd = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  const playSound = (name: string) => {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.play().catch(() => {});
  };

  // Countdown before each exercise
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) {
      setPhase("inProgress");
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((p) => p - 1);
      playSound("beep");
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  // Smooth break timer with RAF
  useEffect(() => {
    if (phase !== "break") return;

    const loop = () => {
      const now = performance.now();
      if (!breakStart.current || !breakEnd.current) {
        breakStart.current = now;
        breakEnd.current = now + breakTotal * 1000;
      }

      const remainingMs = Math.max(0, breakEnd.current - now);
      const remainingSec = remainingMs / 1000;
      setBreakRemaining(remainingSec);

      if (remainingMs <= 0) {
        handleStartNextExercise(true);
        return;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [phase, breakTotal]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-xl">
        Loading your workout...
      </div>
    );

  if (!plan || !plan.plan_exercises?.length)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        No exercises found for this plan.
      </div>
    );

  const exercises = plan.plan_exercises;
  const currentExercise = exercises[currentIndex];
  const nextExercise = exercises[currentIndex + 1];

  const handleStart = () => {
    if (!startTime) setStartTime(new Date().toISOString());
    setCountdown(3);
    setPhase("countdown");
  };

  const handleFinish = async () => {
    const newLog: ExerciseLog = {
      exercise_name: currentExercise.exercise_name || "",
      sets_completed: currentExercise.sets,
      reps_completed: currentExercise.reps,
    };
    setLogs((prev) => [...prev, newLog]);

    if (currentIndex < exercises.length - 1) {
      playSound("success");
      setBreakRemaining(60);
      setBreakTotal(60);
      breakStart.current = null;
      breakEnd.current = null;
      setPhase("break");
    } else {
      playSound("finish");
      setPhase("saving");
      const workoutData = {
        plan: plan.id,
        start_time: startTime,
        end_time: new Date().toISOString(),
        total_calories: 350,
        posture_score_avg: 88.5,
        logs: [...logs, newLog],
      };
      try {
        await saveMutation.mutateAsync(workoutData);
        setPhase("finished");
      } catch {
        alert("Failed to save session. Please try again.");
        setPhase("finished");
      }
    }
  };

  const handleStartNextExercise = (auto = false) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = null;
    setCurrentIndex((p) => p + 1);
    setCountdown(3);
    // Skip "detail" phase, go straight to countdown for next exercise
    setPhase("countdown");
    if (auto) playSound("beep");
  };

  const addFifteenSeconds = () => {
    if (phase !== "break") return;
    if (breakEnd.current) breakEnd.current += 15000;
    setBreakTotal((t) => t + 15);
  };

  if (phase === "saving")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700 text-center">
        <h2 className="text-3xl font-bold mb-4 text-blue-600">
          Saving your session...
        </h2>
        <p className="text-gray-500">Please wait a moment.</p>
      </div>
    );

  if (phase === "finished")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-gray-800 p-8">
        <h1 className="text-5xl font-bold mb-6 text-blue-700">
          Workout Complete 🎉
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Congratulations! You’ve successfully completed your workout plan.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          Session saved at: {new Date().toLocaleTimeString()}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition"
        >
          Restart Workout
        </button>
      </div>
    );

  if (phase === "countdown")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 text-center">
        <h2 className="text-4xl font-semibold mb-4">Get Ready</h2>
        <h3 className="text-2xl text-gray-500 mb-8">
          {currentExercise.exercise_name}
        </h3>
        <div className="text-[8rem] font-bold text-blue-600 animate-pulse">
          {countdown}
        </div>
      </div>
    );

  if (phase === "inProgress")
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 text-center p-8">
        <h2 className="text-5xl font-bold mb-6 text-blue-700">
          {currentExercise.exercise_name}
        </h2>
        <p className="text-xl mb-2">Reps: {currentExercise.reps}</p>
        <p className="text-xl mb-8">Sets: {currentExercise.sets}</p>
        <button
          onClick={handleFinish}
          disabled={saveMutation.isPending}
          className="px-12 py-5 bg-green-600 text-white text-2xl rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          {saveMutation.isPending ? "Saving..." : "Finish"}
        </button>
        <p className="text-gray-500 mt-8 text-lg">
          Exercise {currentIndex + 1} / {exercises.length}
        </p>
      </div>
    );

  if (phase === "break") {
    const r = 70;
    const C = 2 * Math.PI * r;
    const progress = 1 - breakRemaining / breakTotal;
    const dashoffset = C * progress;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 text-center p-8">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">Rest Time ⏱️</h2>

        <div className="relative w-44 h-44 mb-8">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 160 160"
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          >
            <circle
              cx="80"
              cy="80"
              r={r}
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r={r}
              stroke="#3b82f6"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={C}
              strokeDashoffset={dashoffset}
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-blue-600">
            {Math.ceil(breakRemaining)}s
          </div>
        </div>

        <div className="flex gap-4 mb-12">
          <button
            onClick={addFifteenSeconds}
            className="px-6 py-3 bg-gray-300 rounded-xl text-lg font-medium hover:bg-gray-400 transition"
          >
            +15s
          </button>
          <button
            onClick={() => handleStartNextExercise(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transition"
          >
            Start Next
          </button>
        </div>

        {nextExercise && (
          <>
            <h3 className="text-5xl font-bold mb-6 text-blue-700">
              {nextExercise.exercise_name}
            </h3>
            <p className="text-xl text-gray-700 mb-2">
              Reps: {nextExercise.reps}
            </p>
            <p className="text-xl text-gray-700 mb-6">
              Sets: {nextExercise.sets}
            </p>
            {nextExercise.description && (
              <p className="text-gray-600 text-base max-w-2xl mb-8">
                {nextExercise.description}
              </p>
            )}
            <p className="text-gray-500 text-lg">
              Next Exercise {currentIndex + 2} / {exercises.length}
            </p>
          </>
        )}
      </div>
    );
  }

  // Detail (initial plan view)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 text-center p-8">
      <h1 className="text-4xl font-bold mb-3 text-blue-700">{plan.name}</h1>
      <p className="text-lg text-gray-600 mb-10 max-w-xl">{plan.description}</p>

      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Exercises</h2>
        <ul className="space-y-4 text-left">
          {plan.plan_exercises.map((ex: any, idx: number) => (
            <li
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3"
            >
              <div>
                <span className="text-lg font-semibold text-gray-800">
                  {idx + 1}. {ex.exercise_name}
                </span>
                <div className="text-gray-500 text-sm sm:text-base">
                  Reps: {ex.reps} &nbsp;•&nbsp; Sets: {ex.sets}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleStart}
        className="px-12 py-5 bg-blue-600 text-white text-2xl rounded-xl hover:bg-blue-700 transition"
      >
        Start Workout
      </button>

      <p className="text-gray-500 mt-10 text-lg">
        Total Exercises: {plan.plan_exercises.length}
      </p>
    </div>
  );
}
