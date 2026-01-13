import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import analyzeAnimation from "../animations/loading.json";
import { useUpdateProfile } from "../hooks/profile/useUpdateProfile";
import { useProfile } from "../hooks/profile/useProfile";
import type { User } from "../types/user.type";

interface FormData {
  height_cm: number;
  weight_kg: number;
  age: number;
  gender: "male" | "female" | "other";
  activity_level:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active"
    | null;
  main_goal: "build_muscle" | "lose_weight" | "maintain" | null;
  experience_level: "beginner" | "intermediate" | "advanced" | string;
  days_per_week: number;
  equipment_available: "bodyweight" | "basic_gym" | "full_gym" | string;
}

interface Step {
  id: number;
  key: keyof FormData | "welcome" | "finish" | "analyzing";
  question: string;
}

const steps: Step[] = [
  { id: 0, key: "welcome", question: "Chào mừng bạn đến với FitJourney! 🏋️‍♂️" },
  { id: 1, key: "gender", question: "Giới tính của bạn là gì?" },
  { id: 2, key: "age", question: "Bạn bao nhiêu tuổi?" },
  { id: 3, key: "height_cm", question: "Chiều cao của bạn? (cm)" },
  { id: 4, key: "weight_kg", question: "Cân nặng hiện tại của bạn? (kg)" },
  {
    id: 5,
    key: "activity_level",
    question: "Mức độ hoạt động hàng ngày của bạn như thế nào?",
  },
  {
    id: 6,
    key: "experience_level",
    question: "Kinh nghiệm tập luyện của bạn?",
  },
  {
    id: 7,
    key: "days_per_week",
    question: "Bạn có thể tập bao nhiêu ngày mỗi tuần?",
  },
  {
    id: 8,
    key: "equipment_available",
    question: "Bạn có thể sử dụng những thiết bị nào?",
  },
  {
    id: 9,
    key: "main_goal",
    question: "Mục tiêu thể hình chính của bạn là gì?",
  },
  { id: 10, key: "analyzing", question: "Đang phân tích dữ liệu của bạn..." },
  { id: 11, key: "finish", question: "Tất cả đã sẵn sàng! 🎉" },
];

