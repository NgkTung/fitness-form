import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const weightData = [
    { day: "Nov 10", weight: 65.2 },
    { day: "Nov 15", weight: 64.8 },
    { day: "Nov 20", weight: 64.4 },
    { day: "Nov 25", weight: 64.1 },
  ];

  const bmi = 24.0;

  useEffect(() => {
    const stored = localStorage.getItem("fitnessUserData");
    if (!stored && location.pathname !== "/onboarding") {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-800 text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">FitForm</h1>
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/50"
            alt="User"
            className="rounded-full border-2 border-blue-400"
          />
          <div>
            <p className="font-semibold">Hi, Nathan</p>
            <p className="text-sm text-blue-200">You’re doing great today!</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Today Progress</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: "Chest Workout", done: 5, total: 12 },
                { title: "Legs Workout", done: 3, total: 20 },
                { title: "Arms Workout", done: 10, total: 15 },
              ].map((p, i) => (
                <div
                  key={i}
                  className="bg-white/10 p-5 rounded-2xl text-center backdrop-blur-sm"
                >
                  <p className="text-3xl font-bold text-blue-300">
                    {p.done}/{p.total}
                  </p>
                  <p className="text-sm text-blue-100 mt-1">{p.title}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Next Training</h2>
            <div className="space-y-3">
              {[
                { title: "Full Body Warm Up", time: "22 min" },
                { title: "Strength Exercise", time: "14 min" },
                { title: "Both Side Plank", time: "18 min" },
                { title: "Abs Workout", time: "18 min" },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-white/10 p-4 rounded-xl flex justify-between items-center hover:bg-white/20 transition"
                >
                  <p className="font-medium">{t.title}</p>
                  <span className="text-blue-200 text-sm">{t.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4">Weight Progress</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b6cb7" />
                <XAxis dataKey="day" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4">BMI</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    className="text-blue-300 opacity-30"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="100, 100"
                    d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                  />
                  <path
                    className="text-green-400"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${(bmi / 40) * 100}, 100`}
                    strokeLinecap="round"
                    d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-green-400">
                    {bmi.toFixed(1)}
                  </p>
                  <p className="text-sm text-blue-100">Normal</p>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Underweight</span>
                  <span>Normal</span>
                  <span>Overweight</span>
                  <span>Obese</span>
                </div>
                <div className="relative w-full h-2 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500">
                  <div
                    className="absolute top-0 h-2 w-2 bg-white rounded-full shadow-md"
                    style={{
                      left: `${(bmi / 40) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                </div>
                <p className="text-xs text-center text-blue-100 mt-2">
                  18.5 - 25.0 = Normal Range
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
