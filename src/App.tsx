import { useState } from "react";
import "./App.css";
import PostList from "./components/post-lists";

function App() {
  const [toggle, setToggle] = useState<boolean>(false);
  return (
    <>
      <h1>Learning React Query</h1>
      <button
        style={{ margin: "2px 0 3rem" }}
        onClick={() => setToggle((prev) => !prev)}
      >
        Toggle Button
      </button>
      {toggle && <PostList />}
    </>
  );
}

export default App;
