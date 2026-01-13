import { Loader2, PlusCircle, X } from "lucide-react";
import { useAddHydrationLog } from "../../hooks/nutrition/useAddHydrationLog";
import Modal from "../common/Modal";
import { useForm } from "react-hook-form";
import type { HydrationLog } from "../../types/nutrition.type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddHydrationForm({ isOpen, onClose }: Props) {
  const addMutation = useAddHydrationLog();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HydrationLog>({
    defaultValues: {
      water_ml: 0,
    },
  });

  const onSubmit = async (data: HydrationLog) => {
    await addMutation.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Modal open={isOpen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4 relative"
      >
        <X
          onClick={onClose}
          className="absolute top-5 right-5 cursor-pointer text-gray-600 hover:text-gray-800"
        />
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          Thêm lịch sử uống nước
        </h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Lượng nước (ml)
          </label>
          <input
            type="number"
            step="any"
            {...register("water_ml", {
              required: "Lượng nước là bắt buộc",
              valueAsNumber: true,
              min: { value: 1, message: "Lượng nước phải lớn hơn 0" },
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="e.g. 250"
          />
          {errors.water_ml && (
            <p className="text-red-500 text-sm mt-1">
              {errors.water_ml.message}
            </p>
          )}
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
              <PlusCircle size={18} /> Thêm lịch sử
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
