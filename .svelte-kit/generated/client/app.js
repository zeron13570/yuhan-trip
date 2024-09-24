export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/locationDetail": [3],
		"/momentPosting": [4],
		"/routeChoice1": [5],
		"/routeChoice2": [6],
		"/routeChoice3": [7],
		"/routeChoice4": [8],
		"/routeMain": [9],
		"/routeResult": [10],
		"/travelLogPosting": [12],
		"/travelLog": [11],
		"/tripMoment": [13]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';