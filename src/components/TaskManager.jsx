import React, { useEffect, useState } from "react";

const TaskManager = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [tasks, setTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskForm, setTaskForm] = useState({ title: "", description: "", dueDate: "", status: "pending" });

    const fetchTasks = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/tasks`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            const data = await res.json();
            const sortedTasks = [...data].sort(
                (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
              );
            if (res.ok) setTasks(sortedTasks);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    const handleSave = async () => {
        const url = editingTask ? `${backendUrl}/api/tasks/${editingTask._id}` : `${backendUrl}/api/tasks`;
        const method = editingTask ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify(taskForm),
            });
            if (res.ok) {
                fetchTasks();
                setModalOpen(false);
                setEditingTask(null);
                setTaskForm({ title: "", description: "", dueDate: "", status: "pending" });
            }
        } catch (err) {
            console.error("Error saving task", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await fetch(`${backendUrl}/api/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            fetchTasks();
        } catch (err) {
            console.error("Error deleting task", err);
        }
    };

    const getRowClass = (task) => {
        const today = new Date();
        const due = new Date(task.dueDate);
        const isOverdue = due < today && task.status !== "completed";

        if (isOverdue) return "overdue-row";
        if (task.status === "completed") return "completed-row";
        if (task.status === "inprogress") return "inprogress-row";
        return "default-row";
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="task-container">
            <div className="flex-container">
                <h2>Task Manager</h2>
                <button className="task-add-btn" onClick={() => setModalOpen(true)}>+ Add Task</button>
            </div>
            <div className="task-table-container">
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 ? (
                            <tr><td colSpan="5" className="no-tasks">No tasks available</td></tr>
                        ) : (
                            tasks.map(task => (
                                <tr key={task._id} className={getRowClass(task)}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>{new Date(task.dueDate).toISOString().split("T")[0]}</td>
                                    <td>{task.status}</td>
                                    <td>
                                        <button className="delete-button actions-btn" onClick={() => { setEditingTask(task); setTaskForm(task); setModalOpen(true); }}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(task._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {modalOpen && (
                <div className="task-modal">
                    <div className="modal-content">
                        <h3>{editingTask ? "Edit Task" : "Add Task"}</h3>
                        <input type="text" placeholder="Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
                        <textarea placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}></textarea>
                        <input type="date" value={taskForm.dueDate.split("T")[0]} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                        <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                            <option value="pending">Pending</option>
                            <option value="inprogress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <div className="modal-actions">
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => { setModalOpen(false); setEditingTask(null); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManager;
