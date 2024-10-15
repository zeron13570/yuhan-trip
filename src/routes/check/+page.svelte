<script>
    import { onMount } from "svelte";

    let posts = [];  // 저장된 포스팅 리스트

    onMount(() => {
        // 로컬 스토리지에서 포스팅 데이터 불러오기
        let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        posts = storedPosts;

        // 콘솔에 저장된 포스팅 데이터 출력 (내용 포함)
        console.log("로컬 스토리지에 저장된 포스팅:", posts);
    });
</script>

<body>
    <h1>로컬 스토리지 포스팅 확인</h1>
    <ul>
        {#each posts as post}
            <li>
                <h3>ID: {post.id !== undefined ? post.id : 'ID가 없습니다.'}</h3>  <!-- ID가 undefined일 경우 메시지 표시 -->
                <h3>제목: {post.title}</h3>
                <p>작성자: {post.username}</p>
                <p>지역: {post.region}</p>
                <p>작성일: {new Date(post.date).toLocaleString()}</p>
                <div>
                    <!-- 포스팅 내용 표시 -->
                    <p>{@html post.content}</p>
                </div>
            </li>
        {/each}
    </ul>
    <button on:click={() => localStorage.removeItem('posts')}>
        포스팅 기록 삭제
    </button>
</body>
