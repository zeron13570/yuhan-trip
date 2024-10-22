<script>
    import { onMount } from "svelte";
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";


    let posts = []; // 트래블로그 데이터 저장
    let username = localStorage.getItem("username"); // 로그인한 사용자 이름
    let recommendedDestinations = []; // 추천 여행지 저장

    // 인기 여행지 목록
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

    let weatherInfo = ""; // 날씨 정보 저장
    let weatherIcon = ""; // 날씨 아이콘 저장

    onMount(() => {
        loadPosts();
        recommendedDestinations = getRandomDestinations(4); // 추천 여행지 4개 랜덤 선택
        getWeather(); // 날씨 정보 가져오기
    });

    async function getWeather() {
        const apiKey = '013b6110a9dbb3bc5899f78a4b364602'; // API 키
        const lat = 37.5665; // 서울 위도
        const lon = 126.978; // 서울 경도

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`);
            if (!response.ok) {
                throw new Error('날씨 정보를 가져오는 데 실패했습니다: ' + response.statusText);
            }
            const data = await response.json();
            const temperature = Math.round(data.main.temp);
            const icon = data.weather[0].icon;

            // 날씨 정보 표시
            weatherInfo = `온도: ${temperature}°C`;
            weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        } catch (error) {
            console.error("날씨 정보 가져오기 오류:", error);
            weatherInfo = '날씨 정보를 가져오는 데 오류가 발생했습니다.';
        }
    }

    function loadPosts() {
        let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        posts = storedPosts;
    }

    function getRandomDestinations(count) {
        const shuffled = popularDestinations.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function toggleLike(event, post) {
        event.preventDefault(); // 기본 동작 방지
        loadPosts(); // 포스트를 먼저 로드

        let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        const postIndex = storedPosts.findIndex(p => p.id === post.id);

        if (postIndex === -1) {
            console.error("포스트를 찾을 수 없습니다.");
            return; // 포스트가 존재하지 않을 경우
        }

        if (!storedPosts[postIndex].likedBy) storedPosts[postIndex].likedBy = [];

        if (storedPosts[postIndex].likedBy.includes(username)) {
            // 좋아요 취소
            storedPosts[postIndex].likes--;
            storedPosts[postIndex].likedBy = storedPosts[postIndex].likedBy.filter(user => user !== username);
        } else {
            // 좋아요 추가
            storedPosts[postIndex].likes++;
            storedPosts[postIndex].likedBy.push(username);
        }

        localStorage.setItem("posts", JSON.stringify(storedPosts));
        loadPosts(); // 포스트 목록을 새로 고침
    }

    function isPostLiked(post) {
        return post.likedBy && post.likedBy.includes(username);
    }
</script>

<body>
    <div class="locationDetail">
        <nav class="selectList">
            <ul>
                <li><a href="">명소</a></li>
                <li><a href="">음식점</a></li>
                <li><a href="../SeoulMap">카페</a></li>
                <li><a href="https://www.yanolja.com/search/서울" target="_blank">호텔</a></li>
                <li><a href="https://search-travel.interpark.com/search?q=서울" target="_blank">투어&티켓</a></li>
            </ul>
        </nav>

        <div class="localDescription">
            <ul>
                <li>
                    <h1>서울</h1>
                    <p>
                        대한민국의 수도인 서울은 현대적인 고층 빌딩, 
                        첨단 기술의 지하철, 대중문화와 사찰, 고궁, 
                        노점상이 공존하는 <br>
                        대도시입니다. 주목할 만한 명소로는 곡선으로 이루어진 외관과 옥상 공원을
                        특징으로 하는 초현대적 디자인의 컨벤션 홀인 동대문디자인플라자, 
                        한때 7,000여 칸의 방이 자리하던 경복궁, 회화나무와 소나무 
                        고목이 있는 조계사가 있습니다.
                    </p>
                </li>
                <li>
                    <h1>오늘의 날씨</h1>
                    <div class="weather">
                        <img id="weatherIcon" src={weatherIcon} alt="날씨 아이콘" style="display: {weatherIcon ? 'inline' : 'none'};" />
                        <p id="weatherInfo">{weatherInfo}</p>
                    </div>
                </li>
            </ul>
        </div>

        <div class="LogMoment">
            <ul>
                <li class="LogMoment">
                    <h1>트래블로그</h1>
                    <a href="../travelLog"><button>더보기</button></a>
                </li>
                {#each posts.slice(0, 4) as post}
                <li>
                    <a href={`/travelLogDetail/${post.id}`}>
                        <img src={post.image || "https://placehold.co/200x200"} alt="여행지 사진">
                        <p>{post.title}</p>
                        <div class="like">
                            <span>작성자: {post.username}</span>
                            <span on:click={() => toggleLike(post)}>
                                <img src={isPostLiked(post) ? Like : noLike} alt="좋아요">
                            </span>
                            <span>{post.likes} Likes</span>
                        </div>
                    </a>
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
