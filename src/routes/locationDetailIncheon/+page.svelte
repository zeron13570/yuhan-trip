<script>
    import { onMount } from "svelte"; 
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";

    let posts = []; // 트래블로그 데이터 저장
    let username = localStorage.getItem('username') || ""; // 로그인된 사용자 이름 가져오기
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
        const city = "Incheon";
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

    // 트래블로그 데이터 가져오기
    onMount(() => {
        const accessToken = localStorage.getItem("accessToken");

        fetch('http://localhost:3000/get-posts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errMsg => {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errMsg}`);
                });
            }
            return response.json();
        })
        .then(data => {
            posts = data; // 서버에서 받은 데이터를 posts에 저장
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });

        recommendedDestinations = getRandomDestinations(4);
        fetchWeather(); // 날씨 정보 가져오기
    });

    function toggleLike(postId) {
        const postIndex = posts.findIndex(post => post.id === postId);
        const post = posts[postIndex];

        if (!post.likedBy) post.likedBy = []; // likedBy 배열 초기화

        const userIndex = post.likedBy.indexOf(username);
        if (userIndex === -1) {
            post.likes++;
            post.likedBy.push(username); // 좋아요 추가
        } else {
            post.likes--;
            post.likedBy.splice(userIndex, 1); // 좋아요 취소
        }

        // Svelte가 반응하도록 posts 배열 다시 할당
        posts = [...posts]; 

        // 서버에 업데이트된 포스트 데이터 전송
        fetch(`http://localhost:3000/update-post/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(post), // 업데이트된 포스트 데이터
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update post');
            }
            console.log('Post updated successfully');
        })
        .catch(error => {
            console.error('Error updating post:', error);
        });
    }
</script>
<body>
    <div class="locationDetail">
        <nav class="selectList">
            <ul>
                <li><a href="../Place?name=인천">명소</a></li>
                <li><a href="../Food?name=인천">음식점</a></li>
                <li><a href="../Cafe?name=인천">카페</a></li>  
                <li><a href="https://www.yanolja.com/search/인천" target="_blank">호텔</a></li>
                <li><a href="https://search-travel.interpark.com/search?q=인천" target="_blank">투어&티켓</a></li>
            </ul>
        </nav>

        <div class="localDescription">
            <ul>
                <li>
                    <h1>인천</h1>
                    <p>
                        인천광역시는 대한민국 북서부에 있는 광역시이다. 서쪽으로 서해, 동쪽으로 서울특별시 강서구,
                        경기도 부천시, <br> 남동쪽으로 시흥시, 북쪽으로 김포시와 접한다. 인천항과 인천국제공항을 
                        중심으로 제조업과 물류와 산업이 발달하였다. <br>시청 소재지는 남동구 구월동이고, 행정 구역은 8구 2군이다.
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
                    <a href="../travelLog?region=인천"><button>더보기</button></a>    
                </li>
                {#each posts.filter(post => post.region === "인천").slice(0, 4) as post}
                    <li>
                        <a href={`/travelLogDetail/${post.id}`}>
                            <img src={`http://localhost:3000${post.image}`} alt="여행지 사진"/>
                            <p>{post.title}</p>
                        </a>
                        <div class="like">
                            <span>작성자: {post.username}</span>
                            <span>
                                <img src={post.likedBy && post.likedBy.includes(username) ? Like : noLike} 
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
