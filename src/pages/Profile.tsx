import { useState, useMemo, useEffect } from "react";
import { Save, RefreshCw, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useProfile } from "../hooks/profile/useProfile";
import { useUpdateProfile } from "../hooks/profile/useUpdateProfile";
import Alert from "../components/common/Alert";
import type { User } from "../types/user.type";

const ProfilePage = () => {
  const { data, isSuccess, isLoading, isError, refetch } = useProfile();
  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState<User>({
    username: "",
    email: "",
    height_cm: 0,
    weight_kg: 0,
    age: 0,
    gender: "male",
    main_goal: "build_muscle",
    experience_level: "intermediate",
    days_per_week: 4,
    equipment_available: "full_gym",
    activity_level: null,
  });

  const [originalData, setOriginalData] = useState<typeof formData | null>(
    null
  );
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "primary";
    text: string;
  } | null>(null);

  const bmi = useMemo(() => {
    const h = formData.height_cm / 100;
    return h > 0 ? (formData.weight_kg / (h * h)).toFixed(1) : "0.0";
  }, [formData.height_cm, formData.weight_kg]);

  const hasChanged = useMemo(() => {
    if (!originalData) return false;
    return Object.keys(formData).some(
      (key) =>
        formData[key as keyof typeof formData] !==
        originalData[key as keyof typeof originalData]
    );
  }, [formData, originalData]);

  const weightData = [
    { day: "10 Th10", weight: 73.5 },
    { day: "20 Th10", weight: 73.1 },
    { day: "30 Th10", weight: 72.8 },
    { day: "10 Th11", weight: 72.5 },
    { day: "20 Th11", weight: 72.3 },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "days_per_week" ||
        name === "age" ||
        name.includes("weight") ||
        name.includes("height")
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setAlert({ type: "success", text: "Hồ sơ cập nhật thành công!" });
        setOriginalData(formData);
        refetch();
        setTimeout(() => setAlert(null), 4000);
      },
      onError: () => {
        setAlert({ type: "error", text: "Lỗi khi cập nhật hồ sơ của bạn." });
        setTimeout(() => setAlert(null), 4000);
      },
    });
  };

  useEffect(() => {
    if (isSuccess && data) {
      setFormData(data);
      setOriginalData(data);
    }
  }, [data, isSuccess]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 text-blue-700">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin" size={36} />
          <p className="font-semibold text-lg">Đang tải hồ sơ của bạn...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 via-white to-red-100 text-red-700">
        <AlertCircle size={40} className="mb-3" />
        <p className="font-semibold text-lg mb-2">Lỗi khi tải hồ sơ</p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition"
        >
          <RefreshCw size={18} className="animate-spin-slow" />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800 px-8 py-12 relative">
      {alert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md animate-fade-in">
          <Alert type={alert.type} text={alert.text} />
        </div>
      )}

      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-white/90 shadow-md border border-blue-100 rounded-3xl p-10 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
            Hồ sơ cá nhân
          </h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { label: "Chiều cao (cm)", name: "height_cm", type: "number" },
                { label: "Cân nặng (kg)", name: "weight_kg", type: "number" },
                { label: "Tuổi", name: "age", type: "number" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={formData[f.name as keyof typeof formData] ?? ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-blue-100 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-100 px-4 py-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mức độ hoạt động
                </label>
                <select
                  name="activity_level"
                  value={formData.activity_level ?? ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-100 px-4 py-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                >
                  <option value="">Chọn mức độ hoạt động</option>
                  <option value="sedentary">Ít vận động</option>
                  <option value="light">Vận động nhẹ</option>
                  <option value="moderate">Vận động vừa phải</option>
                  <option value="active">Năng động</option>
                  <option value="very_active">Rất năng động</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mục tiêu chính
                </label>
                <select
                  name="main_goal"
                  value={formData.main_goal ?? ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-100 px-4 py-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                >
                  <option value="build_muscle">Tăng cơ</option>
                  <option value="lose_weight">Giảm cân</option>
                  <option value="maintain">Duy trì vóc dáng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Trình độ kinh nghiệm
                </label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-100 px-4 py-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                >
                  <option value="beginner">Người mới bắt đầu</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Số buổi tập / Tuần
                </label>
                <input
                  type="number"
                  name="days_per_week"
                  value={formData.days_per_week}
                  onChange={handleChange}
                  min={1}
                  max={7}
                  className="w-full rounded-xl border border-blue-100 px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Thiết bị hiện có
                </label>
                <select
                  name="equipment_available"
                  value={formData.equipment_available}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-blue-100 px-4 py-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-300"
                >
                  <option value="bodyweight">Trọng lượng cơ thể</option>
                  <option value="basic_gym">Phòng tập cơ bản</option>
                  <option value="full_gym">Phòng tập đầy đủ</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!hasChanged || updateMutation.isPending}
                className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl shadow transition ${
                  !hasChanged || updateMutation.isPending
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Save size={18} />
                {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-white/90 p-6 rounded-3xl border border-blue-100 shadow-md backdrop-blur-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Xu hướng cân nặng
            </h2>
            <ResponsiveContainer width="100%" height={220}>
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

          <div className="bg-white/90 p-6 rounded-3xl border border-blue-100 shadow-md text-center">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Tổng quan BMI
            </h2>
            <p className="text-5xl font-bold text-green-600 mb-1">{bmi}</p>
            <p className="text-gray-600 text-sm">
              {Number(bmi) < 18.5
                ? "Thiếu cân"
                : Number(bmi) < 25
                ? "Bình thường"
                : Number(bmi) < 30
                ? "Thừa cân"
                : "Béo phì"}
            </p>
            <p className="mt-3 text-xs text-blue-500">
              18.5 - 25 = Ngưỡng bình thường
            </p>
          </div>

          <div className="bg-white/90 p-6 rounded-3xl border border-blue-100 shadow-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Tóm tắt luyện tập
            </h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>
                <strong>Mục tiêu:</strong>{" "}
                {formData.main_goal === "build_muscle"
                  ? "TĂNG CƠ"
                  : formData.main_goal === "lose_weight"
                  ? "GIẢM CÂN"
                  : "DUY TRÌ"}
              </li>
              <li>
                <strong>Kinh nghiệm:</strong>{" "}
                {formData.experience_level === "beginner"
                  ? "MỚI BẮT ĐẦU"
                  : formData.experience_level === "intermediate"
                  ? "TRUNG CẤP"
                  : "NÂNG CAO"}
              </li>
              <li>
                <strong>Số buổi/Tuần:</strong> {formData.days_per_week}
              </li>
              <li>
                <strong>Thiết bị:</strong>{" "}
                {formData.equipment_available === "bodyweight"
                  ? "TRỌNG LƯỢNG CƠ THỂ"
                  : formData.equipment_available === "basic_gym"
                  ? "PHÒNG TẬP CƠ BẢN"
                  : "PHÒNG TẬP ĐẦY ĐỦ"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
