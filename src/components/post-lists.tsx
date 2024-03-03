import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { addPost, fetchPosts, fetchTags } from "../api/api";
import { FormEvent } from "react";

const PostList = () => {
  const queryClient = useQueryClient();

  // Fetch Infinite Scrolling components
  const {
    data: postData,
    isError,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    staleTime: 1000 * 60 * 5,
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.next;
    },
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
    const itemsLength = postData?.pages[0].items;
    if (!title || tags.length < 1) return;
    mutate({ id: itemsLength + 1, title, tags });
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
            className="btn next"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage}
          >
            Load More
          </button>
        </div>
        <ul>
          {postData?.pages.map((post: any) =>
            post?.data.map((todo: post) => (
              <li key={todo.id}>
                <p>{todo.title}</p>
                {todo.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default PostList;
