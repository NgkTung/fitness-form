import { Loader2, PlusCircle } from "lucide-react";
import { useSuggestMeal } from "../hooks/nutrition/useSuggestMeal";
import NutritionCard from "../components/Nutrition/NutritionCard";
import { useNutritionLogs } from "../hooks/nutrition/useNutritionLogs";
import { useHydrationLogs } from "../hooks/nutrition/useHydrationLogs";
import AddNutritionForm from "../components/Nutrition/AddNutritionForm";
import AddHydrationForm from "../components/Nutrition/AddHydrationForm";
import { useState } from "react";

const Nutritions = () => {
  const { data: suggestMeal, isLoading: suggestMealIsLoading } =
    useSuggestMeal();
  const { data: nutritionLog = [], isLoading: nutLogIsLoading } =
    useNutritionLogs();
  const { data: hydrationLog = [], isLoading: hydLogIsLoading } =
    useHydrationLogs();

  const [openAddNut, setOpenAddNut] = useState(false);
  const [openAddHyd, setOpenAddHyd] = useState(false);

  return (
    <>
      <AddNutritionForm
        isOpen={openAddNut}
        onClose={() => setOpenAddNut(false)}
      />
      <AddHydrationForm
        isOpen={openAddHyd}
        onClose={() => setOpenAddHyd(false)}
      />

      <div className="flex max-w-[1400px] mx-auto min-h-screen flex-col px-4 sm:px-8 py-8 text-gray-900">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-900 drop-shadow-sm">
          🍽️ Dinh dưỡng
        </h1>

        {/* Suggest Meal */}
        <div className="mt-10 sm:mt-20">
          <h2 className="font-bold text-lg sm:text-2xl mb-5">
            Gợi ý dinh dưỡng dành cho bạn:
          </h2>
          {suggestMealIsLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">
                Đang đề xuất thực đơn dựa trên thông tin của bạn...
              </p>
            </div>
          ) : suggestMeal ? (
            <div className="grid md:grid-cols-2 gap-2">
              <NutritionCard plan={suggestMeal} />
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-12">
              Hiện chưa có gợi ý nào.
            </p>
          )}
        </div>

        {/* Nutrition Logs */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-lg sm:text-2xl">
              Nhật ký ăn uống của bạn:
            </h2>
            <button
              onClick={() => setOpenAddNut(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              <PlusCircle size={18} /> Thêm nhật ký
            </button>
          </div>

          {nutLogIsLoading ? (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang tải nhật ký dinh dưỡng...</span>
            </div>
          ) : nutritionLog.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Chưa có nhật ký ăn uống nào.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nutritionLog.map((log) => (
                <div
                  key={log.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
                >
                  <h3 className="font-semibold text-blue-800">
                    {log.food_name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(log.log_date).toLocaleString()}
                  </p>
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <p>Năng lượng: {log.calories} kcal</p>
                    <p>Đạm (Protein): {log.protein_g} g</p>
                    <p>Tinh bột (Carbs): {log.carbs_g} g</p>
                    <p>Chất béo (Fat): {log.fat_g} g</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hydration Logs */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-lg sm:text-2xl">
              Nhật ký uống nước:
            </h2>
            <button
              onClick={() => setOpenAddHyd(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              <PlusCircle size={18} /> Thêm nhật ký
            </button>
          </div>

          {hydLogIsLoading ? (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang tải nhật ký uống nước...</span>
            </div>
          ) : hydrationLog.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Chưa có nhật ký uống nước nào.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hydrationLog.map((log) => (
                <div
                  key={log.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
                >
                  <h3 className="font-semibold text-blue-800">💧 Nước uống</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(log.log_time).toLocaleString()}
                  </p>
                  <p className="mt-2 text-gray-700 text-sm">
                    Lượng nước: {log.water_ml} ml
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Nutritions;
