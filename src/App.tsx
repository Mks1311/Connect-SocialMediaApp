import { Routes, Route } from "react-router-dom";
import "./globals.css"
import SignInForm from "./_auth/forms/SignInForm"
import SignUpForm from "./_auth/forms/SignUpForm"
import { Home,AllUsers,CreatePost,EditPost,Explore,Profile, UpdateProfile} from "./_root/Pages/index"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import { Toaster } from "@/components/ui/toaster"

function App() {
    return (
        <main className="flex h-screen">
            <Routes>

                <Route element={<AuthLayout />}>
                    {/*public routes */}
                    <Route index element={<SignInForm />} />
                    <Route path="/sign-up" element={<SignUpForm />} />
                </Route>

                <Route element={<RootLayout />}>
                    {/*private routes */}
                    <Route path="/home"  element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/all-users" element={<AllUsers />} />
                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/update-post/:id" element={<EditPost />} />
                    <Route path="/profile/:id/*" element={<Profile />} />
                    <Route path="/update-profile/:id/*" element={<UpdateProfile />} />
                </Route>
            </Routes>
            <Toaster />
        </main>
    )
}
export default App