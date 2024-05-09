"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { requestSetPasswordSchema } from "./schema";
import { User } from "@prisma/client";
import useSessionContext from "@/hooks/useSessionContext";

const formSchema = requestSetPasswordSchema;

type UserFormValue = z.infer<typeof formSchema>;

const RequestResetPasswordForm = () => {
  const { signOut } = useSessionContext();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      const response = await fetch("/api/auth/request-reset-password", {
        method: "POST",
        body: JSON.stringify(data),
        redirect: "follow",
      });
      if (response.ok) {
        await response.json();
        signOut();
      } else {
        if (response.status === 400) {
          const errors = await response.json();

          for (const key in errors) {
            const errorMessage = (errors[key]._errors as string[]).join(",");

            form.setError(key as any, {
              message: errorMessage,
            });
          }
        }
        console.log();
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g platven@gmail.com"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            className="ml-auto w-full"
            type="submit"
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </>
  );
};

export default RequestResetPasswordForm;