
import { useParams, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react';
import authService from '@/lib/appwrite/AuthService';
import Loader from '@/components/Shared/Loader';
import { useAppSelector } from '@/hooks';
import { Routes, Route, Outlet } from 'react-router-dom';
import GridPostList from '@/components/Shared/GridPostList';
import LikedPosts from './LikedPosts';
import SavedPosts from './SavedPosts';

function Profile() {
  const { id } = useParams()
  const user = useAppSelector(state => state.auth.user)
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserData, setUserData] = useState<any>(null);
  const { pathname } = useLocation()

  async function userData() {
    setIsLoading(true)
    try {
      const currentData = await authService.getUserById(id || "")
      if (!currentData) {
        console.log("Profile::userData::currentUserData");
      }
      setUserData(currentData)

    } catch (error) {
      console.log("Profile::userData::", error);
    }
    setIsLoading(false)
  }

  useEffect(() => {
    userData();
  }, [id])


  return (
    <>
      {isLoading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="profile-container">
          <div className="profile-inner_container">
            <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
              <img
                src={
                  currentUserData.imageUrl || "Icons/profile-placeholder.svg"
                }
                alt="profile"
                className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
              />
              <div className="flex flex-col flex-1 justify-between md:mt-2">
                <div className="flex flex-col w-full">
                  <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                    {currentUserData.name}
                  </h1>
                  <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                    @{currentUserData.username}
                  </p>
                </div>

                {/* <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                  <StatBlock value={currentUserData.posts.length} label="Posts" />
                  <StatBlock value={20} label="Followers" />
                  <StatBlock value={20} label="Following" />
                  Post,follower,followers
                </div> */}

                <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                  {currentUserData.bio}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <div className={`${user?.id !== currentUserData.$id && "hidden"}`}>
                  <Link
                    to={`/update-profile/${currentUserData.$id}`}
                    className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user?.id !== currentUserData.$id && "hidden"
                      }`}>
                    <img
                      src={"/Icons/edit.svg"}
                      alt="edit"
                      width={20}
                      height={20}
                    />
                    <p className="flex whitespace-nowrap small-medium">
                      Edit Profile
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>


          <div className="flex max-w-5xl w-full">
            <Link
              to={`/profile/${id}`}
              className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"
                }`}>
              <img
                src={"/Icons/posts.svg"}
                alt="posts"
                width={20}
                height={20}
              />
              Posts
            </Link>
            {currentUserData.$id === user?.id && (
              <>
                <Link
                  to={`/profile/${id}/liked-posts`}
                  className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
                    }`}>
                  <img
                    src={"/Icons/like.svg"}
                    alt="like"
                    width={20}
                    height={20}
                  />
                  Liked
                </Link>

                <Link
                  to={`/profile/${id}/saved-posts`}
                  className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/saved-posts` && "!bg-dark-3"
                    }`}>
                  <img
                    src={"/Icons/save.svg"}
                    alt="save"
                    width={20}
                    height={20}
                  />
                  Saved
                </Link>
              </>
            )}
          </div>

          <Routes>
            <Route
              index
              element={<GridPostList posts={currentUserData.posts} showUser={false} />}
            />
            
            {currentUserData.$id === user.id && (
              <Route>
              <Route path="/liked-posts" element={<LikedPosts />} />
              <Route path="/saved-posts" element={<SavedPosts />} />
              </Route>
            )}
           
          </Routes>
          {/* <Outlet /> */}
        </div>
      )}
    </>
  )
}

export default Profile
