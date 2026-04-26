import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";

const LOCAL_PAGE_SIZE = 10;
type SortOrder = "latest" | "oldest";

const sortOrders = (items: any[], sortOrder: SortOrder) =>
  [...items].sort((a: any, b: any) => {
    const latestFirst =
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

    return sortOrder === "latest" ? latestFirst : -latestFirst;
  });

const getLocalPageData = (items: any[], page: number, sortOrder: SortOrder) => {
  const sorted = sortOrders(items, sortOrder);
  const lastPage = Math.max(1, Math.ceil(sorted.length / LOCAL_PAGE_SIZE));
  const safePage = Math.min(page, lastPage);
  const startIndex = (safePage - 1) * LOCAL_PAGE_SIZE;

  return {
    safePage,
    lastPage,
    total: sorted.length,
    data: sorted.slice(startIndex, startIndex + LOCAL_PAGE_SIZE),
  };
};

const buildVisiblePages = (currentPage: number, lastPage: number) => {
  if (lastPage <= 5) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", lastPage];
  }

  if (currentPage >= lastPage - 2) {
    return [1, "...", lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", lastPage];
};

const Orders = ({ orders: initialOrders = [] }: { orders: any[] }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(initialOrders.length);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");

  useEffect(() => {
    let isMounted = true;

    const setLocalOrders = (page: number) => {
      const localState = getLocalPageData(initialOrders, page, sortOrder);

      if (!isMounted) return;

      setOrders(localState.data);
      setLastPage(localState.lastPage);
      setTotalOrders(localState.total);

      if (localState.safePage !== page) {
        setCurrentPage(localState.safePage);
      }
    };

    const loadOrders = async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setLocalOrders(currentPage);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders?page=${currentPage}&sort=${sortOrder}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch paginated orders.");
        }

        const payload = await res.json();

        if (!Array.isArray(payload?.data)) {
          throw new Error("Unexpected paginated orders response.");
        }

        if (!isMounted) return;

        setOrders(sortOrders(payload.data, sortOrder));
        setLastPage(Math.max(1, payload.last_page || 1));
        setTotalOrders(payload.total || payload.data.length);
      } catch (error) {
        setLocalOrders(currentPage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [currentPage, initialOrders, sortOrder]);

  const visiblePages = buildVisiblePages(currentPage, lastPage);

  if (loading) {
    return (
      <div className="space-y-4 p-4 sm:p-7.5">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="h-[196px] animate-pulse rounded-[28px] border border-gray-3 bg-gray-1"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-7.5">
      {orders.length > 0 ? (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-custom-xs font-semibold uppercase tracking-[0.24em] text-dark-4">
                Showing page {currentPage} of {lastPage}
              </p>
              <p className="mt-1 text-custom-sm text-dark-4">
                {totalOrders} {totalOrders === 1 ? "order" : "orders"} found.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSortOrder("latest");
                  setCurrentPage(1);
                }}
                className={sortOrder === "latest" ? "btn-action" : "btn-action-secondary"}
              >
                Newest
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortOrder("oldest");
                  setCurrentPage(1);
                }}
                className={sortOrder === "oldest" ? "btn-action" : "btn-action-secondary"}
              >
                Oldest
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((orderItem: any) => (
              <SingleOrder key={orderItem.id} orderItem={orderItem} />
            ))}
          </div>

          {lastPage > 1 && (
            <div className="mt-7 flex flex-col gap-3 border-t border-gray-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-custom-sm text-dark-4">
                Move between pages to keep the order list compact and easy to scan.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="btn-action-secondary disabled:pointer-events-none disabled:opacity-45"
                >
                  Previous
                </button>

                {visiblePages.map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-custom-sm font-semibold text-dark-4"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={page}
                      onClick={() => setCurrentPage(Number(page))}
                      className={
                        currentPage === page ? "btn-action min-w-[48px]" : "btn-action-secondary min-w-[48px]"
                      }
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(lastPage, page + 1))}
                  disabled={currentPage === lastPage}
                  className="btn-action-secondary disabled:pointer-events-none disabled:opacity-45"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-[28px] border border-dashed border-gray-3 bg-gray-1 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white-true text-dark-5 shadow-1">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-custom-lg font-semibold text-dark">No orders found yet.</p>
          <p className="mt-2 text-custom-xs text-dark-5 font-medium">
            Start shopping to see your order history here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;
