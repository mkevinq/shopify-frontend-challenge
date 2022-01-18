import type { NextPage } from "next";
import { ReactElement, useEffect, useRef, useState } from "react";

import Layout from "../components/Layout";
import PostPage from "../components/PostPage";
import { APIData } from "../components/ResultItem";
import { fetchResults } from "../utils/api";
import { formatDate } from "../utils/date";

enum FilterMode {
  NONE,
  LIKED,
  CUSTOM_DATE_RANGE,
}

/**
 * Home page.
 *
 * @returns {ReactElement} - Page content for home page.
 */
const Home: NextPage = () => {
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [content, setContent] = useState<APIData[]>([]);
  const currentEndDate = useRef<Date>(new Date());
  const currentStartDate = useRef<Date>(
    new Date(currentEndDate.current.getTime())
  );

  // Fetch data from NASA API on startup
  useEffect(() => {
    setLoading(true);

    // Start fetching results from the previous month
    currentStartDate.current.setMonth(currentEndDate.current.getMonth() - 1);

    fetchResults(
      formatDate(currentStartDate.current),
      formatDate(currentEndDate.current)
    )
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setError(data);
          setContent([]);
          setLoading(false);
          return;
        }

        // Since the API contains content other than images, we'll ignore everything other than images.
        const content = (data as APIData[])
          .filter((item) => item.media_type === "image")
          .reverse();

        setContent(content);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setContent([]);
        setLoading(false);
      });
  }, []);

  // Add an event that checks if the user is near the bottom of the page to load new images
  useEffect(() => {
    window.addEventListener("scroll", () => {
      const screenBottom = window.scrollY + window.innerHeight;
      if (screenBottom >= document.body.offsetHeight - 200) {
        setLoading((prevLoadingState) => {
          if (!prevLoadingState) {
            // Start fetching results from the previous month
            currentEndDate.current.setTime(currentStartDate.current.getTime());
            currentEndDate.current.setDate(
              currentEndDate.current.getDate() - 1
            );
            currentStartDate.current.setMonth(
              currentEndDate.current.getMonth() - 1
            );

            fetchResults(
              formatDate(currentStartDate.current),
              formatDate(currentEndDate.current)
            )
              .then((response) => response.json())
              .then((data) => {
                if (!Array.isArray(data)) {
                  setError(data);
                  setLoading(false);
                  setContent([]);
                  return;
                }
                // Since the API contains content other than images, we'll ignore everything other than images.
                const newContent = (data as APIData[])
                  .filter((item) => item.media_type === "image")
                  .reverse();

                setContent((previousContent) =>
                  previousContent.concat(newContent)
                );
                setLoading(false);
              })
              .catch((error) => {
                setError(error);
                setContent([]);
                setLoading(false);
              });
          }
          return true;
        });
      }
    });
  }, []);

  return (
    <Layout title="Spacetagram - Home Page">
      <PostPage error={error} posts={content} loading={isLoading} />
    </Layout>
  );
};

export default Home;
