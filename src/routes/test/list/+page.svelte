<script>
  import { onMount } from 'svelte';
  let places = [];
  let filter = '';
  let category = 'place';
  const cities = ["서울", "부산", "제주", "강릉", "군산", "경주", "인천", "수원", "포항", "울산", "대구", "전주"];
  const categories = ["place", "cafe", "food", "lodgment"];

  // API 호출
  const fetchPlaces = async () => {
    try {
      console.log(`Fetching data for category: ${category}`);
      const response = await fetch(`http://localhost:8080/api/${category}`);
      if (!response.ok) {
        throw new Error('네트워크 응답에 문제가 있습니다.');
      }
      places = await response.json();
    } catch (error) {
      console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  // category가 변경될 때마다 데이터 다시 가져오기
  $: {
    console.log(`Category has changed to: ${category}`);  // 카테고리 변경 확인
    fetchPlaces();
  }
</script>

<style>
  h1 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  select {
    margin-right: 16px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }
</style>

<div>
  <h1>Place List</h1>

  <!-- 카테고리 필터 선택 메뉴 -->
  <div>
    <label>카테고리 선택: </label>
    <select bind:value={category}>
      {#each categories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>
  </div>

  <!-- 도시 필터 선택 메뉴 -->
  <div>
    <label>도시 선택: </label>
    <select bind:value={filter}>
      <option value="">모든 도시</option>
      {#each cities as city}
        <option value={city}>{city}</option>
      {/each}
    </select>
  </div>
  
  <!-- 필터링된 장소 리스트 -->
  <ul>
    {#each places.filter(place => place.name.includes(filter) || place.address.includes(filter)) as place}
      <li>{place.name} - {place.address}</li>
    {/each}
  </ul>
</div>
