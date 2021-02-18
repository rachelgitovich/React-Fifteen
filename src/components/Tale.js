import React from 'react';

export default function Tale({ value, className, click, hover }) {

	

	return (
		<td className={className} onClick={click} onMouseEnter={hover}>
			{value}
		</td>
	);
}
