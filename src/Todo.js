import React from 'react'

const Todo = ({todo, toggleTodo }) => {

	const hanndleTodoClick = () => {
		toggleTodo(todo.id);
	}

	return (
	<div>
		<label>
			<input
			 type="checkbox" 
			 checked={todo.completed} 
			 readOnly 
			 onChange={hanndleTodoClick}
			 />
		</label>
		{todo.name}
	</div>
  )
}

export default Todo