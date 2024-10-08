<script>
    import "../../css/import.css"
    import Logo from "../../img/Logo.png"
    import LogoW from "../../img/LogoBlack.png"
    import Map from "../../img/map.png"
</script>
<body>
    <div class="choice">
        <h1 class="ask">선호하는 여행 스타일은?</h1>
        <div class="routeContainer routeStyle">
            <button class="recommendation select" onclick="selectStyle('빽빽한 일정')">빽빽한 일정</button>
            <button class="recommendation select" onclick="selectStyle('여유로운 일정')">여유로운 일정</button>
        </div>
    </div>


    <script>
        choiceList1 = JSON.parse(localStorage.getItem('choiceList1')) || [];

        console.log(choiceList1); // 배열의 전체 값을 콘솔에 출력

        function selectStyle(style) {
            let styleNumber;

            switch(style) {
                case "빽빽한 일정":
                    styleNumber = 1;
                    break;
                case "여유로운 일정":
                    styleNumber = 2;
                    break;
            }

            // 여행 기간 선택이 이미 있는 경우, 그 값을 덮어쓰기
            if (choiceList1.length > 3) {
                choiceList1[3] = styleNumber; // 배열의 두 번째 값 덮어쓰기
            } else {
                choiceList1.push(styleNumber); // 아직 값이 없으면 추가
            }

            localStorage.setItem('choiceList1', JSON.stringify(choiceList1));
            localStorage.setItem('selectedStyle', style);
            window.location.href = '../routeResult';
        }
    </script>
</body>
