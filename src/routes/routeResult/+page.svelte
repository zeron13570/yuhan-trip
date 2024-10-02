<script>
    import { onMount } from 'svelte';
    import 'leaflet/dist/leaflet.css';

    //storeData.js 파일에서 storeData 가져오기
    import { storeData } from '../storeData.js';

    let selectedInfo = '';
    let coordinate = [37.5665, 126.978]; // Default coordinate (서울)
    let recommendations = []; // 추천 가게 목록
    let dayCount = 0; // Day 버튼 개수
    let selectedDay = 0; // 선택된 Day (기본값으로 Day 1)
    let map; // Leaflet 지도 객체
    let markers = []; // 현재 지도에 표시된 마커들

    // 지도 초기화 및 마커 업데이트 함수
    function updateMarkers() {
        if (!map) return;

        // 기존 마커 제거
        markers.forEach(marker => marker.remove());
        markers = [];

        // 마커의 경계를 정의하기 위한 LatLngBounds 객체 생성
        const bounds = L.latLngBounds([]);

        // 가게 목록에 맞춰 마커 추가
        (recommendations[selectedDay] || []).forEach((store, index) => {
            const customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="marker-number">${index + 1}</div>`,
                iconSize: [30, 42], // 아이콘 크기
                iconAnchor: [15, 42]
            });
            const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(map);
            // 팝업은 클릭 시에만 열리도록 설정
            marker.bindPopup(`<b>${store.name}</b><br>${store.address}`);

            // LatLngBounds에 마커 좌표 추가
            bounds.extend([store.lat, store.lng]);

            markers.push(marker);
        });

        // 마커가 있을 때만 fitBounds 호출 (비동기 처리를 위한 setTimeout)
        if (markers.length > 0) {
            setTimeout(() => {
                map.fitBounds(bounds, { padding: [20, 20] }); // 여유 공간을 두고 확대/축소
            }, 100); // 마커가 추가된 후 지연 시간을 두고 fitBounds 호출
        }
    }

    onMount(async () => {
        const {default: leaflet } = await import('leaflet');
        L = leaflet;

        const choiceList1 = JSON.parse(localStorage.getItem('choiceList1')) || [];
        const selectedLocation = localStorage.getItem('selectedLocation');
        const selectedDuration = localStorage.getItem('selectedDuration');

        if (selectedLocation && selectedDuration) {
            selectedInfo = `${selectedLocation}, ${selectedDuration}`;
 
            // choiceList1의 값으로 추천 가게 ID 생성
            const id = choiceList1.join(''); // 예: [1, 1, 1, 1] -> "1111"
            if (storeData[id]) {
                recommendations = storeData[id].days; // days 배열 저장
                dayCount = recommendations.length; // Day의 개수로 설정
            }
        } else {
                selectedInfo = '선택된 정보가 없습니다.';
        }

        map = L.map('map').setView(coordinate, 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        updateMarkers();
    });

    // Day 버튼 클릭 시 호출되는 함수
    function selectDay(dayIndex) {
        selectedDay = dayIndex;
        updateMarkers(); // Day가 변경되면 마커를 업데이트
    }
</script>

<style>
/* Svelte에서 전역으로 적용되도록 :global() 사용 */
:global(.custom-div-icon) {
        background-color: transparent;
        border: none;
    }

    :global(.marker-number) {
        background-color: #3bd3b5;
        color: white;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        line-height: 30px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: inline-block;
    }

    :global(.marker-number:hover) {
        transform: scale(1.1);
        transition: 0.3s ease;
    }
</style>

<div class="choiceResult">
    <h1 class="ask">
        <div> {selectedInfo}</div>
        <div id="recommendation">추천 일정입니다!</div>
    </h1>
    <div id="map" style="height: 400px;"></div>

    <div class="day-buttons">
        {#each Array(dayCount) as _, index}
            <button class="day" on:click={() => selectDay(index)}>
                Day {index + 1}
            </button>
        {/each}
    </div>
    
    <div class="resultList">
        <ol id="store-list">
            {#each (recommendations[selectedDay] || []) as { name, address }}
                <li><a href="">{name} <span>({address})</span></a></li>
            {/each}
            {#if (recommendations[selectedDay] || []).length === 0}
                <li>추천 가게가 없습니다.</li>
            {/if}
        </ol>          
    </div>

    <a href="/routeMain"><button class="recommendation retry">다시 해보기</button></a>
</div>
