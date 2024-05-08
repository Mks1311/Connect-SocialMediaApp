import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import authService from "@/lib/appwrite/AuthService"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "@/hooks"
import { useState } from "react"
import Loader from "./Loader"


function Topbar() {
    const { toast } = useToast()
    const navigate = useNavigate()
    const user = useAppSelector((state) => state.auth.user)
    const [loading, setLoading] = useState(false);

    async function logoutClick() {
        setLoading(true);
        const logout = await authService.LogOut();
        if (!logout) {
            return toast({
                variant: "destructive",
                title: "Log out failed, Please try again.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
        else {
            navigate("/home");
        }
        setLoading(true);
    }

    return (
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to="/home" className="flex gap-3 items-center">
                    <img src="/Images/logo2.png"
                        alt="logo"
                        width={130}
                        height={325}
                    />
                </Link>
                <div className="flex gap-4">
                    <Button variant="ghost" className="shad-button_ghost"
                        onClick={logoutClick}
                    >
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <img src="/Icons/logout.svg"
                                    alt="logout"
                                />
                                
                            </>
                        )}
                    </Button>
                    <Link to={`/profile/${user.id}`}
                        className="flex-center gap-3"
                    >
                        <img
                            src={user.imageUrl || "/Icons/profile-placeholder.svg"}
                            alt="profile"
                            className="h-8 w-8 rounded-full"
                        />
                    </Link>
                    <ul className="flex flex-col gap-6">

                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Topbar
