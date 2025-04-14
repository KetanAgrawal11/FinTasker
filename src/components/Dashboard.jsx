import { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import EmptySVG from "../assets/transactions.svg";
import Modal from "./Modal";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [balanceHistory, setBalanceHistory] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const COLORS = ["#0088FE", "#FF8042"];

    const fetchTransactions = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.userId;

            const response = await fetch(`${backendUrl}/api/transactions/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            if (response.ok) {
                let totalIncome = 0;
                let totalExpense = 0;
                setTransactions(data);
                data.forEach((transaction) => {
                    if (transaction.type === "income") {
                        totalIncome += transaction.amount;
                    } else {
                        totalExpense += transaction.amount;
                    }
                });
                setIncome(totalIncome);
                setExpense(totalExpense);
                setBalance(totalIncome - totalExpense);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }, [backendUrl]);

    const fetchBalanceHistory = useCallback(async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.userId;

        if (!userId) return;

        const response = await fetch(`${backendUrl}/api/transactions/balance-history`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        const formattedData = data.map(item => ({
            ...item,
            date: new Date(item.date).toISOString().split("T")[0]
        }));

        setBalanceHistory(formattedData);
    }, [backendUrl]);


    const fetchTransactionSummary = useCallback(async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.userId;

        if (!userId) return;

        const response = await fetch(`${backendUrl}/api/transactions/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ userId }),
        });

        const transactions = await response.json();

        let totalIncome = 0, totalExpense = 0;
        transactions.forEach(txn => {
            txn.type === "income" ? (totalIncome += txn.amount) : (totalExpense += txn.amount);
        });

        setPieData([
            { name: "Income", value: totalIncome },
            { name: "Expense", value: totalExpense }
        ]);
    }, [backendUrl]);


    const deleteTransaction = async (transactionId) => {
        try {
            const response = await fetch(`${backendUrl}/api/transactions/${transactionId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });

            if (response.ok) {
                await fetchTransactions();         // Refresh list & summary
                await fetchBalanceHistory();       // Refresh line chart
                await fetchTransactionSummary();   // Refresh pie chart
            } else {
                console.error("Error deleting transaction");
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };


    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };


    const resetTransactions = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.userId;
        if (!userId) {
            alert("User not found!");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete all transactions? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${backendUrl}/api/transactions/reset`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("All transactions deleted successfully!");
                fetchTransactions(); // Recalculate income, expenses, and transactions
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error resetting transactions:", error);
            alert("Failed to reset transactions");
        }
    };


    const closeModal = () => setShowModal(false);

    const handleTransaction = async (data) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.userId;
            const dataWithUser = { ...data, userId };

            const response = await fetch(`${backendUrl}/api/transactions/new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify(dataWithUser),
            });

            if (response.ok) {
                await fetchTransactions();         // Refresh transactions
                await fetchBalanceHistory();       // Refresh line chart
                await fetchTransactionSummary();   // Refresh pie chart
                closeModal();                      // Close modal
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    const handleExportCSV = () => {
        const headers = ["description", "type", "category", "date", "amount"];
        const rows = transactions.map(txn =>
            [txn.description, txn.type, txn.category, txn.date, txn.amount].join(",")
        );
        const csvContent = [headers.join(","), ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        link.click();
    };

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const formattedData = results.data.map((row) => ({
                        description: row.description,
                        type: row.type.toLowerCase(),
                        category: row.category.toLowerCase(),
                        date: row.date,
                        amount: parseFloat(row.amount),
                    }));

                    console.log(formattedData)

                    const response = await fetch(`${backendUrl}/api/transactions/import`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ transactions: formattedData }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        toast.success("CSV imported successfully!");
                        // Optionally refresh transactions
                        if (typeof fetchTransactions === "function") {
                            fetchTransactions(); // Make sure this updates the table and charts
                            fetchBalanceHistory();
                            fetchTransactionSummary();
                        }
                    } else {
                        toast.error(data.message || "Failed to import CSV");
                    }
                } catch (err) {
                    console.error(err);
                    toast.error("Error while processing CSV");
                }
            },
        });
    };



    useEffect(() => {
        fetchTransactions();
        fetchBalanceHistory();
        fetchTransactionSummary();
    }, [fetchTransactions, fetchBalanceHistory, fetchTransactionSummary]);

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <div className="cards-container">
                <div className="card">
                    <h3>Current Balance</h3>
                    <p>₹{balance}</p>
                    <button onClick={() => resetTransactions()}>Reset</button>
                </div>
                <div className="card">
                    <h3>Total Income</h3>
                    <p>₹{income}</p>
                    <button onClick={() => openModal("income",)}>Add Income</button>
                </div>
                <div className="card">
                    <h3>Total Expense</h3>
                    <p>₹{expense}</p>
                    <button onClick={() => openModal("expense",)}>Add Expense</button>
                </div>
            </div>
            {transactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", margin: "4rem 0" }}>
                    <img src={EmptySVG} alt="No transactions" style={{ maxWidth: "300px", marginBottom: "1rem" }} />
                    <p style={{ color: "#666", fontSize: "1.1rem" }}>No transactions to display</p>
                </div>
            ) : (<>
                <div className="charts-section">
                    <h2>Financial Overview</h2>
                    <div className="charts-container">
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={balanceHistory}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="balance" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                        <Cell key="income" fill="#82ca9d" />
                                        <Cell key="expense" fill="#ff6b6b" />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                <div className="my-transactions">
                    <h2>My Transactions</h2>
                    <div className="csv-buttons">
                        <label className="btn blue-btn" onClick={handleExportCSV}>Export to CSV</label>
                        <input type="text" style={{ display: 'none' }} />
                        <label htmlFor="csvFile" className="btn white-btn">Import from CSV</label>
                        <input type="file" id="csvFile" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
                    </div>


                    <div className="transaction-table-container">
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center", padding: "1rem", color: "#888" }}>
                                            No transactions available.
                                        </td>
                                    </tr>
                                ) : (
                                    [...transactions].reverse().map((txn) => (
                                        <tr key={txn._id} className={txn.type === "income" ? "income-row" : "expense-row"}>
                                            <td>{txn.description}</td>
                                            <td>{txn.type === "income" ? "💰 Income" : "💸 Expense"}</td>
                                            <td>{new Date(txn.date).toISOString().split("T")[0]}</td>
                                            <td>₹{txn.amount}</td>
                                            <td><span className={`category-label ${txn.category}`}>{txn.category}</span></td>
                                            <td><button className="delete-button" onClick={() => deleteTransaction(txn._id)}>Delete</button></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </>
            )}
            {showModal && <Modal type={modalType} onClose={closeModal} onSubmit={handleTransaction} />}
        </div >
    );
}
