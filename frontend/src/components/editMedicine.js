import React, { useState } from "react";

const EditMedicine = () => {
  const [medicineToUpdate, setMedicineToUpdate] = useState({
    name: "",
    activeIngredients: "",
    price: 0,
    description: "",
    medicinalUse: "",
    quantity: 0,
    PrescriptionNeeded: false,
    Archive: false
  });

  const [error, setError] = useState("");

  const [medicineName, setMedicineName] = useState("");
  const [searchedMedicine, setSearchedMedicine] = useState([]); // To store the searched medicine
  const [updatedMedicine, setUpdatedMedicine] = useState(null);
  const [image, setImage] = useState(null);

  
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleInputChange = (e) => {
    const { name, value , checked, type} = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    setMedicineToUpdate({
      ...medicineToUpdate,
      [name]: inputValue,
    });
  };

  const handleSearchMedicine = async () => {
    try {
      const response = await fetch(`/api/pharmacist/searchMedicineByName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicineName: medicineName }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data) {
          // If medicine is found, populate the form fields with its details
          const foundMedicine = data;
          setSearchedMedicine(foundMedicine); // Store the searched medicine
          setMedicineToUpdate(foundMedicine); // Populate the form fields
        } else {
          console.error("Medicine not found");
        }
      } else {
        console.error("Error searching for medicine");
      }
    } catch (error) {
      console.error(
        "An error occurred while searching for the medicine:",
        error
      );
    }
  };

  const handleEditMedicine = async () => {
    if (
      !medicineToUpdate.name ||
      !medicineToUpdate.activeIngredients ||
      !medicineToUpdate.price ||
      !medicineToUpdate.description ||
      !medicineToUpdate.medicinalUse ||
      !medicineToUpdate.quantity 
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", medicineToUpdate.name);
      formData.append("activeIngredients", medicineToUpdate.activeIngredients);
      formData.append("price", medicineToUpdate.price);
      formData.append("description", medicineToUpdate.description);
      formData.append("medicinalUse", medicineToUpdate.medicinalUse);
      formData.append("quantity", medicineToUpdate.quantity);
      formData.append("PrescriptionNeeded", medicineToUpdate.PrescriptionNeeded);
      formData.append("Archive", medicineToUpdate.Archive);

      if(image !== null) {
        formData.append("image", image);
      }
      const response = await fetch("/api/pharmacist/editMedicine", {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        setError("");
        const updatedMedicineData = await response.json();
        setMedicineToUpdate({
          name: "",
          activeIngredients: "",
          price: 0,
          description: "",
          medicinalUse: "",
          quantity: 0,
          PrescriptionNeeded: false,
          Archive: false
        });
        setImage(null);
        setUpdatedMedicine(updatedMedicineData);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError("An error occurred while adding the medicine");
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2>Edit Medicine</h2>
        {error && <p className="text-danger">{error}</p>}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Medicine Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
          />
          <button
            className="btn btn-primary mt-2"
            onClick={handleSearchMedicine}
          >
            Search Medicine
          </button>
        </div>
        {/* Display searched medicine details */}
        {searchedMedicine &&
          searchedMedicine.map((medicine) => (
            <div>
              <p>Name: {medicine.name}</p>
              <p>Active Ingredients: {medicine.activeIngredients}</p>
              <p>Price: {medicine.price}</p>
              <p>Description: {medicine.description}</p>
              <p>Medicinal Use: {medicine.medicinalUse}</p>
              <p>Quantity: {medicine.quantity}</p>
              <p>Prescription Needed: {medicine.PrescriptionNeeded ? 'Yes' : 'No'}</p>
              <p>Archived: {medicine.Archive ? 'Yes' : 'No'}</p>

              {medicine.image.filename ? (
                <img src={`${medicine.image.filename}`} alt="Medicine" />
              ) : (
                <p>No Image Available</p>
              )}
            </div>
          ))}
        {/* Rest of the form fields for editing */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={medicineToUpdate.name}
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
            value={medicineToUpdate.activeIngredients}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price:
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={medicineToUpdate.price}
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
            value={medicineToUpdate.medicinalUse}
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
            value={medicineToUpdate.description}
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
            value={medicineToUpdate.quantity}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="PrescriptionNeeded" className="form-label">
            Prescription Needed:
          </label>
          <input
            type="text"
            className="form-control"
            id="PrescriptionNeeded"
            name="PrescriptionNeeded"
            value={medicineToUpdate.PrescriptionNeeded} // Convert boolean to string
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Archive" className="form-label">
          Archived:
          </label>
          <input
            type="text"
            className="form-control"
            id="Archive"
            name="Archive"
            value={medicineToUpdate.Archive} 
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
        <button className="btn btn-primary" onClick={handleEditMedicine}>
          Edit Medicine
        </button>
      </div>
      {updatedMedicine && (
        <div>
          <p>Name: {updatedMedicine.name}</p>
          <p>Active Ingredients: {updatedMedicine.activeIngredients}</p>
          <p>Price: {updatedMedicine.price}</p>
          <p>Description: {updatedMedicine.description}</p>
          <p>Medicinal Use: {updatedMedicine.medicinalUse}</p>
          <p>Quantity: {updatedMedicine.quantity}</p>
          <p>Prescription Needed: {updatedMedicine.PrescriptionNeeded ? 'Yes' : 'No'}</p>
          <p>Archived: {updatedMedicine.Archive ? 'Yes' : 'No'}</p>

        </div>
      )}
    </div>
  );
};

export default EditMedicine;
