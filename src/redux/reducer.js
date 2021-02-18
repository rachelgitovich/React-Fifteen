import { HIDE_MODAL, SHOW_MODAL } from './actions';

const manageModal = (state = { showModal: false }, action) => {
	switch (action.type) {
		case SHOW_MODAL:
			return { showModal: true };
		case HIDE_MODAL:
			return { showModal: false };

		default:
			return state;
	}
};

export default manageModal;
