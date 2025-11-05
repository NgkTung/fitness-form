import { Loader2 } from "lucide-react";
import { useSuggestMeal } from "../hooks/nutrition/useSuggestMeal";
import NutritionCard from "../components/Nutrition/NutritionCard";

const Nutritions = () => {
  const { data: suggestMeal, isLoading: suggestMealIsLoading } =
    useSuggestMeal();

  return (
    <div className="flex max-w-[1400px] mx-auto min-h-screen flex-col px-4 sm:px-8 py-8 text-gray-900">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-900 drop-shadow-sm">
        🍽️ Nutritions
      </h1>
      <div className="mt-10 sm:mt-20">
        <h2 className="font-bold text-lg sm:text-2xl mb-5">
          Suggestion nutrition for you:
        </h2>
        {suggestMealIsLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">
              Suggesting a nutritions based on your informations...
            </p>
          </div>
        ) : suggestMeal ? (
          <div className="grid md:grid-cols-2 gap-2">
            <NutritionCard plan={suggestMeal} />
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-12">
            No suggestion nutritions.
          </p>
        )}
      </div>
      <div className="mt-10">
        <h2 className="font-bold text-lg sm:text-2xl mb-5">
          Your saved plans:
        </h2>
      </div>
    </div>
  );
};

export default Nutritions;
