<body>
    <div class="choice">
        <h1 class="ask">여행 기간은?</h1>
        <div class="routeContainer">
            <button class="recommendation select" onclick="selectDuration('당일치기')">당일치기</button>
            <button class="recommendation select" onclick="selectDuration('1박 2일')">1박 2일</button>
            <button class="recommendation select" onclick="selectDuration('2박 3일')">2박 3일</button>
        </div>
    </div>

    <script>
        choiceList1 = JSON.parse(localStorage.getItem('choiceList1')) || [];

        console.log(choiceList1); // 배열의 전체 값을 콘솔에 출력

        // 선택된 여행 기간을 저장 및 덮어쓰기
        function selectDuration(duration) {
            let durationNumber;

            switch(duration) {
                case "당일치기":
                    durationNumber = 1;
                    break;
                case "1박 2일":
                    durationNumber = 2;
                    break;
                case "2박 3일":
                    durationNumber = 3;
                    break;
            }

            // 여행 기간 선택이 이미 있는 경우, 그 값을 덮어쓰기
            if (choiceList1.length > 1) {
                choiceList1[1] = durationNumber; // 배열의 두 번째 값 덮어쓰기
            } else {
                choiceList1.push(durationNumber); // 아직 값이 없으면 추가
            }

            localStorage.setItem('choiceList1', JSON.stringify(choiceList1));
            localStorage.setItem('selectedDuration', duration);
            window.location.href = '../routeChoice3';
        }
    </script>

</body>
