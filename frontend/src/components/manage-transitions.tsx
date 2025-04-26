import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Transaction } from "@/pages/AddTransactions";
import axios from "axios";
import { Tag } from "./manage-tags";
import { toast } from "sonner";

const currencySymbols = {
  CAD: "CA$",
  USD: "$",
  LKR: "රු",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
};

export type TypeCurrySymbols = keyof typeof currencySymbols;

export const ManageTransitions: FC<{
  tags: Tag[];
  currency: TypeCurrySymbols;
  selectedTransaction?: Transaction;
  closeModal?: () => void;
}> = ({ tags, currency, selectedTransaction, closeModal }) => {
  const [transaction, setTransaction] = useState<Transaction>({
    type: "expenses",
    amount: 0,
    description: "",
    tags: [],
  });

  // add or update transaction
  const addOrUpdateTransaction = async () => {
    if (
      !transaction.description ||
      !transaction.amount ||
      transaction.tags.length === 0
    )
      return;
    await axios
      .request({
        method: transaction.id === undefined ? "POST" : "PUT",
        url:
          transaction.id === undefined
            ? "/api/transactions"
            : `/api/transactions/${transaction.id}`,
        data: transaction,
      })
      .then((res) => {
        if (res.status === 201) {
          toast.success("Transaction added successfully");
        }
        if (res.status === 200) {
          toast.success("Transaction updated successfully");
          if (closeModal) closeModal();
        }
        setTransaction({
          type: "expenses",
          amount: 0,
          description: "",
          tags: [],
        });
      })
      .catch(() => {
        toast.error("Error adding transaction");
      });
  };

  // set transaction if selected transaction is passed
  useEffect(() => {
    if (selectedTransaction) {
      setTransaction(selectedTransaction);
    }
  }, [selectedTransaction]);

  return (
    <div className="mt-8 flex flex-col gap-y-5">
      {/* transaction type */}
      <div>
        <Label htmlFor="transactionType" className="block text-sm font-medium">
          Transaction Type
        </Label>
        <RadioGroup
          value={transaction.type}
          onValueChange={(value) =>
            setTransaction((prev) => ({
              ...prev,
              type: value as "income" | "expenses",
            }))
          }
          className="flex items-center space-x-4 mt-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expenses" id="expenses" />
            <Label htmlFor="expenses">Expenses</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income">Income</Label>
          </div>
        </RadioGroup>
      </div>

      {/* transaction details */}
      <div>
        <Label htmlFor="description" className="block text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          rows={4}
          name="description"
          className="mt-1 border-gray-300 !ring-0"
          placeholder="Enter transaction description"
          required
          value={transaction.description}
          onChange={(e) =>
            setTransaction((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </div>

      {/* transaction amount */}
      <div>
        <Label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </Label>
        <div className="relative rounded-md overflow-hidden mt-1">
          <Input
            type="number"
            id="amount"
            name="amount"
            className="border-gray-300 !ring-0 ps-10"
            required
            value={transaction.amount}
            onChange={(e) =>
              setTransaction((prev) => ({
                ...prev,
                amount: parseFloat(e.target.value),
              }))
            }
            placeholder="0.00"
            min={0}
          />
          <span className="absolute top-0 h-full border-r bg-gray-400 flex items-center w-8 justify-center text-xs font-medium">
            {currencySymbols[currency] || currency}
          </span>
        </div>
      </div>

      {/* transaction tags */}
      <div>
        <Label htmlFor="tag" className="block text-sm font-medium">
          Tags (Select at least one)
        </Label>
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.map((tag) => {
            const isSelected = transaction.tags.includes(tag.id as number);
            return (
              <button
                key={tag.id}
                className={`flex items-center cursor-pointer text-xs border-2 rounded-2xl px-2 font-medium py-0.5`}
                style={{
                  backgroundColor: isSelected ? tag.color : "transparent",
                  color: isSelected ? "white" : tag.color,
                  borderColor: tag.color,
                }}
                onClick={() => {
                  if (!transaction.tags || !tag.id) return;
                  if (transaction.tags.includes(tag.id)) {
                    setTransaction((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((t) => t !== tag.id),
                    }));
                  } else {
                    setTransaction((prev) => ({
                      ...prev,
                      tags: [...prev.tags, tag.id as number],
                    }));
                  }
                }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* submit button */}
      <Button
        type="button"
        onClick={addOrUpdateTransaction}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
      >
        Add Transaction
      </Button>
    </div>
  );
};
