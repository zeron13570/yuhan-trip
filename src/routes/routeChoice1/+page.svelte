<script>
    import "../../css/import.css"
    import Logo from "../../img/Logo.png"
    import LogoW from "../../img/LogoBlack.png"
    import Map from "../../img/map.png"
</script>
<body>
    <div class="choice">
        <h1 class="ask">어디로 떠나시나요?</h1>
        <div class="routeContainer">
            <button class="recommendation select" onclick="selectLocation('서울')">서울</button>
            <button class="recommendation select" onclick="selectLocation('부산')">부산</button>
            <button class="recommendation select" onclick="selectLocation('제주')">제주</button>
            <button class="recommendation select" onclick="selectLocation('전주')">전주</button>
            <button class="recommendation select" onclick="selectLocation('포항')">포항</button>
            <button class="recommendation select" onclick="selectLocation('울산')">울산</button>
            <button class="recommendation select" onclick="selectLocation('수원')">수원</button>
            <button class="recommendation select" onclick="selectLocation('대구')">대구</button>
            <button class="recommendation select" onclick="selectLocation('군산')">군산</button>
            <button class="recommendation select" onclick="selectLocation('인천')">인천</button>
            <button class="recommendation select" onclick="selectLocation('경주')">경주</button>
            <button class="recommendation select" onclick="selectLocation('강릉')">강릉</button>
        </div>
    </div>

    <script>
        function selectLocation(location) {
            localStorage.setItem('selectedLocation', location);
            window.location.href = '../routeChoice2';
        }
    </script>
</body>