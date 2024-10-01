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
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/customerService": [3],
		"/findRoute": [4],
		"/locationDetail": [5],
		"/myPage": [6],
		"/routeChoice1": [7],
		"/routeChoice2": [8],
		"/routeChoice3": [9],
		"/routeChoice4": [10],
		"/routeMain": [11],
		"/routeResult": [12],
		"/test": [13],
		"/test/list": [14],
		"/travelLogDetail": [16],
		"/travelLogPosting": [17],
		"/travelLog": [15],
		"/tripMomentDetail": [19],
		"/tripMomentPosting": [20],
		"/tripMoment": [18]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';