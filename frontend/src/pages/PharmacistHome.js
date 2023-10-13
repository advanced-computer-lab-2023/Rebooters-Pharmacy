import AddMedicine from "../components/addMedicine";
import EditMedicine from "../components/editMedicine";
import ViewMedicineQuantitySales from "../components/ViewMedicineQuantitySales";
import Medicine from "../components/Medicine";
import "bootstrap/dist/css/bootstrap.min.css";


const PharmacistHome = () => {
  
    return (
      <div className="container">
        <h1 className="mb-4 text-center">Pharmacist Dashboard</h1>
        <div className="mt-4">
        {<Medicine modelName="pharmacist"/>}
        </div>
        <div className="mt-4">
          <AddMedicine />
        </div>
        <div className="mt-4">
          <EditMedicine />
        </div>
        <div className="mt-4">
          <ViewMedicineQuantitySales />
        </div>
      </div>
      
    );
  };
  
  export default PharmacistHome;
  