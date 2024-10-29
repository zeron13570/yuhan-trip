<script>
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";
    import { onMount } from "svelte";

    let posts = [];
    let selectedRegion = "전체 지역";
    let username = localStorage.getItem('username') || "";
    let popularPosts = [];

    function sortPostsByLikes() {
        popularPosts = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6);
    }

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
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            posts = data;
            sortPostsByLikes();
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    });

    function toggleLike(postId) {
        const postIndex = posts.findIndex(post => post.id === postId);
        const post = posts[postIndex];

        if (!post.likedBy) post.likedBy = [];
        const userIndex = post.likedBy.indexOf(username);
        if (userIndex === -1) {
            post.likes++;
            post.likedBy.push(username);
        } else {
            post.likes--;
            post.likedBy.splice(userIndex, 1);
        }

        localStorage.setItem("posts", JSON.stringify(posts));
        sortPostsByLikes();
    }

    function selectRegion(region) {
        selectedRegion = region;
    }

    function filterPostsByRegion() {
        if (!posts || posts.length === 0) {
            return [];
        }
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
            <a href="/travelLogPosting" class="posting">포스팅</a>
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
                            <img src={post.likedBy && post.likedBy.includes(username) ? Like : noLike} 
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
                {#each filterPostsByRegion() as post}
                <li>
                    <a href={`/travelLogDetail/${post.id}`} aria-label={`자세히 보기: ${post.title}`}>
                        <img src={`http://localhost:3000${post.image}`} alt="여행지 사진" />
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
    </div>
</body>
