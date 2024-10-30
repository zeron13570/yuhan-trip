<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Like from "../../../img/like.png";
    import noLike from "../../../img/notLike.png";

    let postId; 
    let postDetail = {
        images: [],
        content: "",
        likes: 0,
        likedBy: []
    };
    let username = localStorage.getItem('username') || ""; // 사용자 이름 가져오기

    $: postId = $page.params.id;

    onMount(async () => {
        try {
            const res = await fetch(`http://localhost:3000/get-post/${postId}`);
            if (res.ok) {
                postDetail = await res.json();
                console.log(postDetail);
            } else {
                console.error("Failed to load post details");
            }
        } catch (error) {
            console.error("Error loading post details:", error);
        }
    });

    function toggleLike() {
        if (!postDetail.likedBy) postDetail.likedBy = [];
        
        const userIndex = postDetail.likedBy.indexOf(username);
        if (userIndex === -1) {
            postDetail.likes++;
            postDetail.likedBy.push(username);
        } else {
            postDetail.likes--;
            postDetail.likedBy.splice(userIndex, 1);
        }

        // 서버에 업데이트된 포스트 데이터를 전송
        fetch(`http://localhost:3000/update-post/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postDetail),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => {
                throw new Error(`Failed to update post: ${response.status} - ${err}`);
                });
            }
            console.log('Post updated successfully');
        })
        .catch(error => {
            console.error('Error updating post:', error);
        });

        // 로컬 스토리지 업데이트 (선택 사항)
        localStorage.setItem("posts", JSON.stringify([postDetail]));
    }
</script>

<section class="travelLogD">
    <h1>{postDetail.title || 'Loading...'}</h1>
    <ul>
        <li>{postDetail.region || 'Unknown'}</li>
        <li>{postDetail.username || 'Anonymous'}</li>
    </ul>
    <div class="blogContent">
        {@html postDetail.content || '<p>No content available.</p>'}
    </div>
    <div class="like blogLike">
        <span>
            <img src={postDetail.likedBy.includes(username) ? Like : noLike} 
                 alt="좋아요" class="like-icon" on:click={toggleLike}>
                 {postDetail.likes || 0}<!-- 좋아요 수 표시 -->
        </span>
    </div>
</section>
