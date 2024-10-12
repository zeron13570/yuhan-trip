<script>
    import "../css/import.css";
    import Logo from "../img/Logo.png";
    import LogoW from "../img/LogoBlack.png";
    import Map from "../img/map.png";
    import { onMount } from "svelte";  // Svelte에서 onMount 사용

    let isLoggedIn = false;  // 로그인 여부를 확인하는 변수
    let userName = '';       // 로그인한 사용자의 이름

    // 카카오 SDK 불러오기
    onMount(() => {
        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = () => {
            // 카카오 SDK 초기화
            Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7'); // 발급받은 JavaScript 키로 초기화
            console.log(Kakao.isInitialized()); // SDK 초기화 확인

            // 로그인 여부 체크
            if (Kakao.Auth.getAccessToken()) {
                getUserInfo();  // 로그인되어 있으면 사용자 정보 가져오기
            }
        };
        document.head.appendChild(script);
    });

    // 카카오 로그인 함수
    function kakaoLogin() {
        Kakao.Auth.login({
            success: function (authObj) {
                console.log(authObj); // 로그인 성공 시 토큰 정보 출력
                getUserInfo();  // 로그인 후 사용자 정보 가져오기
            },
            fail: function (err) {
                console.error(err);
                alert('로그인 실패');
            }
        });
    }

    // 사용자 정보 가져오기
    function getUserInfo() {
        Kakao.API.request({
            url: '/v2/user/me',
            success: function (response) {
                isLoggedIn = true;
                userName = response.kakao_account.profile.nickname; // 사용자 이름 가져오기
                console.log(response);
            },
            fail: function (error) {
                console.error(error);
            }
        });
    }

    // 로그아웃 함수
    function kakaoLogout() {
        Kakao.Auth.logout(() => {
            isLoggedIn = false;
            userName = '';
            alert('로그아웃 되었습니다.');
        });
    }
</script>
<header>
    <nav>
        <ul>
            <li><h1><a href="../"><img src={Logo} alt="Logo"></a></h1></li>
            <li><a href="https://www.yanolja.com/?trackcode=mkt_google_sa&utm_source=google_sa&utm_medium=cpc&utm_campaign=20738115572&utm_content=160897187931&utm_term=kwd-298391364620&gad_source=1&gclid=EAIaIQobChMI7syZvKPdiAMVuWwPAh0uKyRREAAYASAAEgKmE_D_BwE">호텔</a></li>
            <li><a href="https://travel.interpark.com/tour/package/main?utm_source=google&utm_medium=cpc&utm_campaign=tour_abroadpackage_20240730_paidsearch_pc_cpc&utm_term=%EC%9D%B8%ED%84%B0%ED%8C%8C%ED%81%AC%20%ED%88%AC%EC%96%B4&utm_content=consider_34&gad_source=1&gclid=EAIaIQobChMIq7eYyqPdiAMVdVkPAh2dbj1bEAAYASAAEgKcBPD_BwE">투어&티켓</a></li>
            <li><a href="https://www.letskorail.com/">기차표</a></li>            
            <li><a href="/findRoute">경로찾기</a></li>            
            <li><a href="/routeMain">경로추천</a></li>
            {#if isLoggedIn}
                <!-- 로그인된 경우 로그아웃 버튼 표시 -->
                <li><a href="../" on:click={kakaoLogout}>로그아웃</a></li>
            {:else}
                <!-- 로그인되지 않은 경우 로그인 버튼 표시 -->
                <li><a href ="" on:click={kakaoLogin}>로그인</a></li>
            {/if}           
            <li><a href="/myPage">마이페이지</a></li>
            <li><a href="/customerService">고객센터</a></li>  
        </ul>
    </nav>
</header>

    <!-- 각 page.svelte의 내용을 slot 사이에 넣음 -->
<slot>   
</slot>

    <!-- footer 시작 -->
<footer>
    <div class="footer">
        <div>
            <h3>프로젝트 소개</h3>
            <p>
                여행을 갈 때 여러 사이트를 확인하며<br> 
                일정을 계획하지 않고 하나의 사이트에서 <br>
                항공권이나 숙박, 날씨, 맛집 및 카페 등을 <br>
                확인 할 수 있어 간편하게 여행 계획을 <br> 
                세울 수 있는 사이트를 만들었습니다.
            </p>
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