document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.querySelector(".gallery");

    // JSON 데이터 불러오기
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

        const img = document.createElement("img");
        img.src = imageUrl;
        galleryItem.appendChild(img);

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.innerHTML = `<span>복사: 0</span><span>좋아요: 0</span>`;
        galleryItem.appendChild(overlay);

        const promptDiv = document.createElement("div");
        promptDiv.classList.add("prompt");
        promptDiv.textContent = `프롬프트: ${tags.join(", ")}`;
        galleryItem.appendChild(promptDiv);

        const favorite = document.createElement("div");
        favorite.classList.add("favorite");
        favorite.textContent = "★";
        favorite.addEventListener("click", () => {
            favorite.classList.toggle("active");
        });
        galleryItem.appendChild(favorite);

        gallery.appendChild(galleryItem);
    }
});
