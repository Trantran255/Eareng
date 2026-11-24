/* ============================================================
   EarEng — WEB HỌC TỪ VỰNG CHO NGƯỜI MÙ. Toàn bộ logic trong 1 file.

   Mở web: máy đọc "nhấn Tab để bắt đầu". Nhấn Tab: máy đọc liền một mạch
   tên web → giới thiệu → hỏi "có cần nghe hướng dẫn không?"
   → (hướng dẫn) → danh sách bộ từ.
   - Điều hướng: mũi tên 4 chiều nhảy giữa các nút, tới nút nào đọc
     nút đó; Enter / Space để chọn. Tab vẫn dùng được.
   - Chọn bộ từ → menu bộ: "Học từ mới" hoặc "Ôn tập nhanh".
   - Học từ mới: (nghe hướng dẫn nếu bộ có) → xem thẻ lần lượt
     → hết thẻ → bài tập theo thứ tự hoặc xáo trộn.
   - Ôn tập nhanh: 6 câu ngẫu nhiên, mỗi lần vào xáo bộ câu mới.
   - Trả lời sai thì câu hỏi quay lại sau vài câu (SRS trong buổi).

   Không lưu tiến độ qua ngày. Chỉ lưu đúng 1 cài đặt: chế độ màu.
   ============================================================ */

const manHinh = document.getElementById("man-hinh");
const thongBao = document.getElementById("thong-bao");
const phanTinh = document.getElementById("phan-tinh");     // giới thiệu + hướng dẫn
const khuHuongDan = document.getElementById("huong-dan");  // riêng phần hướng dẫn
const nutDoiMau = document.getElementById("nut-doi-mau");  // nằm ngay sau khu vực học
const tenWeb = document.querySelector("h1");                // tên web ở đầu trang
const khuGioiThieu = document.getElementById("gioi-thieu"); // phần giới thiệu
const nhacTab = phanTinh.querySelector("p");               // câu "Để bắt đầu, nhấn Tab"

const SO_CAU_ON_TAP = 6;   // số câu của một bài ôn tập nhanh

let boHienTai = null;   // bộ từ đang học
let viTriThe = 0;       // đang xem thẻ thứ mấy (giai đoạn xem thẻ)
let coc = [];           // cọc câu hỏi (giai đoạn bài tập)
let tongSoThe = 0;
let soLanSai = 0;
let dangTron = false;   // bài tập có xáo trộn không
let cheDoOnTap = false; // đang làm ôn tập nhanh hay bài tập thường

/* ===== CHẾ ĐỘ MÀU (mặc định tương phản cao) ===== */
if (localStorage.getItem("cheDoMau") === "sang") {
  document.body.classList.remove("tuong-phan-cao");
}

nutDoiMau.addEventListener("click", function () {
  document.body.classList.toggle("tuong-phan-cao");
  const dangCao = document.body.classList.contains("tuong-phan-cao");
  localStorage.setItem("cheDoMau", dangCao ? "cao" : "sang");
});

/* ===== ĐIỀU HƯỚNG BẰNG MŨI TÊN =====
   Mũi tên xuống/phải: tới nút kế tiếp. Mũi tên lên/trái: nút trước.
   Hết danh sách thì quay vòng. Đang đứng ở tiêu đề thì mũi tên nhảy
   vào nút đầu tiên. Trong nhóm đáp án (radio) thì để trình duyệt tự lo. */
document.addEventListener("keydown", function (e) {
  const tien = (e.key === "ArrowDown" || e.key === "ArrowRight");
  const lui = (e.key === "ArrowUp" || e.key === "ArrowLeft");
  if (!tien && !lui) return;

  const dangO = document.activeElement;
  if (dangO && dangO.type === "radio") return;   /* radio: mũi tên có sẵn */

  /* Các điểm dừng: mọi nút còn bấm được trong khu vực học + radio đầu tiên */
  const diemDung = [];
  manHinh.querySelectorAll("button:not([disabled]), input[type=radio]:not([disabled])")
    .forEach(function (o) {
      if (o.type === "radio" && diemDung.some(function (d) { return d.type === "radio"; })) return;
      diemDung.push(o);
    });
  if (!nutDoiMau.hidden) diemDung.push(nutDoiMau);
  if (diemDung.length === 0) return;

  e.preventDefault();
  let i = diemDung.indexOf(dangO);
  if (i === -1) {
    i = tien ? 0 : diemDung.length - 1;
  } else {
    i = tien ? (i + 1) % diemDung.length : (i - 1 + diemDung.length) % diemDung.length;
  }
  diemDung[i].focus();
  /* Tới đáp án nào thì chọn luôn đáp án đó, khỏi phải nhấn thêm phím */
  if (diemDung[i].type === "radio") {
    diemDung[i].checked = true;
  }
});

/* ===== ÂM THANH PHẢN HỒI =====
   Có file audio/dung.mp3 và audio/sai.mp3 thì phát file;
   thiếu file thì tự phát tiếng bíp thay thế, không chặn bài học. */
const amDung = new Audio("audio/dung.mp3");
const amSai = new Audio("audio/sai.mp3");

function phatAmThanh(dung) {
  const am = dung ? amDung : amSai;
  am.currentTime = 0;
  am.play().catch(function () {
    phatBip(dung);
  });
}

function phatBip(dung) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = dung ? "sine" : "square";
    osc.frequency.value = dung ? 880 : 130;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,
