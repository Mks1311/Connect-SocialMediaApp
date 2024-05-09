import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { multiFormatDateString } from "@/lib/utils"
import { useAppSelector } from "@/hooks"
import PostStats from "./PostStats"

type PostCardProps = {
    post: Models.Document
}

function PostCard({ post }: PostCardProps) {

    const user = useAppSelector((state) => state.auth.user)

    return (
        <div className="post-card">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post?.creator?.$id}`}>
                        <img
                            src={post?.creator?.imageUrl || "/Icons/profile-placeholder.svg"}
                            alt="creator"
                            className="rounded-full w-12 lg:hg-12"
                        />
                    </Link>
                    <div className="flex flex-col">
                        <Link to={`/profile/${post?.creator?.$id}`}>
                            <p className="base-medium lg:body-bold text-light-1">{post?.creator?.username}</p>
                        </Link>

                        <div className="flex-center gap-2 text-light-1">
                            <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.$createdAt)}</p>

                            -

                            <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                        </div>

                    </div>
                </div>
                <Link to={`/update-post/${post?.$id}`}
                    className={`${user?.id !== post?.creator?.$id && "hidden"}`}
                >
                    <img src="Icons/edit.svg" alt="edit" width={20} />
                </Link>
            </div>

                <div className="small-medium lg:base-medium py-5">
                    <p>{post?.caption}</p>
                    <ul>
                        {post?.tags.map((tag: string) => (
                            <li key={tag} className="text-light-3">
                                #{tag}
                            </li>
                        ))

                        }
                    </ul>
                </div>
                <img
                    src={post?.imageUrl || "Icons/profile-placeholder.svg"}
                    className="post-card_img"
                    alt="post image"
                />

            <PostStats post={post} userId={user.id} />
        </div>
    )
}

export default PostCard
