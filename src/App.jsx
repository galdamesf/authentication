import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Private from "./components/Private";
import { useState } from "react";
import MyNavbar from "./components/MyNavbar";
import Footer from "./components/Footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <MyNavbar />
      <div className="container">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/private"
            element={
              isAuthenticated ? (
                <>
                  <Private setIsAuthenticated={setIsAuthenticated} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
