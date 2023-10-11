import React, { useState } from "react";

const AddMedicine = () => {
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    activeIngredients: "",
    price: 0,
    description: "",
    medicinalUse: "",
    quantity: 0,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine({
      ...newMedicine,
      [name]: value,
    });
  };

  const handleAddMedicine = async () => {
    if (
      !newMedicine.name ||
      !newMedicine.activeIngredients ||
      !newMedicine.price ||
      !newMedicine.description ||
      !newMedicine.medicinalUse ||
      !newMedicine.quantity
    ) {
      setError("Please fill in all fields.");
      setMessage("");
      return;
    }

    try {
      const response = await fetch("/api/pharmacist/addMedicine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMedicine),
      });

      if (response.ok) {
        setMessage("Medicine added successfully");
        setError("");
        //window.location.reload();//comment this
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred while adding the medicine");
      setMessage("");
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2>Add New Medicine</h2>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={newMedicine.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="activeIngredients" className="form-label">
            Active Ingredients:
          </label>
          <input
            type="text"
            className="form-control"
            id="activeIngredients"
            name="activeIngredients"
            value={newMedicine.activeIngredients}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price:
          </label>
          <input
            type="price"
            className="form-control"
            id="number"
            name="price"
            value={newMedicine.price}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={newMedicine.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="medicinalUse" className="form-label">
            Medicinal Use:
          </label>
          <input
            type="text"
            className="form-control"
            id="medicinalUse"
            name="medicinalUse"
            value={newMedicine.medicinalUse}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity:
          </label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={newMedicine.quantity}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleAddMedicine}>
          Add Medicine
        </button>
      </div>
    </div>
  );
};

export default AddMedicine;
