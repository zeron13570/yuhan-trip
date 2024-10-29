<script>
    import Like from "../img/like.png";
    import noLike from "../img/notLike.png";
    import { onMount } from "svelte";

    let posts = []; // 트래블로그 데이터 저장
    let username = localStorage.getItem('username') || ""; // 로그인된 사용자 이름 가져오기

    // 로컬 스토리지에서 포스팅 데이터 불러오기
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
                return response.text().then(errMsg => {
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errMsg}`);
                });
            }
            return response.json();
        })
        .then(data => {
            posts = data; // 서버에서 받은 데이터를 posts에 저장
        })
        .catch(error => {
            console.error('Error fetching posts:', error);  // 오류 처리
        });
    });

    function toggleLike(postId) {
    const postIndex = posts.findIndex(post => post.id === postId);
    const post = posts[postIndex];

    if (!post.likedBy) post.likedBy = [];  // 처음에 likedBy 배열이 없으면 초기화

    // 이미 좋아요한 사용자라면 좋아요 취소
    const userIndex = post.likedBy.indexOf(username);
    if (userIndex === -1) {
        post.likes++;
        post.likedBy.push(username);  // 좋아요한 사용자 추가
    } else {
        post.likes--;
        post.likedBy.splice(userIndex, 1);  // 좋아요 취소
    }


    // 서버에 업데이트된 포스트 데이터를 전송
    fetch(`http://localhost:3000/update-post/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),  // 업데이트된 포스트 데이터
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update post');
        }
        console.log('Post updated successfully');
    })
    .catch(error => {
        console.error('Error updating post:', error);
    });

    // 로컬 스토리지 업데이트
    localStorage.setItem("posts", JSON.stringify(posts)); // 업데이트된 포스트 저장
}

</script>

<header>
    <div></div>
</header>
<!-- section 시작 -->
<section class="index">
    <div class="PopularTravel">
        <h2>인기 여행지</h2>
        <ul>
            <li><a href="../locationDetailSeoul" class="Seoul"><span>서울</span></a></li>
            <li><a href="../locationDetailBusan" class="Busan"><span>부산</span></a></li>
            <li><a href="../locationDetailJeju" class="Jeju"><span>제주</span></a></li>
            <li><a href="../locationDetailGangneung" class="Gangneung"><span>강릉</span></a></li>
        </ul>
        <ul>
            <li><a href="../locationDetailGunsan" class="Gunsan"><span>군산</span></a></li>
            <li><a href="../locationDetailGyeongju" class="Gyeongju"><span>경주</span></a></li>
            <li><a href="../locationDetailIncheon" class="Incheon"><span>인천</span></a></li>
            <li><a href="../locationDetailSuwon" class="Suwon"><span>수원</span></a></li>
        </ul>
        <ul>
            <li><a href="../locationDetailPohang" class="Pohang"><span>포항</span></a></li>
            <li><a href="../locationDetailUlsan" class="Ulsan"><span>울산</span></a></li>
            <li><a href="../locationDetailDaegu" class="Daegu"><span>대구</span></a></li>
            <li><a href="../locationDetailJeonju" class="Jeonju"><span>전주</span></a></li>
        </ul>
    </div>
    <div class="TravelLog uList">
        <h2>트래블로그</h2>
        <ul>
            {#each posts.slice(0, 6) as post}  <!-- 처음 6개만 선택 -->
            <li>
                <a href={`/travelLogDetail/${post.id}`}>
                    <img src={`http://localhost:3000${post.image}`} alt="여행지 사진" />
                    <p>{post.title}</p>
                </a>
                    <div class="like">
                        <span>작성자: {post.username}</span>
                        <span>
                            <img src={post.likedBy && post.likedBy.includes(username) ? Like : noLike} 
                                alt="좋아요" class="like-icon" on:click={() => toggleLike(post.id)}>
                        </span>
                        <span>{post.likes || 0}</span> <!-- 좋아요 수 추가 -->
                    </div>
            </li>
            {/each}
        </ul>
        <a href="/travelLog" class="indexBtn">트래블로그 더 보기</a>
    </div>
    <!-- <div class="TripMoment uList">
        <h2>트립 모먼트</h2>
        <ul>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span>
                        <span><img src={noLike} alt="좋아요" class="like-icon" data-liked="false"></span>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span>
                        <span><img src={noLike} alt="좋아요" class="like-icon" data-liked="false"></span>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span> 
                        <span><img src={noLike} alt="좋아요" class="like-icon" data-liked="false"></span>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span>
                        <span><img src={Like} alt="좋아요" class="like-icon" data-liked="true"></span>
                    </div>
                </a>
            </li>
        </ul>
        <a href="/tripMoment" class="indexBtn">트립 모먼트 더 보기</a>
    </div> -->
</section>