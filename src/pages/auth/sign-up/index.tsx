import { useState, FormEvent, useEffect } from "react";
import Button from "../../../components/Button";
import { config } from "../../../config";
import Metadata from "../../../components/Metadata";
import { Link, useNavigate } from "react-router-dom";
import ProfilePhotoDropZone from "../components/ProfilePhotoDropZone";
import { toast } from "react-toastify";

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
  const [imageUrl, setImageUrl] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedFile.length === 0) return;

    const url = URL.createObjectURL(selectedFile[0]);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleSelectFile = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const originalFile = acceptedFiles[0];

    const randomPart = Math.random().toString().split(".")[1];
    const newFileName = `snappy_${randomPart}.${originalFile.name
      .split(".")
      .pop()}`;

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

  const handleSignUp = async () => {
    if (signUpDatas.password !== signUpDatas.password_confirmation) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      let profileUrl = signUpDatas.url;

      // Finalize image upload
      if (imageUrl.length && selectedFile.length) {
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

      const payload = {
        ...signUpDatas,
        url: profileUrl,
      };

      const response = await fetch(`${config.apiBaseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseJson = await response.json();

      if (!response.ok) {
        if (responseJson?.message) {
          toast.error(responseJson.message);
        } else {
          toast.error("Failed to create account");
        }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpDatas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSignUp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Metadata title="Snappy | Create Account" />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-snap-white p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold gradient-color text-center mb-6 font-caveat-font">
          Happy to join Snappy
        </h2>

        <div className="w-fit mx-auto mb-[0.5rem]">
          {imageUrl ? (
            <div className="relative">
              <div
                onClick={() => {
                  setImageUrl("");
                  setSelectedFile([]);
                }}
                className="gradient-background w-fit rounded-full p-1 absolute top-1 right-0 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <img
                src={imageUrl}
                onLoad={() => URL.revokeObjectURL(imageUrl)}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          ) : (
            <ProfilePhotoDropZone onSelectFile={handleSelectFile} />
          )}
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={signUpDatas.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ko Zaw Zaw"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={signUpDatas.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="thatthathtar2015@gmail.com"
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={signUpDatas.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        {/* Password Confirmation*/}
        <div className="mb-7">
          <label className="block text-sm font-medium mb-1">
            Password Confirmation
          </label>
          <input
            type="password"
            name="password_confirmation"
            required
            value={signUpDatas.password_confirmation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <Button
          isLoading={isLoading}
          buttonClassName="w-full"
          title="Create Account"
        />
        <p className="text-snap-black text-[1rem] mt-[1.5rem] text-center">
          Already have an account?{" "}
          <span className="gradient-color">
            <Link to={"/auth/sign-in"}>Log In</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
