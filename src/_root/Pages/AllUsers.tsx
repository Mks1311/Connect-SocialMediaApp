import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/Shared/Loader";
import UserCard from "@/components/Shared/UseCard";
import authService from "@/lib/appwrite/AuthService";
import { useEffect, useState } from "react";

const AllUsers = () => {
  const { toast } = useToast();
  const [UserData, setUserData] = useState<any>(null);

  async function getUserData() {
    try {
      const creators = await authService.getUsers();
      if (!creators) {
        toast({ title: "Something went wrong." });
        return;
      }
      setUserData(creators)
    } catch (error) {
      console.log("AllUsers::getUserData::", error);

    }

  }
  useEffect(()=>{
    getUserData();
  },[])

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {!UserData ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {UserData?.documents.map((creator:any) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;