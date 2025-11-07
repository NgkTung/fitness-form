import { useState } from "react";
import { Dumbbell, X } from "lucide-react";
import Modal from "../common/Modal";
import Alert from "../common/Alert";
import type { PlanExercise } from "../../types/plan.type";
import { useSavePlan } from "../../hooks/plan/useSavePlan";
import { Link } from "react-router-dom";

interface Props {
  name: string;
  description: string;
  plan_exercises: PlanExercise[];
  planId?: number;
  save?: boolean;
}

export default function PlanCard({
  name,
  description,
  plan_exercises,
  planId,
  save = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const saveMutation = useSavePlan();

  const days = Array.from(
    new Set(plan_exercises.map((ex) => ex.day_number))
  ).sort((a, b) => a - b);

  const handleSavePlan = () => {
    saveMutation.mutate(
      {
        name,
        description,
        plan_exercises,
        schedule: null,
      },
      {
        onSuccess: () => {
          setAlert({ type: "success", text: "Plan saved successfully!" });
          setTimeout(() => setAlert(null), 4000);
        },
        onError: () => {
          setAlert({ type: "error", text: "Failed to save plan." });
          setTimeout(() => setAlert(null), 4000);
        },
      }
    );
  };

  return (
    <>
      {alert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md animate-fade-in">
          <Alert type={alert.type} text={alert.text} />
        </div>
      )}

      <div className="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md p-5 transition flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Dumbbell className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
              <p className="text-gray-500 text-sm">{description}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-xl hover:bg-blue-600 transition"
            >
              View Details
            </button>

            {save && (
              <button
                onClick={handleSavePlan}
                disabled={saveMutation.isPending}
                className={`text-sm font-medium py-2 px-4 rounded-xl transition ${
                  saveMutation.isPending
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {saveMutation.isPending ? "Saving..." : "Save Plan"}
              </button>
            )}
          </div>

          <Link to={`/start-workout/${planId}`}>
            <button className="bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-xl hover:bg-indigo-600 transition">
              Start Workout
            </button>
          </Link>
        </div>
      </div>

      <Modal open={open}>
        <div className="max-h-[80vh] overflow-y-auto bg-white p-10 rounded-lg relative">
          <X
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 cursor-pointer"
          />
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-100 p-3 rounded-full">
              <Dumbbell className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
              <p className="text-gray-500 text-sm">{description}</p>
            </div>
          </div>

          <div className="space-y-6">
            {days.map((day) => {
              const exercises = plan_exercises.filter(
                (ex) => ex.day_number === day
              );
              return (
                <div
                  key={day}
                  className="bg-blue-50 border border-blue-100 rounded-xl p-4"
                >
                  <h3 className="text-md font-semibold text-blue-600 mb-3">
                    Day {day}
                  </h3>
                  <ul className="space-y-2">
                    {exercises.map((ex) => (
                      <li
                        key={ex.exercise_id}
                        className="flex justify-between items-center border-b border-blue-100/80 pb-2"
                      >
                        <span className="font-medium">{ex.exercise_name}</span>
                        <span className="text-sm text-gray-500">
                          {ex.sets} sets × {ex.reps} reps
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
