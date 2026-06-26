import { Link } from "react-router";
import pageNotFoundImage from "../assets/404.png";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#4F2176] flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-white">
        {/* Text Section */}
        <div className="text-center md:text-left">
          <h1 className="text-[80px] sm:text-[100px] md:text-[120px] font-bold">
            404
          </h1>

          <p className="text-xl sm:text-2xl mt-4">Sorry, the page not found</p>

          <p className="text-gray-300 mt-2 text-sm sm:text-base max-w-md mx-auto md:mx-0">
            The link you followed probably broken or the page has been removed.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 bg-white text-[#3b3a78] rounded-md font-medium hover:bg-gray-200 transition"
          >
            Go to Home
          </Link>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={pageNotFoundImage}
            alt="404 illustration"
            className="w-[220px] sm:w-[280px] md:w-[340px]"
          />
        </div>
      </div>
    </div>
  );
}
