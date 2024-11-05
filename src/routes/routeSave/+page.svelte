<script>
  import { onMount } from 'svelte';

  let printContent = '';  // 저장된 인쇄 내용을 표시할 변수
  let travelOption = '';  // 여행 옵션

  // 페이지가 로드되면 localStorage에서 인쇄 내용을 읽어옵니다.
  onMount(() => {
    printContent = localStorage.getItem('printContent') || '내용이 없습니다.'; // 저장된 내용이 없으면 기본 메시지 표시

    // 쿼리 파라미터에서 여행 옵션을 가져옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    travelOption = urlParams.get('option') || '알 수 없음';  // option 파라미터가 없으면 기본값 '알 수 없음' 설정
  });
</script>

<section class="routeSave">
  <h1>{travelOption} 경로</h1>
  <pre class="routeData">{printContent}</pre>
</section>
