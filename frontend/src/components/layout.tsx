import { FC } from "react";
import { SideBar } from "@/components/side-bar";

export const Layout: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <main className="flex flex-row w-full h-screen bg-white overflow-hidden">
      {/* left side : sidebar */}
      <SideBar />
      {/* right side : main content */}
      <div className="w-full h-screen p-4 py-8 flex flex-col items-center overflow-y-auto">
        {children}
      </div>
    </main>
  );
};
