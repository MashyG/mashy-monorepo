"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { Headphones } from "lucide-react";
import TitleShow from "../TitleShow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { type ContactUsData } from "@/utils/baseData";

const formSchema = z.object({
  name: z.string().min(1, { message: "Please input name" }),
  companyName: z.string().min(1, { message: "Please input companyName" }),
  contactInfo: z.string().min(1, { message: "Please input contactInfo" }),
  desc: z.string().min(1, { message: "Please input message" }).max(100, {
    message: "Please input message less than 100 characters",
  }),
});

export function ContactUsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: "",
      companyName: "",
      contactInfo: "",
      desc: "",
    },
  });
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = form;

  const onSubmit = async (values: ContactUsData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
    reset();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="w-20">姓名:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input name" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="w-20">公司名称:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input companyName" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="w-20">联系方式:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please input contactInfo" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="desc"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="w-20">备注:</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Please input message" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            disabled={isSubmitting}
            type="submit"
            className="mt-2 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            提交
          </Button>
        </form>
      </Form>
    </>
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
