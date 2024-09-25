<script>
    import "../../css/import.css"
    import Logo from "../../img/Logo.png"
    import LogoW from "../../img/LogoBlack.png"
    import Map from "../../img/map.png"
</script>
<body>
    <!-- <header>
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
    </header> -->
    <div class="choice">
        <h1 class="ask">선호하는 여행 스타일은?</h1>
        <div class="routeContainer routeStyle">
            <button class="recommendation select" onclick="selectStyle('빽빽한 일정')">빽빽한 일정</button>
            <button class="recommendation select" onclick="selectStyle('여유로운 일정')">여유로운 일정</button>
        </div>
    </div>


    <script>
        choiceList1 = JSON.parse(localStorage.getItem('choiceList1')) || [];

        console.log(choiceList1); // 배열의 전체 값을 콘솔에 출력

        function selectStyle(style) {
            let styleNumber;

            switch(style) {
                case "빽빽한 일정":
                    styleNumber = 1;
                    break;
                case "여유로운 일정":
                    styleNumber = 2;
                    break;
            }

            // 여행 기간 선택이 이미 있는 경우, 그 값을 덮어쓰기
            if (choiceList1.length > 3) {
                choiceList1[3] = styleNumber; // 배열의 두 번째 값 덮어쓰기
            } else {
                choiceList1.push(styleNumber); // 아직 값이 없으면 추가
            }

            localStorage.setItem('choiceList1', JSON.stringify(choiceList1));
            localStorage.setItem('selectedStyle', style);
            window.location.href = '../routeResult';
        }
    </script>


    <!-- <footer>
        <div class="footer">
            <div>
                <h3>프로젝트 소개</h3>
                <p>유한대 졸업 작품</p>
            </div>
            <div>
                <h3>찾아오는 길</h3>
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
    </footer> -->
</body>
