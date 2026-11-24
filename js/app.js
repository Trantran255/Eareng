/* ============================================================
   EarEng — WEB HỌC TỪ VỰNG CHO NGƯỜI MÙ. Toàn bộ logic trong 1 file.

   Mở web: máy đọc "nhấn Tab để bắt đầu". Nhấn Tab: máy đọc liền một mạch
   tên web → giới thiệu → hỏi "có cần nghe hướng dẫn không?"
   → (hướng dẫn) → danh sách bộ từ.
   - Máy chỉ đọc đúng những gì đang hiện trên màn hình, mỗi chữ một lần.
   - Phát âm tiếng Anh dùng giọng tiếng Anh của trình duyệt / Windows.
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

function doiCheDoMau() {
  document.body.classList.toggle("tuong-phan-cao");
  const dangCao = document.body.classList.contains("tuong-phan-cao");
  localStorage.setItem("cheDoMau", dangCao ? "cao" : "sang");
  docLen(dangCao ? "Đã chuyển sang nền đen chữ vàng." : "Đã chuyển sang nền sáng chữ đen.");
}

/* Nút đổi màu cũ nằm ngoài khu vực học: không dùng nữa, luôn ẩn */
nutDoiMau.hidden = true;

/* ===== BỎ CHỮ "NÚT" KHI TRÌNH ĐỌC MÀN HÌNH ĐỌC =====
   Mặc định, trình đọc màn hình đọc tên nút rồi thêm chữ "nút".
   Khai báo role="menuitem" thì nó chỉ đọc đúng chữ trên nút.
   Đoạn này tự gắn khai báo đó cho mọi nút xuất hiện trong khu vực học. */
function boChuNut() {
  manHinh.querySelectorAll("button:not([role])").forEach(function (nut) {
    nut.setAttribute("role", "menuitem");
  });
}
new MutationObserver(boChuNut).observe(manHinh, { childList: true, subtree: true });

/* Khối chữ mở đầu mỗi màn: con trỏ được đặt vào đây để trình đọc màn hình đọc nó.
   Khai báo role="menuitem" để không bị đọc thêm chữ "tiêu đề". */
const MO_KHOI = '<div id="tieu-de-man" role="menuitem" style="font-size:28px;' +
                'font-weight:bold;line-height:1.5;margin:18px 0;outline:none;">';

/* Nút đổi màu nằm ngay trong khu vực học (ở màn hỏi hướng dẫn và màn danh sách) */
const NUT_MAU_HTML = ' <button type="button" id="nut-mau-trong">Đổi chế độ màu</button>';
function ganNutMau() {
  const nut = document.getElementById("nut-mau-trong");
  if (nut) nut.addEventListener("click", doiCheDoMau);
}

/* ===== ĐIỀU HƯỚNG BẰNG MŨI TÊN =====
   Mũi tên xuống/phải: tới nút kế tiếp. Mũi tên lên/trái: nút trước.
   Hết danh sách thì quay vòng. Đang đứng ở tiêu đề thì mũi tên nhảy
   vào nút đầu tiên. */
document.addEventListener("keydown", function (e) {
  const tien = (e.key === "ArrowDown" || e.key === "ArrowRight");
  const lui = (e.key === "ArrowUp" || e.key === "ArrowLeft");
  if (!tien && !lui) return;

  /* Các điểm dừng: mọi nút còn bấm được trong khu vực học */
  const diemDung = Array.from(manHinh.querySelectorAll("button:not([disabled])"));
  if (diemDung.length === 0) return;

  e.preventDefault();
  let i = diemDung.indexOf(document.activeElement);
  if (i === -1) {
    i = tien ? 0 : diemDung.length - 1;
  } else {
    i = tien ? (i + 1) % diemDung.length : (i - 1 + diemDung.length) % diemDung.length;
  }
  diemDung[i].focus();
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
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (loi) { /* máy không phát được tiếng thì thôi */ }
}

/* ===== PHÁT ÂM TIẾNG ANH =====
   Dùng giọng tiếng Anh có sẵn trong trình duyệt và Windows (giọng Anh Mỹ),
   thay vì để trình đọc màn hình đọc bằng giọng của nó.
   Máy nào không có giọng tiếng Anh thì quay về cách cũ: đưa chữ cho trình đọc màn hình. */
let giongAnh = null;

function timGiongAnh() {
  const ds = window.speechSynthesis.getVoices();
  giongAnh =
    ds.find(function (g) { return /Google US English/i.test(g.name); }) ||
    ds.find(function (g) { return g.lang === "en-US"; }) ||
    ds.find(function (g) { return /^en/i.test(g.lang); }) ||
    null;
}

if ("speechSynthesis" in window) {
  timGiongAnh();
  window.speechSynthesis.addEventListener("voiceschanged", timGiongAnh);
}

/* chu: chữ tiếng Anh cần phát âm. chamLai: true thì đọc chậm hơn (dùng khi đánh vần). */
function phatAmAnh(chu, chamLai) {
  if (!("speechSynthesis" in window) || !giongAnh) {
    docLen(bocEn(chu));
    return;
  }
  window.speechSynthesis.cancel();
  const cau = new SpeechSynthesisUtterance(chu);
  cau.voice = giongAnh;
  cau.lang = giongAnh.lang;
  cau.rate = chamLai ? 0.7 : 0.85;
  window.speechSynthesis.speak(cau);
}

/* ===== TIỆN ÍCH ===== */
function bocEn(chu) { return '<span lang="en">' + chu + '</span>'; }

function tronMang(mang) {
  for (let i = mang.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mang[i], mang[j]] = [mang[j], mang[i]];
  }
  return mang;
}

/* Chuyển focus tới phần tử — "con mắt" của người mù sau mỗi lần đổi màn hình */
function focusVao(phanTu) {
  phanTu.setAttribute("tabindex", "-1");
  phanTu.focus();
}

/* Cho trình đọc màn hình đọc một nội dung. Xóa trước rồi mới ghi lại,
   để bấm cùng một nút nhiều lần thì lần nào cũng được đọc. */
function docLen(noiDung) {
  thongBao.textContent = "";
  setTimeout(function () {
    thongBao.innerHTML = noiDung;
  }, 60);
}

/* Gắn hành động cho nút theo id (viết gọn) */
function khiBam(id, ham) {
  document.getElementById(id).addEventListener("click", ham);
}

/* ===== NGUYÊN TẮC ĐỌC =====
   Trình đọc màn hình chỉ được đọc đúng những chữ đang hiện trên màn hình, mỗi chữ một lần.
   - Không có chữ ẩn, không có nhãn ẩn.
   - Khối chữ đầu mỗi màn và các nút đều khai báo role="menuitem", để trình đọc màn hình
     không tự thêm các chữ như "nút" hay "tiêu đề cấp 2".

   ===== MÀN BẮT ĐẦU: vừa mở web =====
   Màn hình chỉ có một câu: "Để bắt đầu, nhấn phím Tab một lần. Sau đó...".
   Khi mở trang, trình đọc màn hình luôn đọc tên trang (thẻ title), nên tên trang
   lúc này chính là câu đó. Nhờ vậy câu được đọc đúng một lần.
   Nhấn Tab là web bắt đầu luôn. */
const TEN_TRANG = "EarEng — Học từ vựng tiếng Anh bằng tai";
const diemBatDau = document.getElementById("diem-bat-dau");
let daBatDau = false;

function hienManBatDau() {
  tenWeb.hidden = true;
  phanTinh.hidden = false;
  nhacTab.hidden = false;
  khuGioiThieu.hidden = true;
  khuHuongDan.hidden = true;
  thongBao.textContent = "";
  manHinh.innerHTML = "";

  diemBatDau.addEventListener("focus", batDauWeb);   /* nhấn Tab là bắt đầu */
  document.addEventListener("click", batDauWeb);       /* người dùng chuột: bấm vào trang */
}

function batDauWeb() {
  if (daBatDau) return;
  daBatDau = true;
  document.removeEventListener("click", batDauWeb);
  document.title = TEN_TRANG;
  /* Chờ một nhịp ngắn cho con trỏ ổn định rồi mới chuyển màn */
  setTimeout(hienHoiHuongDan, 0);
}

/* Ở màn bắt đầu, Enter, phím cách hoặc mũi tên cũng bắt đầu được */
document.addEventListener("keydown", function (e) {
  if (daBatDau) return;
  if (e.key === "Enter" || e.key === " " || e.key.indexOf("Arrow") === 0) {
    e.preventDefault();
    batDauWeb();
  }
});

/* ===== MÀN HÌNH 0: TÊN WEB, GIỚI THIỆU, HỎI CÓ CẦN NGHE HƯỚNG DẪN KHÔNG =====
   Tên web, lời giới thiệu và câu hỏi cùng hiện trên màn hình trong một khối,
   nên trình đọc màn hình đọc liền một mạch đúng những chữ đang hiện. */
function hienHoiHuongDan() {
  tenWeb.hidden = true;
  phanTinh.hidden = true;
  thongBao.textContent = "";

  const loiGioiThieu = khuGioiThieu.querySelector("p").textContent.replace(/\s+/g, " ").trim();

  manHinh.innerHTML =
    MO_KHOI +
      '<span style="display:block;font-size:34px;margin-bottom:14px;">' +
        bocEn("EarEng") + ' — Học từ vựng tiếng Anh bằng tai. </span>' +
      '<span style="display:block;font-size:22px;font-weight:normal;margin-bottom:14px;">' +
        'Giới thiệu: ' + loiGioiThieu + ' </span>' +
      '<span style="display:block;">Bạn có cần nghe hướng dẫn sử dụng không?</span>' +
    '</div>' +
    '<button id="nut-co">Có, nghe hướng dẫn</button> ' +
    '<button id="nut-khong">Không, vào học luôn</button>' +
    NUT_MAU_HTML;

  khiBam("nut-co", hienHuongDan);
  khiBam("nut-khong", hienDanhSachBo);
  ganNutMau();

  focusVao(document.getElementById("tieu-de-man"));
}

/* ===== MÀN HÌNH HƯỚNG DẪN =====
   Nội dung lấy từ phần hướng dẫn viết sẵn trong index.html.
   Mỗi phần hiện thành một mục. Mũi tên xuống tới mục nào, máy đọc mục đó. */
function hienHuongDan() {
  tenWeb.hidden = true;
  phanTinh.hidden = true;
  thongBao.textContent = "";

  const gon = function (chu) { return chu.replace(/\s+/g, " ").trim(); };
  const kieuMuc = 'display:block;width:100%;text-align:left;font-size:20px;' +
                  'font-weight:normal;line-height:1.6;margin:10px 0;';

  let html = MO_KHOI + 'Hướng dẫn sử dụng. ' +
             'Nhấn mũi tên xuống để nghe từng phần.</div>';

  khuHuongDan.querySelectorAll("h3").forEach(function (tieuDePhan) {
    const noiDung = tieuDePhan.nextElementSibling;
    html += '<button type="button" style="' + kieuMuc + '">' +
            '<strong>' + gon(tieuDePhan.textContent) + '.</strong> ' +
            gon(noiDung.textContent) + '</button>';
  });

  html += '<button id="nut-xong-hd">Đã nghe xong hướng dẫn, vào học</button>';
  manHinh.innerHTML = html;

  khiBam("nut-xong-hd", hienDanhSachBo);

  focusVao(document.getElementById("tieu-de-man"));
}

/* ===== MÀN HÌNH 1: DANH SÁCH BỘ TỪ ===== */
function hienDanhSachBo() {
  /* Từ đây trở đi ẩn tên web và phần giới thiệu,
     để trình đọc màn hình không đọc lại chúng ở mỗi màn */
  tenWeb.hidden = true;
  phanTinh.hidden = true;
  khuHuongDan.hidden = true;
  thongBao.textContent = "";
  let html = MO_KHOI + 'Học từ vựng — chọn bộ từ</div>' +
             '<button id="nut-nghe-lai-hd">Nghe lại hướng dẫn sử dụng</button>' +
             '<ul class="danh-sach-bo">';
  CAC_BO_TU.forEach(function (bo, chiSo) {
    html += '<li><button class="nut-bo" data-so="' + chiSo + '">' +
            bo.ten + ' (' + bo.tu.length + ' từ)</button></li>';
  });
  html += '</ul>' + NUT_MAU_HTML;
  manHinh.innerHTML = html;

  khiBam("nut-nghe-lai-hd", hienHuongDan);
  ganNutMau();
  document.querySelectorAll(".nut-bo").forEach(function (nut) {
    nut.addEventListener("click", function () {
      boHienTai = CAC_BO_TU[Number(nut.dataset.so)];
      hienMenuBo();
    });
  });

  focusVao(document.getElementById("tieu-de-man"));
}

/* ===== MENU CỦA MỘT BỘ TỪ ===== */
function hienMenuBo() {
  tenWeb.hidden = true;
  phanTinh.hidden = true;    /* vào bộ từ: ẩn giới thiệu + hướng dẫn, 1 màn hình = 1 việc */
  thongBao.textContent = "";
  manHinh.innerHTML =
    MO_KHOI + 'Bộ từ: ' + boHienTai.ten + ' (' + boHienTai.tu.length + ' từ)</div>' +
    '<button id="nut-hoc-moi">Học từ mới — nghe thẻ rồi làm bài tập</button> ' +
    '<button id="nut-on-tap">Ôn tập nhanh — ' + SO_CAU_ON_TAP + ' câu xáo trộn</button> ' +
    '<button id="nut-chon-bo">Chọn bộ khác</button>';

  khiBam("nut-hoc-moi", function () {
    if (boHienTai.gioiThieu) {
      hienGioiThieu();
    } else {
      batDauXemThe();
    }
  });
  khiBam("nut-on-tap", function () {
    hienLuuYBaiTap(batDauOnTap);
  });
  khiBam("nut-chon-bo", hienDanhSachBo);

  focusVao(document.getElementById("tieu-de-man"));
}

/* ===== LỜI HƯỚNG DẪN RIÊNG CỦA BỘ TỪ (nếu có) ===== */
function hienGioiThieu() {
  thongBao.textContent = "";
  manHinh.innerHTML =
    MO_KHOI +
      '<span style="display:block;margin-bottom:12px;">Hướng dẫn: ' + boHienTai.ten + '. </span>' +
      '<span style="display:block;font-size:24px;font-weight:normal;">' + boHienTai.gioiThieu + '</span>' +
    '</div>' +
    '<button id="nut-bat-dau">Bắt đầu nghe thẻ</button>';

  khiBam("nut-bat-dau", batDauXemThe);

  focusVao(document.getElementById("tieu-de-man"));
}

/* ============================================================
   GIAI ĐOẠN 1 — NGHE THẺ LẦN LƯỢT (kiểu Quizlet)
   ============================================================ */
function batDauXemThe() {
  viTriThe = 0;
  hienThe();
}

function hienThe() {
  thongBao.textContent = "";
  const the = boHienTai.tu[viTriThe];
  const laTheCuoi = (viTriThe === boHienTai.tu.length - 1);

  /* Mỗi thẻ luôn có đủ các nút, theo thứ tự:
     phát âm tiếng Anh, đánh vần, nghe nghĩa, thẻ tiếp theo.
     Không nút nào biến mất, nên nghe lại bao nhiêu lần cũng được. */
  let html =
    MO_KHOI + 'Thẻ ' + (viTriThe + 1) + ' trên ' + boHienTai.tu.length +
    ': ' + bocEn(the.en) + '</div>' +
    '<button type="button" id="nut-nghe-tu">Phát âm tiếng Anh</button> ';

  if (the.en.indexOf(" ") === -1) {
    html += '<button type="button" id="nut-danh-van">Đọc từng chữ cái</button> ';
  }

  html += '<button type="button" id="nut-nghe-nghia">Nghe nghĩa</button> ' +
          '<button type="button" id="nut-the-tiep">' +
          (laTheCuoi ? 'Hết thẻ — sang phần bài tập' : 'Thẻ tiếp theo') + '</button>';

  manHinh.innerHTML = html;

  khiBam("nut-nghe-tu", function () { phatAmAnh(the.en, false); });

  const nutDanhVan = document.getElementById("nut-danh-van");
  if (nutDanhVan) {
    nutDanhVan.addEventListener("click", function () {
      phatAmAnh(the.en.toLowerCase().split("").join(", "), true);
    });
  }

  khiBam("nut-nghe-nghia", function () {
    /* Hiện nghĩa ở vùng thông báo phía dưới; trình đọc màn hình đọc đúng dòng đó */
    docLen(bocEn(the.en) + ' nghĩa là: ' + the.vi);
  });

  khiBam("nut-the-tiep", function () {
    if (laTheCuoi) {
      hienChuyenGiaiDoan();
    } else {
      viTriThe++;
      hienThe();
    }
  });

  focusVao(document.getElementById("tieu-de-man"));
}

/* ===== MÀN CHUYỂN: nghe thẻ xong, chọn việc tiếp theo ===== */
function hienChuyenGiaiDoan() {
  const loi = 'Bạn đã nghe hết ' + boHienTai.tu.length + ' thẻ của bộ "' + boHienTai.ten +
              '". Giờ làm bài tập để kiểm tra nhé. Trả lời sai thì câu hỏi sẽ quay lại cho tới khi đúng.';
  manHinh.innerHTML =
    MO_KHOI + loi + '</div>' +
    '<button id="nut-bt-thu-tu">Làm bài tập theo thứ tự</button> ' +
    '<button id="nut-bt-tron">Làm bài tập xáo trộn</button> ' +
    '<button id="nut-xem-lai">Nghe lại thẻ từ đầu</button> ' +
    '<button id="nut-chon-bo">Chọn bộ khác</button>';

  khiBam("nut-bt-thu-tu", function () {
    hienLuuYBaiTap(function () { batDauBaiTap(false); });
  });
  khiBam("nut-bt-tron", function () {
    hienLuuYBaiTap(function () { batDauBaiTap(true); });
  });
  khiBam("nut-xem-lai", batDauXemThe);
  khiBam("nut-chon-bo", hienDanhSachBo);

  thongBao.textContent = "";
  focusVao(document.getElementById("tieu-de-man"));
}

/* ============================================================
   GIAI ĐOẠN 2 — BÀI TẬP TRẮC NGHIỆM + SRS TRONG BUỔI
   ============================================================ */

/* ===== MÀN LƯU Ý TRƯỚC KHI LÀM BÀI: báo trước tiếng đúng và tiếng sai =====
   batDau là hàm sẽ chạy khi người học chọn "Bắt đầu làm bài". */
function hienLuuYBaiTap(batDau) {
  thongBao.textContent = "";
  manHinh.innerHTML =
    MO_KHOI + 'Lưu ý trước khi làm bài: trả lời đúng sẽ có một tiếng vui, ' +
    'trả lời sai sẽ có một tiếng trầm. Kết quả cũng được đọc bằng lời. ' +
    'Câu trả lời sai sẽ quay lại sau vài câu.</div>' +
    '<button id="nut-bat-dau-bai">Bắt đầu làm bài</button> ' +
    '<button id="nut-thu-dung">Nghe thử tiếng đúng</button> ' +
    '<button id="nut-thu-sai">Nghe thử tiếng sai</button>';

  khiBam("nut-bat-dau-bai", batDau);
  khiBam("nut-thu-dung", function () {
    phatAmThanh(true);
    thongBao.textContent = "Đây là tiếng khi trả lời đúng.";
  });
  khiBam("nut-thu-sai", function () {
    phatAmThanh(false);
    thongBao.textContent = "Đây là tiếng khi trả lời sai.";
  });

  focusVao(document.getElementById("tieu-de-man"));
}

function batDauBaiTap(tron) {
  cheDoOnTap = false;
  dangTron = tron;
  coc = boHienTai.tu.slice();
  if (tron) {
    tronMang(coc);
  }
  tongSoThe = coc.length;
  soLanSai = 0;
  hienCauHoi();
}

/* Ôn tập nhanh: lấy ngẫu nhiên vài câu, mỗi lần vào xáo bộ câu mới */
function batDauOnTap() {
  cheDoOnTap = true;
  dangTron = true;   /* ôn tập luôn hỏi trộn 2 chiều */
  coc = tronMang(boHienTai.tu.slice()).slice(0, SO_CAU_ON_TAP);
  tongSoThe = coc.length;
  soLanSai = 0;
  hienCauHoi();
}

function hienCauHoi() {
  if (coc.length === 0) { hienKetThuc(); return; }

  thongBao.textContent = "";
  const the = coc[0];

  /* Theo thứ tự: luôn hỏi Anh → Việt (nhịp học).
     Xáo trộn / ôn tập: random 2 chiều Anh ↔ Việt (nhịp kiểm tra). */
  const chieu = dangTron
    ? (Math.random() < 0.5 ? "en2vi" : "vi2en")
    : "en2vi";

  /* 2 đáp án nhiễu lấy từ chính bộ từ đang học */
  const khac = tronMang(boHienTai.tu.filter(function (t) { return t.en !== the.en; }));
  const baLuaChon = tronMang([the, khac[0], khac[1]]);

  const cauHoi = (chieu === "en2vi")
    ? bocEn(the.en) + ' nghĩa là gì?'
    : '"' + the.vi + '" trong tiếng Anh là gì?';

  /* Ba đáp án là ba nút. Mũi tên để tới đáp án (máy đọc đáp án đó),
     Enter để trả lời luôn bằng đáp án đang đứng. */
  const kieuDapAn = 'display:block;width:100%;text-align:left;font-size:24px;' +
                    'padding:16px 18px;margin:10px 0;';

  let html = MO_KHOI + 'Câu hỏi còn lại: ' + coc.length + ' — ' + cauHoi + '</div>';

  baLuaChon.forEach(function (luaChon, i) {
    const noiDung = (chieu === "en2vi") ? luaChon.vi : bocEn(luaChon.en);
    html += '<button type="button" class="nut-dap-an" data-so="' + i + '" style="' + kieuDapAn + '">' +
            noiDung + '</button>';
  });

  if (chieu === "en2vi") {
    html += '<button type="button" id="nut-nghe-tu">Phát âm tiếng Anh</button> ';
    if (the.en.indexOf(" ") === -1) {
      html += '<button type="button" id="nut-danh-van">Đọc từng chữ cái</button>';
    }
  }

  manHinh.innerHTML = html;

  const nutNgheTu = document.getElementById("nut-nghe-tu");
  if (nutNgheTu) {
    nutNgheTu.addEventListener("click", function () { phatAmAnh(the.en, false); });
  }

  const nutDanhVan = document.getElementById("nut-danh-van");
  if (nutDanhVan) {
    nutDanhVan.addEventListener("click", function () {
      phatAmAnh(the.en.toLowerCase().split("").join(", "), true);
    });
  }

  document.querySelectorAll(".nut-dap-an").forEach(function (nut) {
    nut.addEventListener("click", function () {
      chamDiem(baLuaChon[Number(nut.dataset.so)], the, baLuaChon);
    });
  });

  focusVao(document.getElementById("tieu-de-man"));
}

function chamDiem(luaChon, the, baLuaChon) {
  const dung = (luaChon.en === the.en);
  phatAmThanh(dung);

  coc.shift();
  if (dung) {
    thongBao.innerHTML = 'Đúng rồi! ' + bocEn(the.en) + ' nghĩa là "' + the.vi + '".';
  } else {
    soLanSai++;
    /* Sai: nhét câu hỏi lại vào cọc, cách 3 câu (SRS trong buổi) */
    coc.splice(Math.min(3, coc.length), 0, the);
    thongBao.innerHTML = 'Sai rồi. Đáp án đúng: ' + bocEn(the.en) +
                         ' nghĩa là "' + the.vi + '". Câu này sẽ quay lại sau.';
  }

  /* Khóa ba đáp án, ghi chú đáp án đúng cho người nhìn được,
     rồi thêm nút đi tiếp và đặt con trỏ vào đó */
  document.querySelectorAll(".nut-dap-an").forEach(function (nut) {
    nut.disabled = true;
    if (baLuaChon[Number(nut.dataset.so)].en === the.en) {
      nut.innerHTML += " (đáp án đúng)";
    }
  });

  const nutTiep = document.createElement("button");
  nutTiep.type = "button";
  nutTiep.textContent = "Câu tiếp theo";
  nutTiep.addEventListener("click", hienCauHoi);
  manHinh.appendChild(nutTiep);
  nutTiep.focus();
}

/* ===== MÀN HÌNH: KẾT THÚC BÀI TẬP / ÔN TẬP ===== */
function hienKetThuc() {
  const tongKet = 'Bộ "' + boHienTai.ten + '": ' + tongSoThe + ' câu, số lần trả lời sai: ' + soLanSai + '.';

  if (cheDoOnTap) {
    manHinh.innerHTML =
      MO_KHOI + 'Xong bài ôn tập! ' + tongKet + '</div>' +
      '<button id="nut-on-lai">Ôn tập lại với câu hỏi mới</button> ' +
      '<button id="nut-ve-menu">Về menu bộ từ</button> ' +
      '<button id="nut-chon-bo">Chọn bộ khác</button>';

    khiBam("nut-on-lai", batDauOnTap);
    khiBam("nut-ve-menu", hienMenuBo);
    khiBam("nut-chon-bo", hienDanhSachBo);
  } else {
    manHinh.innerHTML =
      MO_KHOI + 'Xong bài tập! ' + tongKet + '</div>' +
      '<button id="nut-lam-lai">Làm lại bài tập xáo trộn</button> ' +
      '<button id="nut-xem-the">Nghe lại thẻ từ đầu</button> ' +
      '<button id="nut-chon-bo">Chọn bộ khác</button>';

    khiBam("nut-lam-lai", function () { batDauBaiTap(true); });
    khiBam("nut-xem-the", batDauXemThe);
    khiBam("nut-chon-bo", hienDanhSachBo);
  }

  thongBao.textContent = "";
  focusVao(document.getElementById("tieu-de-man"));
}

/* ===== KHỞI ĐỘNG =====
   Không tự đặt con trỏ lúc mở trang. Trình đọc màn hình đọc tên trang,
   chính là câu "Để bắt đầu, nhấn phím Tab một lần..." đang hiện trên màn hình. */
hienManBatDau();
