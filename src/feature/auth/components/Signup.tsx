import { useState } from 'react'
import { Input, Button, notification } from 'antd';
import { Form } from 'antd';
import signup from '../api/signup.api';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

export default function Signup() {

  const [api, contextHolder] = notification.useNotification()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignup = (values: any) => {
    setLoading(true);
    signup({ username: values.username, password: values.password })
      .then((data) => {
        api.info({
          message: 'Login successful',
          description: 'You have been logged in successfully',
          duration: 2,
          onClose: () => {
            navigate('/')
          }
        })
        localStorage.setItem('token', data.accessToken)
        navigate('/')
      })
      .catch(error => {
        if (error instanceof AxiosError)
          if (error.response?.status === 400) {
            api.info({
              message: 'Tạo tài khoản thất bại',
              description: 'Hãy thử sử dụng một username khác',
            })
          }
        if (error.response?.status === 500) {
          api.info({
            message: 'Đăng nhập thất bại',
            description: 'Lỗi máy chủ',
          })
        }

        else {
          api.info({
            message: 'Đăng nhập thất bại',
            description: 'Lỗi không xác định',
          })
        }
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  };

  return (
    <div>
      {contextHolder}

      <Form
        name="signup_form"
        initialValues={{ remember: true }}
        onFinish={handleSignup}
        layout="vertical"
      >
        {/* <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input />
            </Form.Item> */}

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
