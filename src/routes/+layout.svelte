<script>
    import "../css/import.css";
    import Logo from "../img/Logo.png";
    import LogoW from "../img/LogoBlack.png";
    import Map from "../img/map.png";
    import { onMount } from "svelte";  // Svelte에서 onMount 사용

    let isLoggedIn = false;  // 로그인 여부를 확인하는 변수
    let userName = '';       // 로그인한 사용자의 이름

    // 초기화 및 로그인 여부 확인
    onMount(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.onload = () => {
        Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7');
        console.log(Kakao.isInitialized());

        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            // 토큰 유효성 확인
            Kakao.API.request({
                url: '/v2/user/me',
                success: function() {
                    isLoggedIn = true;
                    userName = localStorage.getItem("userName");
                },
                fail: function(error) {
                    console.error('Token expired or invalid:', error);
                    kakaoLogout(); // 로그아웃 처리
                }
            });
        }
    };
    document.head.appendChild(script);
});


    // 카카오 로그인 함수
    function kakaoLogin() {
        Kakao.Auth.login({
            success: function (authObj) {
                console.log(authObj);
                getUserInfo();
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
            success: function(response) {
                isLoggedIn = true;
                userName = response.kakao_account.profile.nickname;
                const userId = response.id;
                
                localStorage.setItem("userName", userName);
                localStorage.setItem("userId", userId);
                localStorage.setItem("accessToken", Kakao.Auth.getAccessToken()); 
            },
            fail: function(error) {
                console.error('Error fetching user info:', error);
            }
        });
    }

    // 로그아웃 함수
    function kakaoLogout() {
        Kakao.Auth.logout(() => {
            localStorage.removeItem("userName");
            localStorage.removeItem("userId");
            localStorage.removeItem("accessToken");

            // 로그인 상태를 false로 설정
            isLoggedIn = false;
            username = "";
            userId = "";
                
            alert('로그아웃 되었습니다.');
        });
    }
</script>

<header>
    <nav>
        <ul>
            <li><h1><a href="../"><img src={Logo} alt="Logo"></a></h1></li>
            <li><a href="/travelLog">트래블로그</a></li>            
            <li><a href="/findRoute">경로찾기</a></li>            
            <li><a href="/routeMain">경로추천</a></li>
            {#if isLoggedIn}
                <!-- 로그인된 경우 로그아웃 버튼 표시 -->
                <li><a href="../" on:click={kakaoLogout}>로그아웃</a></li>
            {:else}
                <!-- 로그인되지 않은 경우 로그인 버튼 표시 -->
                <li><a href="#" on:click={kakaoLogin}>로그인</a></li>
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