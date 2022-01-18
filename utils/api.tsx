import { formatDate } from "./date";

/**
 * Pulls images from NASA's APOD API for a specific time range.
 *
 * @param {Date} start - The start date of the date range.
 * @param {Date} end - The end date of the date range.
 * @returns {Promise<Response>} - Raw response object from the API.
 */
export const fetchResults = (start: string, end: string) => {
  const url = new URL(process.env.NEXT_PUBLIC_NASA_API_URL as string);
  url.searchParams.append(
    "api_key",
    process.env.NEXT_PUBLIC_NASA_API_KEY as string
  );
  url.searchParams.append("start_date", start);
  url.searchParams.append("end_date", end);
  return fetch(url.toString());
};
