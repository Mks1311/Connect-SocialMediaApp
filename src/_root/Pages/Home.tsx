import authService from "@/lib/appwrite/AuthService"
import { useEffect, useState } from "react";
import PostCard from "@/components/Shared/PostCard";
import Loader from "@/components/Shared/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

function Home() {
  const [currentPost, setCurrentPost] = useState<any>({ total: 0, documents: [] });
  const [lastId, setLastId] = useState<any>("")
  const [loadmore, setLoadmore] = useState(true);

  const addDocument = (newDocument: any) => {
    if (currentPost.documents.length == 0) {
      setCurrentPost({
        total: newDocument.total,
        documents: newDocument.documents,
      });
    }
    else {
      const mergedDocuments = [...currentPost.documents, ...newDocument.documents];
      setCurrentPost({
        total: newDocument.total,
        documents: mergedDocuments,
      })
    }
  };

  async function getCurrentposts() {
    try {
      let posts = await authService.getRecentPost(lastId);
      if (!posts) {
        console.log("Home::CurrentPosts::posts");
      }
      addDocument(posts)
      if (currentPost?.documents?.length == posts?.total) {
        setLoadmore(false)
      }
      setLastId(posts?.documents[posts?.documents?.length-1].$id)
    } catch (error) {
      console.log("Home::CurrentPosts::", error);
    }
  }
  useEffect(() => {
    getCurrentposts();
  }, [])


  return (
    <div className='flex flex-1'>
      <div className='home-container' id="scrollDiv">
        <div className='home-posts' >
          <h2 className='h3-bold md:h2-bold text-center w-full'>Feed</h2>
            <InfiniteScroll
              dataLength={currentPost.documents.length}
              next={getCurrentposts}
              hasMore={loadmore}
              loader={<Loader />}
              scrollableTarget="scrollDiv"
              endMessage={
                <p style={{ textAlign: "center", marginTop: "20px", font: "40px" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              <ul className="grid-container">
                {currentPost?.documents?.map(((post: any) => (
                  <PostCard post={post} key={post?.$id} />
                )))}
              </ul>
            </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}

export default Home
