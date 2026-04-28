import { useState } from "react";
import Note from "../components/note";
import Sidebar from "../components/sidebar";
import { MenuIcon } from "../components/shared/Icons";
import IconButton from "../components/shared/IconButton";

const Notes = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  return (
    <div className="flex  h-full">
      <IconButton className="collapse__btn" icon={MenuIcon} onClick={() => setSidebarCollapsed(false)} />

      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <Note />
    </div>
  );
};

export default Notes;
