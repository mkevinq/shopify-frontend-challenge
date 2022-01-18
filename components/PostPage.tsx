import { FunctionComponent, ReactElement, useEffect, useRef } from "react";

import ResultItem, { APIData } from "../components/ResultItem";

type PostPageProps = {
  error?: Error;
  posts: APIData[];
  loading: boolean;
};

/**
 * Generic page to display posts.
 *
 * @returns {ReactElement} - Markup for a page that displays posts.
 */
const PostPage: FunctionComponent<PostPageProps> = ({
  error,
  posts,
  loading,
}) => {
  const likes = useRef<Record<string, boolean>>({});

  // Load liked images on startup
  useEffect(() => {
    likes.current = JSON.parse(localStorage.getItem("likes") ?? "{}");
  }, []);

  /**
   * Saves the liked image to local storage.
   *
   * @param {string} date - Date in the YYYY-MM-DD format for the correpsonding post.
   * @param {boolean} liked - Whether the image was liked.
   */
  const onLike = (date: string, liked: boolean) => {
    likes.current[date] = liked;
    localStorage.setItem("likes", JSON.stringify(likes.current));
  };

  return (
    <>
      <div
        id="content-container"
        className="w-full h-full flex flex-wrap flex-col md:flex-row place-items-center md:place-items-start md:justify-around gap-4 py-4"
      >
        {error && (
          <div id="error-message">
            <p>Couldn&apos;t load posts! Error: {JSON.stringify(error)}</p>
          </div>
        )}

        {!error && !loading && posts.length < 1 ? (
          <div id="post-message">
            <p>No posts to display!</p>
          </div>
        ) : (
          posts.map((item, index) => (
            <ResultItem
              key={"item-" + index}
              {...item}
              alreadyLiked={likes.current[item.date]}
              onLike={onLike}
            />
          ))
        )}
      </div>
      <div>
        {!error && loading && (
          <div
            id="loading-popup"
            className="flex flex-col m-4 place-items-center"
          >
            <p className="mx-auto">Images are loading...</p>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </>
  );
};

export default PostPage;
