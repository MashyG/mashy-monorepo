"use client";

import { useStores } from "@/hook/useStore";
import { toStr } from "@/utils";
import { Input, Form, Button, message } from "antd";
import { observer } from "mobx-react";

export type LoginFormType = {
  username: string;
  password: string;
};

const formLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
  name: "loginForm",
};
const btnsLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const LoginForm: React.FC = observer(() => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { userStore } = useStores();

  const onFinish = (values: LoginFormType) => {
    fetch("/api/login", {
      method: "POST",
      body: toStr(values),
    })
      .then(async (res) => {
        const { token } = await res.json();
        userStore.setToken(token ?? "");
        messageApi.open({
          type: "success",
          content: "Success",
        });
      })
      .catch((e) => {
        messageApi.open({
          type: "error",
          content: "Error",
        });
      });
  };

  return (
    <>
      <div className="text-2xl">LOGIN</div>
      {contextHolder}
      <Form
        {...formLayout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
      >
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
    </>
  );
});

export default LoginForm;
