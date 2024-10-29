<script>
    import { onMount } from "svelte"; 
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";

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
        const city = "Suwon";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=kr&units=metric`);
        
        if (response.ok) {
            const data = await response.json();
            // 소수점 없이 온도만 표시
            weatherInfo = `현재 온도: ${Math.round(data.main.temp)}°C`; 
            weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        } else {
            weatherInfo = "날씨 정보를 가져오는 데 실패했습니다.";
        }
    }

    onMount(() => {
        recommendedDestinations = getRandomDestinations(4);
        fetchWeather(); // 날씨 정보 가져오기
    });
</script>
<body>
    <div class="locationDetail">
        <nav class="selectList">
            <ul>
                <li><a href="../Place?name=수원">명소</a></li>
                <li><a href="../Food?name=수원">음식점</a></li>
                <li><a href="../Cafe?name=수원">카페</a></li>  
                <li><a href="https://www.yanolja.com/search/수원" target="_blank">호텔</a></li>
                <li><a href="https://search-travel.interpark.com/search?q=수원" target="_blank">투어&티켓</a></li>
            </ul>
        </nav>

        <div class="localDescription">
            <ul>
                <li>
                    <h1>수원</h1>
                    <p>
                        수원시는 대한민국 경기도 중남부에 있는 특례시로, 경기도청 소재지이다. <br>
                        동쪽으로는 용인시, 서쪽으로는 안산시, 남쪽으로는 화성시, 북쪽으로 의왕시와 접한다. <br>
                        시청 소재지는 팔달구 인계동이며, 장안구, 권선구, 팔달구, 영통구의 4개 일반구가 설치되어 있다. 
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
                    <a href="../travelLog"><button>더보기</button></a>    
                </li>
                <li><a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>본문 제목</p>
                    <div class="like">
                        <span>작성자</span><span><img src={noLike} alt="좋아요"></span>
                    </div>
                </a></li>
                <li><a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>본문 제목</p>
                    <div class="like">
                        <span>작성자</span><span><img src={noLike} alt="좋아요"></span>
                    </div>
                </a></li>
                <li><a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>본문 제목</p>
                    <div class="like">
                        <span>작성자</span><span><img src={noLike} alt="좋아요"></span>
                    </div>
                </a></li>
                <li><a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>본문 제목</p>
                    <div class="like">
                        <span>작성자</span><span><img src={noLike} alt="좋아요"></span>
                    </div>
                </a></li>
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
