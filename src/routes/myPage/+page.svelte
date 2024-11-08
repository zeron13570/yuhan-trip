<script>
    import { onMount } from "svelte";
    import Like from "../../img/like.png";
    import noLike from "../../img/notLike.png";
    let posts = [];
    let myLikedPosts = [];
    let username = "";
    let userId = "";
    let isLoggedIn = false;

    const API_URL = "http://localhost:3000"; // 서버 URL

    // 초기화 및 로그인 상태 확인
    onMount(() => {
        const storedUsername = localStorage.getItem("username");
        const storedUserId = localStorage.getItem("userId"); // 사용자 ID 저장 여부 확인

        if (storedUsername && storedUserId) {
            username = storedUsername;
            userId = storedUserId;
            isLoggedIn = true;
            loadPosts();  // 게시물 로드
            loadLikedPosts();  // 내가 좋아요를 누른 글 로드
        } else {
            isLoggedIn = false;
            username = '';
            userId = '';
            posts = [];
            myLikedPosts = [];
        }
    });

    function loadPosts() {
        fetch(`http://localhost:3000/get-posts`)
            .then(response => response.json())
            .then(data => {
                posts = data;
            })
            .catch(err => console.error('Error loading posts:', err));
    }

    function loadLikedPosts() {
        if (userId) {
            fetch(`http://localhost:3000/liked-posts/${userId}`)
                .then(response => response.json())
                .then(data => {
                    myLikedPosts = data;
                })
                .catch(err => console.error('Error loading liked posts:', err));
        }
    }

    // 좋아요 토글 기능
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
                // 로컬 게시물 리스트 업데이트
                posts = posts.map(post => post.id === updatedPost.id ? updatedPost : post);
                loadLikedPosts();  // 내가 좋아요를 누른 글 목록 갱신
            })
            .catch(err => console.error('Error toggling like:', err));
    }

    // 로그아웃
    function kakaoLogout() {
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        username = "";
        userId = "";
        posts = [];
        myLikedPosts = [];
        isLoggedIn = false;
        alert('로그아웃 되었습니다.');
    }

    // 로그인 후 사용자 정보 업데이트
    function kakaoLogin() {
        // 카카오 로그인 구현 부분 (Kakao SDK 이용)
        const nickname = "user1";  // 예시, 실제로는 카카오 API에서 닉네임을 받아옵니다.
        const userIdFromKakao = "user1_id";  // 카카오로부터 받아온 사용자 ID
        localStorage.setItem("username", nickname);
        localStorage.setItem("userId", userIdFromKakao);
        username = nickname;
        userId = userIdFromKakao;
        isLoggedIn = true;
        loadPosts();
        loadLikedPosts();
    }
</script>

<body>
    <section class="myPage">
        {#if isLoggedIn}
            <div class="userID"><span class="userID"></span>{username}님, 환영합니다!</div>

            <h2>내가 좋아요를 누른 글</h2>
            {#if myLikedPosts.length > 0}
            <div class="uList">
                <ul>
                    {#each myLikedPosts as post}
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
