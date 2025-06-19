import React, { useState } from "react";
import { useAuth } from "..//context/AuthContext";
import { useNavigate } from "react-router-dom";
import { POST_Api, GET_Api } from "../services/ApiService";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound, ShieldUser, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// import logo from "@/assets/default-user.png"; //"../assets/default-user.png";
import brand_logo from "@/assets/Audit-Logo.png";

export const Login = () => {
  const { user, setUser, checkAuth } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await POST_Api("/user/login", { username, password });
      console.log("login result :", result);

      const res = await GET_Api("/protected");
      console.log("res :", res);

      setUser(res.data.data);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* <!-- component --> */}
      <div className="h-screen flex items-center justify-center bg-sky-100 px-20">
        {/* <!-- Left: Image --> */}
        <div className=" w-1/2 h-full hidden md:block  align-text-bottom ">
          <img src={brand_logo} height={"200px"} width={"200px"} />
        </div>

        {/* <!-- Right: Login Form --> */}
        <div className="w-1/2     ">
          <Card className="">
            <CardHeader>
              <div className="flex flex-col items-center   ">
                {/* <ShieldUser className="mb-4" size={"60px"} /> */}
                <CircleUserRound className="mb-2" size={"60px"} />
                {/* <Avatar>
                  <AvatarImage src={logo} className="w-140  " />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar> */}
                <CardTitle className="text-3xl  ">Login</CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
                {/* <CardAction></CardAction> */}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                {/* <!-- Username Input --> */}
                <div className="mb-4">
                  <label className="label-style">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autocomplete="off"
                    className="input-style"
                  />
                </div>
                {/* <!-- Password Input --> */}
                <div className="mb-4">
                  <label className="label-style">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autocomplete="off"
                    className="input-style"
                  />
                </div>
                {/* <!-- Login Button --> */}
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full mt-4"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </CardContent>
            {/* <CardFooter>
              <p>Card Footer</p>
            </CardFooter> */}
          </Card>
        </div>
      </div>
    </>
  );
};
