import { useState, FormEvent } from "react";
import Button from "../../../components/Button";
import { config } from "../../../config";
import Metadata from "../../../components/Metadata";
import { Link, useNavigate } from "react-router-dom";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

const SignIn = () => {
  const [formData, setFormData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignIn = async () => {
    setIsLoading(true);
    const response = await fetch(`${config.apiBaseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    const responseJson = await response.json();
    const { token } = responseJson;
    localStorage.setItem("logInToken", token);
    if (response.ok) {
      navigate("/passcode");
      setIsLoading(false);
    } else {
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    handleSignIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Metadata title="Snappy | Sign In" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold gradient-color text-center mb-6 font-caveat-font">
          Sign In
        </h2>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="thetthethtar2015@gmail.com"
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <Button
          buttonClassName="w-full"
          title="Sign In"
          isLoading={isLoading}
        />
        <p className="text-snap-black text-[1rem] mt-[1.5rem] text-center">
          New here?{" "}
          <span className="gradient-color">
            <Link to={"/auth/sign-up"}>Register</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
