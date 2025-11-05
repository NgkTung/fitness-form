"use client";

import { useState } from "react";
import { useExercises } from "../../hooks/exercise/useExercise";
import Modal from "../common/Modal";

type MuscleGroup =
  | ""
  | "legs"
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "core"
  | "other";
type Difficulty = "" | "beginner" | "intermediate" | "advanced";
type Equipment = "" | "bodyweight" | "basic_gym" | "full_gym";

interface Filters {
  muscle_group: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  movement_pattern: "" | "squat" | "hinge" | "horizontal_push" | string;
}

const muscleGroups: MuscleGroup[] = [
  "",
  "legs",
  "chest",
  "back",
  "shoulders",
  "arms",
  "core",
  "other",
];
const difficulties: Difficulty[] = ["", "beginner", "intermediate", "advanced"];
const equipments: Equipment[] = ["", "bodyweight", "basic_gym", "full_gym"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePlanForm({ isOpen, onClose }: Props) {
  const defaultFilters: Filters = {
    muscle_group: "",
    equipment: "",
    difficulty: "",
    movement_pattern: "",
  };

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useExercises(filters);

  const handleFilterChange = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchTerm("");
  };

  const filteredExercises =
    data?.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="max-w-6xl w-full max-h-[80vh] overflow-y-auto bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-2xl space-y-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-5 justify-center mb-6 w-full">
          <div className="flex flex-col w-full sm:w-44">
            <label className="text-sm font-semibold mb-1 text-gray-700">
              Muscle Group
            </label>
            <select
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 shadow-sm hover:shadow-md transition"
              value={filters.muscle_group}
              onChange={(e) =>
                handleFilterChange(
                  "muscle_group",
                  e.target.value as MuscleGroup
                )
              }
            >
              {muscleGroups.map((m) => (
                <option key={m || "all"} value={m}>
                  {m ? m.charAt(0).toUpperCase() + m.slice(1) : "All"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-44">
            <label className="text-sm font-semibold mb-1 text-gray-700">
              Difficulty
            </label>
            <select
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 shadow-sm hover:shadow-md transition"
              value={filters.difficulty}
              onChange={(e) =>
                handleFilterChange("difficulty", e.target.value as Difficulty)
              }
            >
              {difficulties.map((d) => (
                <option key={d || "all"} value={d}>
                  {d ? d.charAt(0).toUpperCase() + d.slice(1) : "All"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-44">
            <label className="text-sm font-semibold mb-1 text-gray-700">
              Equipment
            </label>
            <select
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 shadow-sm hover:shadow-md transition"
              value={filters.equipment}
              onChange={(e) =>
                handleFilterChange("equipment", e.target.value as Equipment)
              }
            >
              {equipments.map((equi) => (
                <option key={equi || "all"} value={equi}>
                  {equi
                    ? equi
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")
                    : "All"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-64">
            <label className="text-sm font-semibold mb-1 text-gray-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Search exercise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 shadow-sm hover:shadow-md transition"
            />
          </div>

          <div className="flex flex-col justify-end w-full sm:w-auto">
            <button
              onClick={handleReset}
              className="mt-1 sm:mt-0 px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Exercise Cards */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading exercises...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load exercises.</p>
        ) : filteredExercises.length === 0 ? (
          <p className="text-center text-gray-500">No exercises found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow"
              >
                <div>
                  <h2 className="text-xl font-bold mb-2 text-blue-900">
                    {ex.name}
                  </h2>
                  <p className="text-gray-700 text-sm mb-3">{ex.description}</p>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>
                      Muscle Group:{" "}
                      {ex.muscle_group
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </p>
                    <p>
                      Difficulty Level:{" "}
                      {ex.difficulty.charAt(0).toUpperCase() +
                        ex.difficulty.slice(1)}
                    </p>
                    <p>
                      Equipment Type:{" "}
                      {ex.equipment
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </p>
                  </div>
                </div>

                {ex.video_url && (
                  <a
                    href={ex.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-blue-700 hover:text-blue-500 font-semibold"
                  >
                    ▶ Watch Tutorial
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
