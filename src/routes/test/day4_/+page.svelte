<script>
  import { onMount } from "svelte";

  let startSearchQuery = "";
  let endSearchQuery = "";
  let waypointSearchQueries = []; // 경유지 검색어 배열
  let startSearchResults = []; // 출발지 검색 결과
  let endSearchResults = []; // 도착지 검색 결과
  let waypointSearchResults = []; // 각 경유지에 대한 검색 결과 배열
  let areaOpen = false; // 사이드바

  let waypoints = [];

  // 경유지 추가 함수
  function addWaypoint() {
    waypoints = [...waypoints, { id: Date.now(), value: "" }];
    waypointSearchQueries = [...waypointSearchQueries, ""];
    waypointSearchResults = [...waypointSearchResults, []]; // 새로운 경유지 검색 결과 배열 추가
  }

  // 경유지 제거 함수
  function removeWaypoint() {
    if (waypoints.length > 0) {
      waypoints = waypoints.slice(0, -1);
      waypointSearchQueries = waypointSearchQueries.slice(0, -1);
      waypointSearchResults = waypointSearchResults.slice(0, -1);
    }
  }

  // 사이드바 토글 함수
  function toggleArea() {
    areaOpen = !areaOpen;
  }

  // 검색 함수
  const searchPlaces = (type, index = null) => {
    let query = "";

    if (type === "start") {
      query = startSearchQuery;
    } else if (type === "end") {
      query = endSearchQuery;
    } else if (type === "waypoint" && index !== null) {
      query = waypointSearchQueries[index];
    }

    if (!query) {
      alert("검색어를 입력하세요.");
      return;
    }

    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(query, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const results = data.map((place) => ({
          id: place.id,
          name: place.place_name,
          address: place.address_name,
          latitude: parseFloat(place.y),
          longitude: parseFloat(place.x),
        }));

        // 검색 타입에 맞는 결과 저장
        if (type === "start") {
          startSearchResults = results;
        } else if (type === "end") {
          endSearchResults = results;
        } else if (type === "waypoint" && index !== null) {
          waypointSearchResults[index] = results;
        }
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  // 검색 결과 클릭 시 입력 필드에 값을 설정하는 함수
  const selectPlace = (place, type, index = null) => {
    if (type === "start") {
      startSearchQuery = place.name;
      startSearchResults = [];
    } else if (type === "end") {
      endSearchQuery = place.name;
      endSearchResults = [];
    } else if (type === "waypoint" && index !== null) {
      waypointSearchQueries[index] = place.name;
      waypointSearchResults[index] = [];
    }
  };

  // findRoute 함수 정의
  const findRoute = () => {
    const startLocation = startSearchQuery;
    const endLocation = endSearchQuery;
    const allWaypoints = waypointSearchQueries.filter(Boolean);

    console.log("출발지:", startLocation);
    console.log("도착지:", endLocation);
    console.log("경유지:", allWaypoints);

    window.location.href = "/routeResult";
  };

  // 지도 초기화
  let map;

  onMount(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 5,
    };

    map = new kakao.maps.Map(container, options);

    const mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  });
</script>

<svelte:head>
  <script
    src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=c6876a5497297dc029c4d55c6e2da7bd&libraries=services"
  ></script>
</svelte:head>

<div class="container">
  <!-- 사이드바 -->
  <div class="sidebar">
    <div class="sidebar-header" on:click={toggleArea}>경로찾기</div>
  </div>

  {#if areaOpen}
    <div class="area_1">
      <div class="input-group">
        <input type="text" placeholder="출발지" bind:value={startSearchQuery} />
        <button on:click={() => searchPlaces("start")}>검색</button>
      </div>
      <ul class="search-results">
        {#each startSearchResults as result}
          <li on:click={() => selectPlace(result, "start")}>
            {result.name} - {result.address}
          </li>
        {/each}
      </ul>

      <div class="input-group">
        <input type="text" placeholder="도착지" bind:value={endSearchQuery} />
        <button on:click={() => searchPlaces("end")}>검색</button>
      </div>
      <ul class="search-results">
        {#each endSearchResults as result}
          <li on:click={() => selectPlace(result, "end")}>
            {result.name} - {result.address}
          </li>
        {/each}
      </ul>

      {#each waypoints as waypoint, index}
        <div class="input-group">
          <input
            type="text"
            placeholder="경유지"
            bind:value={waypointSearchQueries[index]}
          />
          <button on:click={() => searchPlaces("waypoint", index)}>검색</button>
        </div>
        <ul class="search-results">
          {#each waypointSearchResults[index] || [] as result}
            <li on:click={() => selectPlace(result, "waypoint", index)}>
              {result.name} - {result.address}
            </li>
          {/each}
        </ul>
      {/each}

      <div class="buttons">
        <button class="button" on:click|preventDefault={addWaypoint}>경유지 추가</button>
        <button class="button" on:click|preventDefault={removeWaypoint}>경유지 제거</button>
        <button class="button" on:click|preventDefault={findRoute}>찾기</button>
      </div>
    </div>
  {/if}
  <div id="map" class="map"></div>
</div>

<style>
  .container {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 100px;
    height: 100vh;
    background-color: #f0f0f0;
    border-right: 1px solid #ddd;
    position: relative;
  }

  .sidebar-header {
    height: 100vh;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    background-color: #e0e0e0;
    text-align: center;
    cursor: pointer;
  }

  .area_1 {
    width: 250px;
    height: 100vh;
    background-color: #626262;
    border-left: 1px solid #ddd;
    padding: 10px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    position: absolute;
    z-index: 1000;
    left: 100px;
  }

  .input-group {
    display: flex;
    margin-bottom: 10px;
  }

  .input-group input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
  }

  .input-group button {
    padding: 8px;
    background-color: #008cba;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
  }

  .input-group button:hover {
    background-color: #0079a1;
  }

  .map {
    height: 100vh;
  }

  .search-results {
    list-style-type: none;
    padding: 0;
    margin: 0 0 10px;
    max-height: 150px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #ddd;
    position: relative;
    z-index: 1000;
  }

  .search-results li {
    padding: 8px;
    cursor: pointer;
  }

  .search-results li:hover {
    background-color: #f0f0f0;
  }

  .buttons {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .button {
    padding: 8px;
    background-color: #008cba;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    text-align: center;
  }

  .button:hover {
    background-color: #0079a1;
  }
</style>
