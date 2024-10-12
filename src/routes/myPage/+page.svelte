<script>
    import Like from "../../img/like.png"
    import noLike from "../../img/notLike.png"
    import { onMount } from "svelte";  // Svelte의 onMount 사용

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

<body>
    <section class="myPage">
        {#if isLoggedIn}
        <div class="userID"><span class="userID"></span>{userName}님, 환영합니다!</div>
        <h2>내가 작성한 글</h2>
        <h3>트래블로그</h3>
        <div class="uList">
            <ul>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>본문 제목</p>
                        <div class="like">
                            <span>작성자</span><span><img src={noLike} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>본문 제목</p>
                        <div class="like">
                            <span>작성자</span><span><img src={noLike} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>본문 제목</p>
                        <div class="like">
                            <span>작성자</span><span><img src={noLike} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <h3>트립모먼트</h3>
        <div class="uList">
            <ul>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <div class="like">
                            <span>지역명</span><span><img src={noLike} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <div class="like">
                            <span>지역명</span><span><img src={noLike} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <div class="like">
                            <span>지역명</span><span><img src={noLike} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <h2>내가 좋아하는 글</h2>
        <h3>트래블로그</h3>
        <div class="uList">
            <ul>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>본문 제목</p>
                        <div class="like">
                            <span>작성자</span><span><img src={Like} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>본문 제목</p>
                        <div class="like">
                            <span>작성자</span><span><img src={Like} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>본문 제목</p>
                        <div class="like">
                            <span>작성자</span><span><img src={Like} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <h3>트립모먼트</h3>   
        <div class="uList">
            <ul>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <div class="like">
                            <span>지역명</span><span><img src={Like} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <div class="like">
                            <span>지역명</span><span><img src={Like} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <div class="like">
                            <span>지역명</span><span><img src={Like} alt="좋아요"></span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        {:else}
        <!-- 로그인 안 된 경우 -->
        <h2>로그인 후 이용해주세요</h2>
        <button on:click={kakaoLogin}>카카오 로그인</button>
    {/if}
    </section>
</body>