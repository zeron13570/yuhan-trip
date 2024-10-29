<script>
  import { onMount, tick } from "svelte";

  let startSearchQuery = "";
  let endSearchQuery = "";
  let waypointSearchQueries = [];
  let startSearchResults = [];
  let endSearchResults = [];
  let waypointSearchResults = [];
  let openSection = "경로찾기";

  let waypoints = [];
  let map;
  let polylines = [];
  let markers = {};
  let selectedPlaces = []; // 선택된 장소 목록
  let routePolyline;
  let strokeOpacity = 1;
  let roadInfo = []; // 각 일정별 도로 정보 저장
  let dayMarkers = [];

  let category = "관광지";
  let filter = "";
  let currentPage = 1;
  const itemsPerPage = 20;
  let places = [];
  let totalPages = 0;
  let pagedPlaces = [];
  let isClient = false;

  let bounds;
  let dayRoutes = []; // 일차별 장소 저장
  let selectedDay = null; // 현재 선택된 일차
  let dayPolylines = []; // 각 일차별 경로 저장
  let selectedDayIndex = 0; // 선택된 일차
  let draggedPlace = null; // 드래그된 장소의 정보를 저장
  let draggedDayIndex = null; // 드래그된 장소의 일차 인덱스

  let searchQuery = "";
  let searchResults = [];
  let selectedPlaceId = null;

  let listElement = null;

  const cities = ["서울", "부산", "제주", "강릉", "군산", "경주", "인천", "수원", "포항", "울산", "대구", "전주"];
  const categories = ["관광지", "카페", "음식점", "숙박"];
  const categoryToTableName = {
    "관광지": "place",
    "카페": "cafe",
    "음식점": "food",
    "숙박": "lodgment"
  };
  let travelOption = "하루";
  let routeColor = "#008cba";
  let opacity = 1.0;

  // 선택된 장소를 저장하는 변수
  let selectedStartPoint = null;
  let selectedEndPoint = null;
  let selectedWaypointPoints = [];

  $: if (category || filter) {
    currentPage = 1; // 페이지를 1로 초기화
    fetchPlaces();
    scrollToTopOfList();
  }

  $: totalPages = Math.ceil(places.length / itemsPerPage);
  $: roadInfo = [...roadInfo];

  const createNumberedMarker = (position, number) => {
    const markerContent = `
      <div style="background-color: ${routeColor}; border-radius: 50%; width: 30px; height: 30px; display: flex; justify-content: center; align-items: center; color: white; font-size: 16px;">
        ${number}
      </div>
    `;

    const marker = new kakao.maps.CustomOverlay({
      position,
      content: markerContent,
      yAnchor: 1,
      map,
    });

    return marker;
  };

  const searchPlaces = (type, index = null) => {
    const ps = new kakao.maps.services.Places();
    let query = '';
    if (type === 'start') {
      query = startSearchQuery;
    } else if (type === 'end') {
      query = endSearchQuery;
    } else if (type === 'waypoint' && index !== null) {
      query = waypointSearchQueries[index];
    }

    if (!query) {
      alert("검색어를 입력하세요.");
      return;
    }

    ps.keywordSearch(query, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const results = data.map((place) => ({
          id: place.id,
          name: place.place_name,
          address: place.address_name,
          latitude: parseFloat(place.y),
          longitude: parseFloat(place.x),
          category_group_code: place.category_group_code,
          category_group_name: place.category_group_name,
          tableName: mapKakaoCategoryToTableName(place.category_group_code),
        }));

        if (type === 'start') {
          startSearchResults = results;
        } else if (type === 'end') {
          endSearchResults = results;
        } else if (type === 'waypoint' && index !== null) {
          waypointSearchResults[index] = results;
          waypointSearchResults = [...waypointSearchResults]; // 반응성 확보
        }
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  // 카카오 카테고리 그룹 코드를 우리의 tableName으로 매핑하는 함수
  const mapKakaoCategoryToTableName = (category_group_code) => {
    switch (category_group_code) {
      case "AD5":
        return "lodgment"; // 숙박
      case "CE7":
        return "cafe"; // 카페
      case "FD6":
        return "food"; // 음식점
      case "AT4":
        return "place"; // 관광명소
      default:
        return "place"; // 기타는 일단 'place'로 처리
    }
  };

  const fetchPlaces = async () => {
    if (!isClient) return;
    try {
      const tableName = categoryToTableName[category];
      const response = await fetch(`http://localhost:8080/api/${tableName}`);
      if (!response.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
      const data = await response.json();

      places = data.map((place) => ({
        ...place,
        id: `${tableName}_${place.id}`,
        tableName: place.tableName || tableName,
      }));

      totalPages = Math.ceil(places.length / itemsPerPage);
      updatePagedPlaces();
    } catch (error) {
      console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
  };

  const updatePagedPlaces = () => {
    const filteredPlaces = places.filter((place) => {
      return (
        (!filter || place.address.includes(filter)) // 지역 필터
      );
    });

    totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
    pagedPlaces = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  };

  const selectPlace = (place, type, index = null) => {
    if (type === 'start') {
      startSearchQuery = place.name;
      startSearchResults = [];
      selectedStartPoint = place; // 선택된 출발지 저장
    } else if (type === 'end') {
      endSearchQuery = place.name;
      endSearchResults = [];
      selectedEndPoint = place; // 선택된 도착지 저장
    } else if (type === 'waypoint' && index !== null) {
      waypointSearchQueries[index] = place.name;
      waypointSearchQueries = [...waypointSearchQueries]; // 반응성 확보
      waypointSearchResults[index] = [];
      waypointSearchResults = [...waypointSearchResults]; // 반응성 확보
      selectedWaypointPoints[index] = place; // 선택된 경유지 저장
      selectedWaypointPoints = [...selectedWaypointPoints]; // 반응성 확보
    }

    const position = new kakao.maps.LatLng(place.latitude, place.longitude);
    const marker = createNumberedMarker(position, index + 1);
    markers[place.id] = marker;
    map.setCenter(position);
  };

  const getContrastYIQ = (hexcolor) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  const updatePolylineStyles = () => {
    if (dayPolylines && dayPolylines.length > 0) {
      dayPolylines.forEach((polyline) => {
        if (polyline) {
          polyline.setOptions({
            strokeColor: routeColor,
            strokeOpacity: strokeOpacity,
          });
        }
      });
    }
  };

  // 반응형 선언문으로 경로 스타일 업데이트
  $: if (routeColor || strokeOpacity) {
    updatePolylineStyles();
  }

  // 마커 스타일 업데이트를 위한 반응형 선언문
  $: if (routeColor) {
    if (selectedDayIndex !== null && dayMarkers && dayRoutes) {
      updateMarkersForDay(selectedDayIndex);
    }
  }

  // 숫자마커
  const addMarker = (place, dayIndex, placeIndex) => {
    const position = new kakao.maps.LatLng(place.latitude, place.longitude);

    // dayIndex는 해당 일차를 나타내며, placeIndex는 해당 일차에서의 장소 인덱스입니다.
    const index = placeIndex + 1; // 각 일차의 마커는 1부터 시작

    // 마커에 사용할 HTML 컨텐츠 (인라인 스타일 대신 클래스 적용)
    const content = `
        <div class="custom-marker">
            <span class="marker-number">${index}</span>
        </div>
    `;

    const marker = new kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor: 1,
      map,
    });

    // dayMarkers 배열이 존재하지 않으면 초기화
    if (!dayMarkers[dayIndex]) {
      dayMarkers[dayIndex] = [];
    }

    dayMarkers[dayIndex].push(marker);
    markers[place.id] = marker;

    bounds.extend(position);
    map.setBounds(bounds);
  };

  const updateMarkers = () => {
    selectedPlaces.forEach((place, idx) => {
      const marker = markers[place.id];
      const index = idx + 1;

      // 텍스트 색
      const textColor = getContrastYIQ(routeColor);

      const content = `
      <div class="label_" style="background-color: ${routeColor};">
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

      // selectedPlaces에서 제거
      selectedPlaces = selectedPlaces.filter((p) => p.id !== place.id);

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
      if (!place.tableName) {
        place.tableName = mapKakaoCategoryToTableName(
          place.category_group_code
        );
      }

      // 좌표 값 검증
      if (!place.latitude || !place.longitude) {
        alert(`장소 "${place.name}"의 좌표 정보가 올바르지 않습니다.`);
        return;
      }

      // selectedPlaces에 장소 추가
      selectedPlaces = [...selectedPlaces, place];
      addMarker(place);
      // 마커 번호 업데이트
      updateMarkers();
    }
  };

  const findRoute = async () => {
    // 기존 폴리라인과 마커 초기화
    if (polylines && polylines.length > 0) {
      polylines.forEach((polyline) => polyline.setMap(null));
      polylines = [];
    }

    // 여행 일정 옵션에 따른 일차 수 설정
    let numDays = 1;
    if (travelOption === "1박 2일") {
      numDays = 2;
    } else if (travelOption === "2박 3일") {
      numDays = 3;
    }

    // Lodgment(숙박) 장소 필터링
    const lodgmentPlaces = selectedPlaces.filter(
      (place) => place.tableName === "lodgment"
    );

    // 1박 2일 또는 2박 3일 선택 시 숙박 장소 필수 조건 확인
    if (numDays > 1 && lodgmentPlaces.length === 0) {
      alert(
        "1박 2일 또는 2박 3일을 선택한 경우 숙박 장소를 포함해야 합니다."
      );
      return;
    }

    // 각 일차별 장소 목록 초기화
    dayRoutes = Array.from({ length: numDays }, () => []);

    // 각 카테고리별로 장소 분배
    const placePlaces = selectedPlaces.filter(
      (place) => place.tableName === "place"
    );
    const cafePlaces = selectedPlaces.filter(
      (place) => place.tableName === "cafe"
    );
    const foodPlaces = selectedPlaces.filter(
      (place) => place.tableName === "food"
    );

    const distributePlaces = (placesArray) => {
      for (let i = 0; i < placesArray.length; i++) {
        const dayIndex = i % numDays;
        dayRoutes[dayIndex].push(placesArray[i]);
      }
    };

    distributePlaces(placePlaces);
    distributePlaces(cafePlaces);
    distributePlaces(foodPlaces);

    // 각 일차별로 필요한 카테고리의 장소가 포함되어 있는지 확인
    for (let i = 0; i < dayRoutes.length; i++) {
      const dayRoute = dayRoutes[i];
      const categoriesInDayRoute = new Set(
        dayRoute.map((place) => place.tableName)
      );

      const missingCategories = [];
      if (!categoriesInDayRoute.has("place")) missingCategories.push("place");
      if (!categoriesInDayRoute.has("cafe")) missingCategories.push("cafe");
      if (!categoriesInDayRoute.has("food")) missingCategories.push("food");

      // 부족한 카테고리의 장소를 추가
      for (const category of missingCategories) {
        let placeToAdd = null;

        if (category === "place") {
          placeToAdd = placePlaces.find(
            (p) => !dayRoutes.some((route) => route.includes(p))
          );
        } else if (category === "cafe") {
          placeToAdd = cafePlaces.find(
            (p) => !dayRoutes.some((route) => route.includes(p))
          );
        } else if (category === "food") {
          placeToAdd = foodPlaces.find(
            (p) => !dayRoutes.some((route) => route.includes(p))
          );
        }

        if (placeToAdd) {
          dayRoute.push(placeToAdd);
        }
      }
    }

    // 숙박 장소를 일차별로 추가
    if (numDays === 1) {
      dayRoutes[0] = [...dayRoutes[0], ...lodgmentPlaces];
    } else if (numDays === 2) {
      const lodgment1 = lodgmentPlaces[0];
      dayRoutes[0].push(lodgment1); // 첫째 날 끝에 숙소 추가
      dayRoutes[1].unshift(lodgment1); // 둘째 날 시작에 숙소 추가
    } else if (numDays === 3) {
      const lodgment1 = lodgmentPlaces[0];
      const lodgment2 = lodgmentPlaces[1] || lodgment1;
      dayRoutes[0].push(lodgment1);
      dayRoutes[1].unshift(lodgment1);
      dayRoutes[1].push(lodgment2);
      dayRoutes[2].unshift(lodgment2);
    }

    // 각 일차별 경로 찾기
    roadInfo = new Array(dayRoutes.length).fill().map(() => []);
    let hasError = false; // 오류 발생 여부 체크

    for (let i = 0; i < dayRoutes.length; i++) {
      if (dayRoutes[i].length < 2) {
        console.warn(
          `Day ${i + 1}에 장소가 하나뿐입니다. 동일한 장소로 출발지와 도착지를 설정합니다.`
        );
        // 만약 장소가 하나뿐이라면, 출발지와 도착지를 동일하게 설정
        dayRoutes[i].push(dayRoutes[i][0]);
      }

      const origin = {
        name: dayRoutes[i][0].name,
        x: dayRoutes[i][0].longitude.toString(),
        y: dayRoutes[i][0].latitude.toString(),
      };

      const destination = {
        name: dayRoutes[i][dayRoutes[i].length - 1].name,
        x: dayRoutes[i][dayRoutes[i].length - 1].longitude.toString(),
        y: dayRoutes[i][dayRoutes[i].length - 1].latitude.toString(),
      };

      const waypoints = dayRoutes[i]
        .slice(1, dayRoutes[i].length - 1)
        .map((place) => ({
          name: place.name,
          x: place.longitude.toString(),
          y: place.latitude.toString(),
        }));

      // 요청 데이터 콘솔 출력
      console.log("숙박 장소 확인 (추가 후):", lodgmentPlaces);
      console.log("Day Routes 구성 확인:", dayRoutes);
      console.log("API 요청 데이터:", {
        origin,
        destination,
        waypoints,
      });

      try {
        const response = await fetch("http://localhost:8080/findRoute2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origin, destination, waypoints }),
        });

        const data = await response.json();
        if (!data.success) {
          console.error(`경로를 찾을 수 없습니다. ${i + 1}일차: ` + data.error);
          hasError = true;
          continue;
        }

        console.log(`Day ${i + 1} Route Data:`, data.route);
        drawRoute(data.route, i);
      } catch (error) {
        console.error(`Error finding route for day ${i + 1}:`, error);
        hasError = true;
        continue;
      }
    }

    if (hasError) {
      alert("경로를 찾을 수 없는 일차가 있습니다. 콘솔 로그를 확인해주세요.");
      return;
    }

    // 마커 업데이트
    dayRoutes.forEach((route, dayIndex) => {
      updateMarkersForDay(dayIndex);
    });

    selectedDayIndex = 0;

    showDayRoute(selectedDayIndex);
    alert("경로가 만들어 졌습니다.");

    dayRoutes.forEach((_, idx) => {
      if (idx === selectedDayIndex) {
        showDayRoute(idx);
      } else {
        hideDayRoute(idx);
        hideMarkersForDay(idx);
      }
    });

    // 지도와 데이터 동기화
    synchronizeMap();
    openSection = "경로보기";
  };

  const synchronizeMap = () => {
    // 선택된 일차의 마커만 표시하고, 다른 일차의 마커는 숨기기
    dayRoutes.forEach((_, idx) => {
      if (idx === selectedDayIndex) {
        updateMarkersForDay(idx); // 선택된 일차의 마커는 표시
      } else {
        hideMarkersForDay(idx); // 다른 일차의 마커는 숨김
      }
    });

    // 지도의 중심을 현재 선택된 일차에 맞게 설정
    if (dayPolylines[selectedDayIndex]) {
      const bounds = new kakao.maps.LatLngBounds();
      dayPolylines[selectedDayIndex]
        .getPath()
        .forEach((point) => bounds.extend(point));
      map.setBounds(bounds);
    }
  };

  // 드래그 시작 이벤트 핸들러
  const handleDragStart = (dayIndex, index) => {
    draggedPlace = dayRoutes[dayIndex][index]; // 드래그된 장소 저장
    draggedDayIndex = dayIndex; // 드래그된 일차 인덱스 저장
  };

  // 드래그 오버 이벤트 핸들러 (드롭할 수 있는 상태로 설정)
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // 드래그 드롭 이벤트 핸들러 (순서 변경)
  const handleDrop = (dayIndex, index) => {
    if (draggedPlace === null) return;

    // 드래그된 장소를 원래 일차의 목록에서 제거
    dayRoutes[draggedDayIndex] = dayRoutes[draggedDayIndex].filter(
      (place) => place.id !== draggedPlace.id
    );

    // 드롭된 일차의 목록에 장소를 추가
    dayRoutes[dayIndex].splice(index, 0, draggedPlace);

    // draggedPlace와 인덱스 초기화
    draggedPlace = null;
    draggedDayIndex = null;

    // 1일차의 경로를 다시 표시
    updateRoute(0);
    showDayRoute(0);

    // 모든 일차의 경로 업데이트
    dayRoutes.forEach((_, idx) => {
      updateRoute(idx);
    });

    // 모든 일차의 경로를 업데이트했으므로, 선택된 일차의 경로만 표시
    dayRoutes.forEach((_, idx) => {
      if (idx === dayIndex) {
        showDayRoute(idx); // 이동된 일차의 경로만 표시
      } else {
        hideDayRoute(idx); // 다른 일차의 경로는 숨김
        hideMarkersForDay(idx);
      }
    });

    dayRoutes.forEach((_, idx) => {
      if (idx === selectedDayIndex) {
        showDayRoute(idx); // 첫 번째 일차의 경로만 표시
      } else {
        hideDayRoute(idx); // 다른 일차의 경로는 숨김
        hideMarkersForDay(idx);
      }
    });

    // 선택된 일차 인덱스 업데이트
    selectedDayIndex = dayIndex;
  };

  const drawRoute = (routeData, dayIndex) => {
    // 기존 경로 삭제
    if (dayPolylines[dayIndex]) {
      dayPolylines[dayIndex].setMap(null);
    }

    const path = [];
    const routes = routeData.routes;
    const sections = routes[0].sections;

    // sections가 없는 경우 방어 코드 추가
    if (!sections || sections.length === 0) {
      alert(`경로를 찾을 수 없습니다. 일차: ${dayIndex + 1}`);
      return;
    }

    // roadInfo 초기화
    roadInfo[dayIndex] = [];

    // 경로의 섹션을 순회하며 좌표와 도로 정보를 저장
    sections.forEach((section) => {
      section.roads.forEach((road) => {
        const vertexes = road.vertexes;

        for (let i = 0; i < vertexes.length; i += 2) {
          const x = vertexes[i];
          const y = vertexes[i + 1];
          path.push(new kakao.maps.LatLng(y, x));
        }

        roadInfo[dayIndex].push(
          `도로 이름: ${road.name || "알 수 없음"}, 거리: ${road.distance}m`
        );
      });
    });

    const polyline = new kakao.maps.Polyline({
      path,
      strokeWeight: 4,
      strokeColor: routeColor,
      strokeOpacity: strokeOpacity,
      strokeStyle: "solid",
    });

    dayPolylines[dayIndex] = polyline; // 일차별 Polyline 저장
    polyline.setMap(map);
    polylines.push(polyline);

    // 지도의 범위를 경로에 맞게 조정
    const bounds = new kakao.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));
    map.setBounds(bounds);
  };

  const clearAllMarkers = () => {
    if (dayMarkers && dayMarkers.length > 0) {
      dayMarkers.forEach((markersArray) => {
        if (markersArray) {
          markersArray.forEach((marker) => {
            marker.setMap(null); // 모든 마커를 지도에서 제거
          });
        }
      });
    }
    markers = {}; // 마커 객체 초기화
    dayMarkers = []; // 일차별 마커 배열 초기화
  };

  // 선택된 일차의 경로와 마커만 표시하는 함수
  const showDayRoute = (dayIndex) => {
    selectedDayIndex = dayIndex;

    // 모든 일차의 경로를 숨기고 선택된 일차의 경로만 표시
    dayPolylines.forEach((polyline, index) => {
      if (polyline) {
        polyline.setMap(index === dayIndex ? map : null);
      }
    });

    // 모든 일차의 마커를 숨기고 선택된 일차의 마커만 표시
    dayMarkers.forEach((markersArray, idx) => {
      if (markersArray) {
        markersArray.forEach(marker => {
          marker.setMap(idx === dayIndex ? map : null); // 선택된 일차만 지도에 표시
        });
      }
    });

    // 지도 범위를 선택된 일차의 경로에 맞게 조정
    if (dayPolylines[dayIndex]) {
      const bounds = new kakao.maps.LatLngBounds();
      dayPolylines[dayIndex].getPath().forEach((point) => bounds.extend(point));
      map.setBounds(bounds);
    }
  };

  // 일차별로 마커를 초기화하고 일차별로 마커 배열에 저장
  const updateMarkersForDay = (dayIndex) => {
    // dayMarkers와 dayRoutes가 정의되어 있는지 확인
    if (!dayMarkers || !dayRoutes) {
      console.error("dayMarkers 또는 dayRoutes가 정의되지 않았습니다.");
      return;
    }

    // 기존 마커 모두 숨김
    if (dayMarkers[dayIndex] && Array.isArray(dayMarkers[dayIndex])) {
      dayMarkers[dayIndex].forEach(marker => marker.setMap(null));
    }
    dayMarkers[dayIndex] = []; // 마커 배열 초기화

    // 새로운 마커 생성 및 저장
    if (dayRoutes[dayIndex] && Array.isArray(dayRoutes[dayIndex])) {
      dayRoutes[dayIndex].forEach((place, placeIndex) => {
        const position = new kakao.maps.LatLng(place.latitude, place.longitude);
        const index = placeIndex + 1;

        const content = `
          <div class="label_" style="background-color: ${routeColor};">
              <span class="number" style="padding: 3px; font-size: 20px; color: white;">${index}</span>
          </div>
        `;

        const marker = new kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1,
          map: selectedDayIndex === dayIndex ? map : null, // 현재 선택된 일차만 지도에 표시
        });

        dayMarkers[dayIndex].push(marker); // 마커 저장
      });
    } else {
      console.error(`dayRoutes[${dayIndex}]가 정의되지 않았습니다.`);
    }
  };

  // 모든 마커를 숨기는 함수
  const hideAllMarkers = () => {
    if (dayMarkers && dayMarkers.length > 0) {
      dayMarkers.forEach(markersArray => {
        if (markersArray) {
          markersArray.forEach(marker => {
            marker.setMap(null); // 모든 마커 숨김
          });
        }
      });
    }
  };

  // 특정 일차의 경로를 숨기는 함수
  const hideDayRoute = (dayIndex) => {
    if (dayPolylines[dayIndex]) {
      dayPolylines[dayIndex].setMap(null);
    }
  };

  // 선택된 일차에 대한 마커를 숨기는 함수
  const hideMarkersForDay = (dayIndex) => {
    if (dayRoutes[dayIndex]) {
      dayRoutes[dayIndex].forEach((place) => {
        if (markers[place.id]) {
          markers[place.id].setMap(null); // 마커를 지도에서 숨김
        }
      });
    }
  };

  $: if (polylines.length > 0) {
    polylines.forEach(polyline => {
      polyline.setOptions({
        strokeColor: routeColor,
        strokeOpacity: opacity,
      });
    });
  }

  function addWaypoint() {
    waypoints = [...waypoints, { id: Date.now(), value: "" }];
    waypointSearchQueries = [...waypointSearchQueries, ""];
    waypointSearchResults = [...waypointSearchResults, []];
    selectedWaypointPoints = [...selectedWaypointPoints, null]; // 새로운 경유지에 대한 선택된 장소 초기화
  }

  function removeWaypoint() {
    if (waypoints.length > 0) {
      waypoints = waypoints.slice(0, -1);
      waypointSearchQueries = waypointSearchQueries.slice(0, -1);
      waypointSearchResults = waypointSearchResults.slice(0, -1);
      selectedWaypointPoints = selectedWaypointPoints.slice(0, -1); // 선택된 경유지 제거
    }
  }

  function toggleSection(section) {
    if (openSection === section) {
      openSection = null;
    } else {
      openSection = section;
      //fetchPlaces();
    }
  }

  $: if (currentPage) {
    tick().then(() => {
      scrollToTopOfList();
    });
  }

  const scrollToTopOfList = () => {
    if (!listElement) {
      console.error("listElement가 정의되지 않았습니다.");
      return;
    }
    listElement.scrollTop = 0;
  };

  const handleScroll = (e) => {
    const listElement = e.target;
    if (
      listElement.scrollTop + listElement.clientHeight >=
      listElement.scrollHeight
    ) {
      e.preventDefault(); // 리스트가 끝까지 스크롤 되었을 때만 메인 페이지 스크롤 방지
    }
  };

  const goToPage = async (event, page) => {
    if (event) event.preventDefault();
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      await tick(); // DOM 업데이트가 끝날 때까지 대기
      if (listElement) {
        scrollToTopOfList();
      } else {
        console.error("listElement가 정의되지 않았습니다.");
      }
    }
  };

  const prevPage = async (event) => {
    if (event) event.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      await tick();
      updatePagedPlaces();
      scrollToTopOfList();
    }
  }

  const nextPage = async (event) => {
    if (event) event.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      await tick();
      updatePagedPlaces();
      scrollToTopOfList();
    }
  }

  $: pagedPlaces = places
    .filter((place) => place.name.toLowerCase().includes(filter.toLowerCase()))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  onMount(async () => {
    isClient = true;

    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 5,
      };

      map = new kakao.maps.Map(container, options);
      bounds = new kakao.maps.LatLngBounds();
      await tick();

      const mapTypeControl = new kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
      await fetchPlaces();
    } else {
      console.error("Kakao Maps API가 로드되지 않았습니다.");
    }
    await fetchPlaces();
  });

  const selectDay = (dayIndex) => {
  selectedDayIndex = dayIndex;
  showDayRoute(dayIndex);
};

</script>

<svelte:head>
  <script
    src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=c6876a5497297dc029c4d55c6e2da7bd&libraries=services"
  ></script>
</svelte:head>

<div class="container">
  <div class="sidebar">
    <div class="sidebar-header" on:click={() => toggleSection("경로찾기")}>
      경로찾기
    </div>
    <div class="sidebar-header" on:click={() => toggleSection("경로보기")}>
      경로보기
    </div>
  </div>

  {#if openSection === "경로찾기"}
    <div class="route-finding-section">
      <div class="area_1">
        <div class="options">
          <label>여행 일정:</label>
          <select bind:value={travelOption}>
            <option value="하루">하루</option>
            <option value="1박 2일">1박 2일</option>
            <option value="2박 3일">2박 3일</option>
          </select>

          <label>카테고리:</label>
          <select bind:value={category}>
            {#each categories as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>

          <label>지역:</label>
          <select bind:value={filter}>
            <option value="">모든 지역</option>
            {#each cities as city}
              <option value={city}>{city}</option>
            {/each}
          </select>
        </div>

        <!-- 출발지 검색 -->
        <div class="input-group">
          <input
            type="text"
            placeholder="출발지"
            bind:value={startSearchQuery}
          />
          <button on:click={() => searchPlaces("start")}>검색</button>
        </div>
        <ul class="search-results">
          {#each startSearchResults as result}
            <li on:click={() => selectPlace(result, "start")}>
              {result.name} - {result.address}
            </li>
          {/each}
        </ul>

        <!-- 도착지 검색 -->
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

        <!-- 경유지 검색 -->
        {#each waypoints as waypoint, index}
          <div class="input-group">
            <input
              type="text"
              placeholder="경유지"
              bind:value={waypointSearchQueries[index]}
            />
            <button on:click={() => searchPlaces("waypoint", index)}
              >검색</button
            >
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
          <button class="button" on:click|preventDefault={addWaypoint}
            >경유지 추가</button
          >
          <button class="button" on:click|preventDefault={removeWaypoint}
            >경유지 제거</button
          >
          <button class="button" on:click|preventDefault={findRoute}
            >찾기</button
          >
        </div>
      </div>

      <div class="area_list">
        <div class="existing-place-list">
          <ul>
            {#each pagedPlaces as place}
              <li
                class:selected={selectedPlaces.some((p) => p.id === place.id)}
                on:click={() => toggleMarker(place)}
                on:keydown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    toggleMarker(place);
                  }
                }}
              >
                {place.name} - {place.address}
              </li>
            {/each}
          </ul>
        </div>

        <div class="pagination">
          <button
            on:click={(event) => prevPage(event)}
            disabled={currentPage === 1}>이전</button
          >
          <span>{currentPage} / {totalPages}</span>
          <button
            on:click={(event) => nextPage(event)}
            disabled={currentPage === totalPages}>다음</button
          >
        </div>
      </div>
    </div>
  {/if}

  {#if openSection === "경로보기"}
    <div class="area_2">
      <div class="options">
        <label>경로 색상:</label>
        <input type="color" bind:value={routeColor} />

        <label>투명도:</label>
        <input type="range" min="0" max="1" step="0.1" bind:value={opacity} />
      </div>
      
      {#if dayRoutes && dayRoutes.length > 0}
  <div class="day-selection">
    {#each dayRoutes as _, index}
      <button
        class="{selectedDayIndex === index ? 'selected-day' : ''}"
        on:click={() => selectDay(index)}
      >
        {index + 1}일차
      </button>
    {/each}
  </div>
{/if}

{#if dayRoutes && dayRoutes[selectedDayIndex]}
<div class="day-place-list">
  <ul>
    {#each dayRoutes[selectedDayIndex] as place, idx}
      <li>
        {idx + 1}. {place.name} - {place.address}
      </li>
    {/each}
  </ul>
</div>
{/if}
      
{#if roadInfo && roadInfo[selectedDayIndex]}
        <div class="road-info">
          {#each roadInfo[selectedDayIndex] as info}
            <p>{info}</p>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <div id="map" class="map"></div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }
  .sidebar {
    width: 100px;
    height: 100%;
    background-color: #f0f0f0;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
  }
  .sidebar-header {
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    background-color: #e0e0e0;
    text-align: center;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }
  .route-finding-section {
    display: flex;
    width: 500px; /* area_1과 area_list의 너비 합 */
    height: 100%;
    background-color: #ffffff;
    border-left: 1px solid #ddd;
    position: absolute;
    left: 100px;
    z-index: 1000;
  }
  .area_1,
  .area_list {
    width: 250px;
    height: 100%;
    padding: 10px;
    overflow-y: auto;
  }
  .area_list {
    border-left: 1px solid #ddd;
  }
  .area_2 {
    width: 250px;
    height: 100%;
    background-color: #ffffff;
    border-left: 1px solid #ddd;
    padding: 10px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    position: absolute;
    left: 100px;
    z-index: 1000;
    overflow-y: auto;
  }
  #map {
    margin: 0;
    height: 100%;
    flex-grow: 1;
  }
  .map {
    height: 100%;
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
  .options {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    gap: 8px;
  }
  .options label {
    margin-right: 5px;
  }
  .search-results {
    list-style-type: none;
    padding: 0;
    margin: 0 0 10px;
    max-height: 150px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #ddd;
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
  /* 리스트 스타일 추가 */
  .existing-place-list {
    overflow-y: auto;
    max-height: 580px;
    margin-bottom: 10px;
  }
  .existing-place-list ul {
    list-style-type: none;
    padding: 0;
  }
  .existing-place-list li {
    padding: 8px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  .existing-place-list li.selected {
    background-color: #e0e0e0;
    font-weight: bold;
  }
  .existing-place-list li:hover {
    background-color: #f0f0f0;
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
  .pagination button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #ddd;
    border-radius: 5px;
    cursor: pointer;
  }
  .pagination-button:hover {
    background-color: #ccc;
  }
  .pagination span {
    margin: 0 5px;
  }
  .road-info {
    margin-top: 20px;
    overflow-y: auto;
    max-height: 400px;
  }
  .road-info p {
    margin: 5px 0;
  }
  .day-selection {
  margin-top: 10px;
}
.day-selection button {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  background-color: #e0e0e0;
  cursor: pointer;
}
.day-selection button:hover {
  background-color: #d0d0d0;
}
.selected-day {
  background-color: #0079a1;
  color: white;
}
.day-place-list {
  margin-top: 10px;
  max-height: 150px;
  overflow-y: auto;
}
.day-place-list ul {
  list-style-type: none;
  padding: 0;
}
.day-place-list li {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

</style>
