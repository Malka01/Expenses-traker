import { Layout } from "@/components/layout";
import { Tag } from "@/components/manage-tags";
import {
  ManageTransitions,
  TypeCurrySymbols,
} from "@/components/manage-transitions";
import axios from "axios";
import { FC, useCallback, useEffect, useState } from "react";

export interface Transaction {
  id?: number;
  type: "income" | "expenses";
  amount: number;
  description: string;
  tags: number[];
}

export const AddTransactions: FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [currency, setCurrency] = useState<TypeCurrySymbols>("USD");
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
        alert("Error getting tags");
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
        alert("Error getting currency");
      });
  }, []);

  // get summary on mount
  useEffect(() => {
    getSummary();
  }, [getSummary]);

  // useEffect to get tags on mount
  useEffect(() => {
    getTags();
  }, [getTags]);

  return (
    <Layout>
      <div className="flex flex-col items-center w-full h-full">
        <div className="bg-white shadow-md drop-shadow-xl py-8 px-4 border w-full max-w-3xl rounded-md">
          <h2 className="text-2xl font-bold text-center">
            Add New Transaction
          </h2>

          <ManageTransitions tags={tags} currency={currency} />
        </div>
      </div>
    </Layout>
  );
};
