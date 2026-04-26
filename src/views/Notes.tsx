import Note from "../components/note";
import Sidebar from "../components/sidebar";

const Notes = () => {
  return (
    <div className="flex  h-full">
      <Sidebar />
      <Note />
      
    </div>
  );
};

export default Notes;
