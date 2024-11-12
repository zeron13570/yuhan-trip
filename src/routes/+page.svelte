<script>
    import Like from "../img/like.png";
    import noLike from "../img/notLike.png";
    import { onMount } from "svelte";

    let posts = []; // 트래블로그 데이터 저장
    let isLoggedIn = false;
    let userName = "";
    let userId = ""; // 사용자 ID 초기화

    onMount(() => {
        if (typeof window !== 'undefined') {
            userId = localStorage.getItem('userId') || ""; // 로그인된 사용자 ID 가져오기

            fetch('http://localhost:3000/get-posts', {
                method: 'GET',
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
        }
    });

    function kakaoLogin() {
        if (typeof window !== 'undefined') {
            Kakao.Auth.login({
                success: function(authObj) {
                    getUserInfo();
                },
                fail: function(err) {
                    console.error('로그인 실패', err);
                }
            });
        }
    }

    function getUserInfo() {
        if (typeof window !== 'undefined') {
            Kakao.API.request({
                url: '/v2/user/me',
                success: function(response) {
                    isLoggedIn = true;
                    userName = response.kakao_account.profile.nickname;
                    userId = response.id; // 사용자 고유 ID
                    localStorage.setItem("userId", userId); // 사용자 ID 저장
                    localStorage.setItem("accessToken", Kakao.Auth.getAccessToken());
                },
                fail: function(error) {
                    console.error('Error fetching user info:', error);
                }
            });
        }
    }

    function toggleLike(postId) {
        if (!isLoggedIn || !userId) {
            return kakaoLogin(); // 로그인 창을 표시
        }

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("Access token not found. Please log in.");
            return; // 토큰이 없으면 아무 것도 하지 않음
        }

        fetch(`http://localhost:3000/get-post/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 좋아요 상태 업데이트
            const postIndex = posts.findIndex(post => post.id === postId);
            if (postIndex !== -1) {
                posts[postIndex] = {...posts[postIndex], likes: data.likes, likedBy: data.likedBy};
                posts = [...posts]; // 배열을 새로 할당하여 UI를 강제로 갱신
            }
        })
        .catch(error => {
            console.error('Error toggling like:', error);
        });
    }
</script>

<header>
    <div></div>
</header>
<!-- section 시작 -->
<section class="index">
    <div class="PopularTravel">
        <h2>인기 여행지</h2>
        <ul>
            <li><a href="../locationDetailSeoul" class="Seoul"><span>서울</span></a></li>
            <li><a href="../locationDetailBusan" class="Busan"><span>부산</span></a></li>
            <li><a href="../locationDetailJeju" class="Jeju"><span>제주</span></a></li>
            <li><a href="../locationDetailGangneung" class="Gangneung"><span>강릉</span></a></li>
        </ul>
        <ul>
            <li><a href="../locationDetailGunsan" class="Gunsan"><span>군산</span></a></li>
            <li><a href="../locationDetailGyeongju" class="Gyeongju"><span>경주</span></a></li>
            <li><a href="../locationDetailIncheon" class="Incheon"><span>인천</span></a></li>
            <li><a href="../locationDetailSuwon" class="Suwon"><span>수원</span></a></li>
        </ul>
        <ul>
            <li><a href="../locationDetailPohang" class="Pohang"><span>포항</span></a></li>
            <li><a href="../locationDetailUlsan" class="Ulsan"><span>울산</span></a></li>
            <li><a href="../locationDetailDaegu" class="Daegu"><span>대구</span></a></li>
            <li><a href="../locationDetailJeonju" class="Jeonju"><span>전주</span></a></li>
        </ul>
    </div>
    <div class="TravelLog uList">
        <h2>트래블로그</h2>
        <ul>
            {#each posts.slice(0, 6) as post}  <!-- 처음 6개만 선택 -->
            <li>
                <a href={`/travelLogDetail/${post.id}`}>
                    <img src={`http://localhost:3000${post.image}`} alt="여행지 사진" />
                    <p>{post.title}</p>
                </a>
                    <div class="like">
                        <span>작성자: {post.username}</span>
                        <span>
                            <img src={post.likedBy && post.likedBy.includes(userId) ? Like : noLike} 
                                alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)}>
                        </span>
                        <span>{post.likes || 0}</span> <!-- 좋아요 수 추가 -->
                    </div>
            </li>
            {/each}
        </ul>
        <a href="/travelLog" class="indexBtn">트래블로그 더 보기</a>
    </div>
    <!-- <div class="TripMoment uList">
        <h2>트립 모먼트</h2>
        <ul>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span>
                        <span><img src={noLike} alt="좋아요" class="like-icon" data-liked="false"></span>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span>
                        <span><img src={noLike} alt="좋아요" class="like-icon" data-liked="false"></span>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span> 
                        <span><img src={noLike} alt="좋아요" class="like-icon" data-liked="false"></span>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span>
                        <span><img src={Like} alt="좋아요" class="like-icon" data-liked="true"></span>
                    </div>
                </a>
            </li>
        </ul>
        <a href="/tripMoment" class="indexBtn">트립 모먼트 더 보기</a>
    </div> -->
</section>
<style>
.TravelLog ul {
    display: flex;
    flex-wrap: wrap;
    gap: 16px; /* 아이템 간격 */
    justify-content: space-between; /* 여유 공간을 양쪽으로 나누어 배치 */
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.TravelLog ul li {
    width: calc(25% - 16px); /* 한 줄에 4개씩 배치 */
    margin-bottom: 20px;
}

/* 두 줄까지만 4개씩 고정 */
.TravelLog ul li:nth-child(n+9) {
    display: none; /* 8개까지만 표시 */
}

.uList img {
    width: 100%; /* 이미지 가로 크기 맞춤 */
    height: 200px; /* 이미지 높이 고정 */
    object-fit: cover;
}

.like-icon {
    width: auto; /* 좋아요 이미지 크기 유지 */
    height: auto; /* 좋아요 이미지 크기 유지 */
    max-width: 24px; /* 필요 시 최대 너비 지정 */
    max-height: 24px; /* 필요 시 최대 높이 지정 */
}
</style>
