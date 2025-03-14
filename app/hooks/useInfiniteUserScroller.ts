import { useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router";
import { USER_STATUS } from "~/routes/api/get-users";

/**
 * Custom hook that provides infinite scrolling for customer selection.
 * Fetches customers from the API as the user types or scrolls.
 */

type ItemsResponse<T> = {
  items: T[];
  page: number;
};

interface useInfiniteUserScrollerProps {
  actionUrl: string;
  userStatus: keyof typeof USER_STATUS
}

export function useInfiniteUserScroller<T>({
  actionUrl,
  userStatus
}: useInfiniteUserScrollerProps) {
  const params = useParams();
  const fetcher = useFetcher<ItemsResponse<T>>();
  const [page, setPage] = useState(0);
  const [data, setData] = useState<T[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [previousInput, setPreviousInput] = useState(inputValue);

  const isLoading = fetcher.state !== "idle";
  const itemsPerQuery = 5;

  const loadNext = async () => {
    let nextPage = page;

    if (inputValue !== previousInput) {
      nextPage = 0;
    } else if (!fetcher.data) {
      nextPage = 0;
    } else if (fetcher.data.items.length < itemsPerQuery) {
      return;
    } else {
      nextPage = page + 1;
    }

    const query = `?page=${nextPage}&userStatus=${userStatus}&search=${inputValue}`;
    await fetcher.load(`${actionUrl}${query}`);
    setPage(nextPage);
  };

  useEffect(() => {
    if (inputValue !== previousInput) {
      setPage(0);
      setData([]); // Clear data when search changes
      setPreviousInput(inputValue);
    }
  }, [inputValue, previousInput]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") return;
    if (page === 0) {
      // Replace data for first page or new search
      setData(fetcher.data.items);
    } else {
      // Append data for subsequent pages
      setData((prevData) => [...prevData, ...fetcher.data!.items]);
    }
  }, [fetcher.data, page]);

  // Initial load and search changes
  useEffect(() => {
    loadNext();
  }, [inputValue]);

  useEffect(() => {
    if (firstLoad) {
      loadNext();
      setFirstLoad(false);
    }
  }, [firstLoad]);

  return {
    isLoading,
    loadNext,
    data,
    inputValue,
    setInputValue,
  };
}
