import type { NextPage } from "next";
import { ReactElement, useEffect, useRef, useState } from "react";

import Layout from "../components/Layout";
import PostPage from "../components/PostPage";
import { APIData } from "../components/ResultItem";
import { fetchResults } from "../utils/api";
import { formatDate, verifyDate } from "../utils/date";

/**
 * Page for showing posts across a custom date range.
 *
 * @returns {ReactElement} - Page content for posts that fall under the date range.
 */
const Liked: NextPage = () => {
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);
  const [content, setContent] = useState<APIData[]>([]);
  const [endDateInput, setEndDateInput] = useState(formatDate(new Date()));
  const [startDateInput, setStartDateInput] = useState(
    formatDate(
      new Date(new Date().setMonth(new Date(endDateInput).getMonth() - 1))
    )
  );

  useEffect(() => {
    if (verifyDate(startDateInput) && verifyDate(endDateInput)) {
      setContent([]);
      setLoading(true);
      fetchResults(startDateInput, endDateInput)
        .then((response) => response.json())
        .then((data) => {
          // Since the API contains content other than images, we'll ignore everything other than images.
          if (!Array.isArray(data)) {
            setError(data);
            setContent([]);
            setLoading(false);
            return;
          }
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
    }
  }, [startDateInput, endDateInput]);

  return (
    <Layout title="Spacetagram - Custom Date Range">
      <div
        id="date-selection"
        className="w-full flex fixed bottom-12 bg-white dark:bg-neutral-900 place-items-center justify-center gap-2 py-4 z-10 drop-shadow-md"
      >
        <input
          type="date"
          aria-label="Start date"
          className="rounded-md p-1 bg-transparent border-2"
          value={startDateInput}
          onChange={(event) => {
            setStartDateInput(event.target.value);
          }}
        ></input>
        <p>to</p>
        <input
          type="date"
          aria-label="End date"
          className="rounded-md p-1 bg-transparent border-2"
          value={endDateInput}
          onChange={(event) => {
            setEndDateInput(event.target.value);
          }}
        ></input>
      </div>
      <PostPage error={error} posts={content} loading={isLoading} />
    </Layout>
  );
};

export default Liked;
