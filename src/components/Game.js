import React, { useState, useEffect, Fragment } from 'react';
import Tale from './Tale';
import shuffle from '../utils/shuffle';
import { hideModal, showModal } from '../redux/actions';
import { connect } from 'react-redux';
import _ from 'lodash';
import Modal from './Modal';

const mapDispatchToProps = (dispatch) => {
	return {
		show: () => dispatch(showModal()),
		hide: () => dispatch(hideModal())
	};
};

const mapStateToProps = (state) => {
	return { showModal: state.showModal.showModal };
};

const checkClass = (tale, index) => {
	if (tale) {
		if (tale === index + 1) return 'tale on-place';
		return 'tale';
	}
	return 'hole';
};

function Game(props) {
	const [ tales, setTales ] = useState(shuffle([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null ]));

	const [ holeIndex, setHoleIndex ] = useState(tales.indexOf(null));
	const [ moves, setMoves ] = useState(-1);
	const [ seconds, setSeconds ] = useState(0);
	const [ isActive, setIsActive ] = useState(false);
	const [ gameOver, setGameOver ] = useState(false);

	useEffect(
		() => {
			let interval = null;

			if (isActive) {
				interval = setInterval(() => {
					setSeconds((seconds) => seconds + 1);
				}, 1000);
			} else if (!isActive && seconds !== 0) {
				clearInterval(interval);
			}
			return () => clearInterval(interval);
		},
		[ seconds, isActive ]
	);
	useEffect(
		() => {
			if (moves === 1) {
				setIsActive(true);
			}
		},
		[ moves ]
	);
	useEffect(
		() => {
			setMoves(moves + 1);
			if (_.isEqual(tales, [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null ])) {
				setIsActive(false);
				setGameOver(true);
				props.show();
			}
		},
		[ tales ]
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	const handleKeyDown = (event) => {
		const topRow = [ 0, 1, 2, 3 ];
		const bottomRow = [ 12, 13, 14, 15 ];
		const rightCol = [ 3, 7, 11, 15 ];
		const leftCol = [ 0, 4, 8, 12 ];
		switch (event.key) {
			case 'ArrowUp':
				if (bottomRow.includes(holeIndex)) return;
				swapHole(holeIndex + 4);
				break;
			case 'ArrowDown':
				if (topRow.includes(holeIndex)) return;
				swapHole(holeIndex - 4);
				break;
			case 'ArrowRight':
				if (leftCol.includes(holeIndex)) return;
				swapHole(holeIndex - 1);
				break;
			case 'ArrowLeft':
				if (rightCol.includes(holeIndex)) return;
				swapHole(holeIndex + 1);
				break;

			default:
				break;
		}
	};

	const resetGame = () => {
		setTales(shuffle([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null ]));
		setHoleIndex(tales.indexOf(null));
		setMoves(-1);
		setSeconds(0);
		setIsActive(false);
		setGameOver(false);
	};
	const swapHole = (index) => {
		let newTales = [ ...tales ];
		let temp = newTales[index];
		newTales[index] = null;
		newTales[holeIndex] = temp;
		setTales(newTales);
		setHoleIndex(index);
	};

	const clickHandler = (index) => {
		const topRow = [ 0, 1, 2, 3 ];
		const bottomRow = [ 12, 13, 14, 15 ];
		const rightCol = [ 3, 7, 11, 15 ];
		const leftCol = [ 0, 4, 8, 12 ];
		let indexes = [];
		let top = false,
			bottom = false,
			right = false,
			left = false;
		let topIndexes = [],
			bottomIndexes = [],
			rightIndexes = [],
			leftIndexes = [];
		if (topRow.includes(index)) {
			top = true;
			topIndexes = [ index - 1, index + 1, index + 4 ];
		}
		if (bottomRow.includes(index)) {
			bottom = true;
			bottomIndexes = [ index - 4, index - 1, index + 1 ];
		}
		if (leftCol.includes(index)) {
			left = true;
			leftIndexes = [ index - 4, index + 1, index + 4 ];
		}
		if (rightCol.includes(index)) {
			right = true;
			rightIndexes = [ index - 4, index - 1, index + 4 ];
		}
		if (top) {
			if (right) {
				indexes = topIndexes.filter((value) => rightIndexes.includes(value));
			} else if (left) {
				indexes = topIndexes.filter((value) => leftIndexes.includes(value));
			} else {
				indexes = topIndexes;
			}
		} else if (bottom) {
			if (right) {
				indexes = bottomIndexes.filter((value) => rightIndexes.includes(value));
			} else if (left) {
				indexes = bottomIndexes.filter((value) => leftIndexes.includes(value));
			} else {
				indexes = bottomIndexes;
			}
		} else if (right) {
			indexes = rightIndexes;
		} else if (left) {
			indexes = leftIndexes;
		} else {
			indexes = [ index - 4, index - 1, index + 1, index + 4 ];
		}

		if (indexes.includes(holeIndex)) {
			swapHole(index);
		} else return;
	};
	const pause = () => {
		setIsActive(false);
		props.show();
	};
	const closeModal = () => {
		if (gameOver) resetGame();
		else setIsActive(true);
		props.hide();
	};

	return (
		<Fragment>
			<div className='container my-5 game-info '>
				<div className='row'>
					<div className='col-6'>{moves} moves</div>
					<div className='col-6'>{seconds} s</div>
				</div>
			</div>

			<table>
				<tbody>
					<tr>
						<Tale value={tales[0]} className={checkClass(tales[0], 0)} click={() => clickHandler(0)} />
						<Tale value={tales[1]} className={checkClass(tales[1], 1)} click={() => clickHandler(1)} />
						<Tale value={tales[2]} className={checkClass(tales[2], 2)} click={() => clickHandler(2)} />
						<Tale value={tales[3]} className={checkClass(tales[3], 3)} click={() => clickHandler(3)} />
					</tr>
					<tr>
						<Tale value={tales[4]} className={checkClass(tales[4], 4)} click={() => clickHandler(4)} />
						<Tale value={tales[5]} className={checkClass(tales[5], 5)} click={() => clickHandler(5)} />
						<Tale value={tales[6]} className={checkClass(tales[6], 6)} click={() => clickHandler(6)} />
						<Tale value={tales[7]} className={checkClass(tales[7], 7)} click={() => clickHandler(7)} />
					</tr>
					<tr>
						<Tale value={tales[8]} className={checkClass(tales[8], 8)} click={() => clickHandler(8)} />
						<Tale value={tales[9]} className={checkClass(tales[9], 9)} click={() => clickHandler(9)} />
						<Tale value={tales[10]} className={checkClass(tales[10], 10)} click={() => clickHandler(10)} />
						<Tale value={tales[11]} className={checkClass(tales[11], 11)} click={() => clickHandler(11)} />
					</tr>
					<tr>
						<Tale value={tales[12]} className={checkClass(tales[12], 12)} click={() => clickHandler(12)} />
						<Tale value={tales[13]} className={checkClass(tales[13], 13)} click={() => clickHandler(13)} />
						<Tale value={tales[14]} className={checkClass(tales[14], 14)} click={() => clickHandler(14)} />
						<Tale value={tales[15]} className={checkClass(tales[15], 15)} click={() => clickHandler(15)} />
					</tr>
				</tbody>
			</table>
			<div className='row d-flex justify-content-center mb-5 text-center'>
				<div className='col-4' />
				<div className='col-2'>
					<button className='game-info-button' onClick={() => pause()}>
						pause
					</button>
				</div>
				<div className='col-2'>
					<button className='game-info-button' onClick={() => resetGame()}>
						New Game
					</button>
				</div>
				<div className='col-4' />
			</div>

			<Modal
				show={props.showModal}
				handleClose={() => closeModal()}
				buttonText={gameOver ? 'Play Again' : 'Resume'}
			>
				{gameOver ? (
					<h1 className='modal-text'>
						You completed the challenge in {seconds} seconds, and in {moves} moves
					</h1>
				) : (
					<h1 className='modal-text'>Game Paused</h1>
				)}
			</Modal>
		</Fragment>
	);
}
export default connect(mapStateToProps, mapDispatchToProps)(Game);
