import React from 'react';
import './modal.css';
import '../App.css';

export default function Modal({ handleClose, show, children, buttonText }) {
	const showHideClassName = show ? 'modal display-block' : 'modal display-none';
	return (
		<div className={showHideClassName}>
			<section className='modal-main'>
				{children}
				<button className='game-info mb-3' onClick={handleClose}>
					{buttonText}
				</button>
			</section>
		</div>
	);
}
