import abi from './BuyMeACoffee.json';
import { ethers } from "ethers";
import logo from './ShiCa2_face.svg';
import './App.css';
import React, {useState, useRef, useEffect} from "react";
import TodoList from "./TodoList";
import { v4 as uuidv4} from "uuid";



function App() { 
	const contractAddress = "0x084E2A12b01EDc13543156A7A498C8D95fa1712D";
	const contractABI = abi.abi;

	const [currentAccount, setCurrentAccount] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [memos, setMemos] = useState([]);

	const [todos, setTodos] = useState([]);
	const todoNameRef = useRef();

	const onNameChange = (event) => {
		setName(event.target.value);
	}
	
	const onMessageChange = (event) => {
		setMessage(event.target.value);
	}

	// メタマスクウォレット接続
	const connectWallet = () => {
		window.ethereum
		.request({ method: "eth_requestAccounts" })
		.then((result) => {
			currentAccount(result[0]);
		})
		.catch((error) => {
		  setErrorMessage(error.message);
		});
	}

	// コーヒー購入ボタン
	const buyCoffee = async () => {
		try {
		  const {ethereum} = window;
	
		  if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum, "any");
			const signer = provider.getSigner();
			const buyMeACoffee = new ethers.Contract(
			  contractAddress,
			  contractABI,
			  signer
			);
	
			console.log("buying coffee..")
			const coffeeTxn = await buyMeACoffee.buyCoffee(
			  name ? name : "anon",
			  message ? message : "Enjoy your coffee!",
			  {value: ethers.utils.parseEther("0.001")}
			);
	
			await coffeeTxn.wait();
	
			console.log("mined ", coffeeTxn.hash);
	
			console.log("coffee purchased!");
	
			// Clear the form fields.
			setName("");
			setMessage("");
		  }
		} catch (error) {
		  console.log(error);
		}
	};

	// Function to fetch all memos stored on-chain.
	const getMemos = async () => {
	    try {
	    	const { ethereum } = window;
   		 	if (ethereum) {
        		const provider = new ethers.providers.Web3Provider(ethereum);
        		const signer = provider.getSigner();
        		const buyMeACoffee = new ethers.Contract(
        		contractAddress,
        		contractABI,
        		signer
        	);
        
        	console.log("fetching memos from the blockchain..");
        	const memos = await buyMeACoffee.getMemos();
        	console.log("fetched!");
        	setMemos(memos);
      		} else {
        		console.log("Metamask is not connected");
      		}
      
    	} catch (error) {
      	console.log(error);
    	}
	};

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


	useEffect(() => {
		let buyMeACoffee;
		// isWalletConnected();
		getMemos();
	
		// Create an event handler function for when someone sends
		// us a new memo.
		const onNewMemo = (from, timestamp, name, message) => {
		  console.log("Memo received: ", from, timestamp, name, message);
		  setMemos((prevState) => [
			...prevState,
			{
			  address: from,
			  timestamp: new Date(timestamp * 1000),
			  message,
			  name
			}
		  ]);
		};
	
		const {ethereum} = window;
	
		// Listen for new memo events.
		if (ethereum) {
		  const provider = new ethers.providers.Web3Provider(ethereum, "any");
		  const signer = provider.getSigner();
		  buyMeACoffee = new ethers.Contract(
			contractAddress,
			contractABI,
			signer
		  );
	
		  buyMeACoffee.on("NewMemo", onNewMemo);
		}
	
		return () => {
		  if (buyMeACoffee) {
			buyMeACoffee.off("NewMemo", onNewMemo);
		  }
		}
	}, []);


	return(
	    <div className="App">
    	  	<header className="App-header">
				<a href="https://lit.link/ShiCa">
	        		<img src={logo} className="App-logo" alt="logo" />
				</a>

				<h1>シカくんにコーヒーを買ってあげる(Beta)</h1>
				<div>
					<label>お名前</label>
					<input id="name" type="text" placeholder="anon" onChange={onNameChange} />
				</div>
				<div>
					<label>メッセージ</label><br/>
       		        <textarea
                	  rows={3}
                	  placeholder="Enjoy your coffee!"
					  id="message"
					  onChange={onMessageChange}
					  required 
                	>
                	</textarea>
				</div>
				<button onClick={connectWallet}>お財布接続(Metamask)</button>
				<button onClick={buyCoffee}>コーヒー 0.001GoerliETH</button>

				{
				(memos.map((memo, idx) => {
	        		return (
			        	<div key={idx} style={{border:"2px solid", "border-radius":"5px", padding: "5px", margin: "5px"}}>
            				<p style={{"font-weight":"bold"}}>"{memo.message}"</p>
            				<p>
								{memo.name}より
								{/* {memo.timestamp.toString()} */}
							</p>
          				</div>
        			)
		      	}))}

				<p>
					シカくんにコーヒーを買ってあげる手順<br/>
					1.chromeで<a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">Metamaskの拡張機能</a>をインストールする<br/>
					2.Metamaskのアカウントを作成する<br/>
					3.MetamaskのネットワークをGoerli Test Networkに切り替える<br/>
					4.GoerliETHを入手する(<a href="https://goerlifaucet.com/">Goerli Faucet</a>)<br/>
					5.お財布接続ボタンを押して、Metamaskと、このwebサイトを接続する<br/>
					6.コーヒーのボタンを押す<br/>
					7.お名前とメッセージは、残らないかもしれません(テスト中)<br/>
				</p>

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
