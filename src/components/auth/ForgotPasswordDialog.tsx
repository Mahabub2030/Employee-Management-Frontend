/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import z from "zod";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof emailSchema>;

const ForgotPasswordDialog = () => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <a>forgot password</a>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            Enter your email address to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium ">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="w-full"
            >
              Reset Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
