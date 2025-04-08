import {
  DealAPI,
  PaymentInitAPI,
  PaymentVerifyAPI,
  SellerAPI,
} from "../../components/api/api";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CreateDeal.css";
import { useNavigate } from "react-router-dom";

const CreateDeal = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deals, setDeals] = useState([]);
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [file, setFile] = useState(null); // state for the uploaded file
  const [fileControlEnabled, setFileControlEnabled] = useState(false); // to control file upload
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchSellers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(SellerAPI, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSellers(res.data.value);
    } catch (error) {
      window.alert(error.response.data.msg);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const fetchDeals = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(DealAPI, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeals(res.data.value || []);
    } catch (error) {
      window.alert(error.response.data.msg);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchSellers();
    fetchDeals();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePayment = async (dealId) => {
    try {
      const token = localStorage.getItem("token");
      await axios
        .post(
          PaymentInitAPI,
          { id: dealId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.value) {
            let data = res.data.value;
            const options = {
              key: data.key,
              amount: data.amount,
              currency: data.currency,
              name: data.name,
              description: data.description,
              order_id: data.order_id,
              handler: function (response) {
                axios
                  .post(
                    PaymentVerifyAPI,
                    {
                      paymentId: response.razorpay_payment_id,
                      orderId: response.razorpay_order_id,
                      signature: response.razorpay_signature,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  )
                  .then((res) => {
                    if (res.data.success) {
                      alert("Payment Successful");
                      window.location.reload();
                    }
                  })
                  .catch((err) => alert("Payment Verification Failed"));
              },
              prefill: {
                name: "Your Name",
                email: "your-email@example.com",
                contact: "9999999999",
              },
              notes: {
                address: "Your Address",
              },
              theme: {
                color: "#F37254",
              },
            };

            // Create the payment popup
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
          } else {
            window.alert("Order creation failed");
          }
        })
        .catch((error) => {
          window.alert(error.response.data.msg);
        });
    } catch (err) {
      window.alert(err.response?.data?.msg || "Payment Initiation failed");
    }
  };

  // Enable or Disable file upload based on backend response
  const handleFileControlToggle = async (dealId, enable) => {
    const token = localStorage.getItem("token");
    try {
      await axios
        .post(
          `${DealAPI}`,
          { id: dealId, enable, cmd: "updatefile" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          window.location.reload();
        });
    } catch (err) {
      window.alert(err.response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle file upload and other fields
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("participants", selectedSeller);
    formData.append("cmd", "create");

    if (file) {
      formData.append("file", file); // append file as buffer
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(DealAPI, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Deal created successfully!");
      setShowForm(false);
      setTitle("");
      setPrice("");
      setDescription("");
      setSelectedSeller(null);
      setFile(null);
      fetchDeals();
    } catch (err) {
      window.alert(err);
    }
  };

  const updatePrice = async (dealId) => {
    const token = localStorage.getItem("token");
    try {
      axios
        .post(
          DealAPI,
          {
            id: dealId,
            finalprice: newPrice,
            cmd: "updateprice",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setEditingPrice(null);
          window.location.reload();
        });
    } catch (err) {
      window.alert(err);
    }
  };

  return (
    <div className="deal-container">
      <div className="deal-header">
        <h2>List of Deals</h2>
        <button className="add-deal-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "Add Deal"}
        </button>
      </div>

      <div className="deal-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Participant</th>
              <th>Status</th>
              <th>Room</th>
              <th>File Control</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {deals.length === 0 ? (
              <tr>
                <td colSpan="8" style={{textAlign:"center"}}>Create your first Deal</td>
              </tr>
            ) : (
              deals.map((deal) => (
                <tr key={deal.id}>
                  <td>{deal.title}</td>
                  <td>
                    {editingPrice === deal.id && deal.status === "Pending" ? (
                      <>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                        />
                        <button onClick={() => updatePrice(deal.id)}>✔</button>
                        <button onClick={() => setEditingPrice(null)}>✖</button>
                      </>
                    ) : (
                      <>
                        {deal.finalPrice}{" "}
                        {deal.status === "Pending" && (
                          <button
                            onClick={() => {
                              setEditingPrice(deal.id);
                              setNewPrice(deal.finalPrice); // Pre-fill old price
                            }}
                          >
                            ✏️
                          </button>
                        )}
                      </>
                    )}
                  </td>
                  <td>{deal.description}</td>
                  <td>{deal.participants?.map((p) => p.name).join(", ")}</td>
                  <td>{deal.status || "Pending"}</td>
                  <td>
                    <button
                      className="room-btn"
                      onClick={() => navigate(`/buyer/room/${deal.id}`)}
                    >
                      Go to Room
                    </button>
                  </td>
                  <td>
                    {/* File Control Column Logic */}
                    {deal.file ? (
                      <button
                        className={
                          deal.fileVisible ? "enable-btn" : "disable-btn"
                        }
                        onClick={() =>
                          handleFileControlToggle(deal.id, !deal.fileVisible)
                        }
                      >
                        {deal.fileVisible ? "Disable" : "Enable"}
                      </button>
                    ) : (
                      <span>File not uploaded</span>
                    )}
                  </td>
                  <td>
                    {deal.status === "Completed" &&
                    deal.paymentStatus === "Processing" ? (
                      <button
                        className="pay-btn"
                        onClick={() => handlePayment(deal.id)}
                      >
                        Pay
                      </button>
                    ) : deal.status === "Completed" &&
                      deal.paymentStatus === "Success" ? (
                      "Paid"
                    ) : (
                      "Waiting for accept Seller"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="deal-form-card">
            <button className="close-button" onClick={() => setShowForm(false)}>
              &times;
            </button>
            <h3>Create a New Deal</h3>
            <form className="deal-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Deal Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="seller-dropdown-wrapper" ref={dropdownRef}>
                <div
                  className="dropdown-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {selectedSeller
                    ? sellers.find((s) => s.email === selectedSeller)?.name
                    : "Select Seller"}
                </div>
                {showDropdown && (
                  <div className="checkboxes">
                    {sellers.map((seller) => (
                      <label
                        key={seller.email}
                        onClick={() => {
                          setSelectedSeller(seller.email);
                          setShowDropdown(false);
                        }}
                      >
                        <input
                          type="radio"
                          checked={selectedSeller === seller.email}
                          readOnly
                        />
                        <span>{seller.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {/* File control toggle */}
              <div className="file-control">
                <button
                  className={fileControlEnabled ? "enable-btn" : "disable-btn"}
                  onClick={() => setFileControlEnabled(!fileControlEnabled)}
                  type="button"
                >
                  {fileControlEnabled
                    ? "Disable File Upload"
                    : "Enable File Upload"}
                </button>
              </div>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".pdf,.docx,.png"
                disabled={!fileControlEnabled}
              />
              <div className="center-button">
                <button type="submit" className="submit-button">
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateDeal;
