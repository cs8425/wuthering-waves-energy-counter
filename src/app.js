import { h, Fragment, render } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

import { nopFn, useForceUpdate } from './hooks.js';

// import css
import 'bulma/css/bulma.css';
import './all.min.css';

// 1721060676775 => 3
// 1721059596775 => 0

const EnergyConstTime = 6 * 60 * 1000;
const MaxEnergyConstTime = EnergyConstTime * 240;

function ms2Str(ms) {
	const ss = `${Math.floor(ms / 1000) % 60}`.padStart(2, '0');
	const mm = `${Math.floor(ms / (60 * 1000)) % 60}`.padStart(2, '0');
	const hh = `${Math.floor(ms / (60 * 60 * 1000))}`.padStart(2, '0');
	return `${hh}:${mm}:${ss}`;
}

function ts2Str(ts) {
	const d = new Date();
	d.setTime(ts);
	return d.toLocaleString();
}

function EnergyStats(props) {
	const {
		val,
		setupFn = nopFn,
		useEnergyfn = nopFn,
	} = props;
	const accName = val[0];
	const now = Date.now();
	const dt = (now < val[1] + MaxEnergyConstTime) ? now - val[1] : 0;
	const energy = Math.floor(dt / EnergyConstTime);
	const nextMs = EnergyConstTime - (dt % EnergyConstTime);
	const nextTime = val[1] + (energy + 1) * EnergyConstTime;
	const maxMs = MaxEnergyConstTime - dt;
	const maxTime = val[1] + MaxEnergyConstTime;

	return (
		<div class="card">
			<header class="card-header">
				<p class="card-header-title">
					<div class="mr-4">{accName}</div>
					<div class="tags has-addons">
						<span class="tag is-success">{energy}</span>
						<span class="tag is-dark">{ts2Str(maxTime)}</span>
					</div>
				</p>
				<button class="card-header-icon" aria-label="more options">
					<span class="icon">
						<i class="fas fa-angle-down" aria-hidden="true"></i>
					</span>
				</button>
			</header>
			<div class="card-content">
				<div class="content">
					<article class="media">
						<div class="media-content" style="overflow: unset;">
							<div class="content">
								<div class="columns is-mobile is-vcentered is-1">
									<div class="column py-1"><h1 class="title is-6">當前:</h1></div>
									<div class="column py-1"><span>{energy}</span></div>
									<div class="column py-1"><span>240</span></div>
								</div>
								<div class="columns is-mobile is-vcentered is-1">
									<div class="column py-1"><h1 class="title is-6">下次:</h1></div>
									<div class="column py-1"><span>{ms2Str(nextMs)}</span></div>
									<div class="column py-1"><span>{ts2Str(nextTime)}</span></div>
								</div>
								<div class="columns is-mobile is-vcentered is-1">
									<div class="column py-1"><h1 class="title is-6">回滿:</h1></div>
									<div class="column py-1"><span>{ms2Str(maxMs)}</span></div>
									<div class="column py-1"><span>{ts2Str(maxTime)}</span></div>
								</div>
							</div>
						</div>
					</article>
				</div>
			</div>
			<footer class="card-footer">
				<a href="#" class="card-footer-item" onClick={setupFn}>設定</a>
				<a href="#" class="card-footer-item" onClick={useEnergyfn}>耗體</a>
			</footer>
		</div>
	);
}

function SetupEnergyModal(props) {
	const {
		show = false,
		saveFn = nopFn,
		closeFn = nopFn,
	} = props;
	const valRef = useRef(0);
	const mmRef = useRef(0);
	const ssRef = useRef(0);
	const saveHdr = (e) => {
		console.log('[save]', e, valRef.current.value, mmRef.current.value, ssRef.current.value);
		const val = Number.parseInt(valRef.current.value) || 0;
		const mm = Number.parseInt(mmRef.current.value) || 0;
		const ss = Number.parseInt(ssRef.current.value) || 0;
		saveFn(val, mm, ss);
		closeFn();
		valRef.current.value = '';
		mmRef.current.value = '';
		ssRef.current.value = '';
	}
	return (
		<div class={`modal ${(show) ? 'is-active' : ''}`}>
			<div class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title">設定參數</p>
					<button class="delete" aria-label="close" onClick={closeFn}></button>
				</header>
				<section class="modal-card-body">
					<div class="field has-addons">
						<p class="control">
							<a class="button is-static">當前體力</a>
						</p>
						<p class="control">
							<input ref={valRef} class="input" type="number" placeholder="120" />
						</p>
						<p class="control">
							<input class="input" type="text" placeholder="240" readonly />
						</p>
					</div>
					<div class="field has-addons">
						<p class="control">
							<a class="button is-static">下次回復</a>
						</p>
						<p class="control">
							<input ref={mmRef} class="input" type="number" placeholder="分" />
						</p>
						<p class="control">
							<input ref={ssRef} class="input" type="number" placeholder="秒" />
						</p>
					</div>
				</section>
				<footer class="modal-card-foot">
					<div class="buttons">
						<button class="button is-success" onClick={saveHdr}>Save</button>
						<button class="button" onClick={closeFn}>Cancel</button>
					</div>
				</footer>
			</div>
		</div>
	);
}

function UseEnergyModal(props) {
	const {
		show = false,
		saveFn = nopFn,
		closeFn = nopFn,
	} = props;
	const valRef = useRef(0);
	const useEnergyHdr = (e) => {
		console.log('[use]', e, valRef.current.value);
		const val = Number.parseInt(valRef.current.value) || 0;
		saveFn(val);
		closeFn();
	}
	return (
		<div class={`modal ${(show) ? 'is-active' : ''}`}>
			<div class="modal-background"></div>
			<div class="modal-card">
				<header class="modal-card-head">
					<p class="modal-card-title">調整體力</p>
					<button class="delete" aria-label="close" onClick={closeFn}></button>
				</header>
				<section class="modal-card-body">
					<div class="field">
						<p class="control">
							<span class="select">
								<select ref={valRef} >
									<option value="40" selected>消耗40</option>
									<option value="60">消耗60</option>
									<option value="-60">回復60</option>
								</select>
							</span>
						</p>
					</div>
				</section>
				<footer class="modal-card-foot">
					<div class="buttons">
						<button class="button is-success" onClick={useEnergyHdr}>Save</button>
						<button class="button" onClick={closeFn}>Cancel</button>
					</div>
				</footer>
			</div>
		</div>
	);
}

function App() {
	const confRef = useRef([
		['Rover', 1721059596775],
	]);
	const doUpdate = useForceUpdate();
	const renderRef = useRef(null);

	const [showSetup, setShowSetup] = useState(false);
	const [showUseEnergy, setShowUseEnergy] = useState(false);

	useEffect(() => {
		let accStr = window.localStorage.getItem('ts');
		if (accStr) {
			try {
				let accs = JSON.parse(accStr);
				confRef.current = accs;
			}
			catch (e) {
				// TODO:
			}
		}

		const render = () => {
			doUpdate();
			renderRef.current = window.requestAnimationFrame(render);
		};
		renderRef.current = window.requestAnimationFrame(render);
		return () => {
			window.cancelAnimationFrame(renderRef.current);
		};
	}, []);

	return (
		<section class="section">
			<div class="container">
				<h1 class="title">Wuthering Waves</h1>
				<p class="subtitle">energy counter</p>
				<hr />
				<EnergyStats
					val={confRef.current[0]}
					setupFn={() => { setShowSetup(true) }}
					useEnergyfn={() => { setShowUseEnergy(true) }}
				/>

				<SetupEnergyModal
					show={showSetup}
					closeFn={() => { setShowSetup(false) }}
					saveFn={(val, mm, ss) => {
						const now = Date.now();
						const acc = confRef.current[0];
						acc[1] = now - val * EnergyConstTime - mm * 60 * 1000 - ss * 1000;

						// write back
						window.localStorage.setItem('ts', JSON.stringify(confRef.current));
					}}
				/>

				<UseEnergyModal
					show={showUseEnergy}
					closeFn={() => { setShowUseEnergy(false) }}
					saveFn={(val) => {
						const acc = confRef.current[0];
						acc[1] = acc[1] + val * EnergyConstTime;

						// write back
						window.localStorage.setItem('ts', JSON.stringify(confRef.current));
					}}
				/>
			</div>
		</section>
	);
}

render(h(App), document.getElementById('app'));
