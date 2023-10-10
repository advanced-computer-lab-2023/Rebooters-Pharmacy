import { BrowserRouter, Routes, Route } from "react-router-dom";
import Medicine from "./components/Medicine";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/medicine" element={<Medicine modelName="administrator"/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;