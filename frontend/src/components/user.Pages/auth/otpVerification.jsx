import { useState, useRef } from "react";
import axiosInstance from "../../../../axiosinstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Otp = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const focusNextInput = (index) => {
    if (index < 5) inputs.current[index + 1].focus();
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "") focusNextInput(index);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.put("/user/verify", {
        otp: otp.join(""),
      });
      toast.success("Verification successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a2d2b] to-[#191414] py-8 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
            alt="Spotify Logo"
            className="h-12 sm:h-14 mb-6 sm:mb-8 mx-auto"
          />
        </div>

        <div className="bg-neutral-900 rounded-lg p-4 sm:p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
            Enter Verification Code
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 text-center mb-6 sm:mb-8">
            We've sent a code to your email. Enter it here to verify your
            account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="flex justify-center gap-4 mb-6 sm:mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputs.current[index] = el)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl text-center bg-neutral-800 rounded border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength="1"
                  disabled={isLoading}
                />
              ))}
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-full font-bold transition-all duration-200 ${
                isLoading
                  ? "bg-green-600 opacity-70"
                  : "bg-green-500 hover:bg-green-400 hover:scale-105"
              } text-lg`}
              disabled={isLoading || otp.some((d) => d === "")}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => toast("New code sent!", { icon: "🔄" })}
                className="text-sm text-white hover:underline"
              >
                Didn't receive a code? Resend
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-sm text-neutral-400 hover:text-white hover:underline"
            >
              Return to sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
