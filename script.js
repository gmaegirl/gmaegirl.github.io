document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");

    // JSON 데이터 불러오기
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            // 갤러리 아이템 생성
            data.forEach(item => {
                const galleryItem = document.createElement("div");
                galleryItem.classList.add("gallery-item");

                // 이미지 추가
                const img = document.createElement("img");
                img.src = item.image;
                galleryItem.appendChild(img);

                // 태그 추가
                const tagsDiv = document.createElement("div");
                tagsDiv.classList.add("tags");
                item.tags.forEach(tag => {
                    const tagSpan = document.createElement("span");
                    tagSpan.classList.add("tag");
                    tagSpan.textContent = tag;
                    tagsDiv.appendChild(tagSpan);
                });

                galleryItem.appendChild(tagsDiv);
                gallery.appendChild(galleryItem);
            });

            // 태그 필터링 기능 추가
            addTagFilter();
        })
        .catch(error => {
            console.error("JSON 로드 오류:", error);
        });

    // 태그 필터링 기능
    function addTagFilter() {
        const galleryItems = document.querySelectorAll(".gallery-item");
        const tags = document.querySelectorAll(".tag");

        tags.forEach(tag => {
            tag.addEventListener("click", () => {
                const tagName = tag.textContent;

                galleryItems.forEach(item => {
                    const itemTags = Array.from(item.querySelectorAll(".tag")).map(t => t.textContent);

                    if (itemTags.includes(tagName)) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }
});
