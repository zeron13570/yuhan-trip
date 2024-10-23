<script>
    import { onMount } from "svelte";

    let city = "";
    let currentPage = 1;
    const itemsPerPage = 10;

    const allCafes = [
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" },
        { name: "음식점 이름", description: "식당 주소" }
    ];

    let currentCafes = [];
    let totalPages = 0;

    function updateCafes() {
        const start = (currentPage - 1) * itemsPerPage;
        currentCafes = allCafes.slice(start, start + itemsPerPage);
        totalPages = Math.ceil(allCafes.length / itemsPerPage);
    }

    function changePage(page) {
        if (page < 1 || page > totalPages) return; // 유효성 검사
        currentPage = page;
        updateCafes();
    }

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        city = params.get("name") || "음식점"; // 기본값 설정
        updateCafes();
    });
</script>

<body>
    <div class="PlacePage">
        <h1>{city} 음식점</h1>
        <ul>
            {#each currentCafes as cafe}
                <a href="" target="_blank">
                    <li>
                        <p>{cafe.name}</p>
                        {cafe.description}
                    </li>
                </a>
            {/each}
        </ul>
        <div class="pagination">
            <button class={currentPage > 1 ? '' : 'hidden'} on:click={() => changePage(currentPage - 1)}>&lt;</button>
            <p>{currentPage}/{totalPages}</p>
            <button class={currentPage * itemsPerPage < allCafes.length ? '' : 'hidden'} on:click={() => changePage(currentPage + 1)}>&gt;</button>
        </div>  
    </div>
</body>
