import { useEffect, useState } from 'react';
import service from '../service.js';
import { useNavigate } from 'react-router-dom';
import '../todos.css'
 export const Todos=()=>{
 const n=useNavigate()
 
 const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
const[name,setname]=useState()
  async function getTodos() {
    if(localStorage.getItem("access_token")==null)
      n('/login')
    else
    {const todos = await service.getTasks();
    setTodos(todos);}
  }

  async function createTodo(e) {
    e.preventDefault();
    await service.addTask(newTodo);
    setNewTodo("");//clear input
    await getTodos();//refresh tasks list (in order to see the new one)
  }

  async function updateCompleted(todo, isComplete) {
    console.log("todo"+todo+"isComplete"+isComplete)
    await service.setCompleted(todo.id, isComplete);
    await getTodos();//refresh tasks list (in order to see the updated one)

  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();//refresh tasks list
  }

  useEffect(() => {

    const a= service.getLoginUser()
    if(!a){
      alert("תוקף ההתחברות פג אנא התחבר מחדש")
    n('/login')
  return;}
  setname(a.name)
    getTodos();
  }, []);




  return (
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>

{name&&<h4> WELCOME TO  {name}</h4>}

        <form onSubmit={createTodo}>
          <input className="new-todo" placeholder="Well, let's take on the day" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
        </form>
      </header>
      <section className="main" style={{ display: "block" }}>
        <ul className="todo-list">
          {todos.map(todo => {
            return (
              <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                <div className="view">
                  <input className="toggle" type="checkbox" defaultChecked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />
                  <label>{todo.name}</label>
                  <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </section >
  );
 }
 