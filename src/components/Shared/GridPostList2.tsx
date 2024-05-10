import { Link, useLocation } from "react-router-dom";

import PostStats from "@/components/Shared/PostStats"
import { useAppSelector } from "@/hooks";

type GridPostListProps = {
    post: any;
    showUser?: boolean;
    showStats?: boolean;
};

const GridPostList = ({
    post,
    showUser = true,
    showStats = true,
}: GridPostListProps) => {
    const user = useAppSelector((state) => state.auth.user)
    const { pathname } = useLocation()
    const shouldLink = (pathname == `/profile/${user.id}`)
    return (

        <li key={post?.$id} className="relative min-w-80 h-80">
            {
                shouldLink ? (
                    <Link to={`/update-post/${post?.$id}`}>
                        <img
                            src={post?.imageUrl}
                            alt="post"
                            className="h-full w-full object-contain"
                        />
                    </Link>
                ) : (
                    <img
                        src={post?.imageUrl}
                        alt="post"
                        className="h-full w-full object-contain"
                    />
                )
            }


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
    );
};

export default GridPostList;