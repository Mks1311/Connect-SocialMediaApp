import GridPostList2 from "@/components/Shared/GridPostList2"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import authService from "@/lib/appwrite/AuthService"
import Loader from "@/components/Shared/Loader"
import InfiniteScroll from "react-infinite-scroll-component"
import SearchComponent from "@/components/Shared/SearchComponent"

function Explore() {
  const [srcValue, setSrcValue] = useState("")
  const [PostData, setPostData] = useState<any>({ total: 0, documents: [] });
  const [loadmore, setLoadmore] = useState(true);
  const [lastId, setLastId] = useState<any>("")

  const addDocument = (newDocument: any) => {
    console.log(PostData);
    if (PostData.documents.length == 0) {
      setPostData({
        total: newDocument.total,
        documents: newDocument.documents,
      });
    }
    else {
      const mergedDocuments = [...PostData.documents, ...newDocument.documents];
      setPostData({
        total: newDocument.total,
        documents: mergedDocuments,
      })
    }
    console.log("lastId", lastId);
  };

  async function getPostData() {
    try {
      console.log("last", lastId);
      const post = await authService.getPosts(lastId)
      if (!post) {
        console.log("Profile::userData::currentUserData");
      }
      addDocument(post)
      if (PostData?.documents?.length == post?.total) {
        setLoadmore(false)
      }
      setLastId(post?.documents[post?.documents?.length-1].$id)
      console.log("PostData", PostData);
    } catch (error) {
      console.log("Explore::userData::", error);
    }
  }

  useEffect(() => {
    getPostData()
  }, [])

  const showSrcResult = srcValue !== ""

  return (
    <div className="explore-container " id="scrollDiv">
      <div className="explore-inner_container ">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/Icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="search"
            className="explore-search"
            value={srcValue}
            onChange={(e) => setSrcValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7 ">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {showSrcResult ? (
          <SearchComponent 
          srcValue={srcValue}
          />
        ) : (
          <InfiniteScroll
            dataLength={PostData.documents.length}
            next={getPostData}
            hasMore={loadmore}
            loader={<Loader />}
            scrollableTarget="scrollDiv"
            endMessage={
              <p style={{ textAlign: "center",marginTop:"20px",font:"40px" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >

            <ul className="grid-container !max-w-screen-xl">{
              PostData?.documents?.map((item: any, index: any) => (
                <GridPostList2 key={`page-${index}`} post={item} />
              ))
            }
            </ul>
          </InfiniteScroll>
        )}
      </div>
    </div >
  )
}

export default Explore
