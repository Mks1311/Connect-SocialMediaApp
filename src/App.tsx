import { Routes, Route } from "react-router-dom";
import "./globals.css"
import SignInForm from "./_auth/forms/SignInForm"
import SignUpForm from "./_auth/forms/SignUpForm"
import { Home,AllUsers,CreatePost,EditPost,Explore,Profile,UpdateProfile,PostDetails } from "./_root/Pages/index"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import { Toaster } from "@/components/ui/toaster"
import { useAppSelector } from "./hooks";

function App() {
    const user=useAppSelector((state)=>state.auth.user)
    return (
        <main className="flex h-screen">
            <Routes>

                <Route element={<AuthLayout />}>
                    {/*public routes */}
                    <Route path="/sign-in" element={<SignInForm />} />
                    <Route path="/sign-up" element={<SignUpForm />} />
                </Route>

                <Route element={<RootLayout />}>
                    {/*private routes */}
                    <Route index element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/all-users" element={<AllUsers />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/update-post/:id" element={<EditPost />} />
                    <Route path="/posts/:id" element={<PostDetails />} />
                    <Route path="/profile/:id/*" element={<Profile />} />
                </Route>
            </Routes>
            <Toaster />
        </main>
    )
}
export default App