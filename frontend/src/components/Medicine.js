import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "react-bootstrap";

function Medicine({ modelName , sharedState }) {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [medicinalUse, setMedicinalUse] = useState("");
  const [showMedicineList, setShowMedicineList] = useState(false);
  const [alternativeMessage, setAlternativeMessage] = useState(null);
  const [archiveMessages, setArchiveMessages] = useState({});


 
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/${modelName}/viewMedicineInventory`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sharedState]);



  const viewMedicineInventory = async () => {
    try {
     
      setShowMedicineList(true);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleViewMedicines = () => {
    if (!showMedicineList) {
      viewMedicineInventory();
    } else {
      fetchData();
      setShowMedicineList(false);
    }
  };

  const searchMedicineByName = async () => {
    try {
      if (searchTerm.trim() === "") {
        // Use Bootstrap Alert for displaying the message
        setAlternativeMessage(<Alert variant="danger">Please fill in the search field.</Alert>);
        return;
      }
  
      const response = await fetch(`/api/${modelName}/searchMedicineByName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicineName: searchTerm }),
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          const data = await response.json();
          if (data.message === 'Medicine is not available.') {
            // Use Bootstrap Alert for displaying the message
            setAlternativeMessage(<Alert variant="danger">Medicine is not available.</Alert>);
          } else {
            // Use Bootstrap Alert for displaying the message
            setAlternativeMessage(<Alert variant="danger">{`No medicine found with the name "${searchTerm}".`}</Alert>);
          }
        } else {
          throw new Error("Failed to fetch data");
        }
      } else {
        const data = await response.json();
        setShowMedicineList(true);
        setSearchTerm("");
        setMedicines(data);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const filterMedicineByMedicinalUse = async () => {
    try {
      if (medicinalUse === "") {
        // Use Bootstrap Alert for displaying the message
        setAlternativeMessage(<Alert variant="danger">Please fill in the filter field.</Alert>);
        return;
      }
      const response = await fetch(`/api/${modelName}/filterMedicineByMedicinalUse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicinalUse }),
      });
      if (!response.ok) {
        if (response.status === 404) {
          // Use Bootstrap Alert for displaying the message
          setAlternativeMessage(<Alert variant="danger">{`No medical use found with the name "${medicinalUse}".`}</Alert>);
        } else {
          throw new Error("Failed to fetch data");
        }
      } else {
        const data = await response.json();
        setShowMedicineList(true);
        setMedicinalUse("");
        setMedicines(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const addMedicineToCart = async (medicineName) => {
    try {
        const response = await fetch(`/api/${modelName}/addMedicineToCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: medicineName }), // Make sure the key matches what the backend expects
        });

        if (!response.ok) {
            throw new Error(`Failed to add medicine to cart`);
        }

        const data = await response.json();

        if (data.message === 'Prescription is needed for this medicine or the prescription is not recent') {
            alert('Prescription is needed for this medicine or the prescription is not recent. Cannot add to cart.');
        } else if (data.message === 'Medicine added to the cart') {
            alert('Medicine added to the cart successfully!');
        } else {
            console.error('Unexpected response from the server:', data);
            alert('Failed to add medicine to cart. Unexpected response from the server.');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to add medicine to cart');
    }
};

const viewMedicineAlternatives = async (medicineName) => {
  try {
      const response = await fetch(`/api/${modelName}/viewMedicineAlternatives`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: medicineName }),
      });

      if (!response.ok) {
          throw new Error("Failed to fetch alternatives");
      }

      const data = await response.json();

      if (data.message === 'No stock available, alternatives suggested') {
          // Display alternatives
          setShowMedicineList(true);
          setMedicines(data.alternatives);
      } else if (data.message === 'No alternatives available') {
          // Handle the case when there are no alternatives
          setShowMedicineList(false);
          alert("No alternatives available");
      } else {
          console.error('Unexpected response from the server:', data);
          alert('Failed to fetch alternatives. Unexpected response from the server.');
      }
  } catch (error) {
      console.error(error);
      alert("Error fetching alternatives");
  }
};

  // Function to archive a medicine
