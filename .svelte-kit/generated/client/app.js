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
	() => import('./nodes/20'),
	() => import('./nodes/21')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/customerService": [3],
		"/findRoute": [4],
		"/locationDetail": [5],
		"/login": [6],
		"/myPage": [7],
		"/routeChoice1": [8],
		"/routeChoice2": [9],
		"/routeChoice3": [10],
		"/routeChoice4": [11],
		"/routeMain": [12],
		"/routeResult": [13],
		"/test": [14],
		"/test/list": [15],
		"/travelLogDetail": [17],
		"/travelLogPosting": [18],
		"/travelLog": [16],
		"/tripMomentDetail": [20],
		"/tripMomentPosting": [21],
		"/tripMoment": [19]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';