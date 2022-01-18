import type { NextPage } from "next";
import { ReactElement, useEffect, useState } from "react";

import Layout from "../components/Layout";
import PostPage from "../components/PostPage";
import { APIData } from "../components/ResultItem";
import { fetchResults } from "../utils/api";

/**
 * Page for liked posts.
 *
 * @returns {ReactElement} - Page content for liked posts.
 */
const Liked: NextPage = () => {
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [content, setContent] = useState<APIData[]>([]);

  // Fetch data from NASA API on startup
  // Uses a date range defined by the oldest and newest post instead of individually fetching each liked post
  useEffect(() => {
    setLoading(true);

    const likes = JSON.parse(localStorage.getItem("likes") ?? "{}");

    const sortedLikes = Object.entries(likes)
      .filter(([_date, liked]) => liked)
      .sort(
        ([date1, _liked1], [date2, _liked2]) =>
          new Date(date1).getTime() - new Date(date2).getTime()
      );

    if (sortedLikes.length > 0) {
      fetchResults(sortedLikes[0][0], sortedLikes[sortedLikes.length - 1][0])
        .then((response) => response.json())
        .then((data) => {
          if (!Array.isArray(data)) {
            setError(data);
            setLoading(false);
            setContent([]);
            return;
          }

          // Since the API contains content other than images, we'll ignore everything other than images.
          const content = (data as APIData[])
            .filter((item) => likes[item.date])
            .reverse();

          setContent(content);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setContent([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Layout title="Spacetagram - Liked Posts">
      <PostPage error={error} posts={content} loading={isLoading} />
    </Layout>
  );
};

export default Liked;
