import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [views, setViews] = useState(0);

  const getPosts = async () => {
    const response = await axios.get("http://localhost:4000/posts");
    return response.data;
  };

  const addPost = async (newPost) => {
    const response = await axios.post("http://localhost:4000/posts", newPost);
    return response.data;
  };

  const getProfile = async () => {
    const response = await axios.get("http://localhost:4000/profile");
    return response.data;
  };

  const getComments = async () => {
    const response = await axios.get("http://localhost:4000/comments");
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
    enabled: false,
  });

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const {
    data: posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isProfileLoading) {
    return <div>프로필 로딩중입니다...</div>;
  }

  if (isProfileError) {
    return <div>프로필 오류가 발생했습니다...</div>;
  }

  if (isPostsLoading) {
    return <div>포스트 로딩중입니다...</div>;
  }

  if (isPostsError) {
    return <div>포스트 오류가 발생했습니다...</div>;
  }

  return (
    <div>
      <span>{profile.name}님 안녕하세요</span>
      <div>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          value={views}
          onChange={(e) => {
            setViews(e.target.value);
          }}
        />
        <button
          onClick={() => {
            mutation.mutate({
              title,
              views,
            });
          }}
          style={{
            backgroundColor: "red",
          }}
        >
          추가
        </button>
      </div>

      {posts.map((post) => {
        return (
          <div key={post.id}>
            {post.title}
            {post.views}
            <button
              style={{
                backgroundColor: "skyblue",
              }}
            >
              댓글보기
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default App;
