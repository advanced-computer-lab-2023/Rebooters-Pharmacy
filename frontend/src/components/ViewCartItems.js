import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Wallet from "./Wallet";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import "../styles/cartItems.css";
import Medicine from "../components/Medicine";
import { Link, useNavigate } from "react-router-dom";
import CheckingOut from "../components/CheckingOut";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";

const ViewCartItems = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [dangerMessage, setDangerMessage] = useState("");
  const [numbersArray] = useState(Array.from({ length: 20 }, (_, i) => i + 1));
  const MAX_QUANTITY = 15;
  const [showModal, setShowModal] = useState(false);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [SuccessCoupoun, setCouponSuccess] = useState("");
  const [image, setImage] = useState(null);
  const [walletShow, setWalletShow] = useState(false);
  const [walletTarget, setWalletTarget] = useState(null);
  const walletRef = useRef(null);

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const response = await fetch("/api/patient/viewCartItems", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
          setError("");
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (error) {
        setError("Error retrieving cart items");
      }
    };

    getCartItems();
  }, [cartItems]);

  const handleRemoveItem = async (medicineName) => {
    try {
      const response = await fetch("/api/patient/removeCartItem", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ medicineName }),
      });

      if (response.ok) {
        const updatedCartItems = cartItems.filter(
          (item) => item.name !== medicineName
        );
        setCartItems(updatedCartItems);
        setSuccessMessage("Medicine removed successfully");
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError("Error removing medicine from the cart");
    }
  };

  const handleUpdateItem = async (productName, quantity) => {
    try {
      let newValue = quantity + 1;

      if (newValue > MAX_QUANTITY) {
        setDangerMessage(
          `You reached the maximum quantity (${MAX_QUANTITY}) for this medicine`
        );
        setError("");
        return;
      }

      let index = cartItems.findIndex((item) => item.name === productName);
      cartItems[index].quantity = newValue;

      const response = await fetch(
        `/api/patient/changeAmountOfAnItem?name=${productName}&quantity=${newValue}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setSuccessMessage("Quantity updated successfully");
      setError("");
    } catch (error) {
      setError("Error updating quantity");
    }
  };

  const handleDecrementItem = async (productName, quantity) => {
    try {
      if (quantity > 1) {
        let newValue = quantity - 1;
        let index = cartItems.findIndex((item) => item.name === productName);
        cartItems[index].quantity = newValue;

        const response = await fetch(
          `/api/patient/changeAmountOfAnItem?name=${productName}&quantity=${newValue}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update quantity");
        }

        setSuccessMessage("Quantity updated successfully");
        setError("");
      } else {
        setDangerMessage("Quantity cannot be below 1");
        setError("");
      }
    } catch (error) {
      setError("Error updating quantity");
    }
  };

  useEffect(() => {
    // Reset successMessage after 2 seconds
    const resetSuccessMessage = () => {
      setSuccessMessage("");
    };

    const timer = setTimeout(resetSuccessMessage, 2000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    // Reset dangerMessage after 2 seconds
    const resetDangerMessage = () => {
      setDangerMessage("");
    };

    const dangerTimer = setTimeout(resetDangerMessage, 2000);

    return () => clearTimeout(dangerTimer);
  }, [dangerMessage]);

  const handleProceedToCheckout = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Reset successMessage after 2 seconds
    const resetSuccessCoupoun = () => {
      setCouponSuccess("");
    };

    const timer = setTimeout(resetSuccessCoupoun, 2000);

    return () => clearTimeout(timer);
  }, [SuccessCoupoun]);

  useEffect(() => {
    // Reset dangerMessage after 2 seconds
    const resetDangerCoupounError = () => {
      setCouponError("");
    };

    const dangerTimer = setTimeout(resetDangerCoupounError, 2000);

    return () => clearTimeout(dangerTimer);
  }, [couponError]);

  const handleApplyCoupon = () => {
    if (coupon.trim() === "") {
      setCouponError("Please fill in the coupon code.");
    } else if (coupon === "SUP60" || coupon === "sup60") {
      const couponDiscount = subtotal * 0.6;
      setDiscount(couponDiscount);
      setCouponSuccess("The discount added successfully");
    } else {
      // Reset the discount if the coupon is not valid
      setDiscount(0);
      setCouponError("The coupon has expired.");
    }
  };

  const handleWalletClick = (event) => {
    setWalletShow(!walletShow);
    setWalletTarget(event.target);
  };

  return (
    <div className="site-section">
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {dangerMessage && <Alert variant="danger">{dangerMessage}</Alert>}
      <div className="container">
        <div className="row mb-5">
          <form className="col-md-12">
            <div className="site-blocks-table">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="product-thumbnail">Image</th>
                    <th className="product-name">Product</th>
                    <th className="product-price">Price</th>
                    <th className="product-quantity">Quantity</th>
                    <th className="product-total">Total</th>
                    <th className="product-remove">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index}>
                      <td className="product-thumbnail">
                        {item.image && (
                          <img
                            src={`${item.image.filename}`}
                            alt={item.name}
                            className="bd-placeholder-img card-img-top"
                            style={{ width: "20%", height: "125" }}
                          />
                        )}
                      </td>
                      <td className="product-name">
                        <h2 className="h5 text-black">{item.name}</h2>
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <div
                          className="input-group mb-3"
                          style={{ maxWidth: "120px" }}
                        >
                          <div className="input-group-prepend">
                            <button
                              className="btn btn-outline-primary js-btn-minus"
                              type="button"
                              onClick={() =>
                                handleDecrementItem(item.name, item.quantity)
                              }
                            >
                              −
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.quantity}
                            placeholder=""
                            aria-label="Example text with button addon"
                            aria-describedby="button-addon1"
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-outline-primary js-btn-plus"
                              type="button"
                              onClick={() =>
                                handleUpdateItem(item.name, item.quantity)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>${item.quantity * item.price}</td>
                      <td>
                        <button
                          type="button" // Add this line to explicitly set the button type
                          className="btn btn-danger"
                          onClick={() => handleRemoveItem(item.name)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="row mb-5">
              <div className="col-md-4 mb-3 mb-md-0">
                <Link
                  to="/patient#medicines"
                  className="btn btn-outline-primary btn-md btn-block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label className="text-black h4" htmlFor="coupon">
                  Coupon
                </label>
                <p>Enter your coupon code if you have one.</p>
              </div>
              <div className="col-md-8 mb-3 mb-md-0">
                <input
                  type="text"
                  className="form-control py-3"
                  id="coupon"
                  placeholder="Coupon Code"
                  onChange={(e) => setCoupon(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-primary btn-md px-4"
                  onClick={handleApplyCoupon}
                >
                  Apply Coupon
                </button>
                {couponError && <Alert variant="danger">{couponError}</Alert>}
                {SuccessCoupoun && (
                  <Alert variant="success">{SuccessCoupoun}</Alert>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6 pl-5">
            <div className="row justify-content-end">
              <div className="col-md-7">
                <div className="row">
                  <div className="col-md-12 text-right border-bottom mb-5">
                    <h3 className="text-black h4 text-uppercase">
                      Cart Totals
                    </h3>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <span className="text-black">Subtotal</span>
                  </div>
                  <div className="col-md-6 text-right">
                    <strong className="text-black">
                      ${subtotal.toFixed(2)}
                    </strong>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <span className="text-black">Discount</span>
                  </div>
                  <div className="col-md-6 text-right">
                    <strong className="text-black">
                      -${discount.toFixed(2)}
                    </strong>
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-md-6">
                    <span className="text-black">Total</span>
                  </div>
                  <div className="col-md-6 text-right">
                    <strong className="text-black">
                      ${(subtotal - discount).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed To Checkout
                    </button>
                  </div>
                </div>
                {/* Bootstrap Modal */}
                <Modal show={showModal} onHide={handleModalClose}>
                  <Modal.Header closeButton>
                    <Modal.Title> Checkout</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* Include the CheckingOut component here */}
                    <CheckingOut />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                      Close
                    </Button>
                    {/* You can add additional actions/buttons if needed */}
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCartItems;
