<script>
    import { onMount } from "svelte";

    let post = null;
    let isLiked = false;
    let username = localStorage.getItem("username");

    export let params;  // URL 파라미터로부터 id 값 받기

    onMount(() => {
        const postId = params.id;  // URL에서 id 가져오기

        // 로컬 스토리지에서 포스트 불러오기
        let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        post = storedPosts.find(p => p.id.toString() === postId);

        if (post && post.likedBy) {
            isLiked = post.likedBy.includes(username);
        }

        console.log("Post ID:", postId);
        console.log("Found Post:", post);
    });
</script>

<section>
    {#if post}
        <h1>{post.title}</h1>
        <p>작성자: {post.username}</p>
        <p>작성일: {new Date(post.date).toLocaleString()}</p>
        <div>{@html post.content}</div>
    {:else}
        <p>포스트를 찾을 수 없습니다.</p>
    {/if}
</section>
