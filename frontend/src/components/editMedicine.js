import React, { useState } from "react";

const EditMedicine = ({medicine}) => {
  const [medicineToUpdate, setMedicineToUpdate] = useState({
    activeIngredients: "",
    price: 0,
    description: "",
    medicinalUse: "",
    quantity: 0,
    PrescriptionNeeded: false,
    Archive: false
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  //const [medicineName, setMedicineName] = useState("");
  const [searchedMedicine, setSearchedMedicine] = useState([]); // To store the searched medicine
  const [updatedMedicine, setUpdatedMedicine] = useState(null);
  const [image, setImage] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);


  
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


  const toggleSearchResults = () => {
    setShowSearchResults((prevShowSearchResults) => !prevShowSearchResults);
  };

  // const handleSearchMedicine = async () => {
    
  //   try {
  //     if (!medicineName) {
  //       setError("Please fill in the Medicine Name field.");
  //       return;
  //     }
  //     const response = await fetch(`/api/pharmacist/searchMedicineByName`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ medicineName: medicineName }),
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       if (data) {
  //         // If medicine is found, populate the form fields with its details
  //         const foundMedicine = data;
  //         setSearchedMedicine(foundMedicine); // Store the searched medicine
  //         setMedicineToUpdate(foundMedicine); // Populate the form fields
  //         toggleSearchResults();
  //       } else {
  //         setError("Medicine not found");
  //         setSearchedMedicine([]); 
  //         toggleSearchResults();
  //       }
  //     } else {
  //         setError("Medicine not found");
  //         setSearchedMedicine([]); 
  //         toggleSearchResults();
  //     }
  //   } catch (error) {
  //     console.error(
  //       "An error occurred while searching for the medicine:",
  //       error
  //     );
  //   }
  // };

  const handleEditMedicine = async () => {
    let errorMessage = "";
    if (
      !medicineToUpdate.activeIngredients ||
      medicineToUpdate.price < 0 ||
      !medicineToUpdate.description ||
      !medicineToUpdate.medicinalUse ||
      medicineToUpdate.quantity < 0 // Check for negative quantity
    ) {
      setError("Please fill in all fields and ensure that price and quantity are not negative.");
      setMessage("");
      return;
    }else if (!medicineToUpdate.activeIngredients){
      errorMessage = "Please fill the active ingredient field.";
    }
     else if (medicineToUpdate.price <= 0 || !medicineToUpdate.price) {
      errorMessage = "Please fill the price field and ensure Price cannot be a negative number and cannot be zero.";
    } else if (!medicineToUpdate.description || !medicineToUpdate.medicinalUse) {
      errorMessage = "Please fill the description field.";
    } else if ( !medicineToUpdate.medicinalUse){
      errorMessage = "Please fill the medical use field.";
    }
    else if (medicineToUpdate.quantity <= 0 || !medicineToUpdate.quantity) {
      errorMessage = "Quantity cannot be a negative number and cannot be zero.";
    }
    
    if (errorMessage) {
      setError(errorMessage);
      setMessage("");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", medicine);
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
        {/* Display searched medicine details */}
        {/* {showSearchResults &&searchedMedicine &&
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
          ))} */}
        {/* Rest of the form fields for editing */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name: {medicine}
          </label>
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
            placeholder="Type an Active Ingredient"

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
            value={medicineToUpdate.price === 0 ? '' : medicineToUpdate.price}
            onChange={handleInputChange}
            placeholder="Type a price"

          />
        </div>
        <div className="mb-3">
          <label htmlFor="medicinalUse" className="form-label">
            Medical Use:
          </label>
          <input
            type="text"
            className="form-control"
            id="medicinalUse"
            name="medicinalUse"
            value={medicineToUpdate.medicinalUse}
            onChange={handleInputChange}
            placeholder="Type a medical use"

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
            placeholder="Type a description"

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
            value={medicineToUpdate.quantity === 0 ? '' : medicineToUpdate.quantity}
            onChange={handleInputChange}
            placeholder="Type a number"

          />
        </div>
        <div className="mb-3">
          <label htmlFor="PrescriptionNeeded" className="form-label">
            Prescription Needed:
          </label>
          <select
            className="form-control"
            id="PrescriptionNeeded"
            name="PrescriptionNeeded"
            value={medicineToUpdate.PrescriptionNeeded.toString()}
            onChange={handleInputChange}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="Archive" className="form-label">
            Archived:
          </label>
          <select
            className="form-control"
            id="Archive"
            name="Archive"
            value={medicineToUpdate.Archive.toString()}
            onChange={handleInputChange}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
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
