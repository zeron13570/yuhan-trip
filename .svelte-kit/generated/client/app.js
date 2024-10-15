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
	() => import('./nodes/21'),
	() => import('./nodes/22')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/check": [3],
		"/customerService": [4],
		"/findRoute": [5],
		"/locationDetail": [6],
		"/login": [7],
		"/myPage": [8],
		"/routeChoice1": [9],
		"/routeChoice2": [10],
		"/routeChoice3": [11],
		"/routeChoice4": [12],
		"/routeMain": [13],
		"/routeResult": [14],
		"/test": [15],
		"/test/list": [16],
		"/travelLogDetail": [18],
		"/travelLogPosting": [19],
		"/travelLog": [17],
		"/tripMomentDetail": [21],
		"/tripMomentPosting": [22],
		"/tripMoment": [20]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';