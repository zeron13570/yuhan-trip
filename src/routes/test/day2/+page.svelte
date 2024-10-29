<svelte:head>
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=c6876a5497297dc029c4d55c6e2da7bd&libraries=services"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';

  let places = [];
  let filter = '';
  let category = 'place';
  let isClient = false;
  let map;
  let routePolyline;
  let selectedPlaces = [];
  let routeColor = '#FF0000';
  let strokeOpacity = 1;
  let roadInfo = [];
  let markers = {};
  let bounds;

  let searchQuery = ''; // 장소 검색어
  let searchResults = []; // 검색 결과 저장
  let selectedPlaceId = null; // 현재 선택된 장소의 ID

  let currentPage = 1;           // 현재 페이지 번호
  const itemsPerPage = 20;       // 페이지당 아이템 수

  const cities = ["서울", "부산", "제주", "강릉", "군산", "경주", "인천", "수원", "포항", "울산", "대구", "전주"];
  const categories = ["place", "cafe", "food", "lodgment"];

  $: if (category) {
  fetchPlaces();
  }

  // 총 페이지 수 계산
  $: totalPages = Math.ceil(places.length / itemsPerPage);

  const fetchPlaces = async () => {
    if (!isClient) return;
    try {
      console.log(`Fetching data for category: ${category}`);
      const response = await fetch(`http://localhost:8080/api/${category}`);
      if (!response.ok) {
        throw new Error('네트워크 응답에 문제가 있습니다.');
      }
      const data = await response.json();
      places = [...data];
    } catch (error) {
      console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  };
  // 페이지
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      currentPage += 1;
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      currentPage -= 1;
    }
  };

  $: pagedPlaces = places
    .filter(place => place.name.toLowerCase().includes(filter.toLowerCase()))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  onMount(() => {
    isClient = true;
    fetchPlaces();

    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.9780),
      level: 7
    };
    map = new kakao.maps.Map(container, options);
    bounds = new kakao.maps.LatLngBounds();
  });

  const getContrastYIQ = (hexcolor) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  };

  const addMarker = (place) => {
    const position = new kakao.maps.LatLng(place.latitude, place.longitude);
    const index = selectedPlaces.length + 1;

    const textColor = getContrastYIQ(routeColor);

    const content = `
      <div class="label" style="background-color: ${routeColor};">
        <span class="number" style="color: ${textColor};">${index}</span>
      </div>
    `;

    const marker = new kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor: 1,
      map
    });

    markers[place.id] = marker;
    bounds.extend(position);
    map.setBounds(bounds);
  };

  // 마커 업데이트 함수: 경로 색상 변경 시 모든 마커 스타일 업데이트
  const updateMarkers = () => {
    selectedPlaces.forEach((place, idx) => {
      const marker = markers[place.id];
      if (marker) {
        const index = idx + 1;
        const textColor = getContrastYIQ(routeColor);

        const content = `
          <div class="label" style="background-color: ${routeColor};">
            <span class="number" style="color: ${textColor};">${index}</span>
          </div>
        `;

        marker.setContent(content);
      }
    });
  };

  const removeMarker = (place) => {
    if (markers[place.id]) {
      markers[place.id].setMap(null);
      delete markers[place.id];
      selectedPlaces = selectedPlaces.filter(p => p.id !== place.id);
      bounds = new kakao.maps.LatLngBounds();
      for (let id in markers) {
        if (markers[id]) {
          bounds.extend(markers[id].getPosition());
        }
      }
      map.setBounds(bounds);
    }
  };

  const toggleMarker = (place) => {
    if (markers[place.id]) {
      removeMarker(place);
      selectedPlaceId = null; // 선택 해제 시 ID 제거
    } else {
      addMarker(place);
      selectedPlaces = [...selectedPlaces, place];
      selectedPlaceId = place.id; // 선택된 ID 저장
      updateMarkers(); // 마커 추가 후 업데이트
    }
  };

  const drawRoute = (routeData) => {
    if (routePolyline) {
      routePolyline.setMap(null);
    }

    const path = [];
    const routes = routeData.routes;
    if (!routes || routes.length === 0) {
      alert("경로 데이터가 없습니다.");
      return;
    }

    const sections = routes[0].sections;
    roadInfo = []; // 도로 정보 초기화
    sections.forEach(section => {
      section.roads.forEach(road => {
        const vertexes = road.vertexes;
        for (let i = 0; i < vertexes.length; i += 2) {
          const x = vertexes[i];
          const y = vertexes[i + 1];
          path.push(new kakao.maps.LatLng(y, x));
        }
        // 도로 이름과 거리를 roadInfo 배열에 추가
        roadInfo.push(`도로 이름: ${road.name || '알 수 없음'}, 거리: ${road.distance}m`);
      });
    });

    routePolyline = new kakao.maps.Polyline({
      path,
      strokeWeight: 4,
      strokeColor: routeColor,       // 경로 색상 적용
      strokeOpacity: strokeOpacity,  // 경로 투명도 적용
      strokeStyle: 'solid',
    });

    routePolyline.setMap(map);

    const bounds = new kakao.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    map.setBounds(bounds);
  };

  // 반응성 구문을 사용하여 경로 색상 및 투명도 변경 시 마커 업데이트
  $: if (routeColor || strokeOpacity) {
    updateMarkers();
  }

  const findRoute = async () => {
    if (selectedPlaces.length < 2) {
      alert("길찾기를 위해서는 최소 2개의 장소를 선택하세요.");
      return;
    }

    const origin = {
      name: selectedPlaces[0].name,
      x: selectedPlaces[0].longitude.toString(),
      y: selectedPlaces[0].latitude.toString(),
    };

    const destination = {
      name: selectedPlaces[selectedPlaces.length - 1].name,
      x: selectedPlaces[selectedPlaces.length - 1].longitude.toString(),
      y: selectedPlaces[selectedPlaces.length - 1].latitude.toString(),
    };

    const waypoints = selectedPlaces.slice(1, selectedPlaces.length - 1).map(place => ({
      name: place.name,
      x: place.longitude.toString(),
      y: place.latitude.toString(),
    }));

    try {
      const response = await fetch('http://localhost:8080/findRoute2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, waypoints })
      });

      const data = await response.json();
      if (!data.success) {
        alert("경로를 찾을 수 없습니다: " + data.error);
        return;
      }

      drawRoute(data.route);
    } catch (error) {
      alert("경로를 찾을 수 없습니다.");
    }
  };

  const searchPlaces = () => {
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchQuery, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        searchResults = data.map(place => ({
          id: place.id,
          name: place.place_name,
          address: place.address_name,
          latitude: parseFloat(place.y),
          longitude: parseFloat(place.x)
        }));
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };
</script>

<style>
  .container {
    display: flex;
  }
  .left-panel {
    width: 30%;
    padding: 20px;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
  }
  .right-panel {
    width: 60%;
    height: 100vh;
  }
  #map {
    width: 80%;
    height: 80%;
  }
  .selected {
    background-color: #e0e0e0;
    font-weight: bold;
  }
  ul {
    list-style-type: none;
    padding: 0;
    max-height: 200px;
    overflow-y: auto; /* 세로 스크롤 추가 */
  }
  li {
    padding: 8px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  li:hover {
    background-color: #f0f0f0;
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
  .pagination button {
    margin: 0 5px;
    padding: 5px 10px;
  }
  .pagination span {
    margin: 0 5px;
  }
</style>

<div class="container">
  <div class="left-panel">
    <h1>Place List</h1>

    <!-- 카테고리와 도시 선택 UI -->
    <div>
      <label>카테고리: </label>
      <select bind:value={category}>
        {#each categories as cat}
          <option value={cat}>{cat}</option>
        {/each}
      </select>

      <label>도시: </label>
      <select bind:value={filter}>
        <option value="">모든 도시</option>
        {#each cities as city}
          <option value={city}>{city}</option>
        {/each}
      </select>
    </div>

    <!-- 경로 색상 및 투명도 조절 UI -->
    <div>
      <label>경로 색상: </label>
      <input type="color" bind:value={routeColor} /><br>
      <label>경로 투명도: </label>
      <input type="range" min="0" max="1" step="0.1" bind:value={strokeOpacity} />
      <span>{strokeOpacity}</span>
    </div>

    <!-- 장소 검색 UI -->
    <div>
      <label>장소 검색:</label>
      <input type="text" bind:value={searchQuery} placeholder="장소 검색어 입력" />
      <button on:click={searchPlaces}>검색</button>
    </div>

    <!-- 검색된 장소 리스트 -->
    <ul>
      {#each searchResults as result}
        <li class:selected={result.id === selectedPlaceId} on:click={() => toggleMarker(result)}>
          {result.name} - {result.address}
        </li>
      {/each}
    </ul>

    <button class="route-button" on:click={findRoute}>경로 찾기</button>

    <!-- 기존 장소 리스트 -->
    <ul>
      {#each pagedPlaces as place}
    <li class:selected={selectedPlaces.some(p => p.id === place.id)} on:click={() => toggleMarker(place)}>
      {place.name} - {place.address}
        </li>
      {/each}
    </ul>
    <!-- 페이징 컨트롤 -->
    <div class="pagination">
      <button on:click={prevPage} disabled={currentPage === 1}>이전</button>
      <span>{currentPage} / {totalPages}</span>
      <button on:click={nextPage} disabled={currentPage === totalPages}>다음</button>
    </div>
  </div>

  <div class="right-panel">
    <div id="map"></div>
  </div>
  <!-- 도로 정보 표시 영역 -->
  <div class="road-info">
    <h2>도로 정보</h2>
    <ul>
      {#each roadInfo as info}
        <li>{info}</li>
      {/each}
    </ul>
  </div>
</div>
