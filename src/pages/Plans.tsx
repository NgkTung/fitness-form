import { useState } from "react";
import CreatePlanForm from "../components/Plan/CreatePlanForm";
import PlanCard from "../components/Plan/PlanCard";
import { useMyPlans } from "../hooks/plan/useMyPlans";
import { usePlanSuggestion } from "../hooks/plan/usePlanSuggestion";
import { Loader2 } from "lucide-react";

export default function Plans() {
  const { data: suggestionPlans, isLoading: suggestionPlansLoading } =
    usePlanSuggestion();
  const { data: myPlans, isLoading: myPlansLoading } = useMyPlans();

  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      <div className="flex max-w-[1400px] mx-auto min-h-screen flex-col px-4 sm:px-8 py-8 text-gray-900">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-900 drop-shadow-sm">
          💪 Exercise Plans
        </h1>
        <div className="mt-10 sm:mt-20">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-lg sm:text-2xl">
              Suggestion plans for you:
            </h2>
            <button
              onClick={() => setOpenForm(true)}
              className="text-white bg-blue-500 font-semibold text-lg py-2 px-6 rounded-lg cursor-pointer hover:bg-blue-600 transition ease-in-out"
            >
              Create your own plan
            </button>
          </div>
          {suggestionPlansLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">
                Suggesting plans based on your informations...
              </p>
            </div>
          ) : suggestionPlans ? (
            <div className="grid md:grid-cols-2 gap-2">
              <PlanCard
                name={suggestionPlans.name}
                description={suggestionPlans.description}
                plan_exercises={suggestionPlans.plan_exercises}
                save
              />
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-12">
              No suggestion plans.
            </p>
          )}
        </div>
        <div className="mt-10">
          <h2 className="font-bold text-lg sm:text-2xl mb-5">
            Your saved plans:
          </h2>
          {myPlansLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">Getting your saved plans...</p>
            </div>
          ) : myPlans?.length !== 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {myPlans?.map((plan) => (
                <PlanCard
                  name={plan.name}
                  description={plan.description}
                  plan_exercises={plan.plan_exercises}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-12">No saved plans.</p>
          )}
        </div>
      </div>

      <CreatePlanForm isOpen={openForm} onClose={() => setOpenForm(false)} />
    </>
  );
}
