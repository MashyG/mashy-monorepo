"use client";

import { useStores } from "@/hook/useStore";
import { addUser } from "@/lib/api";
import { toStr } from "@/utils";
import { Input, Form, Select, Button, message } from "antd";
import { observer } from "mobx-react";

export type UserFormType = {
  username: string;
  password: string;
  type: string;
};

const typeOptions = [
  {
    value: "0",
    label: "超级管理员",
  },
  {
    value: "1",
    label: "普通用户",
  },
];
const formLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
  name: "userForm",
};
const btnsLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const UserForm: React.FC = observer(() => {
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  const { userStore } = useStores();

  const onFinish = async (values: UserFormType) => {
    try {
      await addUser(values);
      messageApi.success("ADD Success!");
    } catch (error) {
      messageApi.warning("ADD unSuccess!");
    }
  };

  const onTypeChange = (value: string) => {
    form.setFieldsValue({ type: value });
  };

  return (
    <>
      <div className="text-2xl">UserForm</div>
      {contextHolder}
      <Form
        {...formLayout}
        form={form}
        initialValues={{ type: "1" }}
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
        <Form.Item name="type" label="type" rules={[{ required: true }]}>
          {/* 超管才可以有以下表单 */}
          <Select
            placeholder="please select type"
            onChange={onTypeChange}
            options={typeOptions}
          />
        </Form.Item>
        <Form.Item {...btnsLayout}>
          <Button type="primary" htmlType="submit">
            ADD
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={() => messageApi.success("Success" + userStore.token)}>
        LOGIN
      </Button>
    </>
  );
});

export default UserForm;
