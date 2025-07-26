import React, { useState } from "react";
import Title from "../../component/owner/Title";

const AddCard = () => {
  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  });

  const onSubmitHandler = async (e)=>{
    e.preventDefault()
  }

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subtitle="Fill in details to list a new car for booking, including pricing, availabily, and car specificaitons."
      />

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-5 text-shadow-gray-500 text-sm mt-6 max-w-xl">

      </form>

    </div>
  );
};

export default AddCard;
