import Seach from "../components/search";
import { StorageProvider } from "../context/StorageContext";
import Notes from "./Notes";

function App() {
 

  return (
    <StorageProvider>
     <Notes />
     <Seach />
    </StorageProvider>
  );
}

export default App;
