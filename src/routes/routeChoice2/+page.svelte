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
        function selectDuration(duration) {
            localStorage.setItem('selectedDuration', duration);
            window.location.href = '../routeChoice3';
        }
    </script>
</body>
