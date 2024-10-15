<script>
    import { onMount } from "svelte";

    let post = null;  // 선택된 포스트 데이터
    let postId = null;  // URL에서 가져온 포스트 ID
    let isLiked = false;  // 현재 사용자가 좋아요를 눌렀는지 여부
    let username = localStorage.getItem("username");  // 로그인한 사용자 이름
    let showPostDetails = false;  // 포스트 내용 표시 여부

    // 게시글 가져오기 로직
    onMount(() => {
        const url = new URL(window.location.href);
        postId = url.pathname.split("/").pop();  // URL의 마지막 부분이 postId

        // 확인을 위한 콘솔 출력
        console.log("URL에서 가져온 postId:", postId);

        // 로컬 스토리지에서 해당 postId의 글 데이터 불러오기
        let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        post = storedPosts.find(p => p.id.toString() === postId); // postId를 문자열로 변환하여 비교

        if (post && post.likedBy) {
            isLiked = post.likedBy.includes(username);
        }

        // 확인을 위한 콘솔 출력
        console.log("Found Post:", post);
    });

    // 좋아요 토글 기능
    function toggleLike() {
        if (!post) return;

        if (!post.likedBy) post.likedBy = [];

        if (isLiked) {
            // 좋아요 취소
            post.likes--;
            post.likedBy = post.likedBy.filter(user => user !== username);
        } else {
            // 좋아요 추가
            post.likes++;
            post.likedBy.push(username);
        }

        // 로컬 스토리지 업데이트
        let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        const postIndex = storedPosts.findIndex(p => p.id === postId);
        storedPosts[postIndex] = post;
        localStorage.setItem("posts", JSON.stringify(storedPosts));

        // 좋아요 상태 업데이트
        isLiked = !isLiked;
    }

    // 포스트 내용 보기 토글
    function togglePostDetails() {
        showPostDetails = !showPostDetails;  // 현재 상태를 반전
    }
</script>

<!-- 글 세부 정보 화면 -->
<section class="travelLogD">
    {#if post}
        <h1>{post.title}</h1>
        <ul>
            <li>{post.region}</li>
            <li>{post.username}</li>
        </ul>
        <button on:click={togglePostDetails}>{showPostDetails ? '내용 숨기기' : '내용 보기'}</button>

        {#if showPostDetails}
            <div class="blogContent">
                <p>{@html post.content}</p> <!-- HTML로 저장된 글 내용 표시 -->
            </div>
            <div class="like blogLike">
                <span>
                    <img src={isLiked ? 'liked.png' : 'not_liked.png'} alt="좋아요" on:click={toggleLike}>
                </span>
                <span>{post.likes} Likes</span>
            </div>
        {/if}
    {:else}
        <p>글을 찾을 수 없습니다.</p>
    {/if}
</section>
