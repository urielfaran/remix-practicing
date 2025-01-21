import { PropsWithChildren, useEffect, useRef } from "react";

interface InfiniteScrollerProps extends PropsWithChildren {
  loading: boolean;
  loadNext: () => void;
  scrollRefContainer: React.RefObject<HTMLDivElement>;
}
function InfiniteScroller({
  loadNext,
  loading,
  scrollRefContainer,
  children,
}: InfiniteScrollerProps) {
  const scrollListener = useRef(loadNext);

  useEffect(() => {
    scrollListener.current = loadNext;
  }, [loadNext]);

  const onScroll = () => {
    if (scrollRefContainer.current) {
      // const documentHeight = scrollRefContainer.current?.scrollHeight;
      // const scrollDifference = Math.floor(scrollRefContainer.current?.clientHeight + window.scrollY);
      // const scrollEnded = documentHeight == scrollDifference;
      const scrollEnded =
        scrollRefContainer.current.scrollHeight -
          scrollRefContainer.current.scrollTop ===
        scrollRefContainer.current.clientHeight;

      if (scrollEnded && !loading) {
        console.log("first");
        scrollListener.current();
      }
    }
  };

  useEffect(() => {
    if (scrollRefContainer.current) {
      scrollRefContainer.current.addEventListener("scroll", onScroll);
    }

    return () => {
      scrollRefContainer.current?.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <>{children}</>;
}

export default InfiniteScroller;
