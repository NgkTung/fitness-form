import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface FormData {
  gender: string;
  height: string;
  weight: string;
  pushups: string;
  place: string;
  goal: string;
}

interface Step {
  id: number;
  key: keyof FormData | "welcome" | "finish";
  question: string;
}

const steps: Step[] = [
  { id: 0, key: "welcome", question: "Welcome to FitJourney! 🏋️‍♂️" },
  { id: 1, key: "gender", question: "What's your gender?" },
  { id: 2, key: "height", question: "How tall are you? (cm)" },
  { id: 3, key: "weight", question: "What’s your current weight? (kg)" },
  {
    id: 4,
    key: "pushups",
    question: "How many push-ups can you do in one round?",
  },
  { id: 5, key: "place", question: "Where do you usually work out?" },
  { id: 6, key: "goal", question: "What’s your fitness goal?" },
  { id: 7, key: "finish", question: "Thank you for your information! 🎉" },
];

export default function FitnessOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    gender: "",
    height: "",
    weight: "",
    pushups: "",
    place: "",
    goal: "",
  });
  const [error, setError] = useState<string>("");

  // Auto redirect if info exists
  useEffect(() => {
    const stored = localStorage.getItem("fitnessUserData");
    if (stored) navigate("/dashboard");
  }, [navigate]);

  const progress =
    step === 0
      ? 0
      : step === steps.length - 1
      ? 100
      : (step / (steps.length - 2)) * 100;

  const validateStep = (): boolean => {
    setError("");
    const { height, weight } = formData;

    if (step === 2) {
      const h = Number(height);
      if (!h || h < 100 || h > 250) {
        setError("Please enter a realistic height between 100 cm and 250 cm.");
        return false;
      }
    }

    if (step === 3) {
      const w = Number(weight);
      if (!w || w < 30 || w > 250) {
        setError("Please enter a realistic weight between 30 kg and 250 kg.");
        return false;
      }
    }

    return true;
  };

  const nextStep = (): void => {
    if (step > 0 && step < steps.length - 1 && !validateStep()) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = (): void => setStep((prev) => Math.max(prev - 1, 0));

  const handleChange = (key: keyof FormData, value: string): void => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = (): void => {
    if (!validateStep()) return;
    localStorage.setItem("fitnessUserData", JSON.stringify(formData));
    setStep(7);
    setTimeout(() => navigate("/dashboard"), 3000); // 3-second delay
  };

  return (
    <div className="flex flex-col justify-between min-h-screen w-full bg-linear-to-b from-blue-950 to-blue-800 text-white p-8">
      <div className="w-full">
        {step > 0 && step < steps.length - 1 && (
          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-12">
            <motion.div
              className="h-3 bg-linear-to-r from-cyan-400 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center h-[60vh]"
          >
            {/* Welcome */}
            {step === 0 && (
              <div>
                <h1 className="text-5xl font-extrabold mb-8">
                  {steps[step].question}
                </h1>
                <p className="text-2xl max-w-3xl leading-relaxed mx-auto">
                  Before we get started, we just need a few quick details from
                  you so we can personalize your training experience. 💪
                </p>
              </div>
            )}

            {/* Gender */}
            {step === 1 && (
              <>
                <h2 className="text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <div className="flex flex-wrap justify-center gap-8 w-full">
                  {[
                    { label: "Male", icon: "♂️" },
                    { label: "Female", icon: "♀️" },
                    { label: "Other", icon: "⚧️" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleChange("gender", item.label)}
                      className={`flex items-center justify-center gap-4 px-12 py-6 text-2xl rounded-3xl border transition-all ${
                        formData.gender === item.label
                          ? "bg-white text-blue-900 font-bold"
                          : "border-white/40 hover:bg-white/20"
                      }`}
                    >
                      <span className="text-4xl">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Height */}
            {step === 2 && (
              <div className="flex flex-col items-center w-full">
                <h2 className="text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                  className="w-full max-w-2xl py-6 text-5xl text-center text-blue-900 rounded-3xl bg-white outline-none"
                  placeholder="Enter your height"
                />
                {error && <p className="text-red-400 mt-4 text-lg">{error}</p>}
              </div>
            )}

            {/* Weight */}
            {step === 3 && (
              <div className="flex flex-col items-center w-full">
                <h2 className="text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  className="w-full max-w-2xl py-6 text-5xl text-center text-blue-900 rounded-3xl bg-white outline-none"
                  placeholder="Enter your weight"
                />
                {error && <p className="text-red-400 mt-4 text-lg">{error}</p>}
              </div>
            )}

            {/* Push-ups */}
            {step === 4 && (
              <>
                <h2 className="text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <div className="flex flex-wrap justify-center gap-6 w-full">
                  {["<10", "10-20", "20-40", "40+"].map((range) => (
                    <button
                      key={range}
                      onClick={() => handleChange("pushups", range)}
                      className={`flex items-center justify-center gap-3 px-10 py-6 text-2xl rounded-3xl border transition-all ${
                        formData.pushups === range
                          ? "bg-white text-blue-900 font-bold"
                          : "border-white/40 hover:bg-white/20"
                      }`}
                    >
                      <span className="text-3xl">💪</span>
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Place */}
            {step === 5 && (
              <>
                <h2 className="text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <div className="flex flex-wrap justify-center gap-8 w-full">
                  {[
                    { label: "Home", icon: "🏠" },
                    { label: "Gym", icon: "🏋️" },
                    { label: "Outdoor", icon: "⛰️" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleChange("place", item.label)}
                      className={`flex flex-col items-center justify-center gap-4 w-40 h-40 rounded-3xl border text-2xl transition-all ${
                        formData.place === item.label
                          ? "bg-white text-blue-900 font-bold"
                          : "border-white/40 hover:bg-white/20"
                      }`}
                    >
                      <span className="text-5xl">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Goal */}
            {step === 6 && (
              <>
                <h2 className="text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <div className="flex flex-col gap-6 w-full max-w-2xl">
                  {[
                    { label: "Lose weight", icon: "🔥" },
                    { label: "Gain muscle", icon: "💪" },
                    { label: "Maintain", icon: "⚖️" },
                  ].map((goal) => (
                    <button
                      key={goal.label}
                      onClick={() => handleChange("goal", goal.label)}
                      className={`w-full flex items-center justify-center gap-4 py-6 text-2xl rounded-3xl border transition-all ${
                        formData.goal === goal.label
                          ? "bg-white text-blue-900 font-bold"
                          : "border-white/40 hover:bg-white/20"
                      }`}
                    >
                      <span className="text-3xl">{goal.icon}</span>
                      {goal.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Finish */}
            {step === 7 && (
              <div className="text-center">
                <h2 className="text-5xl font-extrabold mb-8">
                  {steps[step].question}
                </h2>
                <p className="text-2xl max-w-2xl mx-auto leading-relaxed">
                  Awesome job, {formData.gender || "friend"}! 💫
                  <br />
                  Your details have been saved successfully.
                  <br />
                  Redirecting you to your dashboard... 🚀
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between w-full mt-10">
        {step > 0 && step < 7 ? (
          <button
            onClick={prevStep}
            className="w-[48%] py-6 rounded-3xl text-2xl bg-white/20 hover:bg-white/30 transition"
          >
            Back
          </button>
        ) : (
          <div className="w-[48%]" />
        )}

        {step === 0 && (
          <button
            onClick={nextStep}
            className="w-full py-6 rounded-3xl text-2xl bg-white text-blue-900 font-bold hover:bg-gray-100 transition"
          >
            Get Started →
          </button>
        )}

        {step > 0 && step < 6 && (
          <button
            onClick={nextStep}
            disabled={!formData[steps[step].key as keyof FormData]}
            className="w-[48%] py-6 rounded-3xl text-2xl bg-white text-blue-900 font-bold hover:bg-gray-100 transition disabled:opacity-50"
          >
            Next
          </button>
        )}

        {step === 6 && (
          <button
            onClick={handleSubmit}
            className="w-[48%] py-6 rounded-3xl text-2xl bg-linear-to-r from-cyan-400 to-blue-400 font-bold text-blue-950 hover:opacity-90 transition"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}
