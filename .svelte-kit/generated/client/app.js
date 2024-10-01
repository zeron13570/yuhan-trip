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
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/customerService": [3],
		"/findRoute": [4],
		"/locationDetail": [5],
		"/momentPosting": [6],
		"/myPage": [7],
		"/routeChoice1": [8],
		"/routeChoice2": [9],
		"/routeChoice3": [10],
		"/routeChoice4": [11],
		"/routeMain": [12],
		"/routeResult": [13],
		"/test": [14],
		"/test/list": [15],
		"/travelLogPosting": [17],
		"/travelLog": [16],
		"/tripMoment": [18]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';