import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    Object.entries(registerData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "This field is required";
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    localStorage.setItem("token", "dummy-token");
    navigate("/");
  };

  const baseInput =
    "w-full px-4 py-3 border rounded-xl focus:outline-none transition-all";
  const okRing = "focus:ring-2 focus:ring-blue-800 border-gray-300";
  const errRing = "border-red-500 focus:ring-2 focus:ring-red-600";

  return (
    <div className="w-full max-w-md mx-auto px-6 sm:px-8 md:px-0 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Create Account
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Join our fitness community today
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={registerData.firstName}
              onChange={handleChange}
              className={`${baseInput} ${errors.firstName ? errRing : okRing}`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={registerData.lastName}
              onChange={handleChange}
              className={`${baseInput} ${errors.lastName ? errRing : okRing}`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={registerData.username}
            onChange={handleChange}
            className={`${baseInput} ${errors.username ? errRing : okRing}`}
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="text-sm text-red-600 mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            className={`${baseInput} ${errors.password ? errRing : okRing}`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 transition-all shadow-md text-base sm:text-lg"
        >
          Create Account
        </button>
      </form>

      <div className="text-center text-gray-600 text-sm sm:text-base">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-800 font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
