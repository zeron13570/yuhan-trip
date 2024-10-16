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
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/check": [3],
		"/customerService": [4],
		"/findRoute": [5],
		"/locationDetailBusan": [6],
		"/locationDetailJeju": [7],
		"/locationDetailSeoul": [8],
		"/login": [9],
		"/myPage": [10],
		"/routeChoice1": [11],
		"/routeChoice2": [12],
		"/routeChoice3": [13],
		"/routeChoice4": [14],
		"/routeMain": [15],
		"/routeResult": [16],
		"/test": [17],
		"/test/list": [18],
		"/travelLogDetail": [20],
		"/travelLogPosting": [21],
		"/travelLog": [19],
		"/tripMomentDetail": [23],
		"/tripMomentPosting": [24],
		"/tripMoment": [22]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';