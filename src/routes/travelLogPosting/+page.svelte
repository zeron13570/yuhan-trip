<body>
    <div class="travelLogP posting">
        <h1>트래블로그 포스팅하기</h1>
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
        <p>제목</p>
        <input type="text" placeholder="멋진 제목을 지어보아요">
        <div class="editor" contenteditable="true" placeholder="여행에서 있던 일을 공유해주세요~!"></div>
        <input type="file" accept="image/*" multiple id="file-input" class="upload-btn" onchange="loadFile(this)">    
        <a href="#" class="posting" onclick="submitPost()">포스팅</a>
    </div>
    <script>
        function loadFile(input) {
            const editor = document.querySelector('.editor');

            for (const file of input.files) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    editor.appendChild(img); // 이미지 삽입
                };
                reader.readAsDataURL(file);
            }
        }

        function submitPost() {
            const content = document.querySelector('.editor').innerHTML;
            console.log(content); // 포스트 내용을 콘솔에 출력
            alert('포스팅 완료!'); // 단순한 피드백
            // 여기서 포스트 내용을 서버로 전송하는 로직을 추가할 수 있습니다.
        }
    </script>   
</body>

