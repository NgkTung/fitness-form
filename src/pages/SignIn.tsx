import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const setFieldError = (name: "username" | "password", msg?: string) =>
    setErrors((prev) => ({ ...prev, [name]: msg }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as {
      name: "username" | "password";
      value: string;
    };
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) setFieldError(name, undefined);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target as {
      name: "username" | "password";
      value: string;
    };
    if (!value.trim()) setFieldError(name, "This field is required");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!loginData.username.trim())
      nextErrors.username = "Username is required";
    if (!loginData.password.trim())
      nextErrors.password = "Password is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    localStorage.setItem("token", "dummy-token");
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

      <form className="space-y-6" onSubmit={handleLogin} noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your username"
            aria-invalid={!!errors.username}
            className={`${baseInput} ${errors.username ? errRing : okRing}`}
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            className={`${baseInput} ${errors.password ? errRing : okRing}`}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <a href="#" className="text-blue-800 font-medium hover:underline">
            Forgot password?
          </a>
          <Link
            to="/register"
            className="text-gray-700 font-medium hover:text-blue-800"
          >
            Create Account
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 transition-all shadow-md"
        >
          Sign In
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
