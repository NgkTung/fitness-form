import { useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Flame, Target, Dumbbell } from "lucide-react";
import { useProfile } from "../hooks/profile/useProfile";
import { useDashboard } from "../hooks/dashboard/useDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useProfile();
  const { data: fitnessData, isLoading } = useDashboard();

  const defaultFitnessData = {
    current_bmi: 0,
    total_calories_burnt: 0,
    total_workouts: 0,
    average_posture_score: 0,
    streak: 0,
    adherence_percent: 0,
  };

  const data = fitnessData ?? defaultFitnessData;

  const weightData = [
    { day: "10 Th11", weight: 65.2 },
    { day: "15 Th11", weight: 64.8 },
    { day: "20 Th11", weight: 63.4 },
    { day: "25 Th11", weight: 62.1 },
  ];

  const dailyGoalCalories = 2500;
  const caloriePercent = Math.min(
    (data.total_calories_burnt / dailyGoalCalories) * 100,
    100
  );

  useLayoutEffect(() => {
    const isNewAccount =
      user?.height_cm === null &&
      user.weight_kg === null &&
      user.experience_level === null;
    if (isNewAccount && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate, location.pathname, user]);

  const COLORS = ["#3b82f6", "#e5e7eb"];
  const pieData = [
    { name: "đã đốt cháy", value: caloriePercent },
    { name: "còn lại", value: 100 - caloriePercent },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600 text-xl">
        Đang tải bảng điều khiển...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-blue-100 text-gray-800 p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-blue-800">FitForm</h1>
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-900 text-xl">
              Chào, {user?.username}
            </p>
            <p className="text-sm text-blue-600">
              Hãy tiếp tục chinh phục mục tiêu hôm nay! 💪
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* CHỈ SỐ CHÍNH */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-linear-to-r from-yellow-400 via-orange-400 to-red-500 text-white p-8 rounded-3xl shadow-2xl flex flex-col justify-between min-h-[220px] hover:scale-[1.03] transition">
              <div className="flex items-center justify-between">
                <Flame size={90} className="opacity-90" />
                <div className="text-right">
                  <p className="text-7xl font-extrabold leading-none">
                    {data.streak}
                  </p>
                  <p className="text-xl mt-1 font-semibold opacity-90">Ngày</p>
                </div>
              </div>
              <p className="text-xl font-medium mt-4 opacity-95">
                🔥 Đừng để chuỗi ngày tập luyện bị ngắt quãng!
              </p>
            </div>

            <div className="bg-linear-to-r from-green-400 via-emerald-500 to-teal-500 text-white p-8 rounded-3xl shadow-2xl flex flex-col justify-between min-h-[220px] hover:scale-[1.03] transition">
              <div className="flex items-center justify-between">
                <Target size={90} className="opacity-90" />
                <div className="text-right">
                  <p className="text-7xl font-extrabold leading-none">
                    {data.adherence_percent}
                    <span className="text-3xl ml-1 font-semibold">%</span>
                  </p>
                  <p className="text-xl mt-1 font-semibold opacity-90">
                    Sự kiên trì
                  </p>
                </div>
              </div>
              <p className="text-xl font-medium mt-4 opacity-95">
                🎯 Kiên trì chính là chìa khóa của sự tiến bộ.
              </p>
            </div>
          </section>

          {/* CALORIES + TẬP LUYỆN */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Calories Đã Đốt - Biểu đồ Pie */}
            <div className="bg-white rounded-3xl border border-blue-100 shadow-lg p-6 flex flex-col items-center justify-center relative">
              <h2 className="text-lg font-semibold text-blue-800 mb-4">
                Calories đã đốt cháy
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center mt-8">
                <Flame size={36} className="text-blue-600 mb-1" />
                <p className="text-3xl font-bold text-blue-800">
                  {data.total_calories_burnt}
                </p>
                <p className="text-lg text-gray-500">
                  / {dailyGoalCalories} kcal
                </p>
              </div>
            </div>

            {/* Tổng số buổi tập */}
            <div className="bg-linear-to-br from-indigo-500 to-blue-600 text-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center hover:scale-[1.03] transition">
              <Dumbbell size={80} className="opacity-90 mb-3" />
              <p className="text-6xl font-extrabold leading-none">
                {data.total_workouts}
              </p>
              <p className="text-xl mt-1 font-semibold">Tổng số buổi tập</p>
              <p className="text-lg opacity-90 mt-2 text-center">
                Tiến lên — mỗi nhịp tập đều có giá trị 💥
              </p>
            </div>
          </section>

          {/* TIẾN TRÌNH CÂN NẶNG */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              Tiến trình cân nặng
            </h2>
            <div className="bg-white/80 border border-blue-100 rounded-2xl shadow-md p-6">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis dataKey="day" stroke="#1e3a8a" />
                  <YAxis stroke="#1e3a8a" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* BÊN PHẢI — BMI */}
        <div className="space-y-8">
          <section className="bg-white/80 border border-blue-100 p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-blue-800">
              Chỉ số BMI
            </h2>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 flex items-center justify-center mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    className="text-blue-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="100, 100"
                    d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                  />
                  <path
                    className="text-green-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${(data.current_bmi / 40) * 100}, 100`}
                    strokeLinecap="round"
                    d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-4xl font-bold text-green-600">
                    {data.current_bmi.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Bình thường</p>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                  <span>Thiếu cân</span>
                  <span>Bình thường</span>
                  <span>Thừa cân</span>
                  <span>Béo phì</span>
                </div>
                <div className="relative w-full h-2 rounded-full bg-linear-to-r from-blue-400 via-yellow-400 to-red-500">
                  <div
                    className="absolute top-0 h-2 w-2 bg-blue-900 rounded-full shadow-md"
                    style={{
                      left: `${(data.current_bmi / 40) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                </div>
                <p className="text-xs text-center text-gray-600 mt-2">
                  18.5 - 25.0 = Ngưỡng bình thường
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
