import { Notification } from "@prisma/client";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import InfiniteScroller from "./InfiniteScroller";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface NotificationsPopoverProps extends PropsWithChildren {
  notifications: Notification[];
  currentPage: number;
}

export type ItemsResponse = {
  notifications: Notification[];
  page: number;
};

function NotificationsPopover({
  notifications,
  currentPage,
  children,
}: NotificationsPopoverProps) {
  const [items, setItems] = useState<Notification[]>(notifications);
  const fetcher = useFetcher<ItemsResponse>();
  const scrollRefContainer = useRef<HTMLDivElement>(null);

  useEffect(() =>{}, [])

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") return;
    
    if (fetcher.data) {
      const newItems = fetcher.data.notifications;
      setItems((prevItems) => {
        const existingIds = new Set(prevItems.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        return [...prevItems, ...uniqueNewItems];
      });
    }
  }, [fetcher.data]);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 max-w-md m-1" side="bottom">
        <h4 className="font-medium leading-none mb-4">Notifications</h4>
        <div
          ref={scrollRefContainer}
          className="space-y-2 min-h-0 max-h-52 overflow-y-scroll"
        >
          <InfiniteScroller
            scrollRefContainer={scrollRefContainer}
            loadNext={() => {
              const page = fetcher.data
                ? fetcher.data.page + 1
                : currentPage + 1;
              fetcher.load(`/action/notifications?page=${page}`);
            }}
            loading={fetcher.state === "loading"}
          >
            <div className="flex flex-col space-y-2">
              {items.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-secondary rounded-lg"
                >
                  <p className="text-sm">{notification.message}</p>
                </div>
              ))}
              {fetcher.state === "loading" && (
                <div className="p-2 text-center">Loading more...</div>
              )}
            </div>
          </InfiniteScroller>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationsPopover;