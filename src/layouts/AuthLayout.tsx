import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="relative flex h-screen flex-col md:flex-row overflow-hidden">
      {/* Background image for mobile */}
      <img
        src="/images/fitness-1.jpg"
        alt="Fitness background"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      />
      <div className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm md:hidden"></div>

      {/* Logo */}
      <div className="absolute sm:top-6 sm:left-6 z-30 md:top-8 md:left-8 block md:hidden">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="w-50 h-auto drop-shadow-lg"
        />
      </div>

      {/* Form section */}
      <div className="relative flex items-center justify-center w-full md:w-7/12 z-20 h-full px-6 sm:px-8">
        <div className="relative w-full max-w-md bg-white md:bg-white shadow-lg md:shadow-none rounded-2xl md:rounded-none p-6 sm:p-8 md:p-10">
          <Outlet />
        </div>
      </div>

      {/* Right image section for desktop */}
      <div className="hidden md:block relative w-5/12 h-full overflow-hidden">
        <img
          src="/images/fitness-1.jpg"
          alt="Fitness background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-blue-900/90 via-blue-900/70 to-blue-900/40 mix-blend-multiply"></div>

        <div className="absolute top-8 left-8 z-20">
          <img src="/images/logo.png" alt="Logo" className="w-72 h-auto" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-8">
          <h2 className="text-4xl font-bold mb-2">Stay Strong, Stay Fit</h2>
          <p className="text-lg opacity-80">
            Join our community and push your limits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
