<body>
    <div class="travelLogP posting">
        <h1>트래블로그 포스팅하기</h1>

        <div class="postingOption">  
            <span>사진 업로드</span>

            <div class="imgSelect">
                <form class="inputImg" method="post" enctype="multipart/form-data">
                    <input type="file" accept="image/*" multiple id="file-input" onchange="loadFile(this)">    
                    <label for="file-input">파일 선택</label>
                    <div class="addImage" id="image-show"></div> <!-- 이미지 미리보기 위치 -->
                </form>
                <div class="dropBtn">
                    <button class="dropbtn">지역 <span class="arrow">&#9662;</span></button> 
                    <div class="dropdown-content">
                        <a href="#">서울</a>
                        <a href="#">부산</a>
                        <a href="#">제주</a>
                        <a href="#">강릉</a>
                        <a href="#">군산</a>
                        <a href="#">경주</a>
                        <a href="#">인천</a>
                        <a href="#">수원</a>
                        <a href="#">포항</a>
                        <a href="#">울산</a>
                        <a href="#">대구</a>
                        <a href="#">전주</a>
                    </div>
                </div>
            </div>
            <div>
                <p>제목</p>
                <input type="text" placeholder="멋진 제목을 입력해 보아요~!">
                <p>여행 스토리</p>
                <input type="text" placeholder="여행에서 있었던 일을 공유해 주세요!">
            </div>
            <a class="posting">포스팅</a>
        </div>
    </div>

    <script>
        function loadFile(input) {
            const imageShow = document.getElementById('image-show');
            const currentCount = imageShow.children.length;

            if (currentCount >= 10) {
                alert('최대 10개의 이미지만 업로드할 수 있습니다.'); // 경고 메시지
                return;
            }

            for (const file of input.files) {
                if (imageShow.children.length < 10) { // 최대 개수 체크
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '150px'; // 원하는 너비 설정
                        img.style.height = '150px'; // 원하는 높이 설정
                        img.style.objectFit = 'cover'; // 이미지 비율 유지
                        img.style.borderRadius = '5px'; // 모서리 둥글게 설정
                        imageShow.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            }
             // 줄바꿈 로직 추가
             if (imageShow.children.length > 5) {
                imageShow.style.flexWrap = 'wrap';
            } else {
                imageShow.style.flexWrap = 'nowrap';
            }
        }
    </script>   
</body>
