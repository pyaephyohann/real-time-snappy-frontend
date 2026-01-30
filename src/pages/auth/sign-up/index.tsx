import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../components/Button";
import Metadata from "../../../components/Metadata";
import ProfilePhotoDropZone from "../components/ProfilePhotoDropZone";
import { config } from "../../../config";

interface SignUpData {
  name: string;
  url: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const SignUp = () => {
  const navigate = useNavigate();

  const [signUpDatas, setSignUpDatas] = useState<SignUpData>({
    name: "",
    url: "https://i.pinimg.com/1200x/21/f9/b1/21f9b15d71cf787cf10823cf2c499f53.jpg",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedFile.length) return;

    const previewUrl = URL.createObjectURL(selectedFile[0]);
    setImageUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedFile]);

  const handleSelectFile = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const originalFile = acceptedFiles[0];
    const randomPart = Math.random().toString().split(".")[1];
    const newFileName = `snappy_${randomPart}.${originalFile.name.split(".").pop()}`;

    const renamedFile = new File([originalFile], newFileName, {
      type: originalFile.type,
    });

    setSelectedFile([renamedFile]);

    const formData = new FormData();
    formData.append("image", renamedFile);

    await fetch(`${config.apiBaseUrl}/images/upload-temp`, {
      method: "POST",
      body: formData,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpDatas((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    if (signUpDatas.password !== signUpDatas.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      let profileUrl = signUpDatas.url;

      if (imageUrl && selectedFile.length) {
        const formData = new FormData();
        formData.append("file", selectedFile[0]);

        const imageResponse = await fetch(
          `${config.apiBaseUrl}/images/finalize`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!imageResponse.ok) {
          throw new Error("Failed to upload profile image");
        }

        const imageJson = await imageResponse.json();
        profileUrl = imageJson.url;
      }

      const response = await fetch(`${config.apiBaseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...signUpDatas,
          url: profileUrl,
        }),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        toast.error(responseJson?.message || "Failed to create account");
        return;
      }

      toast.success("Account created successfully 🎉");

      if (responseJson.token) {
        localStorage.setItem("signUpToken", responseJson.token);
      }

      navigate("/auth/sign-in");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSignUp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-snap-bg">
      <Metadata title="Snappy | Create Account" />

      <form
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-sm
          sm:max-w-md
          lg:max-w-lg
          bg-snap-white
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
          Happy to join Snappy
        </h2>

        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          {imageUrl ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  setSelectedFile([]);
                }}
                className="absolute -top-1 -right-1 gradient-background rounded-full p-1"
              >
                ✕
              </button>

              <img
                src={imageUrl}
                alt="Profile"
                className="
                  w-16 h-16
                  sm:w-20 sm:h-20
                  lg:w-24 lg:h-24
                  rounded-full
                  object-cover
                "
              />
            </div>
          ) : (
            <ProfilePhotoDropZone onSelectFile={handleSelectFile} />
          )}
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={signUpDatas.name}
            onChange={handleChange}
            placeholder="Ko Zaw Zaw"
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

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={signUpDatas.email}
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
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={signUpDatas.password}
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

        {/* Password Confirmation */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Password Confirmation
          </label>
          <input
            type="password"
            name="password_confirmation"
            required
            value={signUpDatas.password_confirmation}
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
          isLoading={isLoading}
          buttonClassName="w-full py-2.5 sm:py-3"
          title="Create Account"
        />

        <p className="text-center text-sm sm:text-base mt-6">
          Already have an account?{" "}
          <Link to="/auth/sign-in" className="gradient-color font-medium">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
