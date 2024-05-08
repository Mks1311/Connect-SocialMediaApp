import { useState, useEffect } from "react";
import authService from "@/lib/appwrite/AuthService";
import Loader from "@/components/Shared/Loader";
import GridPostList from "@/components/Shared/GridPostList";
import { Models } from "appwrite";
import { useAppSelector } from "@/hooks";


function SavedPosts() {
    const user = useAppSelector((state) => state.auth.user)
    const [currentUserData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    async function userData() {
        setIsLoading(true)
        try {
            const currentData = await authService.getSavedPost()
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
    }, [])
    const savePosts = currentUserData?.documents?.map((value: Models.Document) => {
        if (value?.userId === user?.id) {
            return {
                ...(value?.post)
            }
        }
        return undefined
    }).filter((value: Models.Document)=>value!==undefined)

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {savePosts.length === 0 || savePosts === null || savePosts === undefined ? (
                        <p className="text-light-4">No Saved posts</p>
                    ) : (

                        <GridPostList posts={savePosts} showStats={false} />
                    )}
                </>
            )}
        </>
    )
}

export default SavedPosts
