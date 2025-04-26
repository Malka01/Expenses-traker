import { Layout } from "@/components/layout";
import { Tag } from "@/components/manage-tags";
import {
  ManageTransitions,
  TypeCurrySymbols,
} from "@/components/manage-transitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { ArrowDown, Edit, Search } from "lucide-react";
import { FC, useCallback, useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "./AddTransactions";
import { toast } from "sonner";

export interface TransactionResponse {
  id?: number;
  type: "income" | "expenses";
  amount: number;
  description: string;
  tags: Tag[];
  date?: string;
}

const currencySymbols = {
  CAD: "CA$",
  USD: "$",
  LKR: "රු",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
};

export const ViewExpenses: FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [currency, setCurrency] = useState<TypeCurrySymbols>("USD");
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [pagination, setPagination] = useState({
    limit: 5,
    total: 0,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>();
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    filter: "greater",
    amount: 0,
    page: 1,
  });

  // get tags
  const getTags = useCallback(async () => {
    await axios
      .get("/api/tags")
      .then((res) => {
        if (res.status === 200) {
          setTags(res.data);
        }
      })
      .catch(() => {
        toast.error("Error getting tags");
      });
  }, []);

  // get summary
  const getSummary = useCallback(async () => {
    axios
      .get("/api/summary")
      .then((res) => {
        if (res.status === 200) {
          setCurrency(res.data.currency);
        }
      })
      .catch(() => {
        toast.error("Error getting currency");
      });
  }, []);

  // get transactions
  const getTransactions = useCallback(async () => {
    await axios
      .get(
        `/api/transactions?search=${filters.search}&type=${filters.type}&filter=${filters.filter}&amount=${filters.amount},&page=${filters.page}`
      )
      .then((res) => {
        if (res.status === 200) {
          setTransactions(res.data.transactions);
          setPagination((prev) => ({
            ...prev,
            total: res.data.totalPages,
          }));
        }
      })
      .catch(() => {
        toast.error("Error getting transactions");
      });
  }, [
    filters.amount,
    filters.filter,
    filters.page,
    filters.search,
    filters.type,
  ]);

  // delete transaction
  const deleteTransaction = async (id: number) => {
    await axios
      .delete(`/api/transactions/${id}`)
      .then((res) => {
        if (res.status === 204) {
          toast.success("Transaction deleted successfully");
          getTransactions();
        }
      })
      .catch(() => {
        toast.error("Error deleting transaction");
      });
  };

  // refetch transactions and close popup on update
  const closePopup = async () => {
    getTransactions().then(() => {
      setIsPopupOpen(false);
      setSelectedTransaction(null);
    });
  };

  // get summary on mount
  useEffect(() => {
    getSummary();
  }, [getSummary]);

  // useEffect to get tags on mount
  useEffect(() => {
    getTags();
  }, [getTags]);

  // useEffect to get transactions on mount and when filters change
  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  return (
    <Layout>
      <div className="flex flex-col items-center w-full h-full">
        <div className="py-4 px-4 w-full max-w-3xl rounded-md">
          <h2 className="text-2xl font-bold">Your Transaction</h2>
          {/* filters */}
          <div className="">
            {/* search input */}
            <div className="relative rounded-md overflow-hidden mt-4">
              <Input
                id="search"
                name="search"
                className="border-gray-300 !ring-0 ps-10"
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1,
                  }))
                }
                placeholder="Search transaction"
              />
              <span className="absolute top-0 h-full flex items-center w-8 justify-center text-xs font-medium">
                <Search className="text-gray-500 h-4 w-4" />
              </span>
            </div>

            <div className="flex gap-2 mt-2">
              {/* transaction type */}
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, type: value, page: 1 }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="expenses">Expenses Only</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                </SelectContent>
              </Select>

              {/* transaction filter */}
              <Select
                value={filters.filter}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, filter: value, page: 1 }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater">Greater than</SelectItem>
                  <SelectItem value="less">Less than</SelectItem>
                </SelectContent>
              </Select>

              {/* transaction amount */}
              <Input
                type="number"
                id="amount"
                name="amount"
                className="border-gray-300 !ring-0"
                required
                value={filters.amount}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value),
                    page: 1,
                  }))
                }
                placeholder="0.00"
                min={0}
              />

              {/* clear filter button */}
              <Button
                variant={"outline"}
                onClick={() => {
                  setFilters({
                    search: "",
                    type: "all",
                    filter: "greater",
                    amount: 0,
                    page: 1,
                  });
                }}
              >
                <IoMdClose />
                Clear Filter
              </Button>
            </div>
          </div>

          {/* transactions */}
          <div className="flex flex-col gap-2 mt-4">
            {transactions.map((transaction) => (
              <Collapsible>
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 hover:shadow-md hover:drop-shadow-2xl transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold">
                        {transaction.description}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(transaction.date!).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex">
                      <p
                        className={`font-semibold ${
                          transaction.type === "income"
                            ? "text-emerald-500"
                            : "text-red-500 before:content-['-'] before:me-0.5"
                        }`}
                      >
                        {currencySymbols[currency] || currency}
                        {transaction.amount}
                      </p>
                      <CollapsibleTrigger>
                        <ArrowDown className="w-4 h-4 ml-2" />
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="">
                      {/* tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {transaction.tags.map((tag) => {
                          return (
                            <button
                              key={tag.id}
                              className={`flex items-center text-white cursor-pointer text-xs rounded-2xl px-2 font-medium py-0.5`}
                              style={{
                                backgroundColor: tag.color,
                              }}
                            >
                              {tag.name}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant={"ghost"}
                          onClick={() => {
                            setSelectedTransaction({
                              ...transaction,
                              tags: transaction.tags.map((tag) => tag.id!),
                            });
                            setIsPopupOpen(true);
                          }}
                          className="text-xs"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant={"ghost"}
                          onClick={() => {
                            if (transaction.id) {
                              deleteTransaction(transaction.id);
                            }
                          }}
                          className="text-red-500 text-xs"
                        >
                          <MdDelete className="w-4 h-4 -mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>

          {/* pagination */}
          {transactions.length > 0 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem
                  className={
                    filters.page === 1 ? "pointer-events-none opacity-60" : ""
                  }
                  onClick={
                    filters.page === 1
                      ? undefined
                      : () =>
                          setFilters((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                          }))
                  }
                >
                  <PaginationPrevious href="#" />
                </PaginationItem>

                {filters.page > 1 && (
                  <PaginationItem
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                  >
                    <PaginationLink href="#">{filters.page - 1}</PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: prev.page,
                    }))
                  }
                >
                  <PaginationLink href="#" isActive>
                    {filters.page}
                  </PaginationLink>
                </PaginationItem>

                {filters.page < pagination.total && (
                  <PaginationItem
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                  >
                    <PaginationLink href="#">{filters.page + 1}</PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem
                  className={
                    filters.page === pagination.total
                      ? "pointer-events-none opacity-60"
                      : ""
                  }
                  onClick={
                    filters.page === pagination.total
                      ? undefined
                      : () =>
                          setFilters((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                          }))
                  }
                >
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* no data found */}
          {transactions.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h2 className="text-2xl font-bold">No Transactions Found</h2>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/*  update pop up */}
        {selectedTransaction && (
          <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Transaction</DialogTitle>
                <DialogDescription className="sr-only">
                  Update the transaction details
                </DialogDescription>
              </DialogHeader>
              <ManageTransitions
                currency={currency}
                tags={tags}
                selectedTransaction={selectedTransaction}
                closeModal={closePopup}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
};
