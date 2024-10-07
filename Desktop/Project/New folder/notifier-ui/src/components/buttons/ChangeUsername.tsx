"use client";

import React from "react";
import { HiPencilAlt } from "react-icons/hi";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { revalidateTag } from "next/cache";
import { BASE_URL } from "@/constant/constant";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 3 characters.",
  }),
});

function ChangeUsername({
  initalName,
  token,
}: {
  initalName: string;
  token: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: initalName,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await fetch(`${BASE_URL}/api/users/username`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: data.username,
      }),
    });

    if (!res.ok) {
      if (res.status === 400) {
        const response = await res.json();
        return form.setError("username", {
          message: response.errors[0].msg,
        });
      }
      if (res.status === 409) {
        const response = await res.json();
        screen;
        return form.setError("username", {
          message: response.message,
        });
      }
      return;
    }

    const response = await res.json();
    window.location.reload();
  }
  return (
    <Dialog>
      <DialogTrigger>
        {" "}
        <HiPencilAlt />
      </DialogTrigger>
      <DialogContent className="bg-gray-900">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="shadcn"
                      style={{ color: "black" }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    username is unique to each user.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="secondary">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeUsername;
