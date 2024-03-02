export const fetchPosts = async (page: number) => {
    const response = await fetch(
        `http://localhost:3000/posts?_sort=-id&${page ? `_page=${page}&_per_page=5` : ""
        }`
    );
    const postData = await response.json();
    return postData;
};

export const fetchTags = async () => {
    const response = await fetch(`http://localhost:3000/tags`);
    const tagData = await response.json();
    return tagData;
};

export const addPost = async (post: post) => {
    const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    });

    return response.json();
};
