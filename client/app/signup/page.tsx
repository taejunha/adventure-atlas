'use client'

import Link from "next/link";
import axios from "axios";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");

    const {
      register,
      handleSubmit,
      formState: {errors},
    } = useForm<FieldValues>({
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
    });

    /* button submit */
    // data contains field values above
    const onSubmit: SubmitHandler<FieldValues> = (data) => {
      // console.log("Submitted Data:", data);
      setIsLoading(true);
      setEmailError("");

      axios
        .post("/api/register", data)
        .then(() => {
          toast.success("Account created successfuly!");
        })
      .catch((error) => {
        if (error.response?.status === 409) {
          toast.error("This email is already in use. Please try another one.");
        } else {
        toast.error("Oopsies. Cleanup on aisle 404!");
        }
        })
      .finally(() => {
        setIsLoading(false);
        });
    };

    return (
      <div className="overflow-y-hidden flex flex-col items-center justify-center h-screen bg-gray-100">
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-12 rounded-lg shadow-md"
        >
        <h1 className="text-2xl flex flex-col items-center justify-center font-bold mb-6">Create an account!</h1>

        <button 
          type="button"
          onClick={() => signIn("google")}
          className="px-4 py-2 border flex gap-2 border-slate-400 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
        >
          <FcGoogle className="w-6 h-6" /> 
          <span className="text-black">Continue with Google</span>
        </button>

        <div className="flex items-center my-4">
           <hr className="flex-grow border-t border-gray-300" />
          <span className="px-4 text-gray-500">Or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="John Doe"
              {...register("name", { required: "Name is required" })}
            />
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {/*  Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="*******"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <p className="py-2 text-gray-400 text-sm">Already have an account?  
          <Link href="/login" className="text-gray-600"> Log in</Link>
        </p>
    </div>
    );
  }
  