import {  z } from "zod"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ToastAction } from "@/components/ui/toast"
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
import { SignupValidation } from "@/lib/Validation"
import Loader from "@/components/Shared/Loader"
import { Link , useNavigate } from "react-router-dom"
import authService from "@/lib/appwrite/AuthService"
import { useState,useEffect } from "react"


function SignUpForm() {
  const { toast } = useToast()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  async function getUserData(){
    setLoading(true);
    try {
      const currentUser=await authService.getCurrentUserData()
      if(currentUser){
        navigate("/home")
      }
      setLoading(false)
      
    } catch (error) {
      setLoading(false)
      console.log("SignInForm::getUserData::",error);
      
    }
    setLoading(false)
  }

  useEffect(() => {
    getUserData()
  }, []);


  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    setLoading(true)
    try {
      const newUser = await authService.createUserAccount(values)
      if (!newUser) {
        setLoading(false)
        return toast({
          //varient not working
          variant: "destructive",
          title: "Sign up failed, Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }

      const signIn = await authService.LogIn({
        email: values.email,
        password: values.password,
      });

      if (!signIn) {
        setLoading(false)
        toast({ title: "Something went wrong. Please login to your new account", });
        navigate("/");
        return;
      }
      const isLoggedIn = await authService.getCurrentUser();

      if (isLoggedIn) {
        setLoading(false)
        form.reset();
        navigate("/home");
      } 
      else {
        setLoading(false)
        toast({ title: "Login failed. Please try again.", });
        return;
      }
    } catch (error) {
      setLoading(false)
      console.log("sign-up form onsubmit", error);
    }
    setLoading(false)
  }

  return (
    <div className="h-screen">
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col mx-3">
        <img className="m-2"
          src="/Images/logo2.png"
        />
        <h2 className="h3-bold m-2 md:h2-bold sm:pt-4">Create a new account</h2>
        <p className="m-2 text-light-3 small-medium md:base-regular">To use Connect, Please enter your details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="Enter Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              "Sign Up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center">
            Already have an account?
            <Link to="/" className="text-primary-500 text-small-semibold ml-1">Log In</Link>
          </p>
        </form>
      </div >
    </Form>
    </div>
  )
}

export default SignUpForm
