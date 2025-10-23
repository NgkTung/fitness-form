import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-7/12 bg-white p-6 shadow z-20 flex items-center justify-center">
        <Outlet />
      </div>

      <div className="relative w-5/12 h-full overflow-hidden">
        <img
          src="/images/fitness-1.jpg"
          alt="Fitness background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-linear-to-l from-blue-900/90 via-blue-900/70 to-blue-900/40 mix-blend-multiply"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-8">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="absolute top-8 left-8 w-80 h-auto"
          />
          <h2 className="text-5xl font-bold mb-2">Stay Strong, Stay Fit</h2>
          <p className="text-xl opacity-80">
            Join our community and push your limits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
