import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { DealAPI, TransactionAPI } from "../../components/api/api";
import "./Transaction.css";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const location = useLocation();

  // Detect role from the URL
  const role = location.pathname.includes("/buyer/") ? "buyer" : "seller";

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.get(`${TransactionAPI}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        setTransactions(res.data.value);
      })

      
    } catch (err) {
      alert("Failed to fetch transaction history");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transaction-container">
      <h2> Transaction History</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Status</th>
            {role === "buyer"? (<th>Paid To</th>): (<th>Paid By</th>)}
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{textAlign:"center"}}>No transactions found.</td>
            </tr>
          ) : (
            transactions.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.title}</td>
                <td>{deal.description}</td>
                <td>{deal.finalPrice}</td>
                <td>{deal.paymentStatus}</td>
                <td>{deal.name || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
