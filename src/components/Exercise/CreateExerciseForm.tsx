"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { CreateExerciseDto } from "../../types/exercise.type";
import { useCreateExercise } from "../../hooks/exercise/useCreateExercise";

interface CreateExerciseFormProps {
  onSuccess: () => void;
}

export default function CreateExerciseForm({
  onSuccess,
}: CreateExerciseFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateExerciseDto>({
    defaultValues: {
      name: "",
      description: "",
      video_url: "",
      muscle_group: "legs",
      difficulty: "beginner",
      equipment: "bodyweight",
      movement_pattern: "squat",
    },
  });

  const createMutation = useCreateExercise();

  const onSubmit = (data: CreateExerciseDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    });
  };

  useEffect(() => {
    if (createMutation.isSuccess) reset();
  }, [createMutation.isSuccess, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Tên bài tập */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Tên bài tập *
        </label>
        <input
          type="text"
          {...register("name", { required: "Vui lòng nhập tên bài tập" })}
          placeholder="Nhập tên bài tập"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Mô tả *
        </label>
        <textarea
          {...register("description", { required: "Vui lòng nhập mô tả" })}
          placeholder="Nhập mô tả chi tiết"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none min-h-[100px]"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Đường dẫn Video */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Đường dẫn Video (URL)
        </label>
        <input
          type="url"
          {...register("video_url", {
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Định dạng URL không hợp lệ",
            },
          })}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
        />
        {errors.video_url && (
          <p className="text-sm text-red-600 mt-1">
            {errors.video_url.message}
          </p>
        )}
      </div>

      {/* Các trường dạng lưới */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nhóm cơ */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nhóm cơ *
          </label>
          <select
            {...register("muscle_group", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            {[
              { val: "legs", label: "Chân" },
              { val: "chest", label: "Ngực" },
              { val: "back", label: "Lưng" },
              { val: "shoulders", label: "Vai" },
              { val: "arms", label: "Tay" },
              { val: "core", label: "Cơ bụng/lõi" },
              { val: "other", label: "Khác" },
            ].map((m) => (
              <option key={m.val} value={m.val}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Độ khó */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Độ khó *
          </label>
          <select
            {...register("difficulty", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            {[
              { val: "beginner", label: "Mới bắt đầu" },
              { val: "intermediate", label: "Trung cấp" },
              { val: "advanced", label: "Nâng cao" },
            ].map((d) => (
              <option key={d.val} value={d.val}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Thiết bị */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Thiết bị *
          </label>
          <select
            {...register("equipment", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            {[
              { val: "bodyweight", label: "Trọng lượng cơ thể" },
              { val: "basic_gym", label: "Phòng tập cơ bản" },
              { val: "full_gym", label: "Phòng tập đầy đủ" },
            ].map((e) => (
              <option key={e.val} value={e.val}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dạng chuyển động */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Dạng chuyển động *
          </label>
          <select
            {...register("movement_pattern", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            {[
              { val: "squat", label: "Squat (Ngồi xổm)" },
              { val: "hinge", label: "Hinge (Gập hông)" },
              { val: "horizontal_push", label: "Đẩy ngang" },
              { val: "vertical_pull", label: "Kéo dọc" },
              { val: "vertical_push", label: "Đẩy dọc" },
              { val: "carry", label: "Mang vác" },
              { val: "rotation", label: "Xoay người" },
              { val: "other", label: "Khác" },
            ].map((m) => (
              <option key={m.val} value={m.val}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nút Gửi */}
      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
      >
        {createMutation.isPending ? "Đang lưu..." : "Lưu bài tập"}
      </button>
    </form>
  );
}
