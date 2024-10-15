<script>
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";
    import { onMount } from "svelte";

    let posts = [];  // 포스팅 리스트
    let selectedRegion = "전체 지역";  // 선택한 지역 (기본: 전체)
    let isLoggedIn = false; // 사용자 로그인 상태 가정
    let username = ""; // 로그인된 사용자 이름
    let popularPosts = [];  // 인기 포스트 (좋아요 순으로 정렬된 목록)

    // 로컬 스토리지에서 포스팅 데이터 불러오기
    onMount(() => {
        let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        posts = storedPosts;
        sortPostsByLikes();  // 최초 로드 시 좋아요 순으로 정렬
    });

    // 좋아요 기능
    function toggleLike(postId) {
        const postIndex = posts.findIndex(post => post.id === postId);
        const post = posts[postIndex];

        if (!post.likedBy) post.likedBy = [];  // 처음에 likedBy 배열이 없으면 초기화

        // 이미 좋아요한 사용자라면 좋아요 취소
        const userIndex = post.likedBy.indexOf(username);
        if (userIndex === -1) {
            post.likes++;
            post.likedBy.push(username);  // 좋아요한 사용자 추가
        } else {
            post.likes--;
            post.likedBy.splice(userIndex, 1);  // 좋아요 취소
        }

        // 로컬 스토리지 업데이트
        localStorage.setItem("posts", JSON.stringify(posts));
        sortPostsByLikes();  // 좋아요 순으로 정렬
    }

    // 좋아요 수에 따라 인기 블로그 상단 정렬
    function sortPostsByLikes() {
        popularPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 6); // 상위 6개 포스트만 저장
    }

    // 지역 선택
    function selectRegion(region) {
        selectedRegion = region;
    }

    // 선택한 지역에 따라 포스팅 필터링
    function filterPostsByRegion() {
        if (selectedRegion === "전체 지역") {
            return posts;
        } else {
            return posts.filter(post => post.region === selectedRegion);
        }
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
                    <a href="#" on:click={() => selectRegion("강릉")}>강릉</a>
                    <a href="#" on:click={() => selectRegion("군산")}>군산</a>
                    <a href="#" on:click={() => selectRegion("경주")}>경주</a>
                    <a href="#" on:click={() => selectRegion("인천")}>인천</a>
                    <a href="#" on:click={() => selectRegion("수원")}>수원</a>
                    <a href="#" on:click={() => selectRegion("포항")}>포항</a>
                    <a href="#" on:click={() => selectRegion("울산")}>울산</a>
                    <a href="#" on:click={() => selectRegion("대구")}>대구</a>
                    <a href="#" on:click={() => selectRegion("전주")}>전주</a>
                </div>
            </div>
            <h1>추천 블로그</h1>
            <a href="/travelLogPosting" class="posting">포스팅</a>
        </div>
        <div class="uList">
            <ul>
                {#each popularPosts as post}
                <li>
                    <a href={`/travelLogDetail/${post.id}`}>
                        <img src={post.image} alt="여행지 사진">
                        <p>{post.title}</p>
                    </a>
                    <div class="like">
                        <span>작성자: {post.username}</span>
                        <span>
                            <img src={post.likedBy && post.likedBy.includes(username) ? Like : noLike} 
                                 alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)}>
                        </span>
                        <span>{post.likes} Likes</span>
                    </div>
                </li>
                {/each}
            </ul>
        </div>

        <h1>최신 블로그</h1>
        <div class="uList">
            <ul>
                {#each filterPostsByRegion() as post}
                <li>
                    <a href={`/travelLogDetail/${post.id}`}>
                        <img src={post.image} alt="여행지 사진">
                        <p>{post.title}</p>
                        <div class="like">
                            <span>작성자: {post.username}</span>
                            <span>
                                <img src={post.likedBy && post.likedBy.includes(username) ? Like : noLike} 
                                     alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)}>
                            </span>
                            <span>{post.likes} Likes</span>
                        </div>
                    </a>
                </li>
                {/each}
            </ul>
        </div>
    </div>
</body>
