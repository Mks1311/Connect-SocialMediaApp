import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import authService from "@/lib/appwrite/AuthService";
import Loader from "@/components/Shared/Loader";
import PostForm from "@/components/Forms/PostForm";

function EditPost() {
  const { id } = useParams();
  const [postData, setPostData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getPostData() {
    setIsLoading(true)
    try {
      const currentData = await authService.getPostById(id ? id : "")
      if (!currentData) {
        setIsLoading(false)
        console.log("Profile::userData::currentUserData");
      }
      setPostData(currentData)
      setIsLoading(false)
    } catch (error) {
      console.log("Profile::userData::", error);
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    getPostData()
  },[id])

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/Icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isLoading ? <Loader /> : <PostForm action="Update" post={postData} />}
      </div>
    </div>
  )
}

export default EditPost
