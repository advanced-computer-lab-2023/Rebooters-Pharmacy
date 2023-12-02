import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Medicine({ modelName , sharedState }) {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [medicinalUse, setMedicinalUse] = useState("");
  const [showMedicineList, setShowMedicineList] = useState(false);

 
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
      alert("Please fill in the search field.");
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
          alert("Medicine is not available.");
        } else {
          alert(`No medicine found with the name "${searchTerm}".`);
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
        alert("Please fill in the filter field.");
        return;
      }
      const response = await fetch( `/api/${modelName}/filterMedicineByMedicinalUse`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ medicinalUse }),
        }
      );
      if (!response.ok) {
        if (response.status === 404) {
          alert(`No medical use found with the name "${medicinalUse}".`);
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicineName }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add medicine to cart");
      }
  
      const data = await response.json();
      console.log(data); // Log the response from the server
      
      alert("Medicine added to the cart successfully!");
      
    } catch (error) {
      console.error(error);
      alert("Prescription is needed for this medicine.");
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
    alert("Medicine archived successfully!");
  } catch (error) {
    console.error(error);
    alert("Error archiving medicine");
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
    alert("Medicine unarchived successfully!");
  } catch (error) {
    console.error(error);
    alert("Error unarchiving medicine");
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
            placeholder="Filter by Medicinal Use"
            value={medicinalUse}
            onChange={(e) => setMedicinalUse(e.target.value)}
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
        <h2>Medicine List</h2>
        <button className="btn btn-primary" onClick={toggleViewMedicines}>
          {showMedicineList ? "Hide Medicine List" : "View All Medicines"}
        </button>
        {showMedicineList && (
          <ul className="list-group card">
            {medicines.map((medicine, index) => (
              <li key={index} className="list-group-item">
                <h3>{medicine.name}</h3>
                <p>Price: {medicine.price}</p>
                <p>Description: {medicine.description}</p>
                <p>Active Ingredients: {medicine.activeIngredients}</p>
                <p>Medicinal Use: {medicine.medicinalUse}</p>
                <p>Prescription Needed: {medicine.PrescriptionNeeded ? 'Yes' : 'No'}</p>
                {modelName === "pharmacist" || modelName ==="administrator" ? (
                  <div>
                  <p>Quantity: {medicine.quantity}</p>
                  <p>Sales: {medicine.sales}</p>
                  <p>Archived: {medicine.Archive ? 'Yes' : 'No'}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => toggleArchive(medicine.name, medicine.Archive)}
                  >
                    {medicine.Archive ? 'Unarchive' : 'Archive'}
                  </button>
                  </div>
                  
                ) : null}
                
                {medicine.image.filename ? (
                  <img src={`${medicine.image.filename}`} alt="Medicine" />
                ) : (
                  <p>No Image Available</p>
                )}
                {modelName === "patient" && medicine.quantity >0 &&(
                  <button
                    className="btn btn-success"
                    onClick={() => addMedicineToCart(medicine.name)}
                  >
                    Add to Cart
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Medicine;
