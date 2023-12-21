
import React, { useEffect, useState } from "react";
import axios from "axios";

import "./TodoList.scss";

export default function TodoList() {
    let [todos, setTodos] = useState([]);
    let [name, setName] = useState("");
    let [hidden, setHidden] = useState(null);
    let [newTodo, setNewTodo] = useState([]);
    let [isLoaded, setIsLoaded] = useState(false);
    let [statusBox, setStatusBox] = useState(false);
    let [quantity, setQuantity] = useState(0);
     const handleSubmit = (e) => {
         e.preventDefault();
     };
   const data = async () => {
       const res = await axios.get("http://localhost:3000/todo");
       setTodos(res.data);
   };

   useEffect(() => {
       data();
   }, []);

   const nameChange = (e) => {
       setName(e.target.value);
   };

   const upLoad = async () => {
     const response = await axios.post("http://localhost:3000/todo", {
         name: name,
         status: "not complete",
         detail: "lorem",
     });
     
     setTodos(response.data);
     setName("");
   };
   console.log(todos,"vvvvvvvv");
    const removeToDo = async (item) => {
        let confirm1 = confirm("Xóa?");
        if (confirm1) {
            await axios.delete(`http://localhost:3000/todo/${item.id}`);
            const res = await axios.get("http://localhost:3000/todo")
            setTodos(res.data)
        }
    };
    const fixToDo = (item) => {
        setName(item.name);
        setNewTodo(item);

        
    };
    const handleSave = async () => {
        let newArr = todos.find((item) => {
            if (item.id == newTodo.id) {
                item.name = name;

                return item;
            }
        });

        await axios.put(
            `http://localhost:3000/todo/${newTodo.id}`,
            newArr
        );
        setName("");
    };
   const changeStatus = async (item) => {
       const updatedStatus =
           item.status === "not complete" ? "completed" : "not complete";

       try {
           const response = await axios.put(
               `http://localhost:3000/todo/${item.id}`,
               {
                   name: item.name || "", 
                   detail: item.detail || "", 
                   status: updatedStatus,
               }
           );

           const updatedItem = response.data;
           
       } catch (error) {
           console.log(error);
           
       }
   };
   
    return (
        <div className="All">
            <form onSubmit={handleSubmit}>
                <h1>Có  công việc</h1>
                <h2>Todo List</h2>
                <div className="upper">
                    <input
                        type="text"
                        name="name"
                        onChange={nameChange}
                        value={name}
                    />
                    <button onClick={upLoad}>+</button>
                    <button onClick={handleSave}>Save</button>
                    
                </div>
                <div className="down">
                   <table style={{width:"100%"}}>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>Detail</td>
                            <td>Status</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                       {todos.map((item)=>{
                        return (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.detail}</td>
                                <td>{item.status}</td>
                                <td>
                                    <button onClick={() => removeToDo(item)}>
                                        Xóa
                                    </button>
                                    <button onClick={() => fixToDo(item)}>
                                        Sửa
                                    </button>
                                    <button onClick={() => changeStatus(item)}>
                                        Đổi
                                    </button>
                                </td>
                            </tr>
                        );
                       })}
                    </tbody>
                   </table>
                </div>
            </form>
        </div>
    );
}
