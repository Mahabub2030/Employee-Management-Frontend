/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
} from "@/redux/features/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const Verify = () => {
  const location = useLocation();
  const [email] = useState(location.state);
  const [confirm, setConfirm] = useState(false);
  const [timer, setTimer] = useState(120);
  const navigate = useNavigate();
  const [sendOTP] = useSendOTPMutation();
  const [verifyOTP] = useVerifyOTPMutation();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let toastId: string | number | undefined;
    try {
      const userInfo = {
        email: email,
        otp: data.pin,
      };
      toastId = toast.loading("Verifying OTP...");
      const res = await verifyOTP(userInfo).unwrap();
      if (res.success) {
        toast.success("OTP verified successfully", { id: toastId });
        navigate("/login");
      }
    } catch (error: any) {
      if (toastId) {
        toast.error(error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      } else {
        toast.error("Failed to verify OTP");
      }
      console.error("Failed to verify OTP:", error);
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (!email || !confirm) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [email, confirm]);

  const handleSendOtp = async () => {
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading("Sending OTP...");
      const res = await sendOTP({ email: email }).unwrap();
      if (res.success) {
        toast.success("OTP sent successfully", { id: toastId });
        setConfirm(true);
        setTimer(120);
      }
    } catch (error: any) {
      if (toastId) {
        toast.error(error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      } else {
        toast.error("Failed to send OTP");
      }
      console.error("Failed to send OTP:", error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <Helmet>
        <title>Verify - Wallet</title>
        <meta name="description" content="This is Verify Page" />
      </Helmet>
      {confirm ? (
        <Card className="w-full max-w-sm p-6 shadow-lg ">
          <CardHeader className="text-center">
            <CardTitle>Verify your email address</CardTitle>
            <CardDescription>
              Please enter the 6-digit code we sent to <br /> {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="sr-only">
                        Please enter the one-time password sent to your phone.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="link"
                  type="button"
                  onClick={handleSendOtp}
                  disabled={timer > 0}
                  className={cn("p-0 mt-0", {
                    "cursor-pointer": timer === 0,
                    "cursor-not-allowed": timer > 0,
                  })}
                >
                  <span>Resend OTP: </span>
                </Button>
                <span className="ml-1 font-semibold">
                  {`${Math.floor(timer / 60)}:${String(timer % 60).padStart(
                    2,
                    "0"
                  )}`}
                </span>
                <Button className="w-full mt-4" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Verify Your email address</CardTitle>
            <CardDescription>
              We Will send you an OTP at <br /> {email}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" onClick={handleSendOtp} className="w-full">
              Confirm
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Verify;
