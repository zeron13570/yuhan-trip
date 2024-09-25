<body>
    <div class="choice">
        <h1 class="ask">어디로 떠나시나요?</h1>
        <div class="routeContainer">
            <button class="recommendation select" onclick="selectLocation('서울')">서울</button>
            <button class="recommendation select" onclick="selectLocation('부산')">부산</button>
            <button class="recommendation select" onclick="selectLocation('제주')">제주</button>
            <button class="recommendation select" onclick="selectLocation('전주')">전주</button>
            <button class="recommendation select" onclick="selectLocation('포항')">포항</button>
            <button class="recommendation select" onclick="selectLocation('울산')">울산</button>
            <button class="recommendation select" onclick="selectLocation('수원')">수원</button>
            <button class="recommendation select" onclick="selectLocation('대구')">대구</button>
            <button class="recommendation select" onclick="selectLocation('군산')">군산</button>
            <button class="recommendation select" onclick="selectLocation('인천')">인천</button>
            <button class="recommendation select" onclick="selectLocation('경주')">경주</button>
            <button class="recommendation select" onclick="selectLocation('강릉')">강릉</button>
        </div>
    </div>

    <script>

        let choiceList1 = JSON.parse(localStorage.getItem('choiceList1')) || [];
        localStorage.setItem('choiceList1', JSON.stringify(choiceList1));

        console.log(choiceList1); // 초기화된 배열을 콘솔에 출력

        function selectLocation(location) {
            let locationNumber;

            switch(location) {
                case "서울":
                    locationNumber = 1;
                    break;
                case "부산":
                    locationNumber = 2;
                    break;
                case "제주":
                    locationNumber = 3;
                    break;
                case "전주":
                    locationNumber = 4;
                    break;
                case "포항":
                    locationNumber = 5;
                    break;
                case "울산":
                    locationNumber = 6;
                    break;
                case "수원":
                    locationNumber = 7;
                    break;
                case "대구":
                    locationNumber = 8;
                    break;
                case "군산":
                    locationNumber = 9;
                    break;
                case "인천":
                    locationNumber = 10;
                    break;
                case "경주":
                    locationNumber = 11;
                    break;
                case "강릉":
                    locationNumber = 12;
                    break;
            }

            // 여행 기간 선택이 이미 있는 경우, 그 값을 덮어쓰기
            if (choiceList1.length > 0) {
                choiceList1[0] = locationNumber; // 배열의 두 번째 값 덮어쓰기
            } else {
                choiceList1.push(locationNumber); // 아직 값이 없으면 추가
            }

            localStorage.setItem('choiceList1', JSON.stringify(choiceList1));
            
            localStorage.setItem('selectedLocation', location);
            window.location.href = '../routeChoice2';
        }
    </script>

</body>