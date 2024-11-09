<script>
    import { onMount } from "svelte";
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";

    let posts = [];
    let myLikedPosts = [];
    let myPosts = [];
    let username = "";
    let userId = "";
    let isLoggedIn = false;
    let currentMyPosts = [];
    let currentLikedPosts = [];

    let currentPagePosts = 1; // 내가 작성한 글 페이지
    let postsPerPage = 8;
    let currentPageLiked = 1; // 내가 좋아요를 누른 글 페이지
    let likedPostsPerPage = 8;

    const API_URL = "http://localhost:3000"; // 서버 URL

    onMount(() => {
        const storedUsername = localStorage.getItem("username");
        const storedUserId = localStorage.getItem("userId");

        if (storedUsername && storedUserId) {
            username = storedUsername;
            userId = Number(storedUserId); // userId를 숫자로 변환
            isLoggedIn = true;
            loadLikedPosts();
            loadMyPosts();
        } else {
            isLoggedIn = false;
            username = "";
            userId = "";
            posts = [];
            myLikedPosts = [];
            myPosts = [];
        }
    });

    // 내가 작성한 글 로드
    function loadMyPosts() {
        if (userId) {
            fetch(`http://localhost:3000/get-posts-by-user/${userId}`)
                .then(response => response.json())
                .then(data => {
                    myPosts = data.filter(post => Number(post.userId) === userId);
                    paginateMyPosts();  // 내가 작성한 글에 대해 페이지네이션 수행
                })
                .catch(err => console.error('Error loading my posts:', err));
        }
    }

    // 내가 좋아요를 누른 글 로드
    function loadLikedPosts() {
        if (userId) {
            fetch(`http://localhost:3000/liked-posts/${userId}`)
                .then(response => response.json())
                .then(data => {
                    myLikedPosts = data.filter(post => 
                        post.likedBy.some(like => Number(like) === Number(userId)) 
                    );
                    paginateLikedPosts();  // 내가 좋아요를 누른 글에 대해 페이지네이션 수행
                })
                .catch(err => console.error('Error loading liked posts:', err));
        }
    }

    // 내가 작성한 글에 대해 페이지네이션
    function paginateMyPosts() {
        const startIndex = (currentPagePosts - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        currentMyPosts = myPosts.slice(startIndex, endIndex);
    }

    // 내가 좋아요를 누른 글에 대해 페이지네이션
    function paginateLikedPosts() {
        const startIndex = (currentPageLiked - 1) * likedPostsPerPage;
        const endIndex = startIndex + likedPostsPerPage;
        currentLikedPosts = myLikedPosts.slice(startIndex, endIndex);
    }

    // 페이지 변경
    function changePagePosts(page) {
        if (page >= 1 && page <= Math.ceil(myPosts.length / postsPerPage)) {
            currentPagePosts = page;
            paginateMyPosts();
        }
    }

    function changePageLiked(page) {
        if (page >= 1 && page <= Math.ceil(myLikedPosts.length / likedPostsPerPage)) {
            currentPageLiked = page;
            paginateLikedPosts();
        }
    }

    function toggleLike(postId) {
        fetch(`http://localhost:3000/get-post/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postId, userId })
        })
        .then(response => response.json())
        .then(updatedPost => {
            posts = posts.map(post => post.id === updatedPost.id ? updatedPost : post);
            loadLikedPosts();
        })
        .catch(err => console.error('Error toggling like:', err));
    }

    function kakaoLogin() {
        Kakao.Auth.login({
            success: (authObj) => {
                Kakao.API.request({
                    url: '/v2/user/me',
                    success: (res) => {
                        const nickname = res.properties.nickname;
                        const userIdFromKakao = res.id;
                        
                        localStorage.setItem("username", nickname);
                        localStorage.setItem("userId", userIdFromKakao);
                        
                        username = nickname;
                        userId = userIdFromKakao;
                        isLoggedIn = true;
                        loadLikedPosts();
                        loadMyPosts();
                    },
                    fail: (error) => {
                        console.error('카카오 사용자 정보 요청 실패:', error);
                    }
                });
            },
            fail: (error) => {
                console.error('카카오 로그인 실패:', error);
            }
        });
    }
</script>

<body>
    <section class="myPage">
        {#if isLoggedIn}
            <div class="userID"><span class="userID"></span>{username}님, 환영합니다!</div>

            <h2>내가 작성한 글</h2>
            {#if currentMyPosts.length > 0}
            <div class="uList">
                <ul>
                    {#each currentMyPosts as post}
                    <li>
                        <a href={`/travelLogDetail/${post.id}`} sveltekit:prefetch>
                            <img src={`http://localhost:3000${post.image}`} alt="여행지 사진" />
                            <p>{post.title}</p>
                        </a>                    
                        <div class="like">
                            <span>작성자: {post.username}</span>
                            <span>
                                <img src={post.likedBy && post.likedBy.some(id => Number(id) === userId) ? Like : noLike} 
                                    alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)} />
                            </span>
                            <span>{post.likes || 0}</span>
                        </div>
                    </li>
                    {/each}
                </ul>
            </div>
            <div class="pagination">
                <button on:click={() => changePagePosts(currentPagePosts - 1)} disabled={currentPagePosts === 1}>이전</button>
                <button on:click={() => changePagePosts(currentPagePosts + 1)} disabled={currentPagePosts * postsPerPage >= myPosts.length}>다음</button>
            </div>
            {:else}
                <p>작성한 글이 없습니다.</p>
            {/if}

            <h2>내가 좋아요를 누른 글</h2>
            {#if currentLikedPosts.length > 0}
            <div class="uList">
                <ul>
                    {#each currentLikedPosts as post}
                    <li>
                        <a href={`/travelLogDetail/${post.id}`} sveltekit:prefetch>
                            <img src={`http://localhost:3000${post.image}`} alt="여행지 사진" />
                            <p>{post.title}</p>
                        </a>                    
                        <div class="like">
                            <span>작성자: {post.username}</span>
                            <span>
                                <img src={post.likedBy && post.likedBy.some(id => Number(id) === userId) ? Like : noLike} 
                                    alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)} />
                            </span>
                            <span>{post.likes || 0}</span>
                        </div>
                    </li>
                    {/each}
                </ul>
            </div>
            <div class="pagination">
                <button on:click={() => changePageLiked(currentPageLiked - 1)} disabled={currentPageLiked === 1}>이전</button>
                <button on:click={() => changePageLiked(currentPageLiked + 1)} disabled={currentPageLiked * likedPostsPerPage >= myLikedPosts.length}>다음</button>
            </div>
            {:else}
                <p>좋아요를 누른 글이 없습니다.</p>
            {/if}
        {:else}
            <h2>로그인 후 이용해주세요</h2>
            <button on:click={kakaoLogin}>카카오 로그인</button>
        {/if}
    </section>
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
