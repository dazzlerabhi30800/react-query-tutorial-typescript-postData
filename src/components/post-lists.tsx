import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPost, fetchPosts, fetchTags } from "../api/api";
import { FormEvent, useState } from "react";

const PostList = () => {
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();
  const {
    data: postData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", { page }],
    staleTime: 1000 * 60 * 5,
    // gcTime: 0,
    // refetchInterval: 1000 * 5,
    queryFn: () => fetchPosts(page),
  });
  // Fetch Tags
  const { data: tagData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: Infinity,
  });
  const {
    mutate,
    isError: isPostError,
    reset,
  } = useMutation({
    mutationFn: addPost,
    // This function will run before real mutation happen
    onMutate: () => {
      return { id: 1 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
      });
    },
    // onError: (err, variables, context) => {},
    // onSettled: (err, variable, context) => {}
  });

  const handleSubmit = (event: Event | FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { target } = event;
    const formData = new FormData(target as HTMLFormElement);
    const title = formData.get("title")?.toString();
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );
    if (!title || tags.length < 1) return;
    mutate({ id: postData.data?.length + 1, title, tags });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          type="text"
          placeholder="enter your post"
          className="postbox"
        />
        <div className="tags">
          {tagData?.map((tag: string) => (
            <div key={tag}>
              <input type="checkbox" name={tag} id={tag} />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))}
        </div>
        <button className="postBtn">Post</button>
      </form>
      <div className="container">
        {isLoading && <p>Loading...</p>}
        {isError && <p>{error?.message}</p>}
        {isPostError && <p onClick={() => reset()}>Post error {isPostError}</p>}
        <div className="page--container">
          <button
            className="btn prev"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={!postData?.prev}
          >
            prev
          </button>
          <span>{page}</span>
          <button
            className="btn next"
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, postData?.pages))
            }
            disabled={!postData?.next}
          >
            next
          </button>
        </div>
        <ul>
          {postData?.data.map((data: post) => (
            <li key={data.id}>
              <p>{data.title}</p>
              {data.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default PostList;