export default function FitnessOnboarding() {
  const { data, isSuccess } = useProfile();
  const updateMutation = useUpdateProfile();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<User>({
    username: "",
    email: "",
    height_cm: 0,
    weight_kg: 0,
    age: 0,
    gender: "male",
    activity_level: null,
    main_goal: "build_muscle",
    experience_level: "beginner",
    days_per_week: 3,
    equipment_available: "basic_gym",
  });

  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [analyzeText, setAnalyzeText] = useState(
    "Đang phân tích dữ liệu của bạn..."
  );

  useEffect(() => {
    if (!data) return;
    const isNewAccount =
      data.height_cm === null &&
      data.weight_kg === null &&
      data.experience_level === null;

    if (!isNewAccount && step === 0) {
      navigate("/dashboard");
    }
  }, [navigate, data]);

  const handleChange = (key: keyof FormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateStep = (): boolean => {
    setError("");
    if (step === 3 && (formData.height_cm < 100 || formData.height_cm > 250)) {
      setError("Vui lòng nhập chiều cao thực tế từ 100–250 cm.");
      return false;
    }
    if (step === 4 && (formData.weight_kg < 30 || formData.weight_kg > 250)) {
      setError("Vui lòng nhập cân nặng thực tế từ 30–250 kg.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step > 0 && step < steps.length - 1 && !validateStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    if (!validateStep()) return;
    updateMutation.mutate(formData);
    setStep(10);

    let p = 0;
    const messages = [
      "Đang phân tích dữ liệu của bạn...",
      "Đánh giá tiềm năng tập luyện...",
      "Tìm kiếm bài tập phù hợp nhất...",
      "Xây dựng kế hoạch cá nhân hóa...",
      "Chỉ còn một chút nữa thôi...",
    ];
    let msgIndex = 0;
    const interval = setInterval(() => {
      p += 2;
      if (p > 100) {
        clearInterval(interval);
        setStep(11);
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        setProgress(p);
        if (p % 20 === 0 && msgIndex < messages.length - 1) {
          msgIndex++;
          setAnalyzeText(messages[msgIndex]);
        }
      }
    }, 100);
  };

  useEffect(() => {
    if (isSuccess && data) {
      setFormData(() => ({
        ...data,
      }));
    }
  }, [isSuccess, data]);

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-b from-blue-950 to-blue-800 text-white px-4 sm:px-8 py-6 sm:py-8">
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center h-[70vh]"
          >
            {/* Bước 0 - Chào mừng */}
            {step === 0 && (
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-8">
                  {steps[step].question}
                </h1>
                <p className="text-lg sm:text-2xl max-w-3xl mx-auto leading-relaxed">
                  Trước khi bắt đầu, hãy cho chúng tôi biết một vài chi tiết để
                  thiết kế hành trình tập luyện hoàn hảo cho riêng bạn 💪
                </p>
              </div>
            )}

            {/* Giới tính */}
            {step === 1 && (
              <>
                <h2 className="text-4xl font-bold mb-10">
                  {steps[step].question}
                </h2>
                <div className="flex gap-6 flex-wrap justify-center">
                  {[
                    { val: "male", label: "Nam" },
                    { val: "female", label: "Nữ" },
                    { val: "other", label: "Khác" },
                  ].map((g) => (
                    <button
                      key={g.val}
                      onClick={() => handleChange("gender", g.val)}
                      className={`px-10 py-5 rounded-3xl text-2xl border transition ${
                        formData.gender === g.val
                          ? "bg-white text-blue-900 font-bold"
                          : "border-white/40 hover:bg-white/20"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Tuổi */}
            {step === 2 && (
              <div className="flex flex-col items-center w-full">
                <h2 className="text-3xl sm:text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <input
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => handleChange("age", Number(e.target.value))}
                  placeholder="Nhập tuổi của bạn"
                  className="w-full max-w-2xl py-4 sm:py-6 text-3xl sm:text-5xl text-center text-blue-900 rounded-3xl bg-white outline-none"
                />
              </div>
            )}

            {/* Chiều cao */}
            {step === 3 && (
              <div className="flex flex-col items-center w-full">
                <h2 className="text-3xl sm:text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <input
                  type="number"
                  value={formData.height_cm || ""}
                  onChange={(e) =>
                    handleChange("height_cm", Number(e.target.value))
                  }
                  placeholder="Nhập chiều cao (cm)"
                  className="w-full max-w-2xl py-4 sm:py-6 text-3xl sm:text-5xl text-center text-blue-900 rounded-3xl bg-white outline-none"
                />
                {error && <p className="text-red-400 mt-4 text-lg">{error}</p>}
              </div>
            )}

            {/* Cân nặng */}
            {step === 4 && (
              <div className="flex flex-col items-center w-full">
                <h2 className="text-3xl sm:text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <input
                  type="number"
                  value={formData.weight_kg || ""}
                  onChange={(e) =>
                    handleChange("weight_kg", Number(e.target.value))
                  }
                  placeholder="Nhập cân nặng (kg)"
                  className="w-full max-w-2xl py-4 sm:py-6 text-3xl sm:text-5xl text-center text-blue-900 rounded-3xl bg-white outline-none"
                />
                {error && <p className="text-red-400 mt-4 text-lg">{error}</p>}
              </div>
            )}

            {/* Mức độ hoạt động */}
            {step === 5 && (
              <>
                <h2 className="text-4xl font-bold mb-10">
                  {steps[step].question}
                </h2>
                <div className="flex flex-col gap-4 w-full max-w-md">
                  {[
                    {
                      value: "sedentary",
                      label: "Ít vận động (Ngồi nhiều, ít tập thể dục 🪑)",
                    },
                    { value: "light", label: "Nhẹ nhàng (1–3 ngày/tuần 💃)" },
                    { value: "moderate", label: "Vừa phải (3–5 ngày/tuần 🚶‍♂️)" },
                    { value: "active", label: "Năng động (6–7 ngày/tuần 🏋️‍♀️)" },
                    {
                      value: "very_active",
                      label: "Rất năng động (Tập luyện cường độ cao 🏃‍♂️)",
                    },
                  ].map((lvl) => (
                    <button
                      key={lvl.value}
                      onClick={() => handleChange("activity_level", lvl.value)}
                      className={`py-4 rounded-3xl text-xl border transition ${
                        formData.activity_level === lvl.value
                          ? "bg-white text-blue-900 font-bold"
                          : "border-white/40 hover:bg-white/20"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Kinh nghiệm tập luyện */}
            {step === 6 && (
              <>
                <h2 className="text-4xl font-bold mb-10">
                  {steps[step].question}
                </h2>
                <div className="flex gap-6 flex-wrap justify-center">
                  {[
                    { val: "beginner", label: "Người mới" },
                    { val: "intermediate", label: "Trung cấp" },
                    { val: "advanced", label: "Nâng cao" },
                  ].map((lvl) => (
                    <button
                      key={lvl.val}
                      onClick={() => handleChange("experience_level", lvl.val)}
                      className={`px-8 py-5 rounded-3xl text-2xl border transition ${
                        formData.experience_level === lvl.val
                          ? "bg-white text-blue-900 font-bold"
                          : "border-white/40 hover:bg-white/20"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Số ngày tập mỗi tuần */}
            {step === 7 && (
              <div className="flex flex-col items-center w-full">
                <h2 className="text-3xl sm:text-5xl font-extrabold mb-12 leading-tight">
                  {steps[step].question}
                </h2>
                <input
                  type="number"
                  value={formData.days_per_week}
                  onChange={(e) =>
                    handleChange("days_per_week", Number(e.target.value))
                  }
                  min={1}
                  max={7}
                  placeholder="1 - 7"
                  className="w-full max-w-2xl py-4 sm:py-6 text-3xl sm:text-5xl text-center text-blue-900 rounded-3xl bg-white outline-none"
                />
                <p className="text-blue-200 mt-3 text-lg">
                  Sự kiên trì là chìa khóa 🔥 — chỉ cần 3–4 ngày một tuần đã có
                  thể mang lại tiến bộ rõ rệt!
                </p>
              </div>
            )}

            {/* Thiết bị tập */}
            {step === 8 && (
              <>
                <h2 className="text-4xl font-bold mb-10">
                  {steps[step].question}
                </h2>
                <div className="flex gap-6 flex-wrap justify-center">
                  {[
                    { value: "bodyweight", label: "Chỉ trọng lượng cơ thể 🧘‍♂️" },
                    {
                      value: "basic_gym",
                      label: "Phòng tập cơ bản (Tạ đơn, ghế tập 🏋️)",
                    },
                    {
                      value: "full_gym",
                      label: "Phòng tập đầy đủ (Máy móc, tạ nặng 🏆)",
                    },
                  ].map((eq) => (
                    <button
                      key={eq.value}
                      onClick={() =>
                        handleChange("equipment_available", eq.value)
                      }
                      className={`px-8 py-5 rounded-3xl text-2xl border transition ${
                        formData.equipment_available === eq.value
                          ? "bg-white text-blue-900 font-bold"
                          : "border-white/40 hover:bg-white/20"
                      }`}
                    >
                      {eq.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Mục tiêu */}
            {step === 9 && (
              <>
                <h2 className="text-4xl font-bold mb-10">
                  {steps[step].question}
                </h2>
                <div className="flex flex-col gap-4 w-full max-w-md">
                  {[
                    { value: "build_muscle", label: "Tăng cơ 💪" },
                    { value: "lose_weight", label: "Giảm cân 🔥" },
                    { value: "maintain", label: "Duy trì vóc dáng ⚖️" },
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => handleChange("main_goal", goal.value)}
                      className={`py-4 rounded-3xl text-xl border transition ${
                        formData.main_goal === goal.value
                          ? "bg-white text-blue-900 font-bold"
                          : "border-white/40 hover:bg-white/20"
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Phân tích */}
            {step === 10 && (
              <div className="flex flex-col items-center justify-center">
                <Lottie
                  animationData={analyzeAnimation}
                  loop
                  style={{ width: 220, height: 220 }}
                />
                <h2 className="text-3xl font-bold mt-6 mb-3">{analyzeText}</h2>
                <div className="w-64 h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-3 bg-gradient-to-r from-cyan-400 to-blue-400"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            )}

            {/* Hoàn thành */}
            {step === 11 && (
              <div>
                <h2 className="text-4xl font-bold mb-8">
                  {steps[step].question}
                </h2>
                <p className="text-lg sm:text-2xl max-w-2xl mx-auto">
                  Làm tốt lắm,{" "}
                  {formData.gender === "male" ? "nhà vô địch" : "chiến binh"}!
                  💫
                  <br />
                  Kế hoạch tập luyện cá nhân của bạn đã sẵn sàng — đang mở bảng
                  điều khiển... 🚀
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Điều khiển */}
      <div className="flex justify-between mt-10">
        {step > 0 && step < 9 ? (
          <button
            onClick={prevStep}
            className="w-[48%] py-4 sm:py-6 rounded-3xl text-lg sm:text-2xl bg-white/20 hover:bg-white/30 transition"
          >
            Quay lại
          </button>
        ) : (
          <div className="w-[48%]" />
        )}

        {step === 0 && (
          <button
            onClick={nextStep}
            className="w-full py-4 sm:py-6 rounded-3xl text-lg sm:text-2xl bg-white text-blue-900 font-bold hover:bg-gray-100 transition"
          >
            Bắt đầu ngay →
          </button>
        )}

        {step > 0 && step < 9 && (
          <button
            onClick={nextStep}
            disabled={!formData[steps[step].key as keyof FormData]}
            className="w-[48%] py-4 sm:py-6 rounded-3xl text-lg sm:text-2xl bg-white text-blue-900 font-bold hover:bg-gray-100 transition disabled:opacity-50"
          >
            Tiếp theo
          </button>
        )}

        {step === 9 && (
          <button
            onClick={handleSubmit}
            className="w-[48%] py-4 sm:py-6 rounded-3xl text-lg sm:text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 font-bold text-blue-950 hover:opacity-90 transition"
          >
            Hoàn tất
          </button>
        )}
      </div>
    </div>
  );
}
