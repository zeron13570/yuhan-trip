<head>
  <!-- html2pdf.js CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.js"></script>
</head>

<script>
  import { onMount } from 'svelte';
  let travelOption;
  let dayRoutes = [];
  let roadInfo = [];

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('option')) {
      travelOption = decodeURIComponent(urlParams.get('option'));
    }

    if (urlParams.has('dayRoutes')) {
      dayRoutes = JSON.parse(decodeURIComponent(urlParams.get('dayRoutes')));
    }

    if (urlParams.has('roadInfo')) {
      roadInfo = JSON.parse(decodeURIComponent(urlParams.get('roadInfo')));
    }
  });

  // PDF 생성 함수
  function generatePDF() {
    const element = document.getElementById('route-section');  // PDF로 저장할 HTML 요소
    const button = document.querySelector('.button');  // PDF로 저장하기 버튼

    // PDF 생성 전, 크기를 축소하는 스타일을 추가
    button.style.display = 'none';  // 버튼 숨기기

    const options = {
      margin: [10, 0, 0, 0],  // 페이지 마진 (상, 하, 좌, 우)
      filename: 'travel_route.pdf',  // 파일명
      image: { type: 'jpeg', quality: 1 },  // 이미지 품질
      html2canvas: { scale: 2 },  // 캡처 해상도 (scale을 2로 설정해 해상도를 유지)
      jsPDF: {
        unit: 'mm', 
        format: 'a3', 
        orientation: 'portrait',
        compressPdf: true,  // PDF 파일 크기 압축
        // PDF 변환 시 스케일링 적용 (변환된 PDF만 축소됨)
        scale: 0.8, // PDF 내에서 크기 축소 (화면에서는 크기 변화 없음)
      }
    };

    // html2pdf를 이용해 PDF로 저장
    html2pdf()
      .from(element)  // 요소를 PDF로 변환
      .set(options)   // 설정 적용
      .save()         // 저장

      // PDF 생성 후 원래 스타일로 복원
      .finally(() => {
        button.style.display = '';  // 버튼 다시 보이도록 설정
      });
  }
</script>

<!-- 경로 저장 페이지 UI -->
<section id="route-section" class="routeSave">
  <h1>{travelOption} 여행 경로</h1>

  {#if dayRoutes.length > 0}
    <div class="day-areas">
      {#each dayRoutes as dayRoute, dayIndex}
        <div class="day-area">
          <h3>{dayIndex + 1}일차</h3>
          
          <ul>
            {#each dayRoute as place, idx}
              <li>{idx + 1}. {place.name} - {place.address}</li>
            {/each}
          </ul>

          {#if roadInfo[dayIndex]}
            <div class="road-info">
              <strong>도로 정보:</strong>
              {#each roadInfo[dayIndex] as info}
                <p>{info}</p>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- PDF로 저장하기 버튼 -->
  <button class="button" on:click={generatePDF}>PDF로 저장하기</button>
</section>
