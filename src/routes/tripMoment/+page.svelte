<body>
    <div class="tripMoment trip">
        <h1>트립모먼트</h1>
        <div class="header">
            <div class="dropBtn">
                <button class="dropbtn" id="selected-region">지역 <span class="arrow">&#9662;</span></button>
                <div class="dropdown-content">
                    <a href="#" onclick="selectRegion('서울')">서울</a>
                    <a href="#" onclick="selectRegion('부산')">부산</a>
                    <a href="#" onclick="selectRegion('제주')">제주</a>
                    <a href="#" onclick="selectRegion('강릉')">강릉</a>
                    <a href="#" onclick="selectRegion('군산')">군산</a>
                    <a href="#" onclick="selectRegion('경주')">경주</a>
                    <a href="#" onclick="selectRegion('인천')">인천</a>
                    <a href="#" onclick="selectRegion('수원')">수원</a>
                    <a href="#" onclick="selectRegion('포항')">포항</a>
                    <a href="#" onclick="selectRegion('울산')">울산</a>
                    <a href="#" onclick="selectRegion('대구')">대구</a>
                    <a href="#" onclick="selectRegion('전주')">전주</a>
                </div>
            </div>
            <h1>인기 모먼트</h1> 
            <a href="/momentPosting" class="posting">포스팅</a>
        </div>
        
        <div class="uList">
            <ul> 
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <span>지역명</span><span><img src="" alt="좋아요"></span>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <span>지역명</span><span><img src="" alt="좋아요"></span>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <span>지역명</span><span><img src="" alt="좋아요"></span>
                    </a>
                </li>
            </ul>
        </div>
        <h1>최신 모먼트</h1>
        <div class="uList">
            <ul> 
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <span>지역명</span><span><img src="" alt="좋아요"></span>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <span>지역명</span><span><img src="" alt="좋아요"></span>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <span>지역명</span><span><img src="" alt="좋아요"></span>
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <span>지역명</span><span><img src="" alt="좋아요"></span>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <span>지역명</span><span><img src="" alt="좋아요"></span>
                    </a>
                </li>
                <li>
                    <a href="">
                        <img src="https://placehold.co/200x200" alt="여행지 사진">
                        <p>작성자</p>
                        <span>지역명</span><span><img src="" alt="좋아요"></span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    
    <script>
        function selectRegion(region) {
            const button = document.getElementById('selected-region');
            button.textContent = region; // 선택한 지역 이름으로 버튼 텍스트 업데이트
            button.appendChild(document.createElement('span')).innerHTML = ' <span class="arrow">&#9662;</span>'; // 화살표 추가
        }
    </script>
</body>
