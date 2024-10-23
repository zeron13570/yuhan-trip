<script>
// 페이지가 로드될 때 실행
window.onload = function() {
    // 이미지를 찾기
    let existingImage = document.getElementById("seoul-map");
    
    // 이미지가 없다면 새로 생성
    if (!existingImage) {
        const img = document.createElement("img");
        img.id = "seoul-map"; // ID를 설정하여 나중에 쉽게 찾을 수 있게 함
        img.src = "SeoulMap.png"; // 이미지 경로
        img.useMap = "#image-map"; // 이미지 맵 연결
        img.alt = "서울 지도";

        document.body.appendChild(img);
        
        // 이미지 맵 생성
        const imageMap = document.createElement("map");
        imageMap.name = "image-map";

        const areas = [
            { alt: "강서구", title: "강서구", href: "", coords: "206,352,115,292" },
            { alt: "양천구", title: "양천구", href: "", coords: "191,401,256,433" },
            { alt: "구로구", title: "구로구", href: "", coords: "174,457,220,487" },
            { alt: "영등포구", title: "영등포구", href: "", coords: "289,387,359,426" },
            { alt: "금천구", title: "금천구", href: "", coords: "276,521,334,554" },
            { alt: "관악구", title: "관악구", href: "", coords: "345,493,418,554" },
            { alt: "동작구", title: "동작구", href: "", coords: "368,440,412,464" },
            { alt: "서초구", title: "서초구", href: "", coords: "461,463,528,511" },
            { alt: "강남구", title: "강남구", href: "", coords: "554,459,635,505" },
            { alt: "송파구", title: "송파구", href: "", coords: "659,429,724,467" },
            { alt: "강동구", title: "강동구", href: "", coords: "699,332,788,366" },
            { alt: "은평구", title: "은평구", href: "", coords: "315,189,377,220" },
            { alt: "마포구", title: "마포구", href: "", coords: "286,315,354,349" },
            { alt: "서대문구", title: "서대문구", href: "", coords: "343,284,392,308" },
            { alt: "용산구", title: "용산구", href: "https://www.google.com/search?q=%EC%9A%A9%EC%82%B0%EA%B5%AC+%EC%B9%B4%ED%8E%98", coords: "412,365,477,415" },
            { alt: "종로구", title: "종로구", href: "", coords: "413,265,472,301" },
            { alt: "중구", title: "중구", href: "", coords: "441,320,491,340" },
            { alt: "강북구", title: "강북구", href: "", coords: "467,146,530,183" },
            { alt: "성북구", title: "성북구", href: "", coords: "484,234,544,266" },
            { alt: "도봉구", title: "도봉구", href: "", coords: "514,78,564,129" },
            { alt: "노원구", title: "노원구", href: "", coords: "586,113,640,164" },
            { alt: "중랑구", title: "중랑구", href: "", coords: "619,234,672,275" },
            { alt: "광진구", title: "광진구", href: "", coords: "604,346,660,371" },
            { alt: "동대문구", title: "동대문구", href: "", coords: "549,273,601,300" },
            { alt: "성동구", title: "성동구", href: "", coords: "523,333,583,364" }
        ];

        // 각 area를 생성하여 map에 추가
        areas.forEach(areaData => {
            const area = document.createElement("area");
            area.alt = areaData.alt;
            area.title = areaData.title;
            area.href = areaData.href;
            area.coords = areaData.coords;
            area.shape = "rect"; // 모든 area를 rectangle로 설정
            imageMap.appendChild(area);
        });

        // body에 이미지 맵 추가
        document.body.appendChild(imageMap);
    }
};
</script>