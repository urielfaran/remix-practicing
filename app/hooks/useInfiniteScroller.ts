import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

interface useInfiniteSearchScrollerProps {
  apiRoute: string;
  itemsPerQuery?: number;
  additionalQuery?: string;
}

/**
 * Custom hook for infinite scrolling with search capabilities
 * @template T - The type of items being fetched and displayed
 * @param {useInfiniteSearchScrollerProps} props - Configuration options for the hook
 * @returns Object containing state and functions for managing infinite scrolling
 */
export function useInfiniteScroller<T>({
  itemsPerQuery = 5,
  apiRoute,
  additionalQuery,
}: useInfiniteSearchScrollerProps) {
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [items, setItems] = useState<T[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [previousInput, setPreviousInput] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const fetcher = useFetcher<{ items: T[]; page: number }>();
  const scrollContainer = useRef<HTMLDivElement>(null);
  const inputChanged = previousInput !== null && inputValue !== previousInput;
  const hasMore = fetcher.data?.items?.length === itemsPerQuery;

  // Update previousInput
  useEffect(() => setPreviousInput(inputValue), [inputValue]);

  // For popovers
  const [isOpen, setIsOpen] = useState(false);
  const viewport = scrollContainer.current?.querySelector("#scroll-element");

  const handleNextPage = () => {
    if (inputChanged || !fetcher.data) return setPage(0);
    if (fetcher.data.items?.length < itemsPerQuery) return;
    setPage(page + 1);
  };

  // Load initial data or when input changes
  useEffect(() => {
    if (!(isFirstOpen && isOpen) && !inputChanged) return;
    if (inputChanged) {
      setItems([]);
      setPage(0);
    }
    setIsFirstOpen(false);
    loadData();
  }, [isFirstOpen, isOpen, inputValue]);

  // Handle fetched data
  useEffect(() => {
    const newItems = fetcher?.data?.items || [];
    if (!isFirstOpen) handleNextPage();
    setItems((prevItems) => {
      return [...prevItems, ...newItems];
    });
  }, [fetcher.data]);

  const loadData = async () => {
    const query = `${apiRoute}?page=${
      inputChanged ? 0 : page
    }&search=${inputValue}&${additionalQuery}`;
    await fetcher.load(query);
  };

  return {
    viewport,
    setIsOpen,
    scrollContainer,
    setItems,
    setIsFirstOpen,
    items,
    loadData,
    hasMore,
    inputValue,
    setInputValue,
  };
}