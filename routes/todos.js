const express = require("express");
const auth = require("../middleware/auth");
const supabase = require("../supabaseClient");

const router = express.Router();

// GET all todos
router.get("/", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD todo
router.post("/", auth, async (req, res) => {
  const { task } = req.body;
  if (!task || !task.trim()) return res.status(400).json({ error: "Task is required" });

  try {
    const { data, error } = await supabase
      .from("todos")
      .insert([{ task: task.trim(), user_id: req.user.id, completed: false }])
      .select()
      

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// DELETE todo
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) throw error;
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE todo
router.patch("/:id/toggle", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const { data: todo, error: fetchError } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (fetchError || !todo) return res.status(404).json({ error: "Todo not found" });

    const { data, error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
