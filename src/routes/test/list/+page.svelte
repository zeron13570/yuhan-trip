<svelte:head>
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=c6876a5497297dc029c4d55c6e2da7bd&libraries=services"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';

  let places = [];  // 장소 리스트
  let filter = '';  // 도시 필터
  let category = 'place';  // 기본 카테고리
  let map;  // 전역으로 사용할 지도 변수
  const cities = ["서울", "부산", "제주", "강릉", "군산", "경주", "인천", "수원", "포항", "울산", "대구", "전주"];
  const categories = ["place", "cafe", "food", "lodgment"];  // 카테고리 목록

  let markers = {};  // 마커 저장 객체
  let bounds;  // 모든 마커의 위치를 포함하는 경계 객체

  // DB에서 장소 데이터를 가져오는 함수
  const fetchPlaces = async () => {
    try {
      console.log(`Fetching data for category: ${category}`);
      const response = await fetch(`http://localhost:8080/api/${category}`);
      if (!response.ok) {
        throw new Error('네트워크 응답에 문제가 있습니다.');
      }
      const data = await response.json();
      places = data;  // 받아온 데이터로 `places`를 설정
    } catch (error) {
      console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  };

  // category 변경 시 데이터를 가져오는 반응성 구문
  $: if (category) {
    fetchPlaces();  // category가 변경될 때마다 fetchPlaces 호출
  }

  // 지도를 초기화하고 생성하는 함수
  onMount(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.9780), // 초기 지도 위치를 서울로 설정
      level: 7
    };
    map = new kakao.maps.Map(container, options);
    bounds = new kakao.maps.LatLngBounds();  // LatLngBounds 객체 초기화
  });

  // 마커 추가 함수: 마커가 추가될 때 지도의 중심을 해당 위치로 이동
  const addMarker = (place) => {
    if (!markers[place.id]) {
      const position = new kakao.maps.LatLng(place.latitude, place.longitude);
      const marker = new kakao.maps.Marker({
        position,
        map
      });
      markers[place.id] = marker;

      // 지도 경계(bounds)에 새로운 마커 위치를 추가
      bounds.extend(position);
      map.setBounds(bounds);  // 모든 마커가 보이도록 지도 경계 조정
      console.log(`마커 추가: ${place.name} 및 경계 조정`);
    }
  };

  // 마커 제거 함수
  const removeMarker = (place) => {
    if (markers[place.id]) {
      markers[place.id].setMap(null);  // 마커를 지도에서 제거
      delete markers[place.id];  // markers 객체에서 삭제
      console.log(`마커 제거: ${place.name}`);

      // 새로운 bounds 객체 생성 및 모든 남은 마커의 경계 다시 설정
      bounds = new kakao.maps.LatLngBounds();  // 새로운 경계 객체 초기화
      for (let id in markers) {
        if (markers[id]) {
          bounds.extend(markers[id].getPosition());  // 남은 마커의 위치를 경계에 추가
        }
      }
      map.setBounds(bounds);  // 새로운 경계로 지도 설정
    }
  };

  // 마커 추가/제거 토글 함수
  const toggleMarker = (place) => {
    if (markers[place.id]) {
      removeMarker(place);  // 이미 마커가 있으면 제거
    } else {
      addMarker(place);  // 마커가 없으면 추가하고 지도 이동
    }
  };
</script>

<style>
  .container {
    display: flex;  /* 좌우 배치 */
  }
  .left-panel {
    width: 30%;  /* 왼쪽 패널 너비 */
    padding: 20px;
    border-right: 1px solid #ddd;
  }
  .right-panel {
    width: 70%;  /* 오른쪽 패널 너비 */
    height: 100vh;  /* 오른쪽 패널의 높이 */
  }
  h1 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  select {
    margin-right: 16px;
    padding: 5px;
    margin-bottom: 16px;
  }
  ul {
    list-style-type: none;
    padding: 0;
    height: 70vh;  /* 목록의 높이를 설정하여 스크롤 가능 */
    overflow-y: auto;
  }
  li {
    padding: 8px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;  /* 마우스 포인터 추가 */
  }
  li:hover {
    background-color: #f0f0f0;  /* 항목 hover 효과 */
  }
  #map {
    width: 70%;  /* 지도의 너비를 부모 컨테이너에 맞춤 */
    height: 70%;  /* 지도의 높이를 부모 컨테이너에 맞춤 */
  }
</style>

<div class="container">
  <div class="left-panel">
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
        <li on:click={() => toggleMarker(place)}>{place.name} - {place.address}</li>
      {/each}
    </ul>
  </div>

  <div class="right-panel">
    <!-- 지도 표시 영역 -->
    <div id="map"></div>
  </div>
</div>
