<script>
    import { onMount } from "svelte";
  
    let city = ""; // 주소에서 가져온 지역 값
    let currentPage = 1;
    const itemsPerPage = 10;
    
    let category = "food"; // 기본 카테고리
    let allFoods = []; // 모든 데이터 저장
    let currentFoods = [];
    let totalPages = 0;
  
    // 페이지별로 장소 목록을 업데이트하는 함수
    function updateFoods() {
      const start = (currentPage - 1) * itemsPerPage;
      currentFoods = allFoods.slice(start, start + itemsPerPage);
      totalPages = Math.ceil(allFoods.length / itemsPerPage);
    }
  
    function changePage(page) {
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      updateFoods();
    }
  
    // 서버에서 데이터를 가져오는 함수
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/${category}`);
        if (!response.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
        const data = await response.json();
  
        // 주소에 지역명이 포함된 데이터만 필터링
        allFoods = data.filter(
            (place) => place.address && place.address.includes(city));
        updateFoods(); // 페이지 데이터 업데이트
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
      <h1>{city} 음식점</h1>
      <ul>
        {#each currentFoods as Food}
          <a href="" target="_blank">
            <li>
              <p>{Food.name}</p>
              {Food.address}
            </li>
          </a>
        {/each}
      </ul>
      <div class="pagination">
        <button
          class={currentPage > 1 ? "" : "hidden"}
          on:click={() => changePage(currentPage - 1)}>&lt;</button
        >
        <p>{currentPage}/{totalPages}</p>
        <button
          class={currentPage < totalPages ? "" : "hidden"}
          on:click={() => changePage(currentPage + 1)}>&gt;</button
        >
      </div>
    </div>
  </body>
  