<script>
    import Like from "../img/like.png"
    import noLike from "../img/notLike.png"
</script>
<header>
    <div></div>
    <span>
        <input type="text" placeholder="여행지, 명소 등 검색">
        <a href=""><button></button></a>
    </span>
</header>
 <!-- section 시작 -->
 <section class="index">
    <div class="PopularTravel">
        <h2>인기 여행지</h2>
        <ul>
            <li><a href="../locationDetail"><span>서울</span></a></li>
            <li><a href="../locationDetail"><span>부산</span></a></li>
            <li><a href="../locationDetail"><span>제주</span></a></li>
            <li><a href="../locationDetail"><span>강릉</span></a></li>
        </ul>
        <ul>
            <li><a href="../locationDetail"><span>군산</span></a></li>
            <li><a href="../locationDetail"><span>경주</span></a></li>
            <li><a href="../locationDetail"><span>인천</span></a></li>
            <li><a href="../locationDetail"><span>수원</span></a></li>
        </ul>
        <ul>
            <li><a href="../locationDetail"><span>포항</span></a></li>
            <li><a href="../locationDetail"><span>울산</span></a></li>
            <li><a href="../locationDetail"><span>대구</span></a></li>
            <li><a href="../locationDetail"><span>전주</span></a></li>
        </ul>
    </div>
    <div class="TravelLog uList">
        <h2>트래블로그</h2>
        <ul>
            <li><a href="">
                <img src="https://placehold.co/200x200" alt="여행지 사진">
                <p>본문 제목</p>
                <div class="like">
                    <span>작성자</span><span><img src={Like} alt="좋아요"></span>
                </div>
            </a></li>
            <li><a href="">
                <img src="https://placehold.co/200x200" alt="여행지 사진">
                <p>본문 제목</p>
                <div class="like">
                    <span>작성자</span><span><img src={Like} alt="좋아요"></span>
                </div>
            </a></li>
            <li><a href="">
                <img src="https://placehold.co/200x200" alt="여행지 사진">
                <p>본문 제목</p>
                <div class="like">
                    <span>작성자</span><span><img src={noLike} alt="좋아요"></span>
                </div>
            </a></li>
        </ul>
        <ul>
            <li><a href="">
                <img src="https://placehold.co/200x200" alt="여행지 사진">
                <p>본문 제목</p>
                <div class="like">
                    <span>작성자</span><span><img src={Like} alt="좋아요"></span>
                </div>
            </a></li>
            <li><a href="">
                <img src="https://placehold.co/200x200" alt="여행지 사진">
                <p>본문 제목</p>
                <div class="like">
                    <span>작성자</span><span><img src={noLike} alt="좋아요"></span>
                </div>
            </a></li>
            <li><a href="">
                <img src="https://placehold.co/200x200" alt="여행지 사진">
                <p>본문 제목</p>
                <div class="like">
                    <span>작성자</span><span><img src={Like} alt="좋아요"></span>
                </div>
            </a></li>
        </ul>
        <a href="/travelLog" class="indexBtn">트래블로그 더 보기</a>
    </div>
    <div class="TripMoment uList">
        <!-- 슬라이드 없이 게시물 자체만 뿌릴 것 -->
        <h2>트립 모먼트</h2>
        <ul>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span><span><img src={noLike} alt="좋아요"></span>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span><span><img src={noLike} alt="좋아요"></span>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span><span><img src={noLike} alt="좋아요"></span>
                    </div>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="https://placehold.co/200x200" alt="여행지 사진">
                    <p>작성자</p>
                    <div class="like">
                        <span>지역명</span><span><img src={Like} alt="좋아요"></span>
                    </div>
                </a>
            </li>
        </ul>
        <a href="/tripMoment" class="indexBtn">트립 모먼트 더 보기</a>
    </div>
</section>

