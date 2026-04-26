import Seach from "../components/search";
import { StorageProvider } from "../context/StorageContext";
import Notes from "./Notes";

function App() {
  return (
    <div className="grain-global">
      <StorageProvider>
        <Notes />
        <Seach />
      </StorageProvider>
    </div>
  );
}

export default App;
