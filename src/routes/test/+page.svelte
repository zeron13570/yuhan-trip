<script>
    import { onMount } from 'svelte';
  
    let map;
    let origin = '';
    let destination = '';
    let waypoints = [''];
  
    onMount(() => {
      // 스크립트가 이미 로드되었는지 확인
      if (typeof window.kakao === 'undefined') {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=c6876a5497297dc029c4d55c6e2da7bd&libraries=services`;
  
        script.onload = () => {
          initializeMap(); // 스크립트가 로드된 후 지도 초기화
        };
  
        document.head.appendChild(script);
      } else {
        // 이미 스크립트가 로드된 경우 바로 지도 초기화
        initializeMap();
      }
    });
  
    function initializeMap() {
      if (window.kakao && window.kakao.maps) {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
          level: 5, // 확대 수준
        };
        map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도 생성
      } else {
        console.error('Kakao Maps API가 로드되지 않았습니다.');
      }
    }
  
    // 경유지 추가
    function addWaypoint() {
      waypoints = [...waypoints, ''];
    }
  
    // 경유지 제거
    function removeWaypoint(index) {
      waypoints = waypoints.filter((_, i) => i !== index);
    }
  
    // 경유지 업데이트
    function updateWaypoint(index, value) {
      waypoints = [...waypoints];
      waypoints[index] = value;
    }
  
    // 폼 제출 시 경로 찾기 로직
    async function handleSubmit(event) {
      event.preventDefault();
      console.log('출발지:', origin);
      console.log('목적지:', destination);
      console.log('경유지:', waypoints);
    }
  </script>
  
  <!-- 지도 표시 영역 -->
  <div id="map" style="width: 100%; height: 400px;"></div>
  
  <h1>Kakao Maps 경로 찾기</h1>
  <form on:submit={handleSubmit}>
    <div>
      <label>출발지:</label>
      <input type="text" bind:value={origin} placeholder="출발지 건물 이름" required />
    </div>
    <div>
      <label>목적지:</label>
      <input type="text" bind:value={destination} placeholder="목적지 건물 이름" required />
    </div>
    <div>
      <label>경유지:</label>
      {#each waypoints as waypoint, index}
        <div>
          <input
            type="text"
            bind:value={waypoints[index]}
            placeholder="경유지 건물 이름"
          />
          <button type="button" on:click={() => removeWaypoint(index)}>제거</button>
        </div>
      {/each}
      <button type="button" on:click={addWaypoint}>경유지 추가</button>
    </div>
    <div>
      <button type="submit">경로 찾기</button>
    </div>
  </form>
  