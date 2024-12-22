document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");

    // JSON 데이터 불러오기
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(item => addGalleryItem(item.image, item.tags, item.category));
            addTagFilter();
        })
        .catch(error => console.error("JSON 로드 오류:", error));

    // 검색창 필터링 기능
    document.getElementById("search").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const galleryItems = document.querySelectorAll(".gallery-item");

        galleryItems.forEach(item => {
            const itemTags = Array.from(item.querySelectorAll(".tag")).map(t => t.textContent.toLowerCase());
            item.style.display = itemTags.some(tag => tag.includes(query)) ? "block" : "none";
        });
    });

    // 업로드 폼 처리
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

    // 갤러리 항목 추가 함수
    function addGalleryItem(imageUrl, tags, category = "main") {
        const galleryItem = document.createElement("div");
        galleryItem.classList.add("gallery-item");
        galleryItem.dataset.category = category;
    
        const img = document.createElement("img");
        img.src = imageUrl;
        galleryItem.appendChild(img);

        // 오버레이 추가
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        const stats = document.createElement("div");
        stats.classList.add("stats");
        stats.innerHTML = `<span>복사: 0</span><span>좋아요: 0</span>`;

        const favorite = document.createElement("div");
        favorite.classList.add("favorite");
        favorite.textContent = "★";
        favorite.addEventListener("click", () => {
            favorite.classList.toggle("active");
        });

        overlay.appendChild(stats);
        overlay.appendChild(favorite);
        galleryItem.appendChild(overlay);

        // 프롬프트 추가 시작
        const promptDiv = document.createElement("div");
        promptDiv.classList.add("prompt");
        promptDiv.textContent = `프롬프트: ${tags.join(", ")}`;
        galleryItem.appendChild(promptDiv);
        // 프롬프트 추가 끝
    
        gallery.appendChild(galleryItem);
        addTagFilter();
    }

    // 태그 클릭 시 프롬프트 복사 기능
    function addTagFilter() {
        const tags = document.querySelectorAll(".tag");
        tags.forEach(tag => {
            tag.addEventListener("click", () => {
                const tagText = tag.textContent;
                navigator.clipboard.writeText(tagText)
                    .then(() => alert(`"${tagText}" 프롬프트가 복사되었습니다!`))
                    .catch(() => alert("프롬프트 복사에 실패했습니다."));
            });
        });
    }
});
