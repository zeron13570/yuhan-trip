<script>
    import "../css/import.css"
    import Logo from "../img/Logo.png"
    import LogoW from "../img/LogoBlack.png"
    import Map from "../img/map.png"
</script>
<header>
    <nav>
        <ul>
            <li><h1><a href="../"><img src={Logo} alt="Logo"></a></h1></li>
            <li><a href="">호텔</a></li>
            <li><a href="">투어&티켓</a></li>
            <li><a href="">기차표</a></li>            
            <li><a href="">경로찾기</a></li>            
            <li><a href="/routeMain">경로추천</a></li>            
            <li><a href="">로그인</a></li>
            <li><a href="">고객센터</a></li>
        </ul>
    </nav>

    <!-- 버튼에 돋보기 아이콘 백그라운드로 추가 예정 -->
</header>

    <!-- 각 page.svelte의 내용을 slot 사이에 넣음 -->
<slot>   
</slot>

    <!-- footer 시작 -->
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
                <li><a href="https://www.instagram.com/yuhan_univ/"></a></li>
                <li><a href="https://www.youtube.com/channel/UCA5VD_0BbiKgx6MFVCQnQZA/featured"></a></li>
                <li><a href="https://www.facebook.com/yuhancollege/?locale=ko_KR"></a></li>
                <li><a href="https://www.google.co.kr/?hl=ko"></a></li>
                <li><a href="https://x.com/i/flow/login?redirect_after_login=%2Fyuhancollege"></a></li>
            </ul>
        </div>
        <p>All contents Copyright ⓒ Yuhan University.</p>
    </div>
</footer>