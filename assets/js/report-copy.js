const enpoin = "https://66f2998a71c84d805875ef6d.mockapi.io/scammer";
const apiKeyImgBB = "0ee74c3e27f0803221b9178fb849a297";
const uploadImage = document.getElementById("uploadImage");
const formPreviewWrap = document.querySelector(".from__preview-wrap");
const formUploadWrap = document.querySelector(".form__upload-wrap");
let arrayImage = [];
uploadImage.addEventListener("change", handleUploadImage);

// Hanlde Upload ImgBB
async function uploadImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?expiration=600&key=${apiKeyImgBB}`,
      formData
    );
    return response.data.data.url;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// end Hanlde Upload ImgBB

async function handleUploadImage(e) {
  const imageUploaList = [...e.target.files];
  imageUploaList.forEach(async (item) => {
    // const urlImg = URL.createObjectURL(item);
    const urlImgBB = await uploadImgBB(item);
    const imagePreviewHTML = `
    <div class="img-preview__wrap">
      <div class="img-preview__remove" data-url="${urlImgBB}">
        <img src="./assets/images/close-icon.svg" />
      </div>
      <img class="img-preview" src="${urlImgBB}" />
    </div>
  `;
    formPreviewWrap.insertAdjacentHTML("afterbegin", imagePreviewHTML);
    arrayImage.push(urlImgBB);
    console.log(arrayImage);
    formUploadWrap.style.marginBottom = "12px";
  });
}

formPreviewWrap.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".img-preview__remove");
  if (removeBtn) {
    const imgPreviewWrap = removeBtn.parentNode;
    const imgUrl = removeBtn.dataset.url;
    imgPreviewWrap.remove();

    // Cập nhật lại arrayImage sau khi xóa
    arrayImage = arrayImage.filter((item) => item !== imgUrl);
    console.log(arrayImage);
  }
});
// Handle Validate and Submit data
Validator({
  form: ".form-report",
  formGroupSelector: ".form__item",
  errorSelector: ".form-message",
  rules: [
    Validator.isRequired("#accusedName", "Hãy nhập tên chủ TK"),
    Validator.minLength("#accusedName", 6),
    Validator.isRequired("#bankNumber", "Hãy nhập STK "),
    Validator.minLength("#bankNumber", 6),
    Validator.isRequired("#bankName", "Hãy nhập tên ngân hàng"),
    Validator.minLength("#bankName", 3),
    Validator.isRequired("#contentReport", "Hãy nhập nội dung"),
    Validator.isRequired("#nameSender", "Hãy nhập tên của bạn"),
    Validator.minLength("#nameSender", 6),
    Validator.isRequired("#phoneNumberSender", "Hãy nhập SĐT của bạn"),
    Validator.minLength("#phoneNumberSender", 10),
  ],
  onSubmit: async function ({
    accusedName,
    bankNumber,
    bankName,
    contentReport,
    phoneNumberSender,
    phoneNumber,
    option,
  }) {
    try {
      const response = await axios.post(enpoin, {
        accusedName,
        bankNumber,
        bankName,
        contentReport,
        phoneNumberSender,
        phoneNumber,
        option,
        date: new Date(),
        images: arrayImage,
      });
      console.log(response);
      location.reload();
    } catch (error) {
      console.error(error);
    }
  },
});
// Handle Validate and Submit data
