import { StorageProvider } from "../context/StorageContext";
import Notes from "./Notes";

function App() {
 

  return (
    <StorageProvider>
     <Notes />
    </StorageProvider>
  );
}

export default App;
