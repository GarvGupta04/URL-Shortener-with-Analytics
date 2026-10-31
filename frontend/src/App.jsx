import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import AppLayout from "./components/AppLayout";

import Dashboard from "./pages/Dashboard";
import MyUrls from "./pages/MyUrls";
import CreateUrl from "./pages/CreateUrl";
import Analytics from "./pages/Analytics";


function App() {

  return (


    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#14251c",
            color: "#ffffff",
            borderRadius: "10px",
            fontSize: "13px"
          }
        }}
      />

      <Routes>

        <Route element={<AppLayout />}>

          <Route path="/" element={<Dashboard />} />

          <Route path="/urls" element={<MyUrls />} />

          <Route path="/create" element={<CreateUrl />} />

          <Route path="/analytics" element={<Analytics />} />

        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
