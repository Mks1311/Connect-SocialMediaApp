import config from "./config";
import { Client, Account, ID, Avatars, Databases, Query, Storage, ImageGravity } from "appwrite";
import { INewUser, INewPost, IUpdatePost, IUpdateUser } from "@/types";
import { setUser } from "@/features/auth/AuthSlice";
import { store } from "@/store";



export class AuthService {
    client = new Client();
    account;
    avatars;
    databases;
    storage;
    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.account = new Account(this.client)
        this.avatars = new Avatars(this.client)
        this.databases = new Databases(this.client)
        this.storage = new Storage(this.client)

    }

    //USER
    async getUserById(userId: string) {
        try {
            const user = await this.databases.getDocument(
                config.appwriteDBId,
                config.appwriteUserCollectionId,
                userId
            )
            if (!user) throw Error
            return user;
        } catch (error) {
            console.log("AuthSerive::getUserById::", error);

        }
    }

    async getUsers(limit?: number) {
        const queries: any[] = [Query.orderDesc("$createdAt")];

        if (limit) {
            queries.push(Query.limit(limit));
        }

        try {
            const users = await this.databases.listDocuments(
                config.appwriteDBId,
                config.appwriteUserCollectionId,
                queries
            );

            if (!users) throw Error;

            return users;
        } catch (error) {
            console.log(error);
        }
    }


    //POSTS

    async deletePost(postId?: string, imageId?: string) {
        if (!postId || !imageId) return;

        try {
            const statusCode = await this.databases.deleteDocument(
                config.appwriteDBId,
                config.appwritePostCollectionId,
                postId
            );

            if (!statusCode) throw Error;

            await this.deleteFile(imageId);

            return { status: "Ok" };
        } catch (error) {
            console.log(error);
        }
    }

    async updatePost(post: IUpdatePost) {
        const hasFileToUpdate = post.file.length > 0;

        try {
            let image = {
                imageUrl: post.imageUrl,
                imageId: post.imageId,
            };

            if (hasFileToUpdate) {
                // Upload new file to appwrite storage
                const uploadedFile = await this.uploadFile(post.file[0]);
                if (!uploadedFile) throw Error;

                // Get new file url
                const fileUrl = await this.getFilePreview(uploadedFile.$id);
                if (!fileUrl) {
                    await this.deleteFile(uploadedFile.$id);
                    throw Error;
                }

                image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
            }

            // Convert tags into array
            const tags = post.tags?.replace(/ /g, "").split(",") || [];

            //  Update post
            const updatedPost = await this.databases.updateDocument(
                config.appwriteDBId,
                config.appwritePostCollectionId,
                post.postId,
                {
                    caption: post.caption,
                    imageUrl: image.imageUrl,
                    imageId: image.imageId,
                    location: post.location,
                    tags: tags,
                }
            );

            // Failed to update
            if (!updatedPost) {
                // Delete new file that has been recently uploaded
                if (hasFileToUpdate) {
                    await this.deleteFile(image.imageId);
                }

                // If no new file uploaded, just throw error
                throw Error;
            }

            // Safely delete old file after successful update
            if (hasFileToUpdate) {
                await this.deleteFile(post.imageId);
            }

            return updatedPost;
        } catch (error) {
            console.log(error);
        }
    }

    async getPostById(postId: string) {
        try {
            const user = await this.databases.getDocument(
                config.appwriteDBId,
                config.appwritePostCollectionId,
                postId
            )
            if (!user) throw Error
            return user;
        } catch (error) {
            console.log("AuthSerive::getPostById::", error);

        }
    }

    async uploadFile(file: File) {
        try {
            const uploadedFile = await this.storage.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            );

            console.log("uploadFile ::", uploadedFile);


            return uploadedFile;
        }
        catch (error) {
            console.log("AuthService :: uploadFile :: ", error);
        }
    }

    async createPost(post: INewPost) {
        try {
            // Upload file to appwrite storage
            const uploadedFile = await this.uploadFile(post.file[0]);

            if (!uploadedFile) throw Error;

            // Get file url
            const fileUrl = await this.getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await this.deleteFile(uploadedFile.$id);
                console.log("AuthService :: createPost :: fileUrl ");
                throw Error;
            }

            // Convert tags into array
            const tags = post.tags?.replace(/ /g, "").split(",") || [];

            // Create post
            const newPost = await this.databases.createDocument(
                config.appwriteDBId,
                config.appwritePostCollectionId,
                ID.unique(),
                {
                    creator: post.userId,
                    caption: post.caption,
                    imageUrl: fileUrl,
                    imageId: uploadedFile.$id,
                    location: post.location,
                    tags: tags,
                }
            );

            if (!newPost) {
                await this.deleteFile(uploadedFile.$id);
                console.log("AuthService :: createPost :: newPost ");
                throw Error;
            }

            return newPost;
        } catch (error) {
            console.log("AuthService :: createPost :: ", error);
        }
    }

    async getFilePreview(fileId: string) {
        try {
            const fileUrl = this.storage.getFilePreview(
                config.appwriteBucketId,
                fileId,
                2000,
                2000,
                ImageGravity.Center,           // crop center
                90,               // slight compression
            );

            if (!fileUrl) {
                console.log("AuthService :: getFilePreview :: fileUrl ");
                throw Error;
            }
            return fileUrl
        } catch (error) {
            console.log("AuthService :: getFilePreview :: ", error);
        }
    }

    async deleteFile(fileId: string) {
        try {
            await this.storage.deleteFile(config.appwriteBucketId, fileId);

            return { status: "ok" };
        } catch (error) {
            console.log("AuthService :: deleteFile :: ", error);
        }
    }

    async getRecentPost(pageParam:any) {
        const queries: any[] = [Query.limit(6),Query.orderDesc("$updatedAt")];
        if (pageParam) {
            queries.push(Query.cursorAfter(pageParam.toString()));
        }
        try {
            const posts = await this.databases.listDocuments(
                config.appwriteDBId,
                config.appwritePostCollectionId,
                queries
            )
            if (!posts) {
                console.log("AuthService::getRecentPost::listDocuments")
            }
            return posts;
            
        } catch (error) {
            console.log("AuthService::getRecentPost::",error)
        }
        
    }

    async LikePost(postId: string, likesArr: string[]) {
        try {
            const updatePost = await this.databases.updateDocument(
                config.appwriteDBId,
                config.appwritePostCollectionId,
                postId,
                {
                    likes: likesArr
                }
            )
            if (!updatePost) {
                console.log("AuthService :: LikePost :: updatePost");

            }
            return updatePost
        } catch (error) {
            console.log("AuthService :: LikePost :: ", error);
        }
    }

    async SavePost(userId: string, postId: string) {
        try {
            const updatedPost = await this.databases.createDocument(
                config.appwriteDBId,
                config.appwriteSaveCollectionId,
                ID.unique(),
                {
                    user: userId,
                    post: postId,
                    userId: userId,
                }
            );

            if (!updatedPost) throw Error;

            return updatedPost;
        } catch (error) {
            console.log("AuthService :: SavePost :: ", error);
        }
    }

    async deleteSavePost(savedRecordId: string) {
        console.log("savedRecordId", savedRecordId);

        try {
            const statusCode = await this.databases.deleteDocument(
                config.appwriteDBId,
                config.appwriteSaveCollectionId,
                savedRecordId,
            )
            if (!statusCode) {
                console.log("AuthService :: deleteSavePost :: statusCode");

            }
            return { status: 'ok' }
        } catch (error) {
            console.log("AuthService :: deleteSavePost :: ", error);
        }
    }

    async getSavedPost() {
        try {
            const currentUser = await this.account.get();
            if (!currentUser) {
                console.log("Error :: Appwrite Service :: getSavedPost :: currentUser");
                throw Error
            }
            const currentUserData = await this.databases.listDocuments(
                config.appwriteDBId,
                config.appwriteSaveCollectionId,
            )
            if (!currentUserData) {
                console.log("Error :: Appwrite Service :: getSavedPost :: currentUser");
                throw Error
            }
            console.log("getSavedPost", currentUserData);
            return currentUserData
        } catch (error) {
            console.log("Authservice::getSavedPost::", error);
        }
    }

    async getPosts(pageParam:any) {        
        const queries: any[] = [Query.limit(3),Query.orderDesc("$updatedAt")];

        if (pageParam) {
            queries.push(Query.cursorAfter(pageParam.toString()));
        }
        console.log("AuthSerive",queries);
        
        try {
            const posts = await this.databases.listDocuments(
                config.appwriteDBId,
                config.appwritePostCollectionId,
                queries
            );

            if (!posts) throw Error;
            console.log(posts);
            return posts;
        } catch (error) {
            console.log("AuthSerive::getInfintePost::", error);
        }
    }

    async searchPosts(searchTerm: string) {
        try {
            const posts = await this.databases.listDocuments(
                config.appwriteDBId,
                config.appwritePostCollectionId,
                [Query.search("caption", searchTerm)]
            );

            if (!posts) throw Error;

            return posts;
        } catch (error) {
            console.log("AuthService::searchPosts::", error);
        }
    }

    //AUTHORIZATION

    async updateUser(user: IUpdateUser) {
        const hasFileToUpdate = user.file.length > 0;
        try {
            let image = {
                imageUrl: user.imageUrl,
                imageId: user.imageId,
            };

            if (hasFileToUpdate) {
                // Upload new file to appwrite storage
                const uploadedFile = await this.uploadFile(user.file[0]);
                if (!uploadedFile) throw Error;

                // Get new file url
                const fileUrl = await this.getFilePreview(uploadedFile.$id);
                if (!fileUrl) {
                    await this.deleteFile(uploadedFile.$id);
                    throw Error;
                }

                image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
            }

            //  Update user
            const updatedUser = await this.databases.updateDocument(
                config.appwriteDBId,
                config.appwriteUserCollectionId,
                user.userId,
                {
                    name: user.name,
                    bio: user.bio,
                    username: user.username,
                    imageUrl: image.imageUrl,
                    imageId: image.imageId,
                }
            );

            // Failed to update
            if (!updatedUser) {
                // Delete new file that has been recently uploaded
                if (hasFileToUpdate) {
                    await this.deleteFile(image.imageId);
                }
                // If no new file uploaded, just throw error
                throw Error;
            }

            // Safely delete old file after successful update
            if (user.imageId && hasFileToUpdate) {
                await this.deleteFile(user.imageId);
            }
            // dispatch(setUser({

            // }))

            return updatedUser;
        } catch (error) {
            console.log(error);
        }
    }

    async createUserAccount(user: INewUser) {
        try {
            const newAccount = await this.account.create(
                ID.unique(),
                user.email,
                user.password,
                user.name,
            );
            if (!newAccount) throw Error;

            const avatarUrl = this.avatars.getInitials(user.name);

            const newUser = await this.saveUserToDB({
                accountId: newAccount.$id,
                name: newAccount.name,
                email: newAccount.email,
                username: user.username,
                imageUrl: avatarUrl,
            })
            const userdata = await this.getCurrentUser()
            if (!userdata) {
                console.log("Error Authservice :: in createaccount/getcurrentuser");
            }
            return newUser;
        } catch (error) {
            console.log("Error :: Appwrite Service :: createAccount", (error));
        }
    }

    async LogIn(user: {
        email: string,
        password: string
    }) {
        console.log("authservice :: log in", user.email, user.password);
        try {
            const session = await this.account.createEmailPasswordSession(user.email, user.password);
            if (session) {
                console.log("in session", session);

                const userdata = await this.getCurrentUser()
                if (!userdata) {
                    console.log("userData::LogIn::AuthService", userdata);

                    console.log("Error Authservice :: in login/getcurrentuser");
                }
            }
            return session
        }
        catch (error) {
            console.log("Error :: Appwrite Service :: LogIn", error);
        }
    }

    async getCurrentUserData() {
        try {
            const currentUser = await this.account.get();
            if (!currentUser) {
                console.log("Error :: Appwrite Service :: getCurrentUser :: currentUser");
                throw Error
            }
            const currentUserData = await this.databases.listDocuments(
                config.appwriteDBId,
                config.appwriteUserCollectionId,
                [
                    Query.equal('accountId', currentUser.$id)
                ]
            )
            if (!currentUserData) {
                console.log("Error :: Appwrite Service :: getCurrentUser :: currentUser");
                throw Error
            }

            const currentAccount = currentUserData.documents[0];
            if (!currentAccount) {
                console.log("Authservice::getCurrentUserData::currentAccount");
            }
            return currentAccount
        }
        catch (error) {
            console.log("Authservice::getCurrentUserData::", error);

        }
    }

    async getCurrentUser() {
        // const dispatch=useDispatch<useAppDispatch>();
        //cant pass hook direclty in class component
        try {
            const { dispatch } = store
            const currentAccount = await this.getCurrentUserData()
            if (currentAccount) {
                dispatch(setUser({
                    id: currentAccount?.$id,
                    name: currentAccount?.name,
                    username: currentAccount?.username,
                    email: currentAccount?.email,
                    imageUrl: currentAccount?.imageUrl,
                    bio: currentAccount?.bio,
                    imageId: currentAccount?.imageId || "",
                }));
            }
            else {
                console.log("getCurrentUser::no currenctAccount");

            }
            return true;
        } catch (error) {
            console.log("Error :: Appwrite Service :: getCurrentUser", error);
        }
        return null;
    }

    async LogOut() {
        const { dispatch } = store
        try {
            await this.account.deleteSessions();
            dispatch(setUser({
                id: '',
                name: '',
                username: '',
                email: '',
                imageUrl: '',
                bio: '',
                imageId: '',
            }))
            return true
        } catch (error) {
            console.log("Error :: Appwrite Service :: LogOut", error);
        }
    }

    async saveUserToDB(user: {
        accountId: string,
        username: string,
        email: string,
        name: string,
        imageUrl: URL,
    }) {
        try {
            const newUser = await this.databases.createDocument(
                config.appwriteDBId,
                config.appwriteUserCollectionId,
                ID.unique(),
                user
            )
            return newUser;

        } catch (error) {
            console.log("Error :: saveUserToDB :: ", error);
        }
    }
}

const authService = new AuthService();

export default authService;