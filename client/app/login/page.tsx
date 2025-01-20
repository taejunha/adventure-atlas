'use client'

import Link from "next/link";
import { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm} from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

    /* button submit */
    // data contains field values above
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.ok) {
        toast.success("You have successfully logged in.");
        router.refresh(); 
        router.push('/');
      } else if (callback?.error) {
        toast.error(callback.error);
    }
    });
  };

    return (
      <div className="overflow-y-hidden flex flex-col items-center justify-center h-screen bg-gray-100">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="bg-white p-12 rounded-lg shadow-md"
        >
        <h1 className="text-2xl font-bold mb-6 flex flex-col justify-center items-center">Welcome Back!</h1>
        
        <button className="px-4 py-2 border flex gap-2 border-slate-400 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
          <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
        <span className="text-black">Continue with Google</span>
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-4 text-gray-500">Or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="*******"
              {...register("password", { required: "Password is required" })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="py-2 text-gray-400 text-sm">Don't have an account?  
          <Link href="signup" className="text-gray-600"> Sign up</Link>
        </p>
      </div>
    );
  }
  