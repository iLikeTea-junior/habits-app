import express from "express";

const router = express.Router();

let habits = [];

// GET all the habits
router.get("/", (req, res) => {
    res.json(habits);
});

// CREATE a habit
router.post("/", (req, res) => {
    const habit = {
        id: req.body.id,
        name: req.body.name,
        checked: false
    }

    habits.push(habit);
    res.json(habit);
});

// DELETE a habit
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    habits = habits.filter(habit => habit.id !== id);

    res.json({message: "Deleted successfully"})
});


// CHECKED a habit
router.put("/checked/:id", (req, res) => {
    const id = req.params.id
    const habit = habits.find(h => h.id === id);

    if (!habit) return res.status(404).json({message: "Not found"});

    habit.checked = !habit.checked;
    res.json(`habit -> ${habit.name} has been checked!`);
})

// UPDATE a habit
router.put("/:id", (req, res) => {
    const id = req.params.id;

    const habit = habits.find(h => h.id == id);

    if (!habit) return res.status(404).json({message: "Not found"});

    habit.name = req.body.name;
    res.json(habit);
})

export default router;