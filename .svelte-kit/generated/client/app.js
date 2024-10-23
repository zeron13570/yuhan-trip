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
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37')
];

export const server_loads = [];

export const dictionary = {
		"/": [2],
		"/Cafe": [3],
		"/Food": [7],
		"/Place": [22],
		"/SeoulMap": [29],
		"/check": [4],
		"/customerService": [5],
		"/findRoute": [6],
		"/locationDetailBusan": [8],
		"/locationDetailDaegu": [9],
		"/locationDetailGangneung": [10],
		"/locationDetailGunsan": [11],
		"/locationDetailGyeongju": [12],
		"/locationDetailIncheon": [13],
		"/locationDetailJeju": [14],
		"/locationDetailJeonju": [15],
		"/locationDetailPohang": [16],
		"/locationDetailSeoul": [17],
		"/locationDetailSuwon": [18],
		"/locationDetailUlsan": [19],
		"/login": [20],
		"/myPage": [21],
		"/routeChoice1": [23],
		"/routeChoice2": [24],
		"/routeChoice3": [25],
		"/routeChoice4": [26],
		"/routeMain": [27],
		"/routeResult": [28],
		"/test": [30],
		"/test/list": [31],
		"/travelLogDetail": [33],
		"/travelLogPosting": [34],
		"/travelLog": [32],
		"/tripMomentDetail": [36],
		"/tripMomentPosting": [37],
		"/tripMoment": [35]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';