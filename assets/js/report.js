const apiKey = "66b42c2863c28abea36e4bbe28a019c8";
const enpoin = "https://66f2998a71c84d805875ef6d.mockapi.io/scammer";
const uploadImage = document.getElementById("uploadImage");
const fromPreviewWrap = document.querySelector(".from__preview-wrap");
const formUploadWrap = document.querySelector(".form__upload-wrap");
uploadImage.addEventListener("change", handleUploadImage);
let arrayImage = [];

const textarea = document.getElementById("contentReport");

textarea.addEventListener("input", function () {
  this.style.height = "auto"; // Đặt lại chiều cao để tính toán lại
  this.style.height = this.scrollHeight + "px"; // Đặt chiều cao bằng với nội dung
});

async function uploadImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("extension", 0);
  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData
    );
    return response.data.data.url;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function handleUploadImage(e) {
  const images = [...e.target.files];
  images.forEach(async (image) => {
    // const urlImg = URL.createObjectURL(image);
    const urlImgBB = await uploadImgBB(image);
    const imagePreviewHTML = `
    <div class="img-preview__wrap">
      <div class="img-preview__remove" data-url="${urlImgBB}">
        <img src="./assets/images/close-icon.svg" />
      </div>
      <img class="img-preview" src="${urlImgBB}" />
    </div>
  `;
    fromPreviewWrap.insertAdjacentHTML("afterbegin", imagePreviewHTML);
    arrayImage.push(urlImgBB);
    console.log(arrayImage);
    formUploadWrap.style.marginBottom = "12px";
  });
}

fromPreviewWrap.addEventListener("click", handleRemoveImage);

function handleRemoveImage(e) {
  if (e.target.matches(".img-preview__remove")) {
    const imgPreviewWrap = e.target.parentNode;
    imgPreviewWrap.remove();
    arrayImage = arrayImage.filter((item) => item !== e.target.dataset.url);
    console.log(arrayImage);
  }
}

Validator({
  form: ".form-report",
  formGroupSelector: ".form__item",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#accusedName", "Nhập tên chủ TK"),
    Validator.minLength("#accusedName", 6),
    Validator.isRequired("#phoneNumberReport", "Nhập SĐT của đối tượng"),
    Validator.minLength("#phoneNumberReport", 10),
    Validator.isRequired("#bankNumber", "Nhập STK "),
    Validator.minLength("#bankNumber", 6),
    Validator.isRequired("#bankName", "Nhập tên ngân hàng"),
    Validator.minLength("#bankName", 3),
    Validator.isRequired("#contentReport", "Nhập nội dung tố cáo"),
    Validator.isRequired("#nameSender", "Nhập tên của bạn"),
    Validator.minLength("#nameSender", 6),
    Validator.isRequired("#phoneNumberSender", "Nhập SĐT của bạn"),
    Validator.minLength("#phoneNumberSender", 10),
  ],
  onSubmit: async function ({
    accusedName,
    bankNumber,
    bankName,
    contentReport,
    images,
    nameSender,
    phoneNumberSender,
    phoneNumberReport,
    option
  }) {
    try {
      const response = await axios.post(enpoin, {
        accusedName,
        bankNumber,
        bankName,
        contentReport,
        images,
        nameSender,
        phoneNumberSender,
        phoneNumberReport,
        option,
        date: new Date(),
        images: arrayImage,
      });
      await FuiToast.success('Đơn gửi thành công, chờ duyệt!')
      setTimeout(() => {
        location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  },
});
