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
    let userId = localStorage.getItem('userId') || ""; // 로그인된 사용자 ID 가져오기
    let popularPosts = [];
    
    let currentPage = 1;
    const postsPerPage = 16;

    // 페이지 수 계산
    $: totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    onMount(() => {
        if (!window.Kakao) {
            const script = document.createElement("script");
            script.src = "https://developers.kakao.com/sdk/js/kakao.js";
            script.onload = () => {
                Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7');
                if (Kakao.Auth.getAccessToken()) {
                    getUserInfo();
                }
            };
            document.head.appendChild(script);
        } else if (Kakao.isInitialized()) {
            if (Kakao.Auth.getAccessToken()) {
                getUserInfo();
            }
        }

        fetchPosts();
    });

    function kakaoLogin() {
    if (!Kakao.isInitialized()) {
        Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7');
    }

    Kakao.Auth.login({
        success: function(authObj) {
            console.log("Kakao login successful:", authObj);
            isLoggedIn = true;
            localStorage.setItem("accessToken", authObj.access_token);
            getUserInfo(); // 로그인 성공 후 사용자 정보 가져오기
        },
        fail: function(error) {
            console.error("Kakao login failed:", error);
        }
    });
}


    function getUserInfo() {
        Kakao.API.request({
            url: '/v2/user/me',
            success: function(response) {
                isLoggedIn = true;
                userName = response.kakao_account.profile.nickname;
                userId = response.id;  // userId 추가
                localStorage.setItem("userId", userId);  // userId를 localStorage에 저장
                localStorage.setItem("accessToken", Kakao.Auth.getAccessToken()); 
            },
            fail: function(error) {
                console.error('Error fetching user info:', error);
            }
        });
    }
    
    function fetchPosts() {
        const accessToken = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        fetch(`http://localhost:3000/get-posts?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            posts = data;
            applyRegionFilterFromQuery();  // 지역 필터 함수 호출
            sortPostsByLikesAndDate();
        })
        .catch(error => console.error('Error fetching posts:', error));
    }

    function applyRegionFilterFromQuery() {
        if (selectedRegion === "전체 지역") {
            filteredPosts = posts;
        } else {
            filteredPosts = posts.filter(post => post.region === selectedRegion);
        }
    }

    function sortPostsByLikesAndDate() {
        posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        popularPosts = posts.slice(0, 4);  // 상위 4개의 인기 포스트만 추천 블로그에 표시
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function filterPosts() {
        filteredPosts = selectedRegion === "전체 지역" 
            ? posts 
            : posts.filter(post => post.region.trim() === selectedRegion.trim());
    }

    function selectRegion(region) {
        selectedRegion = region;
        filterPosts();
        currentPage = 1; // 페이지를 초기화
    }

    function handlePostButtonClick() {
        if (!isLoggedIn || !userId) {
        kakaoLogin();  // 로그인 처리 함수
        } else {
            goto('/travelLogPosting');
        }
    }

    function toggleLike(postId) {
        if (!isLoggedIn || !userId) {
            return kakaoLogin(); // 로그인 창을 표시
        }

    const accessToken = localStorage.getItem("accessToken");

    fetch(`http://localhost:3000/get-post/${postId}/like`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId })  // 서버로 userId 전송
    })
    .then(response => response.json())
    .then(data => {
        // 서버에서 반환된 data에서 likedBy와 likes 업데이트
        const postIndex = posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
            posts[postIndex].likes = data.likes;
            posts[postIndex].likedBy = data.likedBy;  // likedBy 배열 업데이트
        }

        // 최신 블로그 (filteredPosts) 업데이트
        filterPosts();

        // 추천 블로그 (popularPosts)도 업데이트
        sortPostsByLikesAndDate();  // 좋아요 순으로 정렬 후, 인기 포스트 재설정
    })
    .catch(error => console.error('좋아요 토글 오류:', error));
}

    // 페이지 이동 함수
    function changePage(page) {
        currentPage = page;
    }

    $: paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
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
                            <img src={post.likedBy && post.likedBy.includes(userId) ? Like : noLike} 
                                alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)} />
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
            {#each paginatedPosts as post}
                <li>
                    <a href={`/travelLogDetail/${post.id}`} sveltekit:prefetch>
                        <img src={`http://localhost:3000${post.image}`} alt="여행지 사진" />
                        <p>{post.title}</p>
                    </a>                    
                    <div class="like">
                        <span>작성자: {post.username}</span>
                        <span>
                            <img src={post.likedBy && post.likedBy.includes(userId) ? Like : noLike} 
                                alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)} />
                        </span>
                        <span>{post.likes || 0}</span>
                    </div>
                </li>
            {/each}
        </ul>            
    </div>

    <div class="pagination">
        {#each Array(totalPages) as _, index}
            <button 
                on:click={() => changePage(index + 1)} 
                class:selected={currentPage === index + 1}>
                {index + 1}
            </button>
        {/each}
    </div>
</body>

<style>
    .pagination button {
        margin: 0 5px;
        padding: 5px 10px;
        cursor: pointer;
    }
    .pagination button.selected {
        font-weight: bold;
    }
    .uList img {
        width: 250px;
        height: 250px;
        object-fit: cover;
    }
    .like-icon {
        max-width: 24px;
        max-height: 24px;
    }
</style>
