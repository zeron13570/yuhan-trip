<script>
    import { onMount } from "svelte";
    let posts = [];
    let username = "";
    let myPosts = [];
    let isLoggedIn = false;
    let userName = "";

    // 카카오 SDK 초기화 및 사용자 로그인 여부 확인
    onMount(() => {
        const script = document.createElement("script");
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = () => {
            Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7');
            console.log(Kakao.isInitialized());

            if (Kakao.Auth.getAccessToken()) {
                getUserInfo();  // 사용자 정보 가져오기
            }

            // 로컬 스토리지에서 포스트 불러오기
            username = localStorage.getItem("username") || "";
            let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
            posts = storedPosts;
            myPosts = posts.filter(post => post.username === username);  // 사용자 작성 글만 필터링
        };
        document.head.appendChild(script);
    });

    // 사용자 정보 가져오기
    function getUserInfo() {
        Kakao.API.request({
            url: '/v2/user/me',
            success: function (response) {
                isLoggedIn = true;
                userName = response.kakao_account.profile.nickname;
                localStorage.setItem("username", userName);  // 로컬 스토리지에 저장
            },
            fail: function (error) {
                console.error(error);
            }
        });
    }

    // 카카오 로그인
    function kakaoLogin() {
        Kakao.Auth.login({
            success: function (authObj) {
                console.log(authObj);
                getUserInfo();  // 로그인 성공 후 사용자 정보 가져오기
            },
            fail: function (err) {
                console.error(err);
                alert('로그인 실패');
            }
        });
    }

    // 글 삭제 기능
    function deletePost(postId) {
        let updatedPosts = posts.filter(post => post.id !== postId);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        myPosts = updatedPosts.filter(post => post.username === username);  // 내 글 리스트 갱신
    }

    // 좋아요 토글 기능
    function toggleLike(postId) {
        let post = posts.find(p => p.id === postId);
        if (!post.likedBy) post.likedBy = [];

        if (post.likedBy.includes(username)) {
            post.likes--;
            post.likedBy = post.likedBy.filter(user => user !== username);
        } else {
            post.likes++;
            post.likedBy.push(username);
        }

        localStorage.setItem("posts", JSON.stringify(posts));
        myPosts = posts.filter(post => post.username === username);  // 내 글 리스트 갱신
    }

    // 카카오 로그아웃
    function kakaoLogout() {
        Kakao.Auth.logout(() => {
            isLoggedIn = false;
            userName = '';
            alert('로그아웃 되었습니다.');
        });
    }
</script>

<body>
    <section class="myPage">
        {#if isLoggedIn}
            <div class="userID"><span class="userID"></span>{userName}님, 환영합니다!</div>
            {#if myPosts.length > 0}
                <h2>내가 작성한 글</h2>
                <ul>
                    {#each myPosts as post}
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
                                <button on:click={() => deletePost(post.id)}>삭제</button>
                            </div>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>작성한 글이 없습니다.</p>
            {/if}
        {:else}
            <h2>로그인 후 이용해주세요</h2>
            <button on:click={kakaoLogin}>카카오 로그인</button>
        {/if}
    </section>
</body>
