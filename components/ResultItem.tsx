import Image from "next/image";
import { FunctionComponent, useRef, useState } from "react";

import Heart from "../public/heart.svg";
import Share from "../public/share.svg";

/**
 * Typing of the response from the NASA APOD API.
 */
export type APIData = {
  copyright: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
};

/**.
 * Component that displays data from the NASA APOD Image API
 *
 * @returns {ReactElement} - Markup for the formatted post
 */
const ResultItem: FunctionComponent<
  APIData & {
    alreadyLiked?: boolean;
    onLike: (date: string, liked: boolean) => void;
  }
> = ({
  title,
  copyright,
  explanation,
  date,
  hdurl,
  url,
  onLike,
  alreadyLiked,
}) => {
  const [liked, setLiked] = useState(alreadyLiked ?? false);
  const [expanded, setExpanded] = useState(false);
  const likeButtonAnimate = useRef<SVGElement>(null);

  // Create a text preview that is only 50 characters
  const preview = explanation.slice(0, 50);

  /**
   * Like an image.
   *
   * @param {boolean} force - Default value to set the like status to.
   * @returns {void}
   */
  const likeImage = (force?: boolean) => () => {
    const value = force ?? !liked;
    onLike(date, value);
    setLiked(value);
    if (value) {
      likeButtonAnimate.current?.animate(
        [
          { offset: 0.75, transform: "scale(2)", opacity: 0 },
          { offset: 1, transform: "scale(2)", opacity: 0 },
        ],
        {
          duration: 500,
          iterations: 1,
        }
      );
    }
  };

  return (
    <div
      id="item"
      className="flex flex-col rounded-md w-11/12 md:w-1/4 bg-white dark:bg-neutral-700 drop-shadow-xl overflow-hidden"
    >
      <div id="item-header" className="m-4">
        <h1 className="text-xl font-bold">{date + ": " + title}</h1>
        <h3 className="text-sm text-gray-300">
          {copyright || "Unknown owner"}
        </h3>
      </div>
      <a
        id="item-image"
        className="relative h-full w-full"
        tabIndex={0}
        onDoubleClick={likeImage(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            likeImage(true)();
          }
        }}
      >
        <Image
          width="100%"
          height="100%"
          alt={"An image of " + title}
          src={url}
          layout="responsive"
          objectFit="cover"
        />
      </a>
      <div id="actions" className="flex gap-2 m-2">
        <a
          id="like-button"
          className="flex"
          tabIndex={0}
          onClick={likeImage()}
          onKeyDown={(event: any) => {
            if (event.key === "Enter") {
              likeImage()();
            }
          }}
          aria-label="Like button"
        >
          <Heart
            className={
              liked
                ? "h-8 w-8 cursor-pointer z-10 transition-colors text-red-600"
                : "h-8 w-8 cursor-pointer z-10"
            }
            role="img"
            title="Like button"
          />
          <Heart
            className={"absolute h-8 w-8 text-red-600"}
            ref={likeButtonAnimate}
            role="img"
            title="Like button animated"
          />
        </a>
        <a
          id="share-button"
          tabIndex={0}
          onClick={() => {
            navigator.clipboard.writeText(hdurl);
            alert("Copied link to clipboard!");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              navigator.clipboard.writeText(hdurl);
              alert("Copied link to clipboard!");
            }
          }}
          aria-label="Share button"
        >
          <Share
            className="h-8 w-8 cursor-pointer"
            role="img"
            title="Share button - Copy link to clipboard"
          />
        </a>
      </div>
      <hr className="leading-10" />
      <div id="item-caption" className="m-4 break-normal">
        {expanded ? (
          <>
            <p>{explanation}</p>
            <a
              className="dark:text-blue-300 text-blue-600 cursor-pointer"
              tabIndex={0}
              onClick={() => {
                setExpanded(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setExpanded(false);
                }
              }}
            >
              Read less
            </a>
          </>
        ) : (
          <p>
            {preview + "... "}
            <a
              className="dark:text-blue-300 text-blue-600 cursor-pointer"
              tabIndex={0}
              onClick={() => {
                setExpanded(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setExpanded(true);
                }
              }}
            >
              Read more
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultItem;
