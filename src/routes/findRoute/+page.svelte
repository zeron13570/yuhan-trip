<script>
    import { onMount } from 'svelte';
    let waypoints = []; // 초기 경유지 배열
    let startLocation = '';
    let endLocation = '';

    // 경유지 추가 함수
    function addWaypoint() {
        waypoints = [...waypoints, { id: Date.now(), value: '' }]; // 새로운 경유지 추가
    }

    // 찾기 버튼 클릭 시 처리 함수
    function findRoute() {
        const allWaypoints = waypoints.map(waypoint => waypoint.value).filter(Boolean);
        console.log('출발지:', startLocation);
        console.log('도착지:', endLocation);
        console.log('경유지:', allWaypoints);
        // 여기서 실제 경로 찾기 로직 추가
    }

    // 지도 초기화
    let map;
    onMount(() => {
        map = L.map('map').setView([37.5665, 126.978], 10); // 서울을 기본으로 설정

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    });
</script>

<div class="findRoute">
    <h1>경로 찾기</h1>
    <input type="text" placeholder="출발지" bind:value={startLocation}>
    <span>→</span>
    <input type="text" placeholder="도착지" bind:value={endLocation}>

    {#each waypoints as waypoint (waypoint.id)}
        <input type="text" placeholder="경유지" bind:value={waypoint.value}>
    {/each}

    <a href="#" class="search" on:click|preventDefault={addWaypoint}>경유지 추가</a>
    <a href="#" class="search" on:click|preventDefault={findRoute}>찾기</a>

    <div id="map"></div>
</div>
