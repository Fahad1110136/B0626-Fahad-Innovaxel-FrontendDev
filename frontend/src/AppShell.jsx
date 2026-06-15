import { useState, useEffect, useCallback } from "react";
import { expensesApi } from "./services/api.js";
import { useAuth } from "./context/AuthContext.jsx";

import ExpenseTrackerUI from "./ExpenseTrackerConnected.jsx";

export default function AppShell() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [syncError, setSyncError] = useState("");

  // Fetch expenses from API on mount
  const fetchExpenses = useCallback(async () => {
    try {
      const data = await expensesApi.list({ limit: 500 });
      setExpenses(data.expenses || []);
    } catch (err) {
      setSyncError("Could not load expenses: " + err.message);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const addExpense = useCallback(async (data) => {
    const { expense } = await expensesApi.create(data);
    setExpenses((prev) => [expense, ...prev]);
    return expense;
  }, []);

  const editExpense = useCallback(async (data) => {
    const { expense } = await expensesApi.update(data._id || data.id, data);
    setExpenses((prev) => prev.map((e) => (e._id === expense._id ? expense : e)));
    return expense;
  }, []);

  const deleteExpense = useCallback(async (id) => {
    await expensesApi.remove(id);
    setExpenses((prev) => prev.filter((e) => e._id !== id && e.id !== id));
  }, []);

  if (loadingData) {
    return (
      <div style={{
        minHeight: "100vh", background: "#F5F2EB",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{ textAlign: "center", color: "#5C5647" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
          <div style={{ fontSize: 14 }}>Loading your expenses…</div>
        </div>
      </div>
    );
  }

  return (
    <ExpenseTrackerUI
      user={user}
      expenses={expenses}
      onAdd={addExpense}
      onEdit={editExpense}
      onDelete={deleteExpense}
      onLogout={logout}
      syncError={syncError}
    />
  );
}
