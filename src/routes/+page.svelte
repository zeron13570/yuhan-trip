<script>
    import "../css/import.css"
    import Logo from "../img/Logo.png"
    import LogoW from "../img/LogoBlack.png"
</script>
<header>
    <nav>
        <ul>
            <li><h1><a href=""><img src={Logo} alt="Logo"></a></h1></li>
            <li><a href="">호텔</a></li>
            <li><a href="">투어&티켓</a></li>
            <li><a href="">기차표</a></li>            
            <li><a href="">로그인</a></li>
            <li><a href="">고객센터</a></li>
        </ul>
    </nav>
    <div></div>
    <span>
        <input type="text" placeholder="여행지, 명소 등 검색">
        <a href=""><button></button></a>
    </span>
    <!-- 버튼에 돋보기 아이콘 백그라운드로 추가 예정 -->
</header>
 <!-- section 시작 -->
 <section>
    <div class="PopularTravel">
        <h2>인기 여행지</h2>
        <ul>
            <li><a href=""><span>서울</span></a></li>
            <li><a href=""><span>부산</span></a></li>
            <li><a href=""><span>제주</span></a></li>
            <li><a href=""><span>강릉</span></a></li>
        </ul>
        <ul>
            <li><a href=""><span>군산</span></a></li>
            <li><a href=""><span>경주</span></a></li>
            <li><a href=""><span>인천</span></a></li>
            <li><a href=""><span>수원</span></a></li>
        </ul>
        <ul>
            <li><a href=""><span>포항</span></a></li>
            <li><a href=""><span>울산</span></a></li>
            <li><a href=""><span>대구</span></a></li>
            <li><a href=""><span>전주</span></a></li>
        </ul>
    </div>
    <div class="TravelLog uList">
        <h2>트래블로그</h2>
        <ul>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
        </ul>
        <ul>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
        </ul>
        <a href="">트래블로그 더 보기</a>
    </div>
    <div class="TripMoment uList">
        <!-- 슬라이드 없이 게시물 자체만 뿌릴 것 -->
        <h2>트립 모먼트</h2> <input type="button"  value="포스팅하러 가기">
        <ul>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
            <li>
                <a href="">
                    <img src="" alt="여행지 사진">
                    <p>본문 제목</p>
                    <span>작성자</span><span><img src="" alt="좋아요"></span>
                </a>
            </li>
        </ul>
        <a href="">트립 모먼트 더 보기</a>
    </div>
</section>

<!-- footer 시작 -->
<footer>
    <div class="footer">
        <div>
            <h3>프로젝트 소개</h3>
            <p>유한대 졸업 작품</p>
        </div>
        <div>
            <h3>찾아오는 길</h3>
            <!-- 아이콘 백그라운드 이미지로 뿌림 -->
            <address> 
                <p>14780) 경기도 부천시 경인로 590 (괴안동 185-34)</p>
                <a href="tel:+820226100768">(+82) 02 - 2610 - 0768</a>    
            </address>
        </div>
        <div>
            <h2><a href=""><img src={LogoW} alt="Logo"></a></h2>
            <ul>
                <li><a href="https://www.instagram.com/"></a></li>
                <li><a href="https://www.youtube.com/?app=desktop&hl=ko&gl=KR"></a></li>
                <li><a href="https://www.facebook.com/?locale=ko_KR"></a></li>
                <li><a href="https://www.google.co.kr/?hl=ko"></a></li>
                <li><a href="https://x.com/?lang=ko"></a></li>
            </ul>
        </div>
        <p>All contents Copyright ⓒ Yuhan University.</p>
    </div>
</footer>