<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Like from "../../../img/like.png";
    import noLike from "../../../img/notLike.png";

    let postId; 
    let post = {
        username: "",
        images: [],
        content: "",
        likes: 0,
        likedBy: []
    };
    let userName = ""; // 사용자 이름 가져오기
    let isLoggedIn = false;

    // 페이지 매개변수에서 postId 가져오기
    $: postId = $page.params.id;

    onMount(async () => {
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
        try {
            const res = await fetch(`http://localhost:3000/get-post/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (res.ok) {
                post = await res.json();
            } else {
                console.error("Failed to load post details");
            }
        } catch (error) {
            console.error("Error loading post details:", error);
        }
    });

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
                userName = response.kakao_account.profile.nickname; // username을 여기서 설정
                localStorage.setItem("accessToken", Kakao.Auth.getAccessToken());
            },
            fail: function(error) {
                console.error('Error fetching user info:', error);
            }
        });
    }

    function toggleLike() {
        if (!isLoggedIn || !userName) {
            alert("로그인이 필요합니다.");
            return kakaoLogin(); // 로그인 창을 표시
        }

        const accessToken = localStorage.getItem("accessToken");
        // 서버에 업데이트 요청
        fetch(`http://localhost:3000/get-post/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userName }), // userName 사용
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update post: HTTP status: ${response.status}, Message: ${response.statusText}`);
            }
            return response.json(); // JSON 응답을 처리합니다.
        })
        .then(data => {
            // 좋아요 상태 업데이트
            post.likes = data.likes; // 응답에서 업데이트된 좋아요 수
            post.likedBy = data.likedBy; // 응답에서 업데이트된 좋아요를 누른 사용자 목록
        })
        .catch(error => {
            console.error('Error updating post:', error);
            alert("오류가 발생했습니다.");
        });
    }
</script>

<section class="travelLogD">
    <h1>{post.title || 'Loading...'}</h1>
    <ul>
        <li>{post.region || 'Unknown'}</li>
        <li>{post.username || 'Anonymous'}</li>
    </ul>
    <div class="blogContent">
        {@html post.content || '<p>No content available.</p>'}
    </div>
    <div class="like blogLike">
        <span>
            <img src={post.likedBy.includes(userName) ? Like : noLike}
                alt="좋아요" class="like-icon" on:click={toggleLike} />
            {post.likes || 0} <!-- 좋아요 수 표시 -->
        </span>
    </div>
</section>

<style>
    .like-icon {
        cursor: pointer; /* 포인터 커서 추가 */
        width: 24px; /* 좋아요 이미지 크기 */
        height: 24px; /* 좋아요 이미지 크기 */
        transition: transform 0.2s; /* 클릭 효과 */
    }

    .like-icon:hover {
        transform: scale(1.1); /* 호버 시 확대 효과 */
    }
</style>
