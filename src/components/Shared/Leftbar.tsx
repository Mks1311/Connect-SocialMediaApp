import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector} from '@/hooks'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
import { Button } from '../ui/button'
import authService from '@/lib/appwrite/AuthService'
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useState } from 'react'
import Loader from './Loader'

function Leftbar() {
  const { toast } = useToast()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const [loading, setLoading] = useState(false);

  async function logoutClick() {
    setLoading(true)
    const logout = await authService.LogOut();
    if (!logout) {
      return toast({
        variant: "destructive",
        title: "Log out failed, Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
    else {
      navigate("/");
    }
    setLoading(false)
  }

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to="/home" className="flex gap-3 items-center">
          <img src="/Images/logo2.png"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
          <img
            src={user.imageUrl || "/Icons/profile-placeholder.svg"}
            alt='profile'
            className='h-14 w-14 rounded-full'
          />
          <div className='flex flex-col'>
            <p className='body-bold'>{user.name}</p>
            <p className='small-regular text-light-3'>@{user.username}</p>
          </div>
        </Link>
        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = ((pathname == link.route) || (pathname==`/profile/${user.id}/saved-posts`))
            return (
              <li key={link.label}
                className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}>
                <NavLink to={link.label==="Saved"?`/profile/${user.id}/saved-posts`:link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive && "invert-white"}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}

        </ul>
      </div>
      <Button variant="ghost" className=" shad-button_ghost hover:bg-primary-500 transition hover:stroke-white"
        onClick={logoutClick}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <img src="/Icons/logout.svg"
              alt="logout"
            />
            <p className='small-medium lg:base-medium'>Logout</p>
          </>
        )}

      </Button>
    </nav>
  )
}

export default Leftbar
