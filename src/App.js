import logo from './ShiCa2_face.svg';
import './App.css';
import {useState, useRef} from "react";
import TodoList from "./TodoList";
import { v4 as uuidv4} from "uuid";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
// 		<a href="https://lit.link/ShiCa">
// 	        <img src={logo} className="App-logo" alt="logo" />
// 		</a>
//       </header>
// 	  <h1>Hello ShiCa</h1>
//     </div>
//   );
// }

function App() { 
	const [todos, setTodos] = useState([]);

	const todoNameRef = useRef();

	const handleAddTodo = () => {
		//タスクを追加する
		const name = todoNameRef.current.value;
		if(name==="") return;
		setTodos((prevTodos) => {
			return [...prevTodos, {id:uuidv4(), name:name, completed:false }]
		});
		todoNameRef.current.value=null;
	};

	const toggleTodo = (id)=> {
		const newTodos =  [...todos];
		const todo = newTodos.find((todo) => todo.id === id);
		todo.completed = !todo.completed;
		setTodos(newTodos);
	};

	const handleClear = () => {
		const newTodos = todos.filter((todo) => !todo.completed);
		setTodos(newTodos);
	}

	return(
	    <div className="App">
    	  	<header className="App-header">
				<a href="https://lit.link/ShiCa">
	        		<img src={logo} className="App-logo" alt="logo" />
				</a>
			<h1>シカくんToDoリスト</h1>
			<p>
				タスクを追加すると、シカくんが覚えてくれるよ！<br/>
				サイトを離れたり更新したりする、ToDoリストを綺麗さっぱり忘れるよ！
			</p>
			<TodoList todos={todos} toggleTodo={toggleTodo} />
			<input type="text" ref={todoNameRef} />
			<button onClick={handleAddTodo}>タスクを追加</button>
			<button onClick={handleClear}>完了したタスクの削除</button>
			<div>残りのタスク:{todos.filter((todo) => !todo.completed).length}</div>
			</header>
		</div>
	);
}

export default App;
