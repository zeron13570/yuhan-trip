<svelte:head>
  <!-- Kakao Maps SDK를 동기적으로 로드 -->
  <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=c6876a5497297dc029c4d55c6e2da7bd&libraries=services"></script>
</svelte:head>

<script>
  import { onMount } from 'svelte';

  let map;
  let origin = ""; // 출발지
  let destination = ""; // 목적지
  let waypoints = []; // 경유지
  let errorMessage = "";
  let roadInfo = [];
  let isKakaoLoaded = false;
  let markers = [];
  let polylines = [];

  onMount(() => {
    // Kakao Maps API가 로드되었는지 확인하고 지도 초기화
    if (window.kakao && window.kakao.maps) {
      console.log("Kakao Maps API 로드 완료");
      initializeMap();
      isKakaoLoaded = true;
    } else {
      console.error("Kakao Maps API가 로드되지 않았습니다.");
    }
  });

  // 지도 초기화 함수
  function initializeMap() {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Maps API가 아직 로드되지 않았습니다.");
      return;
    }

    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
      level: 5,
    };
    map = new window.kakao.maps.Map(mapContainer, mapOption);
    console.log("지도가 성공적으로 초기화되었습니다.");
  }

  // 경로 찾기 함수
  async function findRoute() {
    errorMessage = "";
    roadInfo = [];

    if (!isKakaoLoaded) {
      console.error("Kakao Maps API가 아직 로드되지 않았습니다.");
      return;
    }

    try {
      const originCoords = await getCoordsByPlaceName(origin);
      const destinationCoords = await getCoordsByPlaceName(destination);
      const waypointsCoords = await Promise.all(
        waypoints.map(place => getCoordsByPlaceName(place))
      );

      const data = {
        origin: originCoords,
        destination: destinationCoords,
        waypoints: waypointsCoords.map((coord, index) => ({
          name: `waypoint${index + 1}`,
          x: coord.x,
          y: coord.y,
        })),
      };

      const response = await fetch('http://localhost:8080/findRoute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("경로 찾기 실패");
      const result = await response.json();
      console.log("서버에서 받은 경로 데이터:", result.route);
      console.log("sections 데이터:", result.route.sections);


      if (result.route && result.route.routes && result.route.routes.length > 0) {
        const routeData = result.route.routes[0];
        console.log("경로 찾기 성공:", routeData);
        displayRouteOnMap(routeData, originCoords, destinationCoords, waypointsCoords);
        displayRoadInfo(routeData);
      } else {
        errorMessage = "경로를 찾을 수 없습니다.";
      }
    } catch (error) {
      console.error("오류 발생:", error);
      errorMessage = "오류가 발생했습니다.";
    }
  }

  // 장소 이름을 좌표로 변환하는 함수
  function getCoordsByPlaceName(placeName) {
    return new Promise((resolve, reject) => {
      if (!window.kakao || !window.kakao.maps) {
        reject("Kakao Maps API가 로드되지 않았습니다.");
        return;
      }

      const places = new window.kakao.maps.services.Places();
      places.keywordSearch(placeName, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve({ x: result[0].x, y: result[0].y });
        } else {
          reject(`장소를 찾을 수 없습니다: ${placeName}`);
        }
      });
    });
  }

  // 지도에 경로 표시 함수
  function displayRouteOnMap(routeData, originCoords, destinationCoords, waypointsCoords) {
    console.log("displayRouteOnMap 함수가 호출되었습니다.");
    console.log("route 데이터:", routeData);  // route 객체 출력하여 구조 확인
    console.log("sections 데이터:", routeData.sections);
    
    if (!routeData.sections || routeData.sections.length === 0) {
    console.error("route.sections가 정의되지 않았습니다.");  // sections가 없을 때 오류 메시지 출력
    return;
  }
    clearMap();
  
    // 출발지, 경유지, 목적지 마커
    const allPoints = [originCoords, ...waypointsCoords, destinationCoords];
    const markerColor = '#FF0000';
    let markerNumber = 1;

    allPoints.forEach(coords => {
      // 일반 마커
    //   const marker = new window.kakao.maps.Marker({
    //     position: new window.kakao.maps.LatLng(coords.y, coords.x),
    //     map: map,
    //   });
    //   markers.push(marker);
    // });
    // 숫자 마커
    const content = `<div style="background:${markerColor};color:white;width:20px;height:20px;text-align:center;border-radius:50%;font-size:14px;">${markerNumber}</div>`;
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(coords.y, coords.x),
        content: content,
        zIndex: 2,
      });
      overlay.setMap(map);
      markers.push(overlay);
      markerNumber++;
    });

    // 경로 폴리라인 그리기
    routeData.sections.forEach(section => {
      section.roads.forEach(road => {
        const path = road.vertexes.reduce((acc, cur, index) => {
          if (index % 2 === 0) {
            acc.push(new window.kakao.maps.LatLng(road.vertexes[index + 1], cur));
          }
          return acc;
        }, []);

        const polyline = new window.kakao.maps.Polyline({
          path: path,
          strokeWeight: 5,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
        });

        polyline.setMap(map);
        polylines.push(polyline);
      });
    });

    // 전체 경로가 보이도록 지도 범위를 설정
    const bounds = new window.kakao.maps.LatLngBounds();
    allPoints.forEach(point => bounds.extend(new window.kakao.maps.LatLng(point.y, point.x)));
    map.setBounds(bounds);
  }

  // 지도에 있는 기존 마커와 폴리라인 제거
  function clearMap() {
    polylines.forEach(polyline => polyline.setMap(null));
    polylines = [];
    markers.forEach(marker => marker.setMap(null));
    markers = [];
  }

  // 도로 정보를 표시하는 함수
  function displayRoadInfo(route) {
    console.log("displayRoadInfo 함수가 호출되었습니다.");
    console.log("routeData 데이터:", route);  // routeData 객체 확인

    if (!route.sections || route.sections.length === 0) {
      console.error("routeData.sections가 비어 있거나 정의되지 않았습니다.");
      return;
    }
    roadInfo = [];
    route.sections.forEach(section => {
      section.roads.forEach(road => {
        roadInfo.push(`도로 이름: ${road.name}, 거리: ${road.distance}m`);
      });
    });
  }
</script>

<style>
  .container {
    display: flex;
  }
  .directions-form {
    width: 45%;
    padding-right: 2%;
  }
  #map {
    width: 50%;
    height: 500px;
  }
  h2, ul {
    clear: both;
  }
</style>

<div class="container">
  <div class="directions-form">
    <h1>경로 찾기</h1>
    <div>
      <label>출발지: <input type="text" bind:value={origin} placeholder="출발지" /></label>
    </div>
    <div>
      <label>목적지: <input type="text" bind:value={destination} placeholder="목적지" /></label>
    </div>
    <div>
      <label>경유지:</label>
      {#each waypoints as waypoint, index}
        <div>
          <input type="text" bind:value={waypoints[index]} placeholder="경유지" />
          <button on:click={() => (waypoints = waypoints.filter((_, i) => i !== index))}>제거</button>
        </div>
      {/each}
      <button on:click={() => (waypoints = [...waypoints, ""])}>경유지 추가</button>
    </div>
    <div>
      <button on:click={findRoute}>경로 찾기</button>
    </div>
    <h2>도로 정보</h2>
    <ul>
      {#each roadInfo as info}
        <li>{info}</li>
      {/each}
    </ul>
    {#if errorMessage}
      <div style="color: red;">{errorMessage}</div>
    {/if}
  </div>
  
  <div id="map"></div>
</div>
