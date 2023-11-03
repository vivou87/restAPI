const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Person = require("./models/Person");
require("dotenv").config();

let DB = process.env.DB;

mongoose
  .connect(
    `mongodb+srv://gmcws2024:${DB}@cluster0.4dmpkdc.mongodb.net/gmc?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

// INSERT DATA
app.use(express.json());
app.post("/api/addPerson", async (req, res) => {
  let { name, age, favoriteFoods } = req.body;
  try {
    let newPerson = new Person({
      name,
      age,
      favoriteFoods,
    });
    newPerson.save();
    res
      .status(200)
      .json({ status: true, message: "Your data was created successfully" });
  } catch (error) {
    if (error) throw error;
    res.status(401).json({ status: false, error });
  }
});
// GET DATA
app.get("/api/persons", async (req, res) => {
  try {
    const data = await Person.find();
    res.status(200).json({ data });
  } catch (error) {
    if (error) throw error;
    res.status(401).json({ status: false, error });
  }
});
// GET SINGLE DATA
app.get("/api/person", async (req, res) => {
  let { id } = req.query;
  try {
    const person = await Person.findById(id);
    res.json({ message: "ok", data: person });
  } catch (error) {
    if (error) throw error;
    res.status(401).json({ status: false, error });
  }
});
// UPDATE DATA
app.put("/api/update/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let updatedUser = await Person.findByIdAndUpdate(
      id,
      {
        $set: { ...req.body },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ status: true, data: updatedUser });
  } catch (error) {
    if (error) throw error;
    res.status(401).json({ status: false, error });
  }
});

// DELETE DATA
app.delete("/api/delete/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Person.findByIdAndRemove(id);
    res.status(200).json({ message: "The person was deleted successfully" });
  } catch (error) {
    if (error) throw error;
    res.status(401).json({ status: false, error });
  }
});

app.listen(5000, () => {
  console.log("Server is running");
});
