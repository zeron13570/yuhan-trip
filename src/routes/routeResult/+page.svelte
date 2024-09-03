<script>
    import { onMount } from 'svelte';
    import "../../css/import.css";
    import Logo from "../../img/Logo.png";
    import LogoW from "../../img/LogoBlack.png";

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

        const map = L.map('map').setView(coordinate, 10); // Initialize map

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // Add OpenStreetMap tile layer
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Display a marker for the selected location
        if (selectedLocation) {
            var marker = L.marker(coordinate).addTo(map); // Add marker
            marker.bindPopup("선택된 위치").openPopup(); // Add popup to marker
            map.setView(coordinate, 13); // Center map on the selected location
        }
    });
</script>


<body>
    <div class="choiceResult">
        <h1 class="ask"><div id="selected-info"></div>
        <div id="recommendation">추천 일정입니다!</div></h1>
        <!-- 지도를 표시할 div -->
        <div id="map"></div>
        <a href="../routeMain"><button class="recommendation retry">다시 해보기</button></a> 
        <!-- 다시해보기 버튼 눌렀을 시 경로추천 메인페이지로 이동 필요 -->
    </div>
</body>
