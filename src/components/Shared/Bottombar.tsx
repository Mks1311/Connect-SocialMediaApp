import { bottombarLinks } from '@/constants'
import { useAppSelector } from '@/hooks'
import { Link, useLocation } from 'react-router-dom'


function Bottombar() {
  const user=useAppSelector((state)=>state.auth.user)
  const { pathname } = useLocation()
  return (
    <section className='bottom-bar'>
      {bottombarLinks.map((link) => {
        const isActive = (
          (pathname==link.route) || (pathname===`/profile/${user.id}/saved-posts` && link.label=="Saved")
          )
        return (
          <Link to={link.route}
            key={`bottombar-${link.label}`}
            className={`${
              isActive && "rounded-[10px] bg-primary-500 "
            } flex-center flex-col gap-1 p-2 transition`}
          >
            <img
              height={16}
              width={16}
              src={link.imgURL}
              alt={link.label}
              className={` ${isActive && "invert-white"}`}
            />
            <p className='tiny-medium text-light-2'>{link.label}</p>

          </Link>
        )
      })}

    </section>
  )
}

export default Bottombar
