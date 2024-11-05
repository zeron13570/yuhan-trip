<script>
    import { onMount } from "svelte";

    let city = "";
    let currentPage = 1;
    const itemsPerPage = 10;

    let category = "cafe"; // 기본 카테고리
    let allCafes = [];
    let currentCafes = [];
    let totalPages = 0;

    function updateCafes() {
        const start = (currentPage - 1) * itemsPerPage;
        currentCafes = allCafes.slice(start, start + itemsPerPage);
        totalPages = Math.ceil(allCafes.length / itemsPerPage);
    }

    function changePage(page) {
        if (page < 1 || page > totalPages) return; // 유효성 검사
        currentPage = page;
        updateCafes();
    }

    // 서버에서 데이터를 가져오는 함수
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/${category}`);
        if (!response.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
        const data = await response.json();
  
        // 주소에 지역명이 포함된 데이터만 필터링
        allCafes = data.filter(
            (place) => place.address && place.address.includes(city));
        updateCafes(); // 페이지 데이터 업데이트
      } catch (error) {
        console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
      }
    };
  
    onMount(() => {
      const params = new URLSearchParams(window.location.search);
      city = params.get("name"); // URL에서 지역명 가져오기, 기본값은 서울
      fetchPlaces(); // 데이터 가져오기
    });
</script>

<body>
    <div class="PlacePage">
        <h1>{city} 카페</h1>
        <ul>
            {#each currentCafes as cafe}
                <a href="" target="_blank">
                    <li>
                        <p>{cafe.name}</p>
                        {cafe.address}
                    </li>
                </a>
            {/each}
        </ul>
        <div class="pagination">
            <button class={currentPage > 1 ? '' : 'hidden'} on:click={() => changePage(currentPage - 1)}>&lt;</button>
            <p>{currentPage}/{totalPages}</p>
            <button class={currentPage * itemsPerPage < allCafes.length ? '' : 'hidden'} on:click={() => changePage(currentPage + 1)}>&gt;</button>
        </div> 
        <button class="button">전체목록보기</button> 
    </div>
</body>
