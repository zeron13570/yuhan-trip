<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Place List</title>
</head>
<body>
    <div id="root"></div>  <!-- React 컴포넌트를 렌더링할 대상 -->

    <!-- React와 ReactDOM 불러오기 -->
    <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>

    <!-- Babel 스크립트 -->
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

    <!-- React 코드 -->
    <script type="text/babel">
      const { useState, useEffect } = React;

      const PlaceList = () => {
        const [places, setPlaces] = useState([]);

        useEffect(() => {
          const fetchPlaces = async () => {
            try {
              const response = await fetch('http://localhost:8080/api/places');  // Spring Boot API 엔드포인트 호출
              if (!response.ok) {
                throw new Error('네트워크 응답에 문제가 있습니다.');
              }
              const data = await response.json();  // JSON 데이터를 받아옴
              setPlaces(data);  // 상태에 데이터 설정
            } catch (error) {
              console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
          };

          fetchPlaces();
        }, []);

        return (
          <div>
            <h1>Place List</h1>
            <ul>
              {places.map((place) => (
                <li key={place.id}>
                  {place.name} - {place.address}
                </li>
              ))}
            </ul>
          </div>
        );
      };

      // ReactDOM을 사용하여 컴포넌트를 HTML에 렌더링
      ReactDOM.render(<PlaceList />, document.getElementById('root'));
    </script>
</body>
</html>
