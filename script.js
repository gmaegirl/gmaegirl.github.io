document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");

    // JSON 데이터 로드
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => addGalleryItem(item.image, item.tags, item.category));
        })
        .catch(error => console.error("JSON 로드 오류:", error));

    // 갤러리 아이템 추가 함수
    function addGalleryItem(imageUrl, tags, category = "main") {
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");

        // 이미지 추가
        const img = document.createElement("img");
        img.src = imageUrl;
        galleryItem.appendChild(img);

        // 오버레이 추가
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        // 프롬프트 추가
        const promptDiv = document.createElement("div");
        promptDiv.classList.add("prompt");
        promptDiv.textContent = `프롬프트: ${tags.join(", ")}`;
        overlay.appendChild(promptDiv);

        // 복사/좋아요 정보 추가
        const stats = document.createElement("div");
        stats.classList.add("stats");
        stats.innerHTML = `<span>복사: 0</span><span>좋아요: 0</span>`;
        overlay.appendChild(stats);

        galleryItem.appendChild(overlay);

        // 즐겨찾기 아이콘 추가
        const favorite = document.createElement("div");
        favorite.classList.add("favorite");
        favorite.textContent = "★";
        favorite.addEventListener("click", () => {
            favorite.classList.toggle("active");
        });
        galleryItem.appendChild(favorite);

        gallery.appendChild(galleryItem);
    }

    // 이미지 업로드 처리
    document.getElementById("upload-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const tagsInput = document.getElementById("upload-tags").value;
        const imageInput = document.getElementById("upload-image").files;

        if (!tagsInput || imageInput.length === 0) {
            alert("이미지와 태그를 모두 입력해주세요!");
            return;
        }

        const tags = tagsInput.split(",").map(tag => tag.trim());
        Array.from(imageInput).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageUrl = event.target.result;
                addGalleryItem(imageUrl, tags, "user-upload");
            };
            reader.readAsDataURL(file);
        });

        document.getElementById("upload-tags").value = "";
        document.getElementById("upload-image").value = "";
    });

    // 검색 필터
    document.getElementById("search").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const galleryItems = document.querySelectorAll(".gallery-item");

        galleryItems.forEach(item => {
            const itemTags = Array.from(item.querySelectorAll(".prompt")).map(p => p.textContent.toLowerCase());
            item.style.display = itemTags.some(tag => tag.includes(query)) ? "block" : "none";
        });
    });
});
