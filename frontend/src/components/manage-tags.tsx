import { FC, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";

export interface Tag {
  id: number | null;
  name: string;
  color: string;
}

export const ManageTags: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentTag, setCurrentTag] = useState<Tag>({
    id: null,
    name: "",
    color: "#000000",
  });

  // get tags
  const getTags = async () => {
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
  };

  // add or update tag
  const addOrUpdateTag = async () => {
    if (currentTag.name === "" || currentTag.color === "") {
      toast.error("Please fill all fields");
      return;
    }

    axios
      .request({
        method: currentTag.id ? "PUT" : "POST",
        url: currentTag.id ? `/api/tags/${currentTag.id}` : "/api/tags",
        data: {
          name: currentTag.name,
          color: currentTag.color,
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(
            currentTag.id
              ? "Tag updated successfully"
              : "Tag added successfully"
          );
          setCurrentTag({ id: null, name: "", color: "#000000" });
          getTags();
        }
      })
      .catch(() => {
        toast.error(currentTag.id ? "Error updating tag" : "Error adding tag");
      });
  };

  // delete tag
  const deleteTag = async (id: number | null) => {
    if (id === null) {
      toast.error("Tag not found");
      return;
    }

    await axios
      .delete(`/api/tags/${id}`)
      .then((res) => {
        if (res.status === 204) {
          toast.success("Tag deleted successfully");
          getTags();
        }
      })
      .catch(() => {
        toast.error("Error deleting tag");
      });
  };

  // useEffect to get tags on mount
  useEffect(() => {
    getTags();
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="py-8 px-4">
        <SheetHeader>
          <SheetTitle className="text-xl">Manage Tags</SheetTitle>
          <SheetDescription className="sr-only">
            Create and manage tags to categorize your transactions.
          </SheetDescription>
        </SheetHeader>

        {/* tags form */}
        <div className="flex gap-2">
          <Input
            placeholder="Tag name"
            type="text"
            value={currentTag.name}
            onChange={(e) =>
              setCurrentTag((prev) => ({ ...prev, name: e.target.value }))
            }
            className="!ring-0"
          />
          <Input
            placeholder="Tag color"
            type="color"
            value={currentTag.color}
            onChange={(e) =>
              setCurrentTag((prev) => ({ ...prev, color: e.target.value }))
            }
            className="w-14 p-0 border-none outline-none cursor-pointer"
          />

          <Button
            onClick={addOrUpdateTag}
            className="bg-indigo-700 hover:bg-indigo-800"
          >
            {currentTag.id ? "Update" : "Add"}
          </Button>
        </div>

        {/* tags list */}
        <div className="mt-4 flex flex-col gap-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-2 bg-gray-100 border px-3 rounded-md"
            >
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: tag.color }}
                ></div>
                <span>{tag.name}</span>
              </div>
              <div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCurrentTag(tag);
                  }}
                >
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => deleteTag(tag.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {tags.length === 0 && (
            <div className="text-center text-sm text-gray-500">
              No tags found. Please add a tag.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
