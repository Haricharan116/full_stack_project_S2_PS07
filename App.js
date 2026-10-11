import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [employees, setEmployees] = useState([]);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        role: "",
        salary: "",
        attendance: "",
        leaveStatus: "No Leave"
    });

    const [editId, setEditId] = useState(null);

    const getEmployees = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/employees"
            );

            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.log("Backend connection error:", error);
        }
    };

    useEffect(() => {
        getEmployees();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editId
                ? `http://localhost:5000/api/employees/${editId}`
                : "http://localhost:5000/api/employees";

            const method = editId ? "PUT" : "POST";

            await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            alert(
                editId
                    ? "Employee updated successfully!"
                    : "Employee added successfully!"
            );

            setForm({
                name: "",
                email: "",
                phone: "",
                department: "",
                role: "",
                salary: "",
                attendance: "",
                leaveStatus: "No Leave"
            });

            setEditId(null);
            getEmployees();

        } catch (error) {
            alert("Error connecting to backend");
            console.log(error);
        }
    };

    const editEmployee = (employee) => {
        setForm({
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            department: employee.department,
            role: employee.role,
            salary: employee.salary,
            attendance: employee.attendance,
            leaveStatus: employee.leaveStatus
        });

        setEditId(employee._id);
    };

    const deleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) {
            return;
        }

        await fetch(
            `http://localhost:5000/api/employees/${id}`,
            {
                method: "DELETE"
            }
        );

        getEmployees();
    };

    return (
        <div className="container">

            <h1>Employee Management System</h1>

            <div className="form-container">

                <h2>
                    {editId ? "Update Employee" : "Add Employee"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Employee Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                    </select>

                    <input
                        type="text"
                        name="role"
                        placeholder="Job Role"
                        value={form.role}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="salary"
                        placeholder="Salary"
                        value={form.salary}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="attendance"
                        placeholder="Attendance %"
                        value={form.attendance}
                        onChange={handleChange}
                    />

                    <select
                        name="leaveStatus"
                        value={form.leaveStatus}
                        onChange={handleChange}
                    >
                        <option value="No Leave">No Leave</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <button type="submit">
                        {editId ? "Update Employee" : "Add Employee"}
                    </button>

                </form>
            </div>

            <div className="table-container">

                <h2>Employee Details</h2>

                <table>

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Salary</th>
                            <th>Attendance</th>
                            <th>Leave</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {employees.map((employee) => (
                            <tr key={employee._id}>

                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.phone}</td>
                                <td>{employee.department}</td>
                                <td>{employee.role}</td>
                                <td>₹{employee.salary}</td>
                                <td>{employee.attendance}%</td>
                                <td>{employee.leaveStatus}</td>

                                <td>
                                    <button
                                        className="edit"
                                        onClick={() =>
                                            editEmployee(employee)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete"
                                        onClick={() =>
                                            deleteEmployee(employee._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default App;