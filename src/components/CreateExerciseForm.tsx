"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { CreateExerciseDto } from "../types/exercise.type";
import { useCreateExercise } from "../hooks/exercise/useCreateExercise";

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
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Exercise Name *
        </label>
        <input
          type="text"
          {...register("name", { required: "Exercise name is required" })}
          placeholder="Enter exercise name"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Enter detailed description"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none min-h-[100px]"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Video URL
        </label>
        <input
          type="url"
          {...register("video_url", {
            pattern: { value: /^https?:\/\/.+/, message: "Invalid URL format" },
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

      {/* Grid fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Muscle Group */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Muscle Group *
          </label>
          <select
            {...register("muscle_group", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            {[
              "legs",
              "chest",
              "back",
              "shoulders",
              "arms",
              "core",
              "other",
            ].map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Difficulty *
          </label>
          <select
            {...register("difficulty", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            {["beginner", "intermediate", "advanced"].map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Equipment *
          </label>
          <select
            {...register("equipment", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            {["bodyweight", "basic_gym", "full_gym"].map((e) => (
              <option key={e} value={e}>
                {e
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        {/* Movement Pattern */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Movement Pattern *
          </label>
          <select
            {...register("movement_pattern", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          >
            {[
              "squat",
              "hinge",
              "horizontal_push",
              "vertical_pull",
              "vertical_push",
              "carry",
              "rotation",
              "other",
            ].map((m) => (
              <option key={m} value={m}>
                {m
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
      >
        {createMutation.isPending ? "Saving..." : "Save Exercise"}
      </button>
    </form>
  );
}
