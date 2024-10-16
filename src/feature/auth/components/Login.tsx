import { Button, Form, Input, notification } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "../api/login.api";

export default function Login() {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values: any) => {
    setLoading(true);
    login({ username: values.username, password: values.password })
      .then((data) => {
        localStorage.setItem("token", data.accessToken);
        api.info({
          message: "Login successful",
          description: "You have been logged in successfully",
          duration: 2,
          onClose: () => {
            navigate("/");
          },
        });
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            api.info({
              message: "Đăng nhập thất bại",
              description: "Thông tin đăng nhập không chính xác",
            });
          }
          if (error.response?.status === 500) {
            api.info({
              message: "Đăng nhập thất bại",
              description: "Lỗi máy chủ",
            });
          }
        } else {
          api.info({
            message: "Đăng nhập thất bại",
            description: "Lỗi không xác định",
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      {contextHolder}
      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        {/* <Form.Item name="remember" valuePropName="checked">
      <Checkbox>Remember me</Checkbox>
      </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
