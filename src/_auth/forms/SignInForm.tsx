import { string, z } from "zod"
// import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from "@/lib/Validation"
import Loader from "@/components/Shared/Loader"
import { Link , useNavigate } from "react-router-dom"
import authService from "@/lib/appwrite/AuthService"
import { useState } from "react"

function SignInForm() {
  const { toast } = useToast()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      password: "",
      email: "",
    },
  })

  // useEffect(() => {
  //   const cookieFallback = localStorage.getItem("cookieFallback");
  //   if (
  //     cookieFallback === "[]" ||
  //     cookieFallback === null ||
  //     cookieFallback === undefined
  //   ) {
  //     navigate("/sign-in");
  //   }

  //   authService.getCurrentUser();
  // }, []);

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    setLoading(true)
    
    try {
      const signIn = await authService.LogIn({
        email: values.email,
        password: values.password,
      });

      if (!signIn) {
        toast({ title: "Something went wrong. Please try again", });
        return;
      }
      const isLoggedIn = await authService.getCurrentUser();

      if (isLoggedIn) {
        console.log("logged in");
        form.reset();
        navigate("/");
      } 
      else {
        console.log("no logged in");
        toast({ title: "Login failed. Please try again.", });
        return;
      }

    } catch (error) {
      console.log("sign-up form onsubmit", error);
    }
    setLoading(true)
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col mx-3">
        <img className="m-2"
          src="/Images/logo2.png"
        />
        <h2 className="h3-bold m-2 md:h2-bold sm:pt-4">Login to your account</h2>
        <p className="m-2 text-light-3 small-medium md:base-regular">Please enter your details to CONNECT</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="shad-input"
                    placeholder="Enter your Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="shad-input"
                    placeholder="Enter your Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit"
            className="shad-button_primary"

          >
            {loading? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center">
            Didn't CONNECT ?! 
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1"> Sign Up</Link>
          </p>
        </form>
      </div >
    </Form>
  )
}

export default SignInForm
