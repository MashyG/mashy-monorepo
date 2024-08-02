"use client";

import { useStores } from "@/hook/useStore";
import { login } from "@/lib/api";
import { Input, Form, Button, message } from "antd";
import { observer } from "mobx-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type LoginFormType = {
  username: string;
  password: string;
};

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  name: "loginForm",
};
const btnsLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const LoginForm: React.FC = observer(() => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [currToken, setCurrToken] = useState("");

  useEffect(() => {
    if (currToken) {
      redirect("/home");
    }
  }, [currToken]);

  const { userStore } = useStores();

  const onFinish = (values: LoginFormType) => {
    login(values)
      .then(async (res) => {
        const { token } = await res.json();
        userStore.setToken(token ?? "");
        messageApi.success("LOGIN Success!");
        setTimeout(() => {
          setCurrToken(token);
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
        messageApi.warning("LOGIN unSuccess!");
      });
  };

  return (
    <div>
      <div className="border border-white rounded-xl p-4 bg-white">
        <div className="text-2xl text-center m-4">LOGIN</div>
        {contextHolder}
        <Form {...formLayout} form={form} onFinish={onFinish}>
          <Form.Item
            name="username"
            label="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="please input username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="please input password" />
          </Form.Item>
          <Form.Item {...btnsLayout}>
            <Button type="primary" htmlType="submit">
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});

export default LoginForm;
