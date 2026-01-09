import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Mail, ShieldCheck, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
// import { Password } from "@/components/ui/password";
import * as z from "zod";
import registerImg from "../assets/singUp.jpg";
const signupSchema = z
  .object({
    name: z.string().min(2, "Name is Required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password is required"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
    console.log(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-none shadow-none rounded-lg bg-card/80 backdrop-blur-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left Side: Image/Branding */}
          <div className="relative hidden md:block bg-primary/5">
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/40 to-background/20" />
            <img
              src={registerImg}
              alt="Register Illustration"
              className="absolute inset-0 h-auto w-auto object-cover dark:opacity-40 shadow"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 text-white">
              <h2 className="text-3xl font-black tracking-tighter mb-2 italic">
                Welcome to Employee Managments System(EMS)
              </h2>
              <p className="text-sm font-medium opacity-90 leading-relaxed max-w-xs">
                Join us today and take the first step towards efficient employee
                management!
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-6 md:p-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-5"
              >
                <div className="flex justify-between items-center">
                  <Link
                    to="/"
                    className="flex items-center text-sm font-semibold text-primary hover:gap-1 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back to Home
                  </Link>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    EMS
                  </span>
                </div>
                {/* this  */}
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-foreground">
                    Create Your Account
                  </h1>
                  <p className="text-xs font-medium text-muted-foreground">
                    Start your journey with us by creating an account.
                  </p>
                </div>

                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your name"
                              className="pl-10 h-11 bg-background/50 border-border/50 focus-visible:ring-1 rounded-md"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="name@email.com"
                              className="pl-10 h-11 bg-background/50 border-border/50 focus-visible:ring-1 rounded-md"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* role for user */}
                  {/* <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                          Account Type
                        </FormLabel>


                      </FormItem>
                    )}
                  /> */}

                  <div className=" gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                            Password
                          </FormLabel>
                          <FormControl>
                            <input
                              type="password"
                              className="h-11 bg-background/50 border-border/50 focus-visible:ring-1 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                            Confirm
                          </FormLabel>
                          <FormControl>
                            <input
                              type="password"
                              className="h-11 bg-background/50 border-border/50 focus-visible:ring-1 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-bold rounded-md shadow-none shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
                >
                  <ShieldCheck className="mr-2 h-4 w-4" /> Register Account
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground">
                    <span className="bg-card px-2">Or join with</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-11 rounded-md border-border/50 hover:bg-secondary font-semibold transition-all"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign Up with Google
                </Button>

                <p className="text-center text-sm font-medium text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-bold hover:underline underline-offset-4 transition-all"
                  >
                    Log In
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
