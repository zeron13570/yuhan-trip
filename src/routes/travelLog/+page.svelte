<script>
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let posts = [];
    let selectedRegion = "전체 지역";
    let filteredPosts = [];
    let isLoggedIn = false;
    let userName = "";
    let popularPosts = [];

    onMount(() => {
        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = () => {
            Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7');
            if (Kakao.Auth.getAccessToken()) {
                getUserInfo();
            }
        };
        document.head.appendChild(script);

        const accessToken = localStorage.getItem("accessToken");

        fetch('http://localhost:3000/get-posts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            posts = data;
            applyRegionFilterFromQuery();
            sortPostsByLikes();
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    });

    function applyRegionFilterFromQuery() {
        // URL에서 region 파라미터를 가져와 필터링
        const urlParams = new URLSearchParams(window.location.search);
        const region = urlParams.get("region");
        selectedRegion = region || "전체 지역"; // 쿼리 값이 없으면 기본값은 "전체 지역"
        filterPosts();
    }

    function filterPosts() {
        filteredPosts = selectedRegion === "전체 지역" 
            ? posts 
            : posts.filter(post => post.region.trim() === selectedRegion.trim());
    }

    function selectRegion(region) {
        selectedRegion = region;
        filterPosts();
    }

    function kakaoLogin() {
        Kakao.Auth.login({
            success: function(authObj) {
                getUserInfo();
            },
            fail: function(err) {
                console.error('로그인 실패', err);
            }
        });
    }

    function getUserInfo() {
        Kakao.API.request({
            url: '/v2/user/me',
            success: function(response) {
                isLoggedIn = true;
                userName = response.kakao_account.profile.nickname;
                localStorage.setItem("accessToken", Kakao.Auth.getAccessToken()); // Access Token 저장
            },
            fail: function(error) {
                console.error('Error fetching user info:', error);
            }
        });
    }

    function handlePostButtonClick() {
        console.log("Post button clicked.");
        if (!isLoggedIn) {
            kakaoLogin();
        } else {
            goto('/travelLogPosting');
        }
    }

    function toggleLike(postId) {
        const accessToken = localStorage.getItem("accessToken");
        fetch(`http://localhost:3000/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
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
                posts[postIndex].likes = data.likes; // 서버로부터 받은 좋아요 수
                posts[postIndex].likedBy = data.likedBy; // 좋아요를 누른 사용자 목록
                filterPosts(); // 필터링 업데이트
            }
        })
        .catch(error => {
            console.error('Error toggling like:', error);
        });
    }

    function sortPostsByLikes() {
        posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
</script>

<body>
    <div class="travelLog trip">
        <h1>트래블로그</h1>
        <div class="header">
            <div class="dropBtn">
                <button class="dropbtn">{selectedRegion} <span class="arrow">▼</span></button>
                <div class="dropdown-content">
                    <a href="#" on:click={() => selectRegion("전체 지역")}>전체 지역</a>
                    <a href="#" on:click={() => selectRegion("서울")}>서울</a>
                    <a href="#" on:click={() => selectRegion("부산")}>부산</a>
                    <a href="#" on:click={() => selectRegion("제주")}>제주</a>
                    <a href="#" on:click={() => selectRegion("전주")}>전주</a>
                    <a href="#" on:click={() => selectRegion("포항")}>포항</a>
                    <a href="#" on:click={() => selectRegion("울산")}>울산</a>
                    <a href="#" on:click={() => selectRegion("수원")}>수원</a>
                    <a href="#" on:click={() => selectRegion("대구")}>대구</a>
                    <a href="#" on:click={() => selectRegion("군산")}>군산</a>
                    <a href="#" on:click={() => selectRegion("인천")}>인천</a>
                    <a href="#" on:click={() => selectRegion("경주")}>경주</a>
                    <a href="#" on:click={() => selectRegion("강릉")}>강릉</a>
                </div>
            </div>
            <a class="posting" on:click={handlePostButtonClick}>포스팅</a>
        </div>

        <h1>추천 블로그</h1>
        <div class="uList">
            <ul>
                {#each popularPosts as post}
                <li>
                    <a href={`/travelLogDetail/${post.id}`} sveltekit:prefetch>
                        <img src={`http://localhost:3000${post.image}`} alt="여행지 사진" />
                        <p>{post.title}</p>
                    </a>
                    <div class="like">
                        <span>작성자: {post.username}</span>
                        <span>
                            <img src={post.likedBy && post.likedBy.includes(userName) ? Like : noLike} 
                                alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)}>
                        </span>
                        <span>{post.likes || 0}</span>
                    </div>
                </li>
                {/each}
            </ul>            
        </div>

        <h1>최신 블로그</h1>
        <div class="uList">
            <ul>
                {#each filteredPosts as post}
                <li>
                    <a href={`/travelLogDetail/${post.id}`} aria-label={`자세히 보기: ${post.title}`}>
                        <img src={`http://localhost:3000${post.image}`} alt="여행지 사진" />
                        <p>{post.title}</p>
                    </a>
                    <div class="like">
                        <span>작성자: {post.username}</span>
                        <span>
                            <img src={post.likedBy && post.likedBy.includes(userName) ? Like : noLike} 
                                 alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)}>
                        </span>
                        <span>{post.likes || 0}</span>
                    </div>
                </li>
                {/each}
            </ul>            
        </div>
    </div>
</body>

<style>
    .post-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .post-list li {
        width: calc(25% - 10px); /* 한 줄에 4개 표시, 여유 공간을 위해 조정 */
        margin-bottom: 20px; /* 아래쪽 여백 */
    }
    .uList img {
        width: 200px; /* 게시물 이미지 크기 */
        height: 200px; /* 게시물 이미지 크기 */
        object-fit: cover; /* 이미지를 잘라서 비율 유지 */
    }

    .like-icon {
        width: auto; /* 좋아요 이미지 크기 유지 */
        height: auto; /* 좋아요 이미지 크기 유지 */
        max-width: 24px; /* 필요 시 최대 너비 지정 */
        max-height: 24px; /* 필요 시 최대 높이 지정 */
    }
</style>
