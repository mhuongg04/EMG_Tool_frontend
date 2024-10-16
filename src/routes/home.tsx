import { Button, Layout } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkLogin from "../feature/home/api/checkLogin.api";
import Dashboard from "../feature/home/component/Dashboard";
import { handleLogout } from "../lib";

const { Content } = Layout;

export const HomeRoute: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate an API request to check if the user is logged in.
    // Replace with actual API request later.
    const checkLoginStatus = async () => {
      try {
        await checkLogin();
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <Layout>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <button className="btn btn-ghost text-xl">IBME Tool</button>
        </div>
        <div className="flex-none gap-2">
          {isLoggedIn && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar bg-gray-200"
              >
                <div className="w-10 rounded-full !flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                {/* <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li> */}
                <li onClick={handleLogout}>
                  <button>Logout</button>
                </li>
              </ul>
            </div>
          )}

          {!isLoggedIn && (
            <>
              <Button type="primary" onClick={() => navigate("/auth")}>
                Login
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                onClick={() => navigate("/auth")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
      <Content style={{ padding: "50px" }}>
        {isLoggedIn && <Dashboard />}
      </Content>
    </Layout>
  );
};
