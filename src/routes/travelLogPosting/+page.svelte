<script>
    import { onMount } from "svelte";

    let selectedImage;
    let title = '';
    let content = '';
    let region = '';
    let username = localStorage.getItem('username') || '';
    let userId = localStorage.getItem('userId') || '';  // localStorage에서 userId 가져오기
    let post = { image: '' };
    let imageUrls = [];
    let selectedRegion = "지역 선택";

    onMount(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7');
        }

        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            username = storedUsername;
        }
        userId = localStorage.getItem('userId'); // userId를 가져오기
    });

    function kakaoLogin() {
        if (!Kakao.isInitialized()) {
            Kakao.init('1d28a43f8e4e4915d4c2010b36c8a8c7');
        }
        Kakao.Auth.login({
            success: function(authObj) {
                console.log("Kakao login successful:", authObj);
                isLoggedIn = true;
                localStorage.setItem("accessToken", authObj.access_token);
                getUserInfo(); // 로그인 성공 후 사용자 정보 가져오기
            },
            fail: function(error) {
                console.error("Kakao login failed:", error);
            }
        });
    }
    function getUserInfo() {
        Kakao.API.request({
            url: '/v2/user/me',
            success: function(response) {
                isLoggedIn = true;
                userName = response.kakao_account.profile.nickname;
                userId = response.id;  // userId 추가
                localStorage.setItem("userId", userId);  // userId를 localStorage에 저장
                localStorage.setItem("accessToken", Kakao.Auth.getAccessToken()); 
            },
            fail: function(error) {
                console.error('Error fetching user info:', error);
            }
        });
    }

    function handleImageUpload(event) {
        const files = Array.from(event.target.files);

        files.forEach(file => {
            const formData = new FormData();
            formData.append('image', file);

            fetch('http://localhost:3000/upload-image', {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('이미지 업로드 실패');
                }
                return response.json();
            })
            .then(data => {
                if (data.imagePath) {
                    imageUrls.push(data.imagePath);
                    insertImageToEditor(data.imagePath);
                } else {
                    alert("이미지 업로드 실패");
                }
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                alert(error.message);
            });
        });
    }

    function insertImageToEditor(url) {
        const editor = document.querySelector(".editor");
        const img = document.createElement("img");
        img.src = `http://localhost:3000${url}`;
        img.alt = "업로드된 이미지";
        img.style.maxWidth = "100%";
        img.style.margin = "10px 0";
        editor.appendChild(img);
    }

    function selectRegion(region) {
        selectedRegion = region;
    }

    function submitPost() {
    const editor = document.querySelector(".editor");
    content = editor.innerHTML.trim(); // 공백 제거

    // 모든 필드 확인
    if (!title.trim() || !content || selectedRegion === "지역 선택") {
        let errorMessage = "모든 필드를 입력해주세요.";
        if (!title.trim()) errorMessage += "\n- 제목을 입력하세요.";
        if (!content) errorMessage += "\n- 내용을 입력하세요.";
        if (selectedRegion === "지역 선택") errorMessage += "\n- 지역을 선택하세요.";

        alert(errorMessage);
        return; // 경고 메시지 후 종료
    }

    const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

    const newPost = {
        title,
        content,
        region: selectedRegion,
        username: localStorage.getItem("username"),
        userId: userId,  // 작성자 userId 추가
        likes: 0,
        likedBy: [],
        image: firstImageUrl
    };

    fetch('http://localhost:3000/add-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);
        if (data.message) {
            alert(data.message);
        }
        window.location.href = "/travelLog";
    })
    .catch(error => {
        console.error('Fetch error:', error);
        alert("포스팅 중 오류가 발생했습니다.");
    });
}

</script>

<body>
    <div class="travelLogP posting">
        <h1>트래블로그 포스팅하기</h1>

        <!-- 지역 선택 버튼 -->
        <div class="dropBtn">
            <button class="dropbtn" aria-label="지역선택">{selectedRegion} <span class="arrow">▼</span></button>
            <div class="dropdown-content">
                <a href="#" on:click={() => selectRegion("서울")}>서울</a>
                <a href="#" on:click={() => selectRegion("부산")}>부산</a>
                <a href="#" on:click={() => selectRegion("제주")}>제주</a>
                <a href="#" on:click={() => selectRegion("전주")}>전주</a>
                <a href="#" on:click={() => selectRegion("포항")}>포항</a>
                <a href="#" on:click={() => selectRegion("울산")}>울산</a>
                <a href="#" on:click={() => selectRegion("수원")}>수원</a>
                <a href="#" on:click={() => selectRegion("대구")}>대구</a>
                <a href="#" on:click={() => selectRegion("군산")}>군산</a>
                <a href="#" on:click={() => selectRegion("인천")}>인천</a>
                <a href="#" on:click={() => selectRegion("경주")}>경주</a>
                <a href="#" on:click={() => selectRegion("강릉")}>강릉</a>
            </div>
        </div>

        <!-- 제목 입력 -->
        <p>제목</p>
        <input 
            type="text"
            placeholder="멋진 제목을 지어보아요"
            bind:value={title}
            id="post-title"
            on:input={() => {
                if (title.length > 16) {
                    title = title.slice(0, 16); // 16글자까지만 입력 가능하도록 제한
                    alert("제목은 16글자 이내로 작성해주세요.");
                }
            }}
        >

        <!-- 글 작성 및 이미지 추가 -->
        <div class="editor" contenteditable="true" placeholder="여행에서 있던 일을 공유해주세요~!"></div>

        <!-- 이미지 업로드 버튼 -->
        <input type="file" accept="image/*" multiple on:change={handleImageUpload} class="upload-btn" id="image-upload">

        <!-- 포스팅 버튼 -->
        <a href="#" class="posting" on:click={submitPost} aria-label="포스트 작성하기">포스팅</a>
    </div>
</body>
