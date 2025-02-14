import React, { useState, useEffect } from "react";
import { userLogin } from "../../../Redux/slice/user.Slice/authSlice";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.auth.error);
  const status = useSelector((state) => state.auth.status);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "fulfilled") {
      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 2000);
    }
    if (status === "rejected") {
      toast.error(error || "Login failed. Please try again.");
    }
  }, [status, error, navigate]);

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const { errors, values, handleBlur, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues,
      validate,
      onSubmit: (values) => {
        dispatch(userLogin(values));
      },
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a2d2b] to-[#191414] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 rounded-lg p-8 sm:p-10 shadow-lg">
        <Link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
            alt="Spotify Logo"
            className="w-32 mx-auto mb-8"
          />
        </Link>

        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Log in to Spotify
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-white">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="name@domain.com"
              className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-xs mt-2">
                {errors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-bold mb-2 text-white">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-neutral-400 hover:text-white"
            >
              {showPassword ? (
                <EyeIcon className="w-5 h-5" />
              ) : (
                <EyeSlashIcon className="w-5 h-5" />
              )}
            </button>
            {errors.password && touched.password && (
              <p className="text-red-500 text-xs mt-2">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-black py-3 rounded-full font-bold text-lg transition-transform hover:scale-105"
          >
            LOG IN
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-400 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-white hover:underline font-bold"
            >
              Sign up for Spotify
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
