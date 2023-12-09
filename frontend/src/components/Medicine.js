import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Dropdown, DropdownButton } from "react-bootstrap";
import debounce from "lodash.debounce";
import "../styles/medicine.css";
import EditMedicine from "./editMedicine";

function Medicine({ modelName, sharedState }) {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [medicinalUse, setMedicinalUse] = useState("");
  const [showMedicineList, setShowMedicineList] = useState(false);
  const [alternativeMessage, setAlternativeMessage] = useState(null);
  const [archiveMessages, setArchiveMessages] = useState({});
  const [alternativeMedicines, setAlternativeMedicines] = useState([]);
  const [selectedAlternativeMedicine, setSelectedAlternativeMedicine] =
    useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [medicineAlerts, setMedicineAlerts] = useState({});
  const [currentMedicine, setCurrentMedicine] = useState(null);
  const [medicineCartMessages, setMedicineCartMessages] = useState({});
  const [cartMessage, setCartMessage] = useState(null);
  const [suggestedMedicineNames, setSuggestedMedicineNames] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMedicineDetails, setSelectedMedicineDetails] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState("");
  const [showEditingWindow, setShowEditingWindow] = useState(false);
  const [medicineName, setMedicineName] = useState("");

  const handleEditMedicine = (medicine) => {
    setEditingMedicine(medicine);
    setShowEditingWindow(true);
  };

  const handleCloseEditMedicine = () => {
    setEditingMedicine("");
    setShowEditingWindow(false);
  };

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
      /* if (searchTerm.trim() === "") {
        // Use Bootstrap Alert for displaying the message
        setAlternativeMessage(<Alert variant="danger">Please fill in the search field.</Alert>);
        return;
      }*/

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
          if (data.message === "Medicine is not available.") {
            // Use Bootstrap Alert for displaying the message
            setAlternativeMessage(
              <Alert variant="danger">Medicine is not available.</Alert>
            );
          } else {
            // Use Bootstrap Alert for displaying the message
            setAlternativeMessage(
              <Alert variant="danger">{`No medicine found with the name "${searchTerm}".`}</Alert>
            );
          }
        } else {
          throw new Error("Failed to fetch data");
        }
      } else {
        const data = await response.json();
        setSuggestedMedicineNames(data.map((medicine) => medicine.name));
        setShowMedicineList(true);
        setSearchTerm("");
        setMedicines(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedSearchMedicineByName = debounce(searchMedicineByName, 1000);
  useEffect(() => {
    // Trigger searchMedicineByName when searchTerm changes
    debouncedSearchMedicineByName();
    // Cleanup the debounce function on unmount
    return () => debouncedSearchMedicineByName.cancel();
  }, [searchTerm, debouncedSearchMedicineByName]);

  const filterMedicineByMedicinalUse = async () => {
    try {
      /* if (medicinalUse === "") {
        // Use Bootstrap Alert for displaying the message
        setAlternativeMessage(<Alert variant="danger">Please fill in the filter field.</Alert>);
        return;
      }*/
      const response = await fetch(
        `/api/${modelName}/filterMedicineByMedicinalUse`,
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
          // Use Bootstrap Alert for displaying the message
          setAlternativeMessage(
            <Alert variant="danger">{`No medical use found with the name "${medicinalUse}".`}</Alert>
          );
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

  const debouncedFilterMedicineByMedicinalUse = debounce(
    filterMedicineByMedicinalUse,
    1000
  );
  useEffect(() => {
    // Trigger filterMedicineByMedicinalUse when medicinalUse changes
    debouncedFilterMedicineByMedicinalUse();
    // Cleanup the debounce function on unmount
    return () => debouncedFilterMedicineByMedicinalUse.cancel();
  }, [medicinalUse, debouncedFilterMedicineByMedicinalUse]);

  const addMedicineToCart = async (medicineName) => {
    try {
      const response = await fetch(`/api/${modelName}/addMedicineToCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: medicineName }), // Make sure the key matches what the backend expects
      });

      if (!response.ok) {
        throw new Error(`Failed to add medicine to cart`);
      }

      const data = await response.json();
      setMedicineCartMessages({
        ...medicineCartMessages,
        [medicineName]: {
          variant:
            data.message === "Medicine added to the cart"
              ? "success"
              : "danger",
          message: data.message,
        },
      });

      if (
        data.message ===
        "Prescription is needed for this medicine or the prescription is not recent"
      ) {
        setCartMessage({
          variant: "danger",
          message:
            "Prescription is needed for this medicine or the prescription is not recent. Cannot add to cart.",
        });
      } else if (data.message === "Medicine added to the cart") {
        setCartMessage({
          variant: "success",
          message: `Medicine ${medicineName} added to the cart successfully!`,
        });
      } else {
        console.error("Unexpected response from the server:", data);
        setCartMessage({
          variant: "danger",
          message: `Failed to add ${medicineName} to cart. Unexpected response from the server.`,
        });
      }
    } catch (error) {
      console.error(error);
      setMedicineCartMessages({
        ...medicineCartMessages,
        [medicineName]: {
          variant: "danger",
          message: "Failed to add medicine to cart",
        },
      });
    }
  };

  const viewMedicineAlternatives = async (medicineName) => {
    try {
      const response = await fetch(
        `/api/${modelName}/viewMedicineAlternatives`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: medicineName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch alternatives");
      }

      const data = await response.json();

      if (data.message === "No stock available, alternatives suggested") {
        setMedicines(data.alternatives);
        setSelectedAlternativeMedicine(null);
        setCurrentMedicine(medicineName);
      } else if (data.message === "No alternatives available") {
        setMedicineAlerts({
          [medicineName]: (
            <Alert key={medicineName} variant="danger">
              No alternatives available for {medicineName}.
            </Alert>
          ),
        });
        setAlternativeMedicines([]); // Clear alternative medicines
      } else {
        console.error("Unexpected response from the server:", data);
        setMedicineAlerts({
          [medicineName]: (
            <Alert key={medicineName} variant="danger">
              No alternatives available for {medicineName}.
            </Alert>
          ),
        });
        setAlternativeMedicines([]); // Clear alternative medicines
      }

      // Set the alternative medicines as the new medicine list
      setMedicines(data.alternatives);
    } catch (error) {
      console.error(error);
      setMedicineAlerts({
        [medicineName]: (
          <Alert key={medicineName} variant="danger">
            Error fetching alternatives
          </Alert>
        ),
      });
      setAlternativeMedicines([]); // Clear alternative medicines
      setMedicines([]); // Clear other medicines
    }
  };

  const addAlternativeToCart = async () => {
    if (selectedAlternativeMedicine) {
      await addMedicineToCart(selectedAlternativeMedicine.name);
      setSelectedAlternativeMedicine(null); // Reset selected alternative medicine after adding to cart
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
      setArchiveMessages({
        ...archiveMessages,
        [medicineName]: {
          variant: "success",
          message: "Medicine archived successfully!",
        },
      });
    } catch (error) {
      console.error(error);
      setArchiveMessages({
        ...archiveMessages,
        [medicineName]: {
          variant: "danger",
          message: "Error archiving medicine",
        },
      });
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
      setArchiveMessages({
        ...archiveMessages,
        [medicineName]: {
          variant: "success",
          message: "Medicine unarchived successfully!",
        },
      });
    } catch (error) {
      console.error(error);
      setArchiveMessages({
        ...archiveMessages,
        [medicineName]: {
          variant: "danger",
          message: "Error unarchiving medicine",
        },
      });
    }
  };

  const toggleArchive = async (medicineName, isArchived) => {
    if (isArchived) {
      await unarchiveMedicine(medicineName);
    } else {
      await archiveMedicine(medicineName);
    }
  };

  const toggleAlternatives = () => {
    setShowAlternatives(!showAlternatives);
  };

  const handleInputChange = (e) => {
    setAlternativeMessage(null);
    setSearchTerm(e.target.value);

    // Check if the search term is not empty before rendering the dropdown
    if (e.target.value.trim() !== "") {
      setShowDropdown(true);
      debouncedSearchMedicineByName();
    } else {
      setShowDropdown(false);
    }
  };

  const handleDropdownClick = (name) => {
    setSearchTerm(name);
    searchMedicineByName();
  };

  const showMedicineDetails = (medicine) => {
    setSelectedMedicineDetails(medicine);
  };

  const hideMedicineDetails = () => {
    setSelectedMedicineDetails(null);
  };

  const toggleMedicineDetails = (medicine) => {
    if (selectedMedicineDetails === medicine) {
      hideMedicineDetails();
    } else {
      showMedicineDetails(medicine);
    }
  };

  return (
    <div className="container mt-4">
      {/* Edit Medicine modal */}
      {showEditingWindow && (
        <div className="modal-overlay">
          <div className="card">
            <div className="editMedicine">
              <EditMedicine medicine={editingMedicine} />
            </div>
            <button
              className="btn btn-danger"
              onClick={handleCloseEditMedicine}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="card">
        <h1 className="mb-4">Medicine Inventory</h1>
        <div className="mb-3">
          <div
            style={{ position: "relative" }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <input
              type="text"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={handleInputChange}
              className="form-control d-inline w-50"
            />

            {suggestedMedicineNames.length > 0 && showDropdown && (
              <ul className="list-group position-absolute w-50 mt-1">
                {suggestedMedicineNames.map((name, index) => (
                  <li
                    key={index}
                    className="list-group-item clickable"
                    onClick={() => handleDropdownClick(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
        </div>
      </div>
      <hr />
      <div>
        {/* Display the Bootstrap Alert */}
        {alternativeMessage && <div className="mb-3">{alternativeMessage}</div>}

        <div className="mb-3">
          <h2>Medicine List</h2>
          <button className="btn btn-primary" onClick={toggleViewMedicines}>
            {showMedicineList ? "Hide Medicine List" : "View All Medicines"}
          </button>
          {showMedicineList && (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {medicines.map((medicine, index) => (
                <div className="col" key={index}>
                  <div className="medicine-card  card shadow-sm">
                    {medicine.image.filename ? (
                      <img
                        src={`${medicine.image.filename}`}
                        alt={medicine.name}
                        className="bd-placeholder-img card-img-top"
                        width="100%"
                        height="225"
                      />
                    ) : (
                      <svg
                        className="bd-placeholder-img card-img-top"
                        width="100%"
                        height="225"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Placeholder: Thumbnail"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                      >
                        <title>Placeholder</title>
                        <rect width="100%" height="100%" fill="#55595c"></rect>
                        <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                          No Image
                        </text>
                      </svg>
                    )}
                    <div className="card-body ">
                      <h5 className="card-title">{medicine.name} </h5>
                      <button
                        type="button"
                        className={
                          modelName === "patient"
                            ? "btn btn-secondary"
                            : "btn btn-primary"
                        }
                        onClick={() => toggleMedicineDetails(medicine)}
                      >
                        {selectedMedicineDetails === medicine
                          ? "Hide Details"
                          : "View Details"}
                      </button>

                      <span>&nbsp;</span>

                      {modelName === "patient" && medicine.quantity === 0 && (
                        <button
                          type="button"
                          className="btn btn-warning ml-2"
                          onClick={() =>
                            viewMedicineAlternatives(medicine.name)
                          }
                        >
                          View Alternatives
                        </button>
                      )}

                      {/* {currentMedicine === medicine.name &&
                        alternativeMedicines.length > 0 && (
                          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                            {alternativeMedicines.map((alternative, index) => (
                              <div className="col" key={index}>
                                <div className="medicine-card card shadow-sm">
                                  {alternative.image.filename ? (
                                    <img
                                      src={`${alternative.image.filename}`}
                                      alt={alternative.name}
                                      className="bd-placeholder-img card-img-top"
                                      width="100%"
                                      height="225"
                                    />
                                  ) : (
                                    <svg
                                      className="bd-placeholder-img card-img-top"
                                      width="100%"
                                      height="225"
                                      xmlns="http://www.w3.org/2000/svg"
                                      role="img"
                                      aria-label="Placeholder: Thumbnail"
                                      preserveAspectRatio="xMidYMid slice"
                                      focusable="false"
                                    >
                                      <title>Placeholder</title>
                                      <rect
                                        width="100%"
                                        height="100%"
                                        fill="#55595c"
                                      ></rect>
                                      <text
                                        x="50%"
                                        y="50%"
                                        fill="#eceeef"
                                        dy=".3em"
                                      >
                                        No Image
                                      </text>
                                    </svg>
                                  )}
                                  <div className="card-body ">
                                    <h5 className="card-title">
                                      {alternative.name}{" "}
                                    </h5>
                                 
                                    {modelName === "patient" && (
                                      <div>
                                        <p className="card-text">
                                          Price: {alternative.price}
                                        </p>
                                        <p className="card-text">
                                          Description: {alternative.description}
                                        </p>
                                        <p className="card-text">
                                          Active Ingredients:{" "}
                                          {alternative.activeIngredients}
                                        </p>
                                        <p className="card-text">
                                          Medicinal Use:{" "}
                                          {alternative.medicinalUse}
                                        </p>
                                        <p className="card-text">
                                          Prescription Needed:{" "}
                                          {alternative.PrescriptionNeeded
                                            ? "Yes"
                                            : "No"}
                                        </p>
                                      </div>
                                    )}
                               
                                    <button
                                      type="button"
                                      className="btn btn-success"
                                      onClick={() =>
                                        addAlternativeToCart(alternative)
                                      }
                                    >
                                      Add to Cart
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )} */}
                      <span>&nbsp;</span>

                      {selectedMedicineDetails === medicine && (
                        <div>
                          <p className="card-text">Price: {medicine.price}</p>
                          <p className="card-text">
                            Description: {medicine.description}
                          </p>
                          <p className="card-text">
                            Active Ingredients: {medicine.activeIngredients}
                          </p>
                          <p className="card-text">
                            Medicinal Use: {medicine.medicinalUse}
                          </p>
                          <p className="card-text">
                            Prescription Needed:{" "}
                            {medicine.PrescriptionNeeded ? "Yes" : "No"}
                          </p>

                          {/* Additional details for pharmacist and administrator */}
                          {modelName === "pharmacist" ||
                          modelName === "administrator" ? (
                            <div>
                              <p className="card-text">
                                Quantity: {medicine.quantity}
                              </p>
                              <p className="card-text">
                                Sales: {medicine.sales}
                              </p>
                              <p className="card-text">
                                Archived: {medicine.Archive ? "Yes" : "No"}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {modelName === "pharmacist" && (
                        <div>
                          {/* Archive button */}
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                              toggleArchive(medicine.name, medicine.Archive)
                            }
                          >
                            {medicine.Archive ? "Unarchive" : "Archive"}
                          </button>

                          {/* Edit Medicine button */}
                          <button
                            className="btn btn-success"
                            onClick={() => handleEditMedicine(medicine.name)}
                          >
                            Edit Medicine
                          </button>
                        </div>
                      )}

                      {medicineCartMessages[medicine.name] && (
                        <div className="mb-3">
                          <Alert
                            variant={
                              medicineCartMessages[medicine.name].variant
                            }
                          >
                            {medicineCartMessages[medicine.name].message}
                          </Alert>
                        </div>
                      )}
                      {modelName === "patient" && medicine.quantity > 0 && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => addMedicineToCart(medicine.name)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Medicine;
