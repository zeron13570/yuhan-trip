<script>
    import Like from "../../img/like.png"
    import noLike from "../../img/notLike.png"
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
                    <h1>지역명</h1>
                    <p>지역 상세 설명</p>
                </li>
                <li>
                    <!-- 날짜 다시 시도해보기 -->
                    <h1 id="todayDate">
                        <script>
                            date = new Date();
                            year = date.getFullYear();
                            month = date.getMonth() + 1;
                            day = date.getDate();
                            document.getElementById("current_date").innerHTML = month + "/" + day + "/" + year;
                        </script>
                    </h1>
                    <img id="weatherIcon" alt="날씨 아이콘" />
                    <p id="weatherInfo">날씨 아이콘 및 기온</p>                    
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
        const apiKey = '013b6110a9dbb3bc5899f78a4b364602'; // 본인의 API 키
        const lat = 37.5553; // 서울역의 위도
        const lon = 126.9707; // 서울역의 경도

        async function getWeather() {
            try {
                const response = await fetch(`https://thingproxy.freeboard.io/fetch/https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`);
                if (!response.ok) {
                    throw new Error('날씨 정보를 가져올 수 없습니다.');
                }
                const data = await response.json();
                const temperature = data.main.temp;
                const icon = data.weather[0].icon;

                document.getElementById('weatherInfo').innerText = `온도: ${temperature}°C`;
                document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                document.getElementById('weatherIcon').style.display = 'inline';
            } catch (error) {
                console.error("날씨 정보 가져오기 오류:", error);
                document.getElementById('weatherInfo').innerText = '날씨 정보를 가져오는 데 오류가 발생했습니다.';
            }
        }

        function displayTodayDate() {
            const today = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
            const formattedDate = today.toLocaleDateString('ko-KR', options);
            document.getElementById('todayDate').innerText = formattedDate;
        }

        window.onload = () => {
            displayTodayDate();
            getWeather();
        };
    </script>
</body>
