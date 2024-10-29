<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Like from "../../../img/like.png";
    import noLike from "../../../img/notLike.png";

    let postId; 
    let postDetail = {
        images: [],
        content: ""
    };

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
        <span><img src={noLike} alt="좋아요" /></span>
    </div>
</section>
