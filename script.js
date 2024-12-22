document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");

    // JSON 데이터 로드
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => addGalleryItem(item.image, item.tags));
        })
        .catch(error => console.error("JSON 로드 오류:", error));

    // 갤러리 아이템 추가
    function addGalleryItem(imageUrl, tags) {
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");

        // 이미지 클릭 시 태그 복사 및 집계 업데이트
        const img = document.createElement("img");
        img.src = imageUrl;
        img.addEventListener("click", () => {
            navigator.clipboard.writeText(tags.join(", "))
                .then(() => {
                    alert("Tag copied!");
                    const currentCopy = parseInt(stats.textContent.match(/Copy: (\d+)/)[1]);
                    const currentFavorite = parseInt(stats.textContent.match(/Favorite: (\d+)/)[1]);
                    stats.textContent = `Copy: ${currentCopy + 1} Favorite: ${currentFavorite}`;
                });
        });
        galleryItem.appendChild(img);

        const details = document.createElement("div");
        details.classList.add("details");

        // 태그 표시
        const tagDiv = document.createElement("div");
        tagDiv.classList.add("tags");
        tagDiv.textContent = tags.join(", ");
        details.appendChild(tagDiv);

        // 집계 수
        const stats = document.createElement("div");
        stats.classList.add("stats");
        stats.textContent = `Copy: 0 Favorite: 0`;
        details.appendChild(stats);

        galleryItem.appendChild(details);

        // 즐겨찾기 버튼 추가
        const favorite = document.createElement("div");
        favorite.classList.add("favorite");
        favorite.textContent = "★";
        favorite.addEventListener("click", () => {
            favorite.classList.toggle("active");
            const currentFavorite = favorite.classList.contains("active") ? 1 : 0;
            const currentCopy = parseInt(stats.textContent.match(/Copy: (\d+)/)[1]);
            stats.textContent = `Copy: ${currentCopy} Favorite: ${currentFavorite}`;
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
            const tagText = item.querySelector(".tags").textContent.toLowerCase();
            item.style.display = tagText.includes(query) ? "block" : "none";
        });
    });
});
