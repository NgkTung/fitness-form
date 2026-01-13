interface Meal {
  name: string;
  calories: number;
}

interface Macros {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface Meals {
  breakfast: Meal;
  lunch: Meal;
  snack: Meal;
  dinner: Meal;
}

interface UserInfo {
  calculated_tdee: number;
  calculated_target_calories: number;
}

export interface MealPlan {
  name: string;
  goal_type: string;
  target_calories: number;
  macros: Macros;
  meals: Meals;
  user_info: UserInfo;
}

// Bảng dịch cho các bữa ăn
const mealLabels: Record<string, string> = {
  breakfast: "Bữa sáng",
  lunch: "Bữa trưa",
  snack: "Bữa phụ",
  dinner: "Bữa tối",
};

export default function NutritionCard({ plan }: { plan: MealPlan }) {
  return (
    <div className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-lg space-y-5">
      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
        <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
          {plan.goal_type === "build_muscle"
            ? "Tăng cơ"
            : plan.goal_type === "lose_weight"
            ? "Giảm cân"
            : "Duy trì"}
        </span>
      </div>

      <div>
        <h3 className="text-sm uppercase text-gray-500 mb-2">Mục tiêu</h3>
        <p className="text-lg font-semibold text-gray-900">
          {plan.target_calories.toLocaleString()} kcal/ngày
        </p>
        <div className="flex justify-between text-sm mt-2 text-gray-700">
          <span>Đạm: {plan.macros.protein_g}g</span>
          <span>Tinh bột: {plan.macros.carbs_g}g</span>
          <span>Béo: {plan.macros.fat_g}g</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm uppercase text-gray-500 mb-2">Các bữa ăn</h3>
        <div className="space-y-2">
          {Object.entries(plan.meals).map(([key, meal]) => (
            <div
              key={key}
              className="flex justify-between bg-white rounded-lg px-3 py-2 border border-gray-200 hover:bg-gray-100 transition"
            >
              <div>
                <p className="text-sm font-medium capitalize text-gray-900">
                  {mealLabels[key] || key}
                </p>
                <p className="text-xs text-gray-500">{meal.name}</p>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {meal.calories} kcal
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200 text-sm text-gray-600">
        <p>
          TDEE (Tổng năng lượng tiêu thụ): {plan.user_info.calculated_tdee} kcal
        </p>
        <p>
          Mục tiêu sau điều chỉnh: {plan.user_info.calculated_target_calories}{" "}
          kcal
        </p>
      </div>
    </div>
  );
}
