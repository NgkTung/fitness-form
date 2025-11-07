import { useState, useEffect } from "react";
import { usePlanDetail } from "../hooks/plan/usePlanDetail";
import { useSaveSession } from "../hooks/session/useSaveSession";
import { useParams } from "react-router-dom";

// 🧩 Define type for a single exercise log
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
    "detail" | "countdown" | "inProgress" | "saving" | "finished"
  >("detail");
  const [countdown, setCountdown] = useState(3);
  const [startTime, setStartTime] = useState<string | null>(null);

  // ✅ Type your logs properly
  const [logs, setLogs] = useState<ExerciseLog[]>([]);

  const playSound = (name: string) => {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.play().catch(() => {});
  };

  useEffect(() => {
    let timer: number;
    if (phase === "countdown" && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown((prev) => prev - 1);
        playSound("beep");
      }, 1000);
    } else if (phase === "countdown" && countdown === 0) {
      setPhase("inProgress");
    }
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-500 text-xl">
        Loading your workout...
      </div>
    );
  }

  if (!plan || !plan.plan_exercises?.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-red-500 text-lg">
        No exercises found for this plan.
      </div>
    );
  }

  const exercises = plan.plan_exercises;
  const currentExercise = exercises[currentIndex];

  const handleStart = () => {
    if (!startTime) setStartTime(new Date().toISOString());
    setCountdown(3);
    setPhase("countdown");
  };

  const handleFinish = async () => {
    const newLog: ExerciseLog = {
      exercise_name: currentExercise.exercise_name,
      sets_completed: currentExercise.sets,
      reps_completed: currentExercise.reps,
    };

    setLogs((prev) => [...prev, newLog]);

    if (currentIndex < exercises.length - 1) {
      playSound("success");
      setCurrentIndex((prev) => prev + 1);
      setCountdown(3);
      setPhase("detail");
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
      } catch (err) {
        console.error("Failed to save session:", err);
        alert("Failed to save session. Please try again.");
        setPhase("finished");
      }
    }
  };

  if (phase === "saving") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-700 text-center">
        <h2 className="text-3xl font-bold mb-4 text-blue-600">
          Saving your session...
        </h2>
        <p className="text-gray-500">Please wait a moment.</p>
      </div>
    );
  }

  if (phase === "finished") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-center text-gray-800 p-8">
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
  }

  if (phase === "countdown") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-200 text-gray-800 text-center">
        <h2 className="text-4xl font-semibold mb-8">Get Ready</h2>
        <div className="text-[8rem] font-bold text-blue-600 animate-pulse">
          {countdown}
        </div>
      </div>
    );
  }

  if (phase === "inProgress") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 text-center p-8">
        <h2 className="text-5xl font-bold mb-6 text-blue-700">
          {currentExercise.exercise_name}
        </h2>
        <p className="text-xl text-gray-700 mb-6">
          Reps: {currentExercise.reps}
        </p>
        <p className="text-xl text-gray-700 mb-12">
          Sets: {currentExercise.sets}
        </p>
        <button
          onClick={handleFinish}
          disabled={saveMutation.isPending}
          className="px-12 py-5 bg-green-600 text-white text-2xl rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          {saveMutation.isPending ? "Saving..." : "Finish"}
        </button>
        <p className="text-gray-500 mt-12 text-lg">
          Exercise {currentIndex + 1} / {exercises.length}
        </p>
      </div>
    );
  }

  // detail phase
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 text-center p-8">
      <h1 className="text-3xl font-bold mb-3">{plan.name}</h1>
      <p className="text-gray-600 mb-10">{plan.description}</p>
      <h2 className="text-5xl font-bold mb-6 text-blue-700">
        {currentExercise.exercise_name}
      </h2>
      <p className="text-xl text-gray-700 mb-4">Reps: {currentExercise.reps}</p>
      <p className="text-xl text-gray-700 mb-10">
        Sets: {currentExercise.sets}
      </p>
      <button
        onClick={handleStart}
        className="px-12 py-5 bg-blue-600 text-white text-2xl rounded-xl hover:bg-blue-700 transition"
      >
        Start
      </button>
      <p className="text-gray-500 mt-12 text-lg">
        Exercise {currentIndex + 1} / {exercises.length}
      </p>
    </div>
  );
}
