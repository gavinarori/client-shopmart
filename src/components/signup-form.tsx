"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Eye, EyeOff, X } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { customer_register, messageClear } from "../store/reducers/authReducer";

interface SignUpState {
  name: string;
  email: string;
  password: string;
}

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { loader, successMessage, errorMessage } = useSelector(
    (state: any) => state.auth
  );

  const [state, setState] = useState<SignUpState>({
    name: "",
    email: "",
    password: "",
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const inputHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!state.name || !state.email || !state.password) {
      toast.error("All fields are required!");
      return;
    }

    dispatch(customer_register(state));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      router.push("/login");
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, router]);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(state.password);
  const strengthScore = useMemo(
    () => strength.filter((req) => req.met).length,
    [strength]
  );

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={submit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            value={state.name}
            onChange={inputHandle}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={state.email}
            onChange={inputHandle}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              className="pe-9"
              placeholder="Password"
              type={isVisible ? "text" : "password"}
              value={state.password}
              onChange={inputHandle}
              aria-invalid={strengthScore < 4}
              aria-describedby="password-strength"
            />
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 transition-colors hover:text-foreground focus:z-10"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
              aria-pressed={isVisible}
              aria-controls="password"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div
          className="h-1 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={strengthScore}
          aria-valuemin={0}
          aria-valuemax={4}
        >
          <div
            className={`h-full ${getStrengthColor(
              strengthScore
            )} transition-all duration-500`}
            style={{ width: `${(strengthScore / 4) * 100}%` }}
          />
        </div>

        <p id="password-strength" className="text-sm font-medium text-foreground">
          {getStrengthText(strengthScore)}. Must contain:
        </p>

        <ul className="space-y-1.5">
          {strength.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              {req.met ? (
                <Check size={16} className="text-emerald-500" />
              ) : (
                <X size={16} className="text-muted-foreground/80" />
              )}
              <span
                className={req.met ? "text-emerald-600" : "text-muted-foreground"}
              >
                {req.text}
              </span>
            </li>
          ))}
        </ul>

        <Button type="submit" className="w-full" disabled={loader}>
          {loader ? "Signing up..." : "Sign up"}
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline">
          Sign in
        </a>
      </div>
    </form>
  );
}
