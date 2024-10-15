<script>
    import { onMount } from "svelte";

    let isLoggedIn = true; // 로그인 상태
    let username = "testUser"; // 로그인된 사용자 이름
    let selectedRegion = "지역 선택"; // 드롭다운에서 선택한 지역
    let posts = []; // 저장된 포스팅 리스트

    // 카카오 로그인 API 초기화
    onMount(() => {
        if (typeof window !== "undefined") {
            const script = document.createElement("script");
            script.src = "https://developers.kakao.com/sdk/js/kakao.js";
            script.onload = () => {
                Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7'); // 카카오 API 키
                console.log(Kakao.isInitialized()); // 초기화 확인
                checkLoginStatus(); // 로그인 상태 확인
            };
            document.head.appendChild(script);
        }

        // 로컬 스토리지에서 포스팅 데이터 불러오기
        let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        posts = storedPosts;
    });

    // 로그인 상태 확인
    function checkLoginStatus() {
        const token = Kakao.Auth.getAccessToken();
        if (token) {
            getUserInfo(); // 로그인 상태일 경우 사용자 정보 가져오기
        }
    }

    // 사용자 정보 가져오기
    function getUserInfo() {
        Kakao.API.request({
            url: '/v2/user/me',
            success: function(response) {
                isLoggedIn = true;
                username = response.kakao_account.profile.nickname;  // 카카오 사용자 이름 저장
                localStorage.setItem("username", username);  // 사용자 이름 로컬 스토리지에 저장
            },
            fail: function(error) {
                console.error("사용자 정보 가져오기 실패:", error);
            }
        });
    }

    // 카카오 로그인 함수
    function kakaoLogin() {
        Kakao.Auth.login({
            success: function (authObj) {
                console.log("로그인 성공:", authObj);
                getUserInfo(); // 로그인 후 사용자 정보 가져오기
            },
            fail: function (err) {
                console.error("로그인 실패:", err);
                alert('로그인 실패');
            }
        });
    }

    // 지역 선택 함수
    function selectRegion(region) {
        selectedRegion = region;
    }

    // 이미지 파일 업로드 처리 함수
    function loadFile(input) {
        const editor = document.querySelector('.editor'); // 에디터 영역

        for (const file of input.files) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgTag = `<img src="${e.target.result}" alt="업로드 이미지" style="max-width: 100%; margin: 10px 0;" />`;
                editor.innerHTML += imgTag; // 에디터 안에 이미지 삽입
            };
            reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
        }
    }

    // 포스팅 제출 함수
    function submitPost() {
        if (!isLoggedIn) {
            alert("로그인 후 글을 작성할 수 있습니다.");
            return;
        }

        const titleInput = document.getElementById('post-title').value.trim();
        const postContent = document.querySelector('.editor').innerHTML.trim();

        // 필수 입력 검증
        if (!selectedRegion || selectedRegion === "지역 선택") {
            alert("지역을 선택해 주세요.");
            return;
        }
        if (!titleInput) {
            alert("제목을 입력해 주세요.");
            return;
        }
        if (!postContent) {
            alert("내용을 입력해 주세요.");
            return;
        }

        // 이미지 URL 처리
        let imageUrl = ""; // 기본적으로 비어있음
        const imageInput = document.getElementById('image-upload'); // 이미지 업로드 input 요소

        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imageUrl = event.target.result; // 이미지 URL 설정
                addPost(titleInput, postContent, selectedRegion, imageUrl); // 포스트 추가
            };
            reader.readAsDataURL(imageInput.files[0]); // 첫 번째 파일을 데이터 URL로 읽기
        } else {
            addPost(titleInput, postContent, selectedRegion); // 이미지 없이 포스트 추가
        }

        alert("포스팅이 완료되었습니다!");
        resetForm();
    }

    // 포스트 추가 함수
    function addPost(title, content, region, imageUrl = "") {
    let storedPosts = JSON.parse(localStorage.getItem("posts")) || [];

    const newPost = {
        id: Date.now(), // 고유 ID로 현재 시간 사용
        title,
        content,
        region,
        username: localStorage.getItem("username"),
        date: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        image: imageUrl, // 이미지 URL 추가
    };

    storedPosts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(storedPosts)); // 로컬 스토리지에 저장
}


    // 폼 리셋
    function resetForm() {
        document.getElementById('post-title').value = ""; // 제목 리셋
        document.querySelector('.editor').innerHTML = ""; // 에디터 리셋
        selectedRegion = "지역 선택"; // 지역 리셋
        document.getElementById('selected-region').innerText = selectedRegion; // 버튼 텍스트 리셋
    }
</script>

<body>
    <div class="travelLogP posting">
        {#if isLoggedIn}
            <h1>트래블로그 포스팅하기</h1>
            <div class="dropBtn">
                <button class="dropbtn">{selectedRegion} <span class="arrow">▼</span></button>
                <div class="dropdown-content">
                    <a href="#" on:click={() => selectRegion("서울")}>서울</a>
                    <a href="#" on:click={() => selectRegion("부산")}>부산</a>
                    <a href="#" on:click={() => selectRegion("제주")}>제주</a>
                    <a href="#" on:click={() => selectRegion("강릉")}>강릉</a>
                    <a href="#" on:click={() => selectRegion("군산")}>군산</a>
                    <a href="#" on:click={() => selectRegion("경주")}>경주</a>
                    <a href="#" on:click={() => selectRegion("인천")}>인천</a>
                    <a href="#" on:click={() => selectRegion("수원")}>수원</a>
                    <a href="#" on:click={() => selectRegion("포항")}>포항</a>
                    <a href="#" on:click={() => selectRegion("울산")}>울산</a>
                    <a href="#" on:click={() => selectRegion("대구")}>대구</a>
                    <a href="#" on:click={() => selectRegion("전주")}>전주</a>
                </div>
            </div>
            <p>제목</p>
            <input type="text" placeholder="멋진 제목을 지어보아요" id="post-title">
            <div class="editor" contenteditable="true" placeholder="여행에서 있던 일을 공유해주세요~!"></div>
            <input type="file" accept="image/*" multiple on:change={(e) => loadFile(e.target)} class="upload-btn" id="image-upload">
            <a href="/travelLog" class="posting" on:click={submitPost}>포스팅</a>
        {:else}
            <h1>로그인 후 이용해주세요</h1>
            <button on:click={kakaoLogin}>카카오 로그인</button>
        {/if}
    </div>
</body>
