"use client";

import { useState } from "react";
import { useExercises } from "../../hooks/exercise/useExercise";
import Modal from "../common/Modal";
import { X } from "lucide-react";

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

// Bảng dịch cho các giá trị hiển thị
const muscleLabels: Record<string, string> = {
  "": "Tất cả",
  legs: "Chân",
  chest: "Ngực",
  back: "Lưng",
  shoulders: "Vai",
  arms: "Tay",
  core: "Cơ bụng/lõi",
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
    <Modal open={isOpen}>
      <div className="max-w-6xl w-full max-h-[80vh] overflow-y-auto bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-2xl space-y-8 relative">
        <X
          onClick={onClose}
          className="absolute top-5 right-5 cursor-pointer"
        />
        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-5 justify-center mb-6 w-full">
          <div className="flex flex-col w-full sm:w-44">
            <label className="text-sm font-semibold mb-1 text-gray-700">
              Nhóm cơ
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
                  {muscleLabels[m]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-44">
            <label className="text-sm font-semibold mb-1 text-gray-700">
              Độ khó
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
                  {difficultyLabels[d]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-44">
            <label className="text-sm font-semibold mb-1 text-gray-700">
              Thiết bị
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
                  {equipmentLabels[equi]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full sm:w-64">
            <label className="text-sm font-semibold mb-1 text-gray-700">
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
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
              Đặt lại
            </button>
          </div>
        </div>

        {/* Danh sách bài tập */}
        {isLoading ? (
          <p className="text-center text-gray-500">
            Đang tải danh sách bài tập...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">
            Không thể tải danh sách bài tập.
          </p>
        ) : filteredExercises.length === 0 ? (
          <p className="text-center text-gray-500">
            Không tìm thấy bài tập nào.
          </p>
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
                      Nhóm cơ:{" "}
                      {muscleLabels[ex.muscle_group] || ex.muscle_group}
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
        )}
      </div>
    </Modal>
  );
}
