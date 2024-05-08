import authService from "@/lib/appwrite/AuthService";
import { Models } from "appwrite"
import { useEffect, useState } from "react";
import { checkIsPresent } from "@/lib/utils";
import { useAppSelector } from "@/hooks";
import Loader from "./Loader";

type PostStatProps = {
  post: Models.Document;
  userId: string;
}

function PostStats({ post, userId }: PostStatProps) {
  console.log("post",post?.creator?.username);
  
  const [isSaved, isSetSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postId,setPostId]=useState("")
  let currentUserData;

  async function UserData() {
    setIsLoading(true)
    try {
      currentUserData = await authService.getCurrentUserData();
      console.log("getUserData", currentUserData);
      if (!currentUserData) {
        console.log("PostStats::currentUserData::in try");
      } else {
        const savedPostRecord = (currentUserData?.saves?.find(
          (record: Models.Document) => record.post.$id === post.$id
        ));
        console.log("savedPostRecord", savedPostRecord?.$id);
        setPostId(savedPostRecord?.$id)
        console.log("postId",postId);
        
        isSetSaved(savedPostRecord === undefined ? false : true)
      }
    } catch (error) {
      console.log("PostStats::currentUserData::", error);

    }
    setIsLoading(false)
  }
  // const [saving,setSaving]=useState(false);
  // const savedPostRecord = currentUserData?.saves?.find(
  //   (record: Models.Document) => record.post.$id === post.$id
  // );
  // console.log("savedPostRecord", savedPostRecord);


  useEffect(() => {
    UserData()
  }, [])

  const likesList = post.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState<string[]>(likesList);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }
    setLikes(likesArray);
    const like = authService.LikePost(post.$id, likesArray);
    if (!like) {
      console.log("PostStats::handleLikePost::like");
    }
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (isSaved) {
      isSetSaved(false);
      console.log("postID",postId);
      
      return authService.deleteSavePost(postId);
    }
    console.log("PostStats::hanldeSave",post);
    
    authService.SavePost(userId, post.$id);
    isSetSaved(true);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";


  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${checkIsPresent(likes, userId)
            ? "/Icons/liked.svg"
            : "/Icons/like.svg"
            }`}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isLoading ? (
          <Loader />
        ) : (
          <img
            src={`${isSaved
              ? "/Icons/saved.svg"
              : "/Icons/save.svg"
              }`}
            alt="like"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}

      </div>

    </div>
  )
}

export default PostStats
