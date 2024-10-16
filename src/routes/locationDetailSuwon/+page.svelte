<script>
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";
</script>
<body>
    <div class="locationDetail">
        <nav class="selectList">
            <ul>
                <li><a href="">명소</a></li>
                <li><a href="">음식점</a></li>
                <li><a href="">카페</a></li>  
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
                        <img id="weatherIcon" alt="날씨 아이콘" />
                        <p id="weatherInfo"></p>  
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
            <ul>
                <li class="LogMoment">
                    <h1>트립모먼트</h1>
                    <a href="../tripMoment"><button>더보기</button></a>
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

        <section class="index">
            <div class="PopularTravel">
                <h2>기타 추천 여행지</h2>
                <ul>
                    <li><a href="/detail"><span>서울</span></a></li>
                    <li><a href=""><span>부산</span></a></li>
                    <li><a href=""><span>제주</span></a></li>
                    <li><a href=""><span>강릉</span></a></li>
                </ul>
            </div>
        </section>
    </div>

    <script>
    async function getWeather() {
        const apiKey = '013b6110a9dbb3bc5899f78a4b364602'; // 여기에 자신의 API 키를 입력하세요.
        const lat =  37.2636;
        const lon = 127.0286;

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`);
            if (!response.ok) {
                throw new Error('날씨 정보를 가져오는 데 실패했습니다: ' + response.statusText);
            }
            const data = await response.json();
            const temperature = data.main.temp;
            const icon = data.weather[0].icon;

            // 날씨 정보 표시
            document.getElementById('weatherInfo').innerText = `온도: ${temperature}°C`;
            const weatherIcon = document.getElementById('weatherIcon');
            weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            weatherIcon.style.display = 'inline'; // 아이콘 보이기

        } catch (error) {
            console.error("날씨 정보 가져오기 오류:", error);
            document.getElementById('weatherInfo').innerText = '날씨 정보를 가져오는 데 오류가 발생했습니다.';
        }
    }

    // DOMContentLoaded 이벤트 리스너로 날씨 정보 가져오기
    document.addEventListener('DOMContentLoaded', getWeather);

    </script>
    
</body>
