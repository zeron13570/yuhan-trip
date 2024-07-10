<script>
    import "../../css/import.css"
    import Logo from "../../img/Logo.png"
    import LogoW from "../../img/LogoBlack.png"
    import Map from "../../img/map.png"
</script>
<body>
    <header>
        <nav>
            <ul>
                <li><h1><a href="../"><img src={Logo} alt="Logo"></a></h1></li>
                <li><a href="">호텔</a></li>
                <li><a href="">투어&티켓</a></li>
                <li><a href="">기차표</a></li>            
                <li><a href="">경로찾기</a></li>            
                <li><a href="">경로추천</a></li>            
                <li><a href="">로그인</a></li>
                <li><a href="">고객센터</a></li>
            </ul>
        </nav>
    </header>
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

    <footer>
        <div class="footer">
            <div>
                <h3>프로젝트 소개</h3>
                <p>유한대 졸업 작품</p>
            </div>
            <div>
                <h3>찾아오는 길</h3>
                <!-- 아이콘 백그라운드 이미지로 뿌림 -->
                <address> 
                    <p>14780) 경기도 부천시 경인로 590 (괴안동 185-34)</p>
                    <a href="tel:+820226100768">(+82) 02 - 2610 - 0768</a>    
                </address>
            </div>
            <div>
                <h2><a href=""><img src={LogoW} alt="Logo"></a></h2>
                <ul>
                    <li><a href="https://www.instagram.com/"></a></li>
                    <li><a href="https://www.youtube.com/?app=desktop&hl=ko&gl=KR"></a></li>
                    <li><a href="https://www.facebook.com/?locale=ko_KR"></a></li>
                    <li><a href="https://www.google.co.kr/?hl=ko"></a></li>
                    <li><a href="https://x.com/?lang=ko"></a></li>
                </ul>
            </div>
            <p>All contents Copyright ⓒ Yuhan University.</p>
        </div>
    </footer>
</body>