import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import CreateDeal from "./pages/Deal/CreateDeal";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./pages/Header/Header";
import AssignedDeals from "./pages/Seller Assigned/AssignedDeal";
import ChatRoomWrapper from "./pages/ChatRoom/ChatRoomWrapper";
import TransactionHistory from "./pages/TransactionHistory/Transaction";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute props="login">
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute props="register">
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <ProtectedRoute props="dashboard">
                <h1>Seller Dashboard</h1>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/deals"
            element={
              <ProtectedRoute props="deals">
                <AssignedDeals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/room/:roomId"
            element={
              <ProtectedRoute props="room">
                <ChatRoomWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/transaction"
            element={
              <ProtectedRoute props="transaction">
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute props="dashboard">
                <h2>dashboard</h2>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/deals"
            element={
              <ProtectedRoute props="deals">
                <CreateDeal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/room/:roomId"
            element={
              <ProtectedRoute props="room">
                <ChatRoomWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/transaction"
            element={
              <ProtectedRoute props="transaction">
                <TransactionHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <ProtectedRoute allowedRoles={["buyer", "seller"]}>
                <p>Redirecting...</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
