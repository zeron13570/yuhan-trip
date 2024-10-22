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
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/SeoulMap": [26],
		"/check": [3],
		"/customerService": [4],
		"/findRoute": [5],
		"/locationDetailBusan": [6],
		"/locationDetailDaegu": [7],
		"/locationDetailGangneung": [8],
		"/locationDetailGunsan": [9],
		"/locationDetailGyeongju": [10],
		"/locationDetailIncheon": [11],
		"/locationDetailJeju": [12],
		"/locationDetailJeonju": [13],
		"/locationDetailPohang": [14],
		"/locationDetailSeoul": [15],
		"/locationDetailSuwon": [16],
		"/locationDetailUlsan": [17],
		"/login": [18],
		"/myPage": [19],
		"/routeChoice1": [20],
		"/routeChoice2": [21],
		"/routeChoice3": [22],
		"/routeChoice4": [23],
		"/routeMain": [24],
		"/routeResult": [25],
		"/test": [27],
		"/test/list": [28],
		"/travelLogDetail": [30],
		"/travelLogPosting": [31],
		"/travelLog": [29],
		"/tripMomentDetail": [33],
		"/tripMomentPosting": [34],
		"/tripMoment": [32]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';