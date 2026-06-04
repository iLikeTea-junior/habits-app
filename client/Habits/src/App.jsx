import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { clsx } from 'clsx';
import { motion } from "framer-motion"

import AnimatedTitle from "./components/AnimatedTitle.jsx"
import Cloud from "./components/Cloud.jsx"

import "./trash.css"
import "./checkbox.css"

function App() {
  
  function request(method, data) {
    return {
      method: method.toUpperCase(),
      headers: { "Content-Type" : "application/json" },
      ...(data && { body: JSON.stringify(data) })
    }
  }

  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const [habits, setHabits] = useState([]);
  const [habit, setHabit] = useState('');

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [persistErrorMessage, setPersistErrorMessage] = useState(false);

  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editedHabit, setEditedHabit] = useState('')


  useEffect(() => {
    fetch(`${BASE_URL}/api/habits`)
      .then(res => res.json())
      .then(data => setHabits(data));
  }, [])

  function handleHabit(event) {
    event.preventDefault();

    if (!habit && showErrorMessage) {
      setPersistErrorMessage(false);
      setTimeout(() => setPersistErrorMessage(true), 0);
      return;
    }

    if (!habit) {
      setShowErrorMessage(true);
      return;
    }

    const habitData = { id: uuidv4(), name: habit }
    fetch(`${BASE_URL}/api/habits`, request("post", habitData))
      .then(() => {
        setHabits(prevHabits => [...prevHabits, habitData]);
      })
    setHabit('');
  }

  function removeHabit(habitId) {
    fetch(`${BASE_URL}/api/habits/${habitId}`, request("delete"))
      .then(() => {
        setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
      });
  }

  function handleCheckbox(habitId) {
    fetch(`${BASE_URL}/api/habits/checked/${habitId}`, request("put"))
      .then(() => {
        setHabits(prevHabits => prevHabits.map(h => h.id === habitId ? { ...h, checked: !h.checked } : h));
      });
  }

  function changeHabit(habitId, habitName) {
    setEditingHabitId(habitId);
    setEditedHabit(habitName);
  }

  function submitEdit() {
    fetch(`${BASE_URL}/api/habits/${editingHabitId}`, request("put", { name: editedHabit }))
      .then(() => {
        setHabits(prevHabits => prevHabits.map(h => h.id === editingHabitId ? {...h, name: editedHabit } : h));
        setEditingHabitId(null);
        setEditedHabit('');
      })
  }

  return (
    <main>
      <AnimatedTitle/>
      <Cloud/>

      {/* where the lists of habits will be displayed */}
      <div className={clsx({"habits-box-wrapper": habits.length > 4})}>
        <motion.section
          className="habits-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.75,
            duration: 1
          }}
        >
          {habits.map(habit => (
            <motion.div
              className={clsx('habit-box', { strikethrough: habit.checked})}
              key={habit.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.75 }}
            >
                <input
                  type="checkbox"
                  name="finish-habit"
                  checked={habit.checked ?? false}
                  onChange={() => handleCheckbox(habit.id)}
                />

              <div className={clsx("habit-container", { completed: habit.checked })}>
                <div className="habit" onClick={() => changeHabit(habit.id, habit.name)}>
                  {editingHabitId === habit.id
                    ? <input
                        type="text"
                        className="edit-habit"
                        value={editedHabit}
                        onChange={(e) => setEditedHabit(e.target.value)}
                        onKeyDown={(e) => {if (e.key === "Enter" || e.key === "Escape") submitEdit();}}
                        onBlur={() => submitEdit()}
                        autoFocus
                      />
                    : habit.name
                  }
                </div>

                <div className="remove-btn-side">
                  <button className="remove-btn" onClick={() => removeHabit(habit.id)}>
                    <div className="gg-trash"></div>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </div>

      <motion.form
        onSubmit={handleHabit}
        initial={{ x: window.innerWidth }}
        animate={{ x: 0 }}
        transition={{ duration: 4 + ((window.innerWidth - 1000) / 1000) }}
      >
        <input
          type="text"
          name="habit"
          placeholder="Enter a habit"
          value={habit}
          onChange={(e) => {
            setHabit(e.target.value);
            if (showErrorMessage) setShowErrorMessage(false);
          }}
          autoComplete="off"
        />

        <button>Add Habit</button>
      </motion.form>
      
      <p className={clsx("invalid-input", {show: showErrorMessage, persist: persistErrorMessage})}>Cannot enter a empty habit</p>
    </main>
  );
}

export default App;