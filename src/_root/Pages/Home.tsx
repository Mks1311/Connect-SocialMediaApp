import authService from "@/lib/appwrite/AuthService"
import { useEffect, useState } from "react";
import PostCard from "@/components/Shared/PostCard";
import Loader from "@/components/Shared/Loader";

function Home() {
  const [currentPost, setCurrentPost] =useState<any>(null);
  const [loading,setLoading]=useState(true);
  async function getCurrentposts() {
    try {
      setLoading(true)
      let posts = await authService.getRecentPost();
      if (!posts) {
        console.log("Home::CurrentPosts::posts");
      }
      setCurrentPost(posts)
      setLoading(false)
    } catch (error) {
      console.log("Home::CurrentPosts::", error);
    }
  }
  useEffect(() => {
    getCurrentposts();
  }, [])


  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold text-left w-full'>Feed</h2>
          {loading?(
            <Loader/>
          ):(
            <ul className="flex flex-col flex-1 gap-9 w-full">
            {currentPost?.documents?.map(((post:any)=>(
              <PostCard post={post} key={post?.caption}/>
            )))}
          </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
