import { Notification } from "@prisma/client";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import InfiniteScroller from "./InfiniteScroller";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface NotificationsPopoverProps extends PropsWithChildren {
}

export type ItemsResponse = {
  notifications: Notification[];
};

function NotificationsPopover({
  children,
}: NotificationsPopoverProps) {
  const [items, setItems] = useState<Notification[]>([]);
  const fetcher = useFetcher<ItemsResponse>();
  const scrollRefContainer = useRef<HTMLDivElement>(null);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (open && isFirstOpen) {
      setIsFirstOpen(false);
      fetcher.load(`/action/notifications`);
    }
  }, [open, isFirstOpen, fetcher]);

  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") return;

    if (fetcher.data) {
      const newItems = fetcher.data.notifications;
      setItems((prevItems) => {
        const existingIds = new Set(prevItems.map((item) => item.id));
        const uniqueNewItems = newItems.filter(
          (item) => !existingIds.has(item.id)
        );
        return [...prevItems, ...uniqueNewItems];
      });
    }
  }, [fetcher.data]);

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          navigate(".", { replace: true });
          setItems([]);
          setIsFirstOpen(true)
        }
      }}
    >
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
              fetcher.load(`/action/notifications`);
            }}
            loading={fetcher.state === "loading"}
          >
            <div className="flex flex-col space-y-2">
              {items.length > 0 ? (
                items.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-2 bg-secondary rounded-lg m-1"
                  >
                    <p className="text-sm">{notification.message}</p>
                  </div>
                ))
              ) : (
                <span>No notifications found</span>
              )}
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
