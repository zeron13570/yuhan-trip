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

  const cities = ["서울", "부산", "제주", "강릉", "군산", "경주", "인천", "수원", "포항", "울산", "대구", "전주"];
  const categories = ["place", "cafe", "food", "lodgment"];
  let markers = {};
  let bounds;

  // DB에서 장소 데이터를 가져오는 함수
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

  $: if (isClient && category) {
    fetchPlaces();
  }

  const getContrastYIQ = (hexcolor) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  };

  // 숫자마커
  const addMarker = (place) => {
  const position = new kakao.maps.LatLng(place.latitude, place.longitude);

  const index = selectedPlaces.length + 1;

  // 텍스트 색
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
  console.log(`마커 추가: ${place.name} 및 경계 조정`);
};

const updateMarkers = () => {
  selectedPlaces.forEach((place, idx) => {
    const marker = markers[place.id];
    const index = idx + 1;

    // 텍스트 색
    const textColor = getContrastYIQ(routeColor);

    const content = `
      <div class="label" style="background-color: ${routeColor};">
        <span class="number" style="padding: 3px; font-size: 20px; color: ${textColor};">${index}</span>
      </div>
    `;
    marker.setContent(content);
  });
};

$: if (routeColor) {
    updateMarkers();
  }

const removeMarker = (place) => {
  if (markers[place.id]) {
    markers[place.id].setMap(null);
    delete markers[place.id];
    console.log(`마커 제거: ${place.name}`);

    // selectedPlaces에서 제거
    selectedPlaces = selectedPlaces.filter(p => p.id !== place.id);

    // 마커 번호 업데이트
    updateMarkers();

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
  } else {
    // selectedPlaces에 장소 추가
    selectedPlaces = [...selectedPlaces, place];
    addMarker(place);
    // 마커 번호 업데이트
    updateMarkers();
  }
};

  // drawRoute 함수를 먼저 정의합니다.
  const drawRoute = (routeData) => {
    if (routePolyline) {
      routePolyline.setMap(null);
    }

    // 경로 좌표 추출
    const path = [];
    const routes = routeData.routes;
    if (!routes || routes.length === 0) {
      alert("경로 데이터가 없습니다.");
      return;
    }

    const sections = routes[0].sections;
    sections.forEach(section => {
      section.roads.forEach(road => {
        const vertexes = road.vertexes;
        for (let i = 0; i < vertexes.length; i += 2) {
          const x = vertexes[i];
          const y = vertexes[i + 1];
          path.push(new kakao.maps.LatLng(y, x));
        }
      });
    });

    // 경로를 지도에 그림
    routePolyline = new kakao.maps.Polyline({
      path,
      strokeWeight: 4, // 두께
      strokeColor: routeColor,
      strokeOpacity: strokeOpacity, // 투명도
      strokeStyle: 'solid',
    });

    routePolyline.setMap(map);

    // 경로에 맞게 지도 중심과 확대 수준 조정
    const bounds = new kakao.maps.LatLngBounds();
    path.forEach(point => bounds.extend(point));
    map.setBounds(bounds);
  };

  const extractRoadInfo = (routeData) => {
  console.log("extractRoadInfo 함수가 호출되었습니다.");
  console.log("routeData 데이터:", routeData);  // routeData 객체 확인

  if (!routeData.routes || routeData.routes.length === 0) {
    console.error("routeData.routes가 비어 있거나 정의되지 않았습니다.");
    return;
  }

  roadInfo = []; // 이전 정보 초기화

  const sections = routeData.routes[0].sections;
  sections.forEach(section => {
    section.roads.forEach(road => {
      roadInfo.push(`도로 이름: ${road.name}, 거리: ${road.distance}m`);
    });
  });
};

  // findRoute 함수를 그 다음에 정의합니다.
  const findRoute = async () => {
    if (selectedPlaces.length < 2) {
      alert("길찾기를 위해서는 최소 2개의 장소를 선택하세요.");
      return;
    }

    // 출발지와 도착지를 설정
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

    // 경유지 설정 (출발지와 도착지를 제외한 나머지 장소들)
    const waypoints = selectedPlaces.slice(1, selectedPlaces.length - 1).map(place => ({
      name: place.name,
      x: place.longitude.toString(),
      y: place.latitude.toString(),
    }));

    try {
      const response = await fetch('http://localhost:8080/findRoute2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ origin, destination, waypoints })
      });

      const data = await response.json();

      if (!data.success) {
        alert("경로를 찾을 수 없습니다: " + data.error);
        return;
      }

      // drawRoute 함수 호출
      drawRoute(data.route);
    
      extractRoadInfo(data.route);
      } catch (error) {
      console.error('Error fetching route:', error);
      alert("경로를 찾을 수 없습니다.");
    }
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
    width: 70%;
    height: 100vh;
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
    flex-grow: 1;
    overflow-y: auto;
    max-height: 200px;
    }
  li {
    padding: 8px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  li:hover {
    background-color: #f0f0f0;
  }
  .route-button {
    margin: 20px 0;
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    align-self: flex-start;
  }
  .route-button:hover {
    background-color: #45a049;
  }
  #map {
    width: 95%;
    height: 95%;
  }
  .label {
  background-color: white;
  border: 1px solid black;
  border-radius: 50%;
  padding: 10px;
  text-align: center;
  }

  .label .number {
    font-weight: bold;
    font-size: 10px;
  }
</style>

<div class="container">
  <div class="left-panel">
    <h1>Place List</h1>
    <!-- left-panel 내부에, "경로 찾기" 버튼 위나 아래에 추가 -->
    <div>
      <label>경로 색상: </label>
      <input type="color" bind:value={routeColor} /><br>
      <label>경로 투명도: </label>
      <input type="range" min="0" max="1" step="0.1" bind:value={strokeOpacity} />
      <span>{strokeOpacity}</span>
    </div>

    <div>
      <label>카테고리: </label>
      <select bind:value={category}>
        {#each categories as cat}
          <option value={cat}>{cat}</option>
        {/each}
      </select>
    </div>

    <div>
      <label>도시: </label>
      <select bind:value={filter}>
        <option value="">모든 도시</option>
        {#each cities as city}
          <option value={city}>{city}</option>
        {/each}
      </select>
    </div>

    <!-- 경로 찾기 버튼 -->
    <button class="route-button" on:click={findRoute}>경로 찾기</button>

    <!-- 필터링된 장소 리스트 -->
    <ul>
      {#each places.filter(place => {
        const filterText = filter.toLowerCase();
        return (
          place.name.toLowerCase().includes(filterText) ||
          place.address.toLowerCase().includes(filterText)
        );
      }) as place}
        <li on:click={() => toggleMarker(place)}>
          {place.name} - {place.address}
        </li>
      {/each}
    </ul> <br>
    <ul>
      {#each roadInfo as info}
        <li>{info}</li>
      {/each}
    </ul>
  </div>
  <div class="right-panel">
    <!-- 지도 표시 영역 -->
    <div id="map"></div>
  </div>
</div>
