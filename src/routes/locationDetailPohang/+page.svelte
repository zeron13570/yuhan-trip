<script>
    import { onMount } from "svelte"; 
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";

    let posts = []; // 트래블로그 데이터 저장
    let isLoggedIn = false;
    let username = ""; // 로그인된 사용자 이름
    let userId = ""; // 로그인된 사용자 ID
    let recommendedDestinations = []; 
    let weatherInfo = ""; // 날씨 정보 저장
    let weatherIcon = ""; // 날씨 아이콘 URL

    const popularDestinations = [
        { name: "서울", link: "/locationDetailSeoul", className: "Seoul" },
        { name: "부산", link: "/locationDetailBusan", className: "Busan" },
        { name: "제주", link: "/locationDetailJeju", className: "Jeju" },
        { name: "강릉", link: "/locationDetailGangneung", className: "Gangneung" },
        { name: "군산", link: "/locationDetailGunsan", className: "Gunsan" },
        { name: "경주", link: "/locationDetailGyeongju", className: "Gyeongju" },
        { name: "인천", link: "/locationDetailIncheon", className: "Incheon" },
        { name: "수원", link: "/locationDetailSuwon", className: "Suwon" },
        { name: "포항", link: "/locationDetailPohang", className: "Pohang" },
        { name: "울산", link: "/locationDetailUlsan", className: "Ulsan" },
        { name: "대구", link: "/locationDetailDaegu", className: "Daegu" },
        { name: "전주", link: "/locationDetailJeonju", className: "Jeonju" }
    ];

    function getRandomDestinations(count) {
        const shuffled = popularDestinations.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    async function fetchWeather() {
        const apiKey = "013b6110a9dbb3bc5899f78a4b364602"; // API 키
        const city = "Busan";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=kr&units=metric`);
        
        if (response.ok) {
            const data = await response.json();
            weatherInfo = `현재 온도: ${Math.round(data.main.temp)}°C`; 
            weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        } else {
            weatherInfo = "날씨 정보를 가져오는 데 실패했습니다.";
        }
    }

    onMount(() => {
        // 클라이언트에서만 localStorage를 사용하도록 처리
        if (typeof window !== 'undefined') {
            username = localStorage.getItem('username') || ""; // 로그인된 사용자 이름 가져오기
            userId = localStorage.getItem('userId') || ""; // 로그인된 사용자 ID 가져오기
        }

        recommendedDestinations = getRandomDestinations(4);
        fetchWeather(); // 날씨 정보 가져오기

        if (!window.Kakao) {
            const script = document.createElement("script");
            script.src = "https://developers.kakao.com/sdk/js/kakao.js";
            script.onload = () => {
                Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7');
                if (Kakao.Auth.getAccessToken()) {
                    getUserInfo();
                }
            };
            document.head.appendChild(script);
        } else if (Kakao.isInitialized()) {
            if (Kakao.Auth.getAccessToken()) {
                getUserInfo();
            }
        }

        fetchPosts();
    });

    function kakaoLogin() {
        if (!Kakao.isInitialized()) {
            Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7');
        }

        Kakao.Auth.login({
            success: function(authObj) {
                console.log("Kakao login successful:", authObj);
                isLoggedIn = true;
                if (typeof window !== 'undefined') {
                    localStorage.setItem("accessToken", authObj.access_token);
                }
                getUserInfo(); // 로그인 성공 후 사용자 정보 가져오기
            },
            fail: function(error) {
                console.error("Kakao login failed:", error);
            }
        });
    }

    function getUserInfo() {
        Kakao.API.request({
            url: '/v2/user/me',
            success: function(response) {
                isLoggedIn = true;
                userId = Number(response.id);  // userId를 숫자형으로 변환
                if (typeof window !== 'undefined') {
                    localStorage.setItem("userId", userId);  // userId를 localStorage에 저장
                    localStorage.setItem("accessToken", Kakao.Auth.getAccessToken()); 
                }
            },
            fail: function(error) {
                console.error('Error fetching user info:', error);
            }
        });
    }
    
    function fetchPosts() {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : "";
        const userId = typeof window !== 'undefined' ? localStorage.getItem("userId") : "";

        fetch(`http://localhost:3000/get-posts?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            posts = data;
        })
        .catch(error => console.error('Error fetching posts:', error));
    }

    function toggleLike(postId) {
        if (!isLoggedIn || !userId) {
            return kakaoLogin(); // 로그인 창을 표시
        }

        const accessToken = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : "";

        fetch(`http://localhost:3000/get-post/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId })  // 서버로 userId 전송
        })
        .then(response => response.json())
        .then(data => {
            // 서버에서 반환된 data에서 likedBy와 likes 업데이트
            const postIndex = posts.findIndex(post => post.id === postId);
            if (postIndex !== -1) {
                posts[postIndex].likes = data.likes;
                posts[postIndex].likedBy = data.likedBy;  // likedBy 배열 업데이트
            }
        })
        .catch(error => console.error('좋아요 토글 오류:', error));
    }
</script>

<body>
    <div class="locationDetail">
        <nav class="selectList">
            <ul>
                <li><a href="../Place?name=포항">명소</a></li>
                <li><a href="../Food?name=포항">음식점</a></li>
                <li><a href="../Cafe?name=포항">카페</a></li>  
                <li><a href="https://www.yanolja.com/search/포항" target="_blank">호텔</a></li>
                <li><a href="https://search-travel.interpark.com/search?q=포항" target="_blank">투어&티켓</a></li>      
            </ul>
        </nav>

        <div class="localDescription">
            <ul>
                <li>
                    <h1>포항</h1>
                    <p>
                        포항시는 대한민국 경상북도 동해안에 있는 시이다. 시의 중심으로 흐르는 형산강이 영일만에
                        유입되면서 <br> 넓은 충적평야를 형성하고 있다. 1968년부터 포항제철이
                        조성되면서 철강 산업을 기반으로 경상북도 최대의 도시로 발전했으며, 주민등록 인구는 약 50만명이다.
                    </p>
                </li>
                <li>
                    <h1>오늘의 날씨</h1>                 
                    <div class="weather">
                        <img src={weatherIcon} alt="날씨 아이콘" />
                        <p>{weatherInfo}</p>  
                    </div>     
                </li>
            </ul>
        </div>

        <div class="LogMoment"> 
            <ul>
                <li class="LogMoment">
                    <h1>트래블로그</h1>
                    <a href="../travelLog?region=포항"><button>더보기</button></a>    
                </li>
                {#each posts.filter(post => post.region === "포항").slice(0, 4) as post}
                    <li>
                        <a href={`/travelLogDetail/${post.id}`}>
                            <img src={`http://localhost:3000${post.image}`} alt="여행지 사진"/>
                            <p>{post.title}</p>
                        </a>
                        <div class="like">
                            <span>작성자: {post.username}</span>
                            <span>
                                <img src={post.likedBy && post.likedBy.includes(userId) ? Like : noLike} 
                                    alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)}>
                            </span>
                            <span>{post.likes || 0}</span>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>

        <section class="index">
            <div class="PopularTravel">
                <h2>기타 추천 여행지</h2>
                <ul>
                    {#each recommendedDestinations as destination}
                        <li>
                            <a href={destination.link} class={destination.className}>
                                <span>{destination.name}</span>
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
        </section>
    </div>
</body>
