<script>
    import { onMount } from 'svelte';
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';

    onMount(() => {
        const selectedLocation = localStorage.getItem('selectedLocation');
        const selectedDuration = localStorage.getItem('selectedDuration');

        const selectedInfoElement = document.getElementById('selected-info');
        const recommendationElement = document.getElementById('recommendation');

        let coordinate = [37.5665, 126.978]; // Default coordinate (서울)

        if (selectedLocation && selectedDuration) {
            selectedInfoElement.textContent = `${selectedLocation}, ${selectedDuration}`;
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
            selectedInfoElement.textContent = '선택된 정보가 없습니다.';
        }

        // Leaflet 지도 초기화
        const map = L.map('map').setView(coordinate, 10);

        // 지도 타일 레이어 추가
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // 선택된 위치를 지도에 마커로 표시
        if (selectedLocation) {
            try {
                const coordinates = JSON.parse(selectedLocation);
                if (coordinates.lat && coordinates.lng) {
                    const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(map);
                    marker.bindPopup("선택된 위치").openPopup();
                    map.setView([coordinates.lat, coordinates.lng], 13);
                }
            } catch (e) {
                console.error('Error parsing coordinates:', e);
            }
        }
    });
</script>

<style>
    /* 지도 스타일 설정 */
    #map {
        height: 400px; /* 원하는 높이로 조정 */
        width: 100%; /* 전체 너비로 조정 */
    }
</style>

<div class="choiceResult">
    <h1 class="ask">
        <div id="selected-info"></div>
        <div id="recommendation">추천 일정입니다!</div>
    </h1>
    <!-- 지도를 표시할 div -->
    <div id="map"></div>
    <a href="/routeMain"><button class="recommendation retry">다시 해보기</button></a>
</div>
