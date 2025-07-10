import { useEffect, useState } from 'react';
import service from '../service.js';
import { useNavigate } from 'react-router-dom';
import '../todos.css'

export const Todos = () => {
  const n = useNavigate()
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [name, setname] = useState()

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

  useEffect(() => {
    const a = service.getLoginUser()
    if (!a) {
      alert("תוקף ההתחברות פג, אנא התחבר מחדש")
      n('/login')
      return;
    }
    setname(a.name)
    getTodos();
  }, []);

  return (
    <section style={{ direction: "rtl", textAlign: "right", background: "#f8f9fa", minHeight: "100vh", padding: "2rem" }}>
      <div className="container">
        <header className="mb-4">
          <h1 className="display-5 mb-3">רשימת משימות</h1>
          {name && <h4 className="mb-4">ברוך הבא, {name}</h4>}
          <form onSubmit={createTodo} className="d-flex mb-4">
            <input
              className="form-control me-2"
              style={{ maxWidth: "350px" }}
              placeholder="הוסף משימה חדשה..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button className="btn btn-success" type="submit">הוסף</button>
          </form>
        </header>
        <section>
          <div className="row g-3">
            {todos.map(todo => (
              <div className="col-12 col-md-6 col-lg-4" key={todo.id}>
                <div className={`card shadow-sm ${todo.isComplete ? 'border-success' : ''}` }>
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="form-check" style={{ flex: 1 }}>
                        <input
                          className="form-check-input ms-2"
                          type="checkbox"
                          checked={todo.isComplete}
                          onChange={(e) => updateCompleted(todo, e.target.checked)}
                          id={`todo-check-${todo.id}`}
                        />
                        <label
                          className={`form-check-label ${todo.isComplete ? 'text-decoration-line-through text-success' : ''}`}
                          htmlFor={`todo-check-${todo.id}`}
                          style={{ fontWeight: 500 }}
                        >
                          {todo.name}
                        </label>
                      </div>
                      <button className="btn btn-danger btn-sm" title="מחק" onClick={() => deleteTodo(todo.id)}>
                        מחק
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
 