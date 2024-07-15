import { useState, useRef, useEffect, useContext, useMemo } from 'preact/hooks';

const nopFn = () => { }
export { nopFn };

function useForceUpdate() {
	const [_, doUpdate] = useState(0);
	return () => {
		doUpdate((v) => v + 1);
	};
}
export { useForceUpdate };

// delay & limit rate of update function call
function useDelayLimit(updateFn, timeMs = 50) {
	const valRef = useRef({
		t: Date.now(),
		val: null,
		ref: null,
		newUpdateFn: null,
		updateFn0: updateFn,
	});

	// init once only or updateFn changed
	if (valRef.current.newUpdateFn == null || valRef.current.updateFn0 !== updateFn) {
		valRef.current.newUpdateFn = (val) => {
			const state = valRef.current;
			state.val = val;

			// update in queue, skip
			if (state.ref !== null) return;

			if (Date.now() - state.t > timeMs) {
				updateFn(state.val);
				state.t = Date.now();
				return;
			}

			// delay update call
			state.ref = setTimeout(() => {
				updateFn(valRef.current.val);
				state.t = Date.now();
				state.ref = null;
			}, timeMs);
		};
	}

	return valRef.current.newUpdateFn;
}
export { useDelayLimit };


