import { Loader2, PlusCircle, X } from "lucide-react";
import { useAddNutritionLog } from "../../hooks/nutrition/useAddNutritionLog";
import Modal from "../common/Modal";
import { useForm } from "react-hook-form";
import type { MealLog } from "../../types/nutrition.type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddNutritionForm({ isOpen, onClose }: Props) {
  const addMutation = useAddNutritionLog();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MealLog>({
    defaultValues: {
      food_name: "",
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
    },
  });

  const onSubmit = async (data: MealLog) => {
    await addMutation.mutateAsync(data);
    reset();
    if (onClose) onClose();
  };

  return (
    <Modal open={isOpen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4 relative"
      >
        <X
          onClick={onClose}
          className="absolute top-5 right-5 cursor-pointer"
        />
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          Thêm nhật ký dinh dưỡng
        </h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tên thực phẩm
          </label>
          <input
            {...register("food_name", {
              required: "Vui lòng nhập tên thực phẩm",
              minLength: {
                value: 2,
                message: "Tên phải có ít nhất 2 ký tự",
              },
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Ví dụ: Ức gà"
          />
          {errors.food_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.food_name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Năng lượng (kcal)
            </label>
            <input
              type="number"
              step="any"
              {...register("calories", {
                required: "Vui lòng nhập calo",
                valueAsNumber: true,
                min: { value: 1, message: "Calo phải lớn hơn 0" },
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="450"
            />
            {errors.calories && (
              <p className="text-red-500 text-sm mt-1">
                {errors.calories.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Đạm/Protein (g)
            </label>
            <input
              type="number"
              step="any"
              {...register("protein_g", {
                required: "Vui lòng nhập protein",
                valueAsNumber: true,
                min: { value: 0, message: "Protein không thể âm" },
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="35.5"
            />
            {errors.protein_g && (
              <p className="text-red-500 text-sm mt-1">
                {errors.protein_g.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tinh bột/Carbs (g)
            </label>
            <input
              type="number"
              step="any"
              {...register("carbs_g", {
                required: "Vui lòng nhập carbs",
                valueAsNumber: true,
                min: { value: 0, message: "Carbs không thể âm" },
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="50.0"
            />
            {errors.carbs_g && (
              <p className="text-red-500 text-sm mt-1">
                {errors.carbs_g.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Chất béo/Fat (g)
            </label>
            <input
              type="number"
              step="any"
              {...register("fat_g", {
                required: "Vui lòng nhập chất béo",
                valueAsNumber: true,
                min: { value: 0, message: "Chất béo không thể âm" },
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="10.2"
            />
            {errors.fat_g && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fat_g.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={addMutation.isPending}
          className={`w-full flex justify-center items-center gap-2 mt-4 py-2 rounded-lg font-semibold text-white transition ${
            addMutation.isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {addMutation.isPending ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Đang lưu...
            </>
          ) : (
            <>
              <PlusCircle size={18} /> Thêm nhật ký
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
