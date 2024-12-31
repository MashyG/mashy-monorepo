"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Headphones } from "lucide-react";
import TitleShow from "../TitleShow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type ContactUsData } from "@/utils/baseData";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  companyName: z.string(),
  contactInfo: z.string().min(2).max(50),
  message: z.string().min(2).max(100),
});

export function ContactUsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema as any),
  });

  const onSubmit = async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    reset();
  };

  const clientAction: SubmitHandler<ContactUsData> = async (
    formData: FormData
  ) => {
    const submitData = {
      name: formData.get("name"),
      companyName: formData.get("companyName"),
      contactInfo: formData.get("contactInfo"),
      message: formData.get("message"),
    };

    // 客户端校验
    const result = formSchema.safeParse(submitData);
    if (!result.success) {
      console.error(result.error.issues[0].message);
      return;
    }

    console.log("success ==== > ", result);
    reset();
    // TODO 提交给服务端
    // const response = await submitContactUsData(result.data);
    // if (response?.error) {
    //   console.error(response.error);
    //   return;
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
      <div className="flex items-center">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-6 text-gray-900 w-20"
        >
          姓名:
        </label>
        <Input
          id="name"
          {...register("name")}
          type="text"
          required
          className="flex-1 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
        />
      </div>
      <div className="flex items-center">
        <label
          htmlFor="companyName"
          className="text-sm font-medium leading-6 text-gray-900 w-20"
        >
          公司名称:
        </label>
        <Input
          id="companyName"
          {...register("companyName")}
          type="text"
          className="flex-1 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
        />
      </div>
      <div className="flex items-center">
        <label
          htmlFor="contactInfo"
          className="text-sm font-medium leading-6 text-gray-900 w-20"
        >
          联系方式:
        </label>
        <Input
          id="contactInfo"
          {...register("contactInfo")}
          type="text"
          required
          className="flex-1 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
        />
      </div>
      <div className="flex items-center">
        <label
          htmlFor="message"
          className="text-sm font-medium leading-6 text-gray-900 w-20"
        >
          备注:
        </label>
        <Textarea
          id="message"
          {...register("message")}
          required
          className="flex-1 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
        />
      </div>
      <Button
        type="submit"
        className="w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        提交
      </Button>
    </form>
  );
}

export default function ContactUs() {
  return (
    <div>
      <TitleShow title="Contact us" titleStyle="text-blue-600">
        <Headphones className="mr-1" />
      </TitleShow>
      <ContactUsForm />
    </div>
  );
}
