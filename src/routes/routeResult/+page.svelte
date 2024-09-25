<script>
    import { onMount } from 'svelte';
    import 'leaflet/dist/leaflet.css';
    let L;

    let selectedInfo = '';
    let coordinate = [37.5665, 126.978]; // Default coordinate (서울)
    let recommendations = []; // 추천 가게 목록
    let dayCount = 0; // Day 버튼 개수

    const storeData = {
        '1111': [ // 서울 - 당일치기 - 혼자 - 빽빽여행
            { name: "가게 A", address: "서울특별시 A" },
            { name: "가게 B", address: "서울특별시 B" },
            { name: "가게 C", address: "서울특별시 C" },
            { name: "가게 D", address: "서울특별시 D" },
            { name: "가게 E", address: "서울특별시 E" },
            { name: "가게 F", address: "서울특별시 F" }
        ],
        '1112': [ // 서울 - 당일치기 - 혼자 - 여유로운여행
            { name: "가게 A", address: "서울특별시 A" },
            { name: "가게 B", address: "서울특별시 B" },
            { name: "가게 C", address: "서울특별시 C" },
            { name: "가게 D", address: "서울특별시 D" }
        ]
        
    };

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
            recommendations = storeData[id] || []; // 해당 조합이 없으면 빈 배열로 초기화
          
            // Day 버튼 개수 설정
            dayCount = choiceList1[1]; // 두 번째 값 사용

            switch (selectedLocation) {
                case "서울":
                    coordinate = [37.5665, 126.978];
                    break;
                case "제주":
                    coordinate = [33.3846216, 126.5534925];
                    break;
                case "부산":
                    coordinate = [35.2100142, 129.0688702];
                    break;
                case "전주":
                    coordinate = [35.8280463, 127.1160156];
                    break;
                case "포항":
                    coordinate = [36.0929227, 129.3052666];
                    break;
                case "울산":
                    coordinate = [35.5537228, 129.2380554];
                    break;
                case "수원":
                    coordinate = [37.2803896, 127.0077847];
                    break;
                case "대구":
                    coordinate = [35.8294374, 128.5655119];
                    break;
                case "군산":
                    coordinate = [35.9676772, 126.7366293];
                    break;
                case "인천":
                    coordinate = [37.4477691, 126.7000885];
                    break;
                case "경주":
                    coordinate = [35.8266161, 129.235988];
                    break;
                case "강릉":
                    coordinate = [37.7091295, 128.8324462];
                    break;
                default:
                    break;
            }
        } else {
            selectedInfo = '선택된 정보가 없습니다.';
        }

        const map = L.map('map').setView(coordinate, 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        if (selectedLocation) {
            const marker = L.marker(coordinate).addTo(map);
            marker.bindPopup(selectedLocation).openPopup();
            map.setView(coordinate, 13);                
        }
    });
</script>

<div class="choiceResult">
    <h1 class="ask">
        <div> {selectedInfo}</div>
        <div id="recommendation">추천 일정입니다!</div>
    </h1>
    <div id="map" style="height: 400px;"></div>

    <div class="day-buttons">
        {#each Array(dayCount) as _, index}
            <button class="day">Day {index + 1}</button>
        {/each}
    </div>

    <div class="resultList">
        <ol id="store-list">
            {#each recommendations as { name, address }}
                <li><a href="">{name} <span>({address})</span></a></li>
            {/each}
            {#if recommendations.length === 0}
                <li>추천 가게가 없습니다.</li>
            {/if}
        </ol>          
    </div>

    <a href="/routeMain"><button class="recommendation retry">다시 해보기</button></a>
</div>
