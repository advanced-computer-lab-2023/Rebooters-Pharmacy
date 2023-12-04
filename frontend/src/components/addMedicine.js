import React, { useState } from "react";

const AddMedicine = () => {
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    activeIngredients: "",
    price: 0,
    description: "",
    medicinalUse: "",
    quantity: 0,
    prescription: false,
    archive: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If the input type is a checkbox, handle it differently
    const inputValue = type === "checkbox" ? checked : value;

    setNewMedicine({
      ...newMedicine,
      [name]: inputValue,
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
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
      const formData = new FormData();
      formData.append("name", newMedicine.name);
      formData.append("activeIngredients", newMedicine.activeIngredients);
      formData.append("price", newMedicine.price);
      formData.append("description", newMedicine.description);
      formData.append("medicinalUse", newMedicine.medicinalUse);
      formData.append("quantity", newMedicine.quantity);
      formData.append("PrescriptionNeeded", newMedicine.prescription);
      formData.append("Archive", newMedicine.archive); // Add this line
      formData.append("image", image);

      const response = await fetch("/api/pharmacist/addMedicine", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Medicine added successfully");
        setError("");
        setNewMedicine({
          name: "",
          activeIngredients: "",
          price: 0,
          description: "",
          medicinalUse: "",
          quantity: 0,
          archive:false,
        });
        setImage(null);
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
        <div className="mb-3">
          <label htmlFor="prescription" className="form-label">
            Prescription Needed:
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="prescription"
            name="prescription"
            checked={newMedicine.prescription}
            onChange={handleInputChange}
          />
         
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image: (Optional)
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            name="image"
            onChange={handleImageChange}
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
