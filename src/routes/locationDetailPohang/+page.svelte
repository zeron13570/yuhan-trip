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
        const city = "Pohang";
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
