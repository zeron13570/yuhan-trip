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
                <li><a href="">놀거리</a></li>         
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
        // 날씨 정보를 가져오는 함수
        async function getWeather() {
            const apiKey = '013b6110a9dbb3bc5899f78a4b364602'; // 여기에 자신의 API 키를 입력하세요.
            const lat = 37.5553;
            const lon = 126.9707;

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

        // 페이지가 로드되면 날씨 정보 가져오기
        window.onload = getWeather; // 페이지 로드 시 바로 호출
    </script>
</body>
