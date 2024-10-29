<script>
    import "../../css/import.css"
    import Logo from "../../img/Logo.png"
    import LogoW from "../../img/LogoBlack.png"
    import Map from "../../img/map.png"
</script>
<body>
    <div class="choice">
        <h1 class="ask">누구와 떠나시나요?</h1>
        <div class="routeContainer">
            <button class="recommendation select" onclick="selectCompanion('혼자')" >혼자</button>
            <button class="recommendation select" onclick="selectCompanion('연인과')">연인과</button>
            <button class="recommendation select" onclick="selectCompanion('친구와')">친구와</button>
            <button class="recommendation select" onclick="selectCompanion('부모님과')">부모님과</button>
            <button class="recommendation select" onclick="selectCompanion('아이와')">아이와</button>
            <button class="recommendation select" onclick="selectCompanion('기타')">기타</button>
        </div>
    </div>


    <script>
        choiceList1 = JSON.parse(localStorage.getItem('choiceList1')) || [];

        console.log(choiceList1); // 배열의 전체 값을 콘솔에 출력

        // 선택된 여행 기간을 저장 및 덮어쓰기
        function selectCompanion(companion) {
            let companionNumber;

            switch(companion) {
                case "혼자":
                    companionNumber = 1;
                    break;
                case "연인과":
                    companionNumber = 2;
                    break;
                case "친구와":
                    companionNumber = 2;
                    break;
                case "부모님과":
                    companionNumber = 3;
                    break;
                case "아이와":
                    companionNumber = 4;
                    break;
                case "기타":
                    companionNumber = 5;
                    break;
            }

            // 여행 기간 선택이 이미 있는 경우, 그 값을 덮어쓰기
            if (choiceList1.length > 2) {
                choiceList1[2] = companionNumber; // 배열의 두 번째 값 덮어쓰기
            } else {
                choiceList1.push(companionNumber); // 아직 값이 없으면 추가
            }

            localStorage.setItem('choiceList1', JSON.stringify(choiceList1));
            localStorage.setItem('selectedCompanion', companion);
            window.location.href = '../routeChoice4';
        }
    </script>
</body>
