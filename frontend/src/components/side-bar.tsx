import { ChartArea, HomeIcon, PlusCircle, TagIcon } from "lucide-react";
import { FC } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";

const sideBarItem = [
  {
    label: "Home",
    icon: <HomeIcon className="h-5 w-5" />,
    link: "/",
  },
  {
    label: "Add Transaction",
    icon: <PlusCircle className="h-5 w-5" />,
    link: "/add",
  },
  {
    label: "View Expenses",
    icon: <ChartArea className="h-5 w-5" />,
    link: "/expenses",
  },
];

export const SideBar: FC = () => {
  // active link
  const location = useLocation();
  const { pathname } = location;
  return (
    <aside className="w-full max-w-[15rem] bg-gray-100 h-screen flex flex-col p-4">
      {/*  heading */}
      <h1 className="text-xl font-bold">SpendWise</h1>

      {/* buttons */}
      <div className="mt-6 flex flex-col gap-3">
        {sideBarItem.map((item) => (
          <Link
            to={item.link}
            className={`${
              pathname === item.link ? "bg-indigo-700 text-white" : ""
            } flex gap-x-2.5 items-end font-medium text-sm px-3 py-2 rounded-sm`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}

        {/* manage tags */}
        <Button
          className={
            "flex gap-x-2.5 justify-start !bg-transparent w-full cursor-pointer text-black shadow-none items-end font-medium text-sm !px-4 py-2 rounded-sm"
          }
        >
          <TagIcon className="h-5 w-5" />
          <span>Manage Tags</span>
        </Button>
      </div>
    </aside>
  );
};
