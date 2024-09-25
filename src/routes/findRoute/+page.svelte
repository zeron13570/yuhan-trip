<body>
    <div class="findRoute">
        <h1>경로 찾기</h1>
        <input type="text" placeholder="출발지">
        <span>→</span>
        <input type="text" placeholder="도착지">
        <a href="#" class="search">찾기</a>
        <div id="map"></div>
    </div>
    <script>
        const map = L.map('map').setView(coordinate, 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        if (selectedLocation) {
            const marker = L.marker(coordinate).addTo(map);
            marker.bindPopup(selectedLocation).openPopup();
            map.setView(coordinate, 13);                
        }
    </script>
</body>