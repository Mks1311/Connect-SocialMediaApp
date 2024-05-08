import { useState, useEffect } from "react";
import authService from "@/lib/appwrite/AuthService";
import Loader from "@/components/Shared/Loader";
import GridPostList from "@/components/Shared/GridPostList";
function LikedPosts() {
    const [currentUserData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    async function userData() {
        setIsLoading(true)
        try {
            const currentData = await authService.getCurrentUserData()
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
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {currentUserData.liked.length === 0 && (
                        <p className="text-light-4">No liked posts</p>
                    )}

                    <GridPostList posts={currentUserData.liked} showStats={false} />
                </>
            )}
        </>
    )
}

export default LikedPosts
