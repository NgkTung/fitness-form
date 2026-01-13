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

// Bản dịch cho các giá trị hiển thị
const muscleGroupLabels: Record<string, string> = {
  "": "Tất cả",
  legs: "Chân",
  chest: "Ngực",
  back: "Lưng",
  shoulders: "Vai",
  arms: "Tay",
  core: "Cơ trọng tâm",
  other: "Khác",
};

const difficultyLabels: Record<string, string> = {
  "": "Tất cả",
  beginner: "Mới bắt đầu",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
};

const equipmentLabels: Record<string, string> = {
  "": "Tất cả",
  bodyweight: "Trọng lượng cơ thể",
  basic_gym: "Phòng tập cơ bản",
  full_gym: "Phòng tập đầy đủ",
};

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
          🏋️ Khám phá bài tập
        </h1>
        <button
          onClick={() => setOpenModal(true)}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
        >
          + Tạo bài tập mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-wrap sm:flex-row gap-5 justify-center mb-8 sm:mb-10">
        {/* Muscle Group */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Nhóm cơ:
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
                {muscleGroupLabels[m]}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Độ khó:
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
                {difficultyLabels[d]}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Thiết bị:
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
                {equipmentLabels[equi]}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Tìm kiếm:
          </label>
          <input
            type="text"
            placeholder="Tìm tên bài tập..."
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
            Đặt lại
          </button>
        </div>
      </div>

      {/* Exercise Cards */}
      {isLoading ? (
        <p className="text-center text-gray-500">
          Đang tải danh sách bài tập...
        </p>
      ) : error ? (
        <p className="text-center text-red-500">
          Không thể tải danh sách bài tập.
        </p>
      ) : filteredExercises.length === 0 ? (
        <p className="text-center text-gray-500">Không tìm thấy bài tập nào.</p>
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
                      Nhóm cơ:{" "}
                      {muscleGroupLabels[ex.muscle_group] || ex.muscle_group}
                    </p>
                    <p>
                      Độ khó: {difficultyLabels[ex.difficulty] || ex.difficulty}
                    </p>
                    <p>
                      Thiết bị: {equipmentLabels[ex.equipment] || ex.equipment}
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
                    ▶ Xem hướng dẫn
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Exercise Modal */}
      <Modal open={openModal}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 relative">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">
            Tạo bài tập mới
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