const archiveMedicine = async (medicineName) => {
  try {
    const response = await fetch(`/api/pharmacist/archiveMedicine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ medicineName }),
    });

    if (!response.ok) {
      throw new Error("Failed to archive medicine");
    }

    // Update the local state with the updated medicine list
    fetchData();
    setArchiveMessages({ ...archiveMessages, [medicineName]: { variant: "success", message: "Medicine archived successfully!" } });
  } catch (error) {
    console.error(error);
    setArchiveMessages({ ...archiveMessages, [medicineName]: { variant: "danger", message: "Error archiving medicine" } });
  }
};

// Function to unarchive a medicine
const unarchiveMedicine = async (medicineName) => {
  try {
    const response = await fetch(`/api/pharmacist/unarchiveMedicine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ medicineName }),
    });

    if (!response.ok) {
      throw new Error("Failed to unarchive medicine");
    }

    // Update the local state with the updated medicine list
    fetchData();
    setArchiveMessages({ ...archiveMessages, [medicineName]: { variant: "success", message: "Medicine unarchived successfully!" } });
  } catch (error) {
    console.error(error);
    setArchiveMessages({ ...archiveMessages, [medicineName]: { variant: "danger", message: "Error unarchiving medicine" } });
  }
};

const toggleArchive = async (medicineName, isArchived) => {
  if (isArchived) {
    await unarchiveMedicine(medicineName);
  } else {
    await archiveMedicine(medicineName);
  }
};

   return (
    <div className="container mt-4">
      <div className="card">
        <h1 className="mb-4">Medicine Inventory</h1>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => {
              // Reset alternativeMessage when the user types in the search field
              setAlternativeMessage(null);
              setSearchTerm(e.target.value);
            }}
            className="form-control d-inline w-50"
          />
          <button
            className="btn btn-primary ml-2"
            onClick={searchMedicineByName}
          >
            Search
          </button>
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Filter by Medical Use"
            value={medicinalUse}
            onChange={(e) => {
              // Reset alternativeMessage when the user types in the filter field
              setAlternativeMessage(null);
              setMedicinalUse(e.target.value);
            }}
            className="form-control d-inline w-50"
          />
          <button
            className="btn btn-primary ml-2"
            onClick={filterMedicineByMedicinalUse}
          >
            Filter
          </button>
        </div>
      </div>
      <hr />
      <div>
        {/* Display the Bootstrap Alert */}
        {alternativeMessage && (
          <div className="mb-3">
            {alternativeMessage}
          </div>
        )}
        
        <h2>Medicine List</h2>
        <button className="btn btn-primary" onClick={toggleViewMedicines}>
          {showMedicineList ? "Hide Medicine List" : "View All Medicines"}
        </button>
        {showMedicineList && (
          <ul className="list-group card">
            {medicines.map(
              (medicine, index) =>
                // Add the condition to skip rendering archived medicines for patients
                !(modelName === "patient" && medicine.Archive) && (
                  <li key={index} className="list-group-item">
                    <h3>{medicine.name}</h3>
                    <p>Price: {medicine.price}</p>
                    <p>Description: {medicine.description}</p>
                    <p>Active Ingredients: {medicine.activeIngredients}</p>
                    <p>Medicinal Use: {medicine.medicinalUse}</p>
                    <p>
                      Prescription Needed:{" "}
                      {medicine.PrescriptionNeeded ? "Yes" : "No"}
                    </p>
                    {modelName === "pharmacist" ||
                    modelName === "administrator" ? (
                      <div>
                        <p>Quantity: {medicine.quantity}</p>
                        <p>Sales: {medicine.sales}</p>
                        <p>Archived: {medicine.Archive ? "Yes" : "No"}</p>
                      </div>
                    ) : null}

                    {medicine.image.filename ? (
                      <img
                        src={`${medicine.image.filename}`}
                        alt="Medicine"
                      />
                    ) : (
                      <p>No Image Available</p>
                    )}
                    {modelName === "pharmacist" && (
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          toggleArchive(medicine.name, medicine.Archive)
                        }
                      >
                        {medicine.Archive ? "Unarchive" : "Archive"}
                      </button>
                    )}
                    {modelName === "patient" && medicine.quantity === 0 && (
                      <div>
                        <button
                          className="btn btn-info"
                          onClick={() =>
                            viewMedicineAlternatives(medicine.name)
                          }
                        >
                          View Alternatives
                        </button>
                        <p>
                          Medicine is out of stock. Click "View Alternatives" to
                          see alternatives.
                        </p>
                      </div>
                    )}
                    {modelName === "patient" && medicine.quantity>0 && (
                      <button
                        className="btn btn-success"
                        onClick={() => addMedicineToCart(medicine.name)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </li>
                )
            )}
          </ul>
        )}
        
      </div>
    </div>
  );
}

export default Medicine;
