import React, { useState, ChangeEvent } from "react";

const MyForm: React.FC = () => {
    const [myCar, setMyCar] = useState<string>("Volvo");

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setMyCar(event.target.value);
    };

    return (
        <div className="flex ">
            <div className="flex flex-col space-y-2 ml-auto">
                <label htmlFor="cars" className="text-lg font-semibold text-gray-700">Status</label>
                <select
                    value={status}
                    onChange={handleChange}
                    className="bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
                >
                    <option value="TO_DO">On going</option>
                    <option value="NEED_REVIEW">Need review</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>
        </div>
    );
};

export default MyForm;
