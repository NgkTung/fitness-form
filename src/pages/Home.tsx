import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="relative flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="w-60 h-auto md:w-80"
        />
      </div>

      <div className="relative w-full h-full md:w-1/2">
        <img
          src="/images/fitness-2.jpeg"
          alt="Fitness"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8 md:hidden z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
            Thay Đổi Hành Trình <span className="text-blue-200">Tập Luyện</span>{" "}
            Của Bạn
          </h1>
          <p className="text-base sm:text-lg mb-10 text-white/90 max-w-md">
            Tập luyện thông minh, bền bỉ mỗi ngày và làm chủ hiệu suất cùng ứng
            dụng thể hình toàn diện của chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-blue-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-md text-center"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-blue-700 text-white rounded-xl font-semibold text-lg hover:bg-blue-800 transition-all shadow-md text-center"
            >
              Đăng kí
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 flex-col justify-center bg-white px-10 md:px-16 lg:px-24">
        <h1 className="text-6xl font-extrabold text-blue-950 leading-tight mb-6">
          Thay Đổi Hành Trình <span className="text-blue-700">Tập Luyện</span>{" "}
          Của Bạn
        </h1>
        <p className="text-lg mb-10 text-gray-600 max-w-md">
          Tập luyện thông minh, bền bỉ mỗi ngày và làm chủ hiệu suất cùng ứng
          dụng thể hình toàn diện của chúng tôi.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-8 py-3 bg-blue-800 text-white rounded-xl font-semibold text-lg hover:bg-blue-900 transition-all shadow-md"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-white border border-blue-800 text-blue-800 rounded-xl font-semibold text-lg hover:bg-blue-800 hover:text-white transition-all shadow-md"
          >
            Đăng kí
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
