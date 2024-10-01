<body>
    <div class="travelLogP posting">
        <h1>트립모먼트 포스팅하기</h1>

        <div class="postingOption">  
            <span>사진 업로드</span>

            <div class="imgSelect">
                <form class="inputImg" method="post" enctype="multipart/form-data">
                    <input type="file" accept="image/*" multiple id="file-input" onchange="loadFile(this)">    
                    <label for="file-input">파일 선택</label>
                    <div class="addImage" id="image-show"></div> <!-- 이미지 미리보기 위치 -->
                </form>
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
            </div>
            <a href="#" class="posting"  onclick="submitPost()">포스팅</a>
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

        function selectRegion(region) {
            const button = document.getElementById('selected-region');
            button.textContent = region; // 선택한 지역 이름으로 버튼 텍스트 업데이트
            button.appendChild(document.createElement('span')).innerHTML = ' <span class="arrow">&#9662;</span>'; // 화살표 추가
        }

        function submitPost() {
            const content = document.querySelector('.editor').innerHTML;
            console.log(content); // 포스트 내용을 콘솔에 출력
            alert('포스팅 완료!'); // 단순한 피드백
            // 여기서 포스트 내용을 서버로 전송하는 로직을 추가할 수 있습니다.
        }
    </script>   
</body>
