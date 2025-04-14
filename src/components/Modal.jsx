import { useState } from "react";

export default function Modal({ onClose, onSubmit, type }) {
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");

    const validateAndSubmit = () => {
        setError(""); // Clear previous errors

        // Validate amount
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Amount must be greater than 0.");
            return;
        }

        // Validate date (not older than last 30 days)
        const selectedDate = new Date(date);
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        if (selectedDate < oneMonthAgo || selectedDate > today) {
            setError("Date must be within the last one month.");
            return;
        }

        // If validation passes, submit the data
        onSubmit({ description, date, amount: parsedAmount, type, category: category });
        onClose(); // Close modal after submission
    };

    return (
        <div className="modal-overlay">
            <div className="modal"> 
                <h2>{type === "income" ? "Add Income" : "Add Expense"}</h2>

                {error && <p className="error">{error}</p>}

                <label>Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

                <label>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                <label>Amount</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="food">Food</option>
                    <option value="cloth">Cloth</option>
                    <option value="rent">Rent</option>
                    <option value="others">Others</option>
                </select>

                <div className="modal-buttons">
                    <button onClick={validateAndSubmit}>Submit</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
