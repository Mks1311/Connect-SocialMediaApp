import GridPostList from "@/components/Shared/GridPostList"
import useDebounce from "@/hooks/useDebounce"
import Loader from "./Loader"
import authService from "@/lib/appwrite/AuthService"
import { useEffect, useState } from "react"

function SearchComponent({ srcValue }:any) {
  const [isSearching, setIsSearching] = useState(true)
  const [searchedPosts,setSearchedPosts]=useState<any>(null)
  const debounceVal = useDebounce(srcValue, 500)

  async function search() {
    setIsSearching(true)
    const searchPost = await authService.searchPosts(debounceVal)
    if (!searchPost) {
      setIsSearching(false)
      console.log("Explore::search::searchPost")
    }
    setSearchedPosts(searchPost)
    
    setIsSearching(false)
    return searchPost
  }
  useEffect(()=>{
    search()    
  },[srcValue])

  if (isSearching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
}

export default SearchComponent
