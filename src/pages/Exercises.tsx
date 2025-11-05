"use client";

import { useState } from "react";
import { useExercises } from "../hooks/exercise/useExercise";
import Modal from "../components/common/Modal";
import CreateExerciseForm from "../components/Exercise/CreateExerciseForm";

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
  muscle_group:
    | ""
    | "legs"
    | "chest"
    | "back"
    | "shoulders"
    | "arms"
    | "core"
    | "other";
  equipment: "" | "bodyweight" | "basic_gym" | "full_gym";
  difficulty: "" | "beginner" | "intermediate" | "advanced";
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

export default function Exercises() {
  const defaultFilters: Filters = {
    muscle_group: "",
    equipment: "",
    difficulty: "",
    movement_pattern: "",
  };

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);

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
    <div className="flex min-h-screen flex-col bg-linear-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-8 py-8 text-gray-900">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 max-w-[1200px] mx-auto w-full space-y-5">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-900 drop-shadow-sm">
          🏋️ Exercise Explorer
        </h1>
        <button
          onClick={() => setOpenModal(true)}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
        >
          + Create Exercise
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-wrap sm:flex-row gap-5 justify-center mb-8 sm:mb-10">
        {/* Muscle Group */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Muscle Group:
          </label>
          <select
            className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 shadow-sm hover:shadow-md transition w-full sm:w-44"
            value={filters.muscle_group}
            onChange={(e) =>
              handleFilterChange("muscle_group", e.target.value as MuscleGroup)
            }
          >
            {muscleGroups.map((m) => (
              <option key={m || "all"} value={m}>
                {m ? m.charAt(0).toUpperCase() + m.slice(1) : "All"}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Difficulty:
          </label>
          <select
            className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 shadow-sm hover:shadow-md transition w-full sm:w-44"
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

        {/* Equipment */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Equipment:
          </label>
          <select
            className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 shadow-sm hover:shadow-md transition w-full sm:w-44"
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

        {/* Search */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Search:
          </label>
          <input
            type="text"
            placeholder="Search exercise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 shadow-sm hover:shadow-md transition w-full sm:w-64"
          />
        </div>

        {/* Reset Button */}
        <div className="flex flex-col justify-end w-full sm:w-auto">
          <button
            onClick={handleReset}
            className="mt-1 sm:mt-0 px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
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
        <div className="w-full max-w-[1200px] mx-auto">
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
        </div>
      )}

      {/* Create Exercise Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 relative">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">
            Create Exercise
          </h2>
          <CreateExerciseForm onSuccess={() => setOpenModal(false)} />
          <button
            onClick={() => setOpenModal(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>
      </Modal>
    </div>
  );
}
