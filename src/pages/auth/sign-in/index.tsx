import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../components/Button";
import Metadata from "../../../components/Metadata";
import { config } from "../../../config";

interface SignInData {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignInData>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson?.message || "Invalid email or password");
      }

      localStorage.setItem("logInToken", responseJson.token);

      toast.success("Signed in successfully 🎉");
      navigate("/passcode");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSignIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-snap-bg">
      <Metadata title="Snappy | Sign In" />

      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-sm
          sm:max-w-md
          lg:max-w-lg
          bg-white
          p-5 sm:p-6 lg:p-8
          rounded-2xl
          shadow-lg
        "
      >
        <h2
          className="
            text-xl
            sm:text-2xl
            lg:text-3xl
            font-semibold
            gradient-color
            text-center
            mb-6
            font-caveat-font
          "
        >
          Welcome Back
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="
              w-full
              px-3
              py-2 sm:py-2.5
              text-sm sm:text-base
              border
              rounded-lg
              focus:outline-none
              focus:ring-2
              focus:ring-primary
            "
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="
              w-full
              px-3
              py-2 sm:py-2.5
              text-sm sm:text-base
              border
              rounded-lg
              focus:outline-none
              focus:ring-2
              focus:ring-primary
            "
          />
        </div>

        <Button
          title="Sign In"
          isLoading={isLoading}
          isDisabled={isLoading}
          buttonClassName="w-full py-2.5 sm:py-3"
        />

        <p className="text-center text-sm sm:text-base mt-6">
          New here?{" "}
          <Link to="/auth/sign-up" className="gradient-color font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
