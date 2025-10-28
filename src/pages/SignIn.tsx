import type React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/auth/useLogin";

const schema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().trim().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useLogin();

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
        <h1 className="text-4xl font-extrabold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            {...register("username")}
            placeholder="Enter your username"
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
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            className={`${baseInput} ${errors.password ? errRing : okRing}`}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {isError && (
          <p className="text-sm text-red-600">
            {(error as any)?.message || "Login failed"}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 transition-all shadow-md"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-10 text-center">
        <Link
          to="/register"
          className="inline-block w-full py-3 bg-white border border-blue-800 text-blue-800 font-semibold rounded-xl hover:bg-blue-800 hover:text-white transition-all shadow-sm"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
