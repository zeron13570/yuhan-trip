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
                <li><a href="https://www.yanolja.com/search/군산" target="_blank">호텔</a></li>
                <li><a href="https://search-travel.interpark.com/search?q=군산" target="_blank">투어&티켓</a></li>    
            </ul>
        </nav>

        <div class="localDescription">
            <ul>
                <li>
                    <h1>군산</h1>
                    <p>
                        군산시는 대한민국 전북특별자치도 북서부 해안가에 있는 시이다. <br>
                        동쪽은 익산시, 서쪽은 황해, 남쪽은 만경강을 경계로 김제시, 북쪽은 금강을 경계로 <br> 충청남도 서천군과 접하고 있다. 
                        금강 하구와 만경강 하구로 둘러싸인 육지와 황해의 섬들로 이루어진다.
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
        const lat =  35.9655;
        const lon = 126.7376;

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
