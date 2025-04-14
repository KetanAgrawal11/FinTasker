import React, { useState, useEffect } from "react";

const TaskModal = ({ show, onClose, onSave, existingTask }) => {
    const [task, setTask] = useState({
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
    });

    useEffect(() => {
        if (existingTask) {
            setTask(existingTask);
        }
    }, [existingTask]);

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!task.title || !task.description || !task.dueDate) {
            alert("Please fill all fields");
            return;
        }
        onSave(task);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{existingTask ? "Edit Task" : "Add New Task"}</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={task.title}
                    onChange={handleChange}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={task.description}
                    onChange={handleChange}
                ></textarea>
                <input
                    type="date"
                    name="dueDate"
                    value={task.dueDate.split("T")[0]}
                    onChange={handleChange}
                />
                <select name="status" value={task.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <div className="modal-actions">
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose} className="cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
