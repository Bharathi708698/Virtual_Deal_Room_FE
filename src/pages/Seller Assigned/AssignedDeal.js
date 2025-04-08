import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedDeals.css";
import { useNavigate } from "react-router-dom";
import {
  AssignedDealAPI,
  DealAPI,
} from "../../components/api/api";

const AssignedDeals = () => {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios
          .get(AssignedDealAPI, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setDeals(res.data.value);
          })
          .catch((error) => {
            window.alert(error.response.data.msg);
            localStorage.removeItem("token");
            navigate("/");
          });
      } catch (err) {
        window.alert(err);
      }
    };

    fetchDeals();
  }, []);

  const handleStatusUpdate = async (dealId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios
        .post(
          DealAPI,
          { id: dealId, status, cmd: "updatestatus" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          window.alert(res.data.msg);
          window.location.reload();
        })
        .catch((error) => {
          window.alert(error.response.data.msg);
        });
    } catch (err) {
      window.alert(err.response?.data?.msg || "Status update failed");
    }
  };

  const handleFileDownload = (filePath) => {
    // Handle the file download logic here
    const link = document.createElement("a");
    link.href = filePath; // The path of the file to be downloaded
    link.download = filePath.split("/").pop(); // Extracts the file name from the path
    link.click(); // Programmatically clicks the link to initiate the download
  };

  return (
    <div className="assigned-deals-container">
      <h2>Assigned Deals</h2>
      <table className="deals-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Status</th>
            <th>Room</th>
            <th>Deal File</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deals.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Waiting for Buyer to assign the Deal
              </td>
            </tr>
          ) : (
            deals.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.title}</td>
                <td>{deal.finalPrice}</td>
                <td>{deal.description}</td>
                <td>
                  {deal.status === "Completed"
                    ? "Completed"
                    : deal.status === "Pending" && !deal.dealCancelled
                    ? "Pending"
                    : "Cancelled"}
                </td>
                <td>
                  <button onClick={() => navigate(`/seller/room/${deal.id}`)}>
                    Go to Room
                  </button>
                </td>
                <td>
                  {deal.file ? (
                    <button
                      onClick={() => handleFileDownload(deal.file)}
                      style={{ backgroundColor: "#3498db", color: "white" }}
                    >
                      Download File
                    </button>
                  ) : (
                    <span>No file available</span>
                  )}
                </td>
                <td>
                  {/* Conditional rendering based on deal status */}
                  {deal.status === "Pending" && !deal.dealCancelled ? (
                    <>
                      <button
                        // onClick={() => handlePayment(deal.id)}
                        onClick={() => handleStatusUpdate(deal.id, "Completed")}
                        disabled={deal.status === "Completed"}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(deal.id, "Cancelled")}
                        disabled={deal.status === "Cancelled"}
                        style={{
                          marginLeft: "8px",
                          backgroundColor: "#e74c3c",
                        }}
                      >
                        Reject
                      </button>
                    </>
                  ) : deal.status === "Cancelled" ? (
                    <span>Rejected</span>
                  ) : deal.status === "Completed" ? (
                    <span>Accepted</span>
                  ) : null}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedDeals;
