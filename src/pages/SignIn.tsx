import type React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/auth/useLogin";

const schema = z.object({
  username: z.string().trim().min(1, "Tên đăng nhập là bắt buộc"),
  password: z.string().trim().min(1, "Mật khẩu là bắt buộc"),
});

type FormValues = z.infer<typeof schema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values);
    navigate("/");
  };

  const baseInput =
    "w-full px-4 py-3 border rounded-xl focus:outline-none transition-all";
  const okRing = "focus:ring-2 focus:ring-blue-800 border-gray-300";
  const errRing = "border-red-500 focus:ring-2 focus:ring-red-600";

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Chào mừng trở lại
        </h1>
        <p className="text-gray-500 mt-2">
          Đăng nhập để tiếp tục hành trình của bạn
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên đăng nhập
          </label>
          <input
            type="text"
            {...register("username")}
            placeholder="Nhập tên đăng nhập của bạn"
            aria-invalid={!!errors.username}
            className={`${baseInput} ${errors.username ? errRing : okRing}`}
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Nhập mật khẩu của bạn"
              aria-invalid={!!errors.password}
              className={`${baseInput} pr-10 ${
                errors.password ? errRing : okRing
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {isError && (
          <p className="text-sm text-red-600">
            {error?.message || "Login failed"}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 font-semibold rounded-xl transition-all shadow-md
            ${
              isPending
                ? "bg-blue-300 text-white cursor-not-allowed shadow-none"
                : "bg-blue-800 text-white hover:bg-blue-900"
            }`}
        >
          {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <div className="text-center">
        <Link
          to="/register"
          className="inline-block w-full py-3 bg-white border border-blue-800 text-blue-800 font-semibold rounded-xl hover:bg-blue-800 hover:text-white transition-all shadow-sm"
        >
          Đăng kí ngay
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
