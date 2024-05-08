import { Models } from "appwrite";
import { Link, Routes, Route } from "react-router-dom";

import PostStats from "@/components/Shared/PostStats"
import { useAppSelector } from "@/hooks";
import { Profile } from "@/_root/Pages";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const user = useAppSelector((state) => state.auth.user)
  posts?.reverse();
  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={post?.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post?.$id}`} className="grid-post_link">
            <img
              src={post?.imageUrl}
              alt="post"
              className="h-full w-full object-contain"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (

              <div className="flex items-center justify-start gap-2 flex-1">
                <Link to={`/profile/${post?.creator?.$id}`} >
                  <img
                    src={
                      post?.creator?.imageUrl ||
                      "/Icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 rounded-full"
                  />
                </Link>
                <Link to={`/profile/${post?.creator?.$id}`}>
                  <p className="line-clamp-1">{post?.creator?.name}</p>
                </Link>
              </div>
              
            )}
            {showStats && <PostStats post={post} userId={user?.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;