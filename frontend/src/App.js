import React from 'react';
import Main from "./components/MainComponent";
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

function App() {
	return (
		<Router>
			<div className="App">
				<Main/>
			</div>
		</Router>
	);
}

export default App;
