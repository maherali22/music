import { useState } from "react";
import { useFormik } from "formik";
import axiosInstance from "../../../../axiosinstance";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Check } from "react-feather";

const initialValues = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
};

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};

    if (currentStep === 1) {
      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
    }

    if (currentStep === 2) {
      if (!values.password) {
        errors.password = "Password is required";
      } else {
        const hasLetter = /[A-Za-z]/.test(values.password);
        const hasNumber = /\d/.test(values.password);
        const hasMinLength = values.password.length >= 6;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(values.password);

        if (!hasLetter || !hasNumber || !hasMinLength || !hasSpecialChar) {
          errors.password = "Password doesn't meet requirements";
        }
      }

      if (
        values.confirmPassword &&
        values.password !== values.confirmPassword
      ) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (currentStep === 3) {
      if (!values.name) {
        errors.name = "Name is required";
      } else if (values.name.length < 2) {
        errors.name = "Name must be at least 2 characters";
      }
    }

    return errors;
  };

  const {
    errors,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldTouched,
  } = useFormik({
    initialValues,
    validate,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
        return;
      }

      setIsLoading(true);
      setApiError(null);
      try {
        const response = await axiosInstance.post("/user/register", values);
        toast.success("Registration successful!");
        navigate("/otp-verify");
      } catch (error) {
        setApiError(error.response?.data?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const passwordRequirements = (password) => ({
    hasLetter: /[A-Za-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasMinLength: password.length >= 6,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  const renderStepIndicator = () => (
    <div className="flex justify-center gap-2 mb-8">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`w-8 h-8 rounded-full flex items-center justify-center
            ${currentStep >= step ? "bg-green-500" : "bg-neutral-700"}`}
        >
          <Check
            size={16}
            className={`${
              currentStep >= step ? "text-black" : "text-transparent"
            }`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a2d2b] to-[#191414]">
      <div className="min-h-screen flex flex-col justify-start px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[450px] mx-auto pt-8 pb-16 sm:pt-12">
          <div className="text-center mb-8 sm:mb-12">
            <Link to="/">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
                alt="Spotify Logo"
                className="w-32 mx-auto mb-10"
              />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 px-2">
              {currentStep === 1
                ? "Sign up to start listening"
                : currentStep === 2
                ? "Create a password"
                : "What should we call you?"}
            </h1>
            {renderStepIndicator()}
          </div>

          <div className="bg-neutral-900 rounded-lg p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Email */}
              {currentStep === 1 && (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold mb-2"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                  )}
                </div>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <>
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold mb-2"
                    >
                      Create a password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Create a password"
                      className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 bottom-3 text-neutral-400 hover:text-white"
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  <div className="text-xs font-bold">
                    Your password must contain at least
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {Object.entries(passwordRequirements(values.password)).map(
                      ([key, met]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              met ? "bg-green-500" : "bg-neutral-700"
                            }`}
                          >
                            <Check
                              size={10}
                              className={`${
                                met ? "text-black" : "text-transparent"
                              }`}
                            />
                          </div>

                          <span
                            className={
                              met ? "text-green-500" : "text-neutral-100"
                            }
                          >
                            {key === "hasLetter" && "1 letter"}
                            {key === "hasNumber" && "1 number"}
                            {key === "hasMinLength" && "6 characters"}
                            {key === "hasSpecialChar" && "1 special character"}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-bold mb-2"
                    >
                      Confirm password
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 bottom-3 text-neutral-400 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-2">
                      {errors.confirmPassword}
                    </p>
                  )}
                </>
              )}

              {/* Step 3: Name */}
              {currentStep === 3 && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold mb-2"
                  >
                    Profile name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="This name will appear on your profile"
                    className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-2">{errors.name}</p>
                  )}
                </div>
              )}

              {apiError && (
                <div className="bg-red-900/50 text-red-400 p-4 rounded-lg text-sm">
                  {apiError}
                </div>
              )}

              <div className="flex justify-between gap-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="w-1/3 py-3 rounded-full font-bold bg-neutral-700 hover:bg-neutral-600 text-white"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className={`w-full py-3 rounded-full font-bold text-lg ${
                    isLoading
                      ? "bg-green-600 opacity-70"
                      : "bg-green-500 hover:bg-green-400"
                  } transition-all duration-200`}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : currentStep === 3
                    ? "Create Account"
                    : "Next"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-neutral-400 text-sm">
                Already have an account? {""}
                <Link to="/login" className="text-white hover:underline">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
