const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Employee = require("./models/Employee");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log("MongoDB Error:", error));

app.get("/", (req, res) => {
    res.send("Employee Management System Backend Running");
});

app.get("/api/employees", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/employees", async (req, res) => {
    try {
        const employee = new Employee(req.body);
        const savedEmployee = await employee.save();

        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put("/api/employees/:id", async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete("/api/employees/:id", async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);

        res.json({
            message: "Employee deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});