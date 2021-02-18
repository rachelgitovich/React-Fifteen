
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import rootReducer from './redux/combine';
import './App.css';
import Game from './components/Game';

const enhancers = compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const initialState = { showModal: false };
const store = createStore(rootReducer, initialState, enhancers);
function App() {
	return (
		<Provider store={store}>
			<Game />
		</Provider>
	);
}

export default App;
