import { useEffect, useState } from 'react';
import service from '../service.js';
import { useNavigate } from 'react-router-dom';
import '../todos.css'

export const Todos = () => {
  const n = useNavigate()
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [name, setname] = useState()
  const [isLoading, setIsLoading] = useState(true)

  async function getTodos() {
    if (localStorage.getItem("access_token") == null)
      n('/login')
    else {
      const todos = await service.getTasks();
      setTodos(todos);
    }
  }

  async function createTodo(e) {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    await service.addTask(newTodo);
    setNewTodo("");//clear input
    await getTodos();//refresh tasks list (in order to see the new one)
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, isComplete);
    await getTodos();//refresh tasks list (in order to see the updated one)
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();//refresh tasks list
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    n('/login');
  }

  useEffect(() => {
    const checkAuth = async () => {
      const a = service.getLoginUser()
      if (!a) {
        alert("תוקף ההתחברות פג. אנא התחבר מחדש.");
        n('/login')
        return;
      }
      setname(a.name)
      await getTodos();
      setIsLoading(false);
    }
    
    checkAuth();
  }, []);

  // אם עדיין בודקים אותנטיקציה, לא מציגים כלום
  if (isLoading) {
    return null;
  }

  return (
    <div style={{ direction: "rtl", textAlign: "right", background: "#f5f5f5", minHeight: "100vh", padding: "2rem" }}>
      <div className="container">
        {/* Header with logout */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="display-6 mb-2" style={{ color: "#2c3e50", fontWeight: "bold" }}>
              פנקס המשימות שלי
            </h1>
            {name && <h5 className="text-muted">שלום, {name}</h5>}
          </div>
          <button 
            className="btn btn-outline-danger" 
            onClick={handleLogout}
            style={{ fontSize: "0.9rem" }}
          >
            התנתק
          </button>
        </div>

        {/* Add new task form */}
        <div className="card shadow-sm mb-4" style={{ border: "none", borderRadius: "15px" }}>
          <div className="card-body p-4">
            <form onSubmit={createTodo} className="d-flex gap-2">
              <input
                className="form-control"
                style={{ 
                  border: "2px solid #e9ecef", 
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  padding: "12px 15px"
                }}
                placeholder="הוסף משימה חדשה..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <button 
                className="btn btn-primary" 
                type="submit"
                style={{ 
                  borderRadius: "10px",
                  padding: "12px 25px",
                  fontSize: "1.1rem"
                }}
              >
                הוסף
              </button>
            </form>
          </div>
        </div>

        {/* Tasks list */}
        <div className="card shadow-sm" style={{ border: "none", borderRadius: "15px" }}>
          <div className="card-body p-0">
            {todos.length === 0 ? (
              <div className="text-center py-5">
                <h5 className="text-muted">אין משימות עדיין</h5>
                <p className="text-muted">הוסף משימה חדשה כדי להתחיל!</p>
              </div>
            ) : (
              <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {todos.map((todo, index) => (
                  <div 
                    key={todo.id}
                    className={`d-flex align-items-center p-3 border-bottom ${index === todos.length - 1 ? 'border-bottom-0' : ''}`}
                    style={{ 
                      backgroundColor: todo.isComplete ? "#f8f9fa" : "white",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div className="form-check ms-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={todo.isComplete}
                        onChange={(e) => updateCompleted(todo, e.target.checked)}
                        style={{ transform: "scale(1.2)" }}
                      />
                    </div>
                    <div className="flex-grow-1 me-3">
                      <span
                        className={`${todo.isComplete ? 'text-decoration-line-through text-muted' : ''}`}
                        style={{ 
                          fontSize: "1.1rem",
                          fontWeight: todo.isComplete ? "normal" : "500"
                        }}
                      >
                        {todo.name}
                      </span>
                    </div>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteTodo(todo.id)}
                      style={{ 
                        borderRadius: "8px",
                        padding: "6px 12px"
                      }}
                    >
                      מחק
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 