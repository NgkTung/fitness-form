import { useState } from "react";
import { PlusCircle, Trash2, Dumbbell, Save, Loader2 } from "lucide-react";
import { useExercises } from "../hooks/exercise/useExercise";
import Alert from "../components/common/Alert";
import { useSavePlan } from "../hooks/plan/useSavePlan";

type PlanExercise = {
  exercise_id: number;
  sets: number;
  reps: string;
  description: string;
  video_url: string;
};

export default function CreatePlan() {
  const { data: exercises = [], isLoading } = useExercises({
    muscle_group: "",
    equipment: "",
    difficulty: "",
    movement_pattern: "",
  });

  const saveMutation = useSavePlan();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [planExercises, setPlanExercises] = useState<PlanExercise[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "warning" | "error" | "primary"
  >("primary");

  const addExercise = () => {
    if (!exercises || exercises.length === 0) return;
    const ex = exercises[0];
    setPlanExercises((prev) => [
      ...prev,
      {
        exercise_id: ex.id,
        sets: 3,
        reps: "10",
        description: ex.description || "",
        video_url: ex.video_url || "",
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setPlanExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (
    index: number,
    key: keyof PlanExercise,
    value: any
  ) => {
    setPlanExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [key]: value } : ex))
    );
  };

  const handleSave = async () => {
    if (!name.trim() || planExercises.length === 0) {
      setMessage("⚠️ Vui lòng nhập tên kế hoạch và thêm ít nhất một bài tập.");
      setMessageType("warning");
      return;
    }

    const data = {
      name,
      description,
      plan_exercises: planExercises,
    };

    try {
      await saveMutation.mutateAsync(data);
      setMessage("✅ Kế hoạch đã được lưu thành công!");
      setMessageType("success");
      setName("");
      setDescription("");
      setPlanExercises([]);
    } catch (error: any) {
      console.error("❌ Lưu kế hoạch thất bại:", error);
      setMessage("❌ Không thể lưu kế hoạch. Vui lòng thử lại.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-900 flex items-center gap-2 mb-6">
          <Dumbbell className="text-blue-600" /> Tạo kế hoạch của bạn
        </h1>

        {message && (
          <div className="mb-6">
            <Alert type={messageType} text={message} />
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tên kế hoạch
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="ví dụ: Tăng cơ bắp"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Mô tả ngắn gọn về kế hoạch của bạn..."
            />
          </div>

          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xl text-blue-800">Bài tập</h2>
            <button
              onClick={addExercise}
              disabled={isLoading || !exercises?.length}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                isLoading || !exercises?.length
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Đang tải...
                </>
              ) : (
                <>
                  <PlusCircle size={18} /> Thêm bài tập
                </>
              )}
            </button>
          </div>

          {planExercises.length === 0 && (
            <p className="text-gray-500 text-sm">
              Chưa có bài tập nào được thêm.
            </p>
          )}

          {planExercises.map((ex, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-blue-50/50 rounded-xl p-4 flex flex-col gap-4"
            >
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col flex-1 min-w-[150px]">
                  <label className="text-sm font-semibold text-gray-700">
                    Bài tập
                  </label>
                  <select
                    value={ex.exercise_id}
                    onChange={(e) => {
                      const selected = exercises.find(
                        (x) => x.id === Number(e.target.value)
                      );
                      updateExercise(
                        index,
                        "exercise_id",
                        Number(e.target.value)
                      );
                      updateExercise(
                        index,
                        "description",
                        selected?.description || ""
                      );
                      updateExercise(
                        index,
                        "video_url",
                        selected?.video_url || ""
                      );
                    }}
                    disabled={isLoading}
                    className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
                  >
                    {isLoading ? (
                      <option>Đang tải...</option>
                    ) : (
                      exercises?.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.muscle_group})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="flex flex-col w-24">
                  <label className="text-sm font-semibold text-gray-700">
                    Số hiệp
                  </label>
                  <input
                    type="number"
                    value={ex.sets}
                    onChange={(e) =>
                      updateExercise(index, "sets", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col w-28">
                  <label className="text-sm font-semibold text-gray-700">
                    Số lần (Reps)
                  </label>
                  <input
                    value={ex.reps}
                    onChange={(e) =>
                      updateExercise(index, "reps", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => removeExercise(index)}
                  className="text-red-600 hover:text-red-700 p-2 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {planExercises.length > 0 && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition ${
                  saveMutation.isPending
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Lưu kế hoạch
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {planExercises.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">
              Xem trước kế hoạch
            </h2>
            <div className="bg-white border border-gray-200 rounded-2xl shadow p-5">
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                {planExercises.map((e, i) => {
                  const ex = exercises.find((x) => x.id === e.exercise_id);
                  return (
                    <li key={i}>
                      {ex?.name ?? "Bài tập không xác định"} — {e.sets} hiệp ×{" "}
                      {e.reps} lần
                      <br />
                      <span className="text-gray-500">{e.description}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
