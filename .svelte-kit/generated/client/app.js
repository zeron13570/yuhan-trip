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
	() => import('./nodes/13'),
	() => import('./nodes/14')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/customerService": [3],
		"/locationDetail": [4],
		"/momentPosting": [5],
		"/routeChoice1": [6],
		"/routeChoice2": [7],
		"/routeChoice3": [8],
		"/routeChoice4": [9],
		"/routeMain": [10],
		"/routeResult": [11],
		"/travelLogPosting": [13],
		"/travelLog": [12],
		"/tripMoment": [14]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';