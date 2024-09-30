const api = "https://66f2998a71c84d805875ef6d.mockapi.io/scammer";
const apiWarning = "https://66f2998a71c84d805875ef6d.mockapi.io/warnings";
const scammerList = document.querySelector(".scammer__list");
const scammerDesc = document.querySelector(".scammer__desc");
const scammerTitle = document.querySelector(".scammer__title");
const titleToday = document.querySelector(".title-today");
const notFound = document.querySelector(".not-found");
const loading = document.querySelector(".loading-wrap");
let scammerData = [];
let approveData = [];

function formatDate(dateString) {
  // Nếu không có dateString, sử dụng thời gian hiện tại
  const date = dateString ? new Date(dateString) : new Date();

  // Lấy ngày, tháng và năm trực tiếp từ đối tượng Date
  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng được tính từ 0, nên cần cộng thêm 1
  const year = date.getFullYear();

  // Định dạng ngày và tháng thành 2 chữ số
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
}

if (titleToday) {
  titleToday.textContent = `Hôm nay ${formatDate()}`;
}

function handleShowModal(item) {
  const imageListHTML = item.images
    .map(
      (item) =>
        `
        <a onclick="event.preventDefault();" href="${item}"iv class="modal-image__item">
            <img src="${item}" alt="Scammer Image" />
        </a>
      `
    )
    .join("");
  const templateModal = `
<div class="modal">
    <div class="modal__overlay"></div>
    <div class="modal__content">
        <div class="modal__header">
        <div class="modal__header-title">Chi tiết tố cáo</div>
        <div class="modal__close">
            <img
            src="./assets/images/close-icon.svg"
            alt=""
            class="modal__close-icon"
            />
        </div>
        </div>
        <div class="modal-body">
        <div class="modal-detail">
            <div class="modal-detail__top">
            <img
                srcset="./assets/images/avatar.png 2x"
                alt=""
                class="modal-detail__avatar"
            />
            <div class="modal-detail__profile">
                <h4 class="modal-detail__name">${item.accusedName}</h4>
                <p class="modal-detail__desc">#${
                  item.id
                } - Tố cáo vào ngày ${formatDate(item.date)}</p>
            </div>
            </div>
            <div class="modal-info__list">
            <div class="modal-info__item">
                <div class="modal-info__label">Số điện thoại</div>
                <div class="modal-info__text text-single">${
                  item.phoneNumberReport
                }</div>
            </div>
            <div class="modal-info__item">
                <div class="modal-info__label">Số tài khoản</div>
                <div class="modal-info__text text-single">${
                  item.bankNumber
                }</div>
            </div>
            <div class="modal-info__item">
                <div class="modal-info__label">Ngân hàng</div>
                <div class="modal-info__text text-single">${item.bankName}</div>
            </div>
            <div class="modal-info__text text-singlearea">
                <div class="modal-info__label">Nội dung tố cáo</div>
                <div class="modal-info__text">${item.contentReport}</div>
            </div>
            </div>
        </div>
        <div class="modal-detail">
            <div class="modal-detail__top">
            <img
                srcset="./assets/images/avatar-2.png 2x"
                alt=""
                class="modal-detail__avatar"
            />
            <div class="modal-detail__profile">
                <h4 class="modal-detail__name">${item.nameSender}</h4>
                <p class="modal-detail__desc">Người gửi</p>
            </div>
            </div>
            <div class="modal-info__list">
            <div class="modal-info__item">
                <div class="modal-info__label">Trạng thái</div>
                <div class="modal-info__text text-single">${item.option}</div>
            </div>
            <div class="modal-info__item">
                <div class="modal-info__label">Liên hệ</div>
                <div class="modal-info__text text-single">${
                  item.phoneNumberSender
                }</div>
            </div>
            <div class="modal-info__image">
                <div class="modal-info__label">Hình ảnh bẳng chứng</div>
                <div class="modal-image__list">
                ${imageListHTML}</div
            </div>
            </div>
        </div>
        </div>
    </div>
</div>
`;

  document.body.insertAdjacentHTML("afterbegin", templateModal);
  document.body.style.overflow = "hidden";

  const modalClose = document.querySelector(".modal__close");
  const modalOverlay = document.querySelector(".modal__overlay");

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  const imageList = document.querySelector(".modal-image__list");
  lightGallery(imageList, {
    plugins: [lgZoom, lgThumbnail],
    speed: 500,
    download: false,
    actualSize: false,
    zoomFromOrigin: false,
    // Bạn có thể bật hoặc tắt tính năng download ở đây
  });
}

function closeModal() {
  const modal = document.querySelector(".modal");
  modal.remove();
  document.body.style.overflow = "auto";
}

async function getScammer(data) {
  // Xóa danh sách cũ trước khi thêm mới
  scammerList.innerHTML = "";
  loading.classList.add("active");

  // Lấy ngày hiện tại và đặt thời gian về 00:00:00
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày

  // Hiển thị danh sách mới từ dữ liệu
  const todayData = data.filter((item) => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày
    return itemDate.getTime() === today.getTime(); // So sánh ngày
  });

  // Hiển thị danh sách mới từ dữ liệu
  if (todayData.length > 0) {
    todayData.map((item, index) => {
      const scammerInfoHTML = `
      <li class="scammer__item" data-id="${item.id}">
        <img src="https://i.ibb.co/wCTchvk/avatar.png" alt="" class="scammer__avatar"/>
        <div class="scammer__info">
          <h3 class="scammer__name text-single">${item.accusedName}</h3>
          <p class="scammer__date">#${index + 1} - ${formatDate(item.date)}</p>
        </div>
      </li>
    `;
      scammerList.insertAdjacentHTML("afterbegin", scammerInfoHTML);

      // Gán sự kiện click cho phần tử này sau khi nó được thêm vào DOM
      const scammerItem = scammerList.querySelector(`.scammer__item`);
      scammerItem.addEventListener("click", () => handleShowModal(item));
      scammerDesc.textContent = `Có ${todayData.length} cảnh báo hôm nay`;
      loading.classList.remove("active");
    });
  } else {
    scammerDesc.textContent = `Có ${todayData.length} cảnh báo`;
    loading.classList.remove("active");
    notFound.classList.add("active");
  }
}

async function fetchScammerData() {
  try {
    const response = await axios.get(api);
    const data = response.data;
    scammerData = data.filter((item) => {
      // Kiểm tra giá trị của từng item.approve
      return item.approve === true;
    });
    getScammer(scammerData);
  } catch (error) {
    console.error(error);
    notFound.classList.add("active");
  }
}

fetchScammerData(); // Lấy dữ liệu từ API và hiển thị lần đầu

// Handle Search
const formSearch = document.querySelector(".form-search");
const inputSearch = document.querySelector(".input-search");

formSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchValue = inputSearch.value.trim();

  // Lọc dữ liệu theo số tài khoản
  const filteredData = scammerData.filter(
    (item) =>
      item.bankNumber.includes(searchValue) ||
      item.phoneNumberReport?.includes(searchValue)
  );

  // Hiển thị dữ liệu đã lọc
  getScammer(filteredData);
  if (searchValue === "") {
    getScammer(scammerData);
    notFound.classList.remove("active");
  }
});

// Handle Open warning

// end handle Open warning

const wariningList = document.querySelector(".warining__list");
async function getWarning() {
  const response = await axios.get(apiWarning);
  const dataWarning = await response.data;
  if (dataWarning.length > 0) {
    dataWarning.map((item) => {
      const warningItemHTML = `<li class="warning__item">
            <div class="warning__header">
              <div class="warning-icon">
                <img src="./assets/images/arrow-right-icon-2.svg" alt="" />
              </div>
              ${item.title}
            </div>
            <div class="warning__content">${item.content}</div>
          </li>`;
      wariningList.insertAdjacentHTML("afterbegin", warningItemHTML);
    });
    const warningHeader = wariningList.querySelectorAll(".warning__header");
    warningHeader.forEach((item) => {
      item.addEventListener("click", (e) => {
        const warningContent = e.target.nextElementSibling;
        warningContent.style.height = `${warningContent.scrollHeight}px`;
        const icon = e.target.querySelector(".warning-icon");
        warningContent.classList.toggle("open");
        icon.classList.toggle("open");
        if (!warningContent.classList.contains("open")) {
          warningContent.style.height = `0px`;
        }
      });
    });
  }
}

getWarning();
