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
	() => import('./nodes/14'),
	() => import('./nodes/15')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/customerService": [3],
		"/findRoute": [4],
		"/locationDetail": [5],
		"/momentPosting": [6],
		"/routeChoice1": [7],
		"/routeChoice2": [8],
		"/routeChoice3": [9],
		"/routeChoice4": [10],
		"/routeMain": [11],
		"/routeResult": [12],
		"/travelLogPosting": [14],
		"/travelLog": [13],
		"/tripMoment": [15]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';