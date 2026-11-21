/* ============================================================
   EarEng — WEB HỌC TỪ VỰNG CHO NGƯỜI MÙ. Toàn bộ logic trong 1 file.

   Trang đầu: tên web → giới thiệu (tĩnh) → hỏi "có cần nghe hướng
   dẫn không?" → (hướng dẫn) → danh sách bộ từ.
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
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (loi) { /* máy không phát được tiếng thì thôi */ }
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

/* Gắn hành động cho nút theo id (viết gọn) */
function khiBam(id, ham) {
  document.getElementById(id).addEventListener("click", ham);
}

/* ===== MÀN HÌNH 0: HỎI CÓ CẦN NGHE HƯỚNG DẪN KHÔNG ===== */
function hienHoiHuongDan() {
  phanTinh.hidden = false;
  nutDoiMau.hidden = false;
  khuHuongDan.hidden = true;
  thongBao.textContent = "";
  manHinh.innerHTML =
    '<h2 id="tieu-de-man">Bạn có cần nghe hướng dẫn sử dụng không?</h2>' +
    '<button id="nut-co">Có, nghe hướng dẫn</button> ' +
    '<button id="nut-khong">Không, vào học luôn</button>';

  khiBam("nut-co", hienHuongDan);
  khiBam("nut-khong", hienDanhSachBo);

  focusVao(document.getElementById("tieu-de-man"));
}

/* ===== MÀN HÌNH HƯỚNG DẪN (nội dung tĩnh nằm trong index.html) ===== */
function hienHuongDan() {
  phanTinh.hidden = false;
  nutDoiMau.hidden = false;
  khuHuongDan.hidden = false;
  thongBao.textContent = "";
  manHinh.innerHTML =
    '<button id="nut-xong-hd">Đã nghe xong hướng dẫn, vào học</button>';

  khiBam("nut-xong-hd", hienDanhSachBo);

  /* Focus vào tiêu đề "Hướng dẫn sử dụng" để NVDA bắt đầu đọc từ đó */
  focusVao(khuHuongDan.querySelector("h2"));
}

/* ===== MÀN HÌNH 1: DANH SÁCH BỘ TỪ ===== */
function hienDanhSachBo() {
  phanTinh.hidden = false;
  nutDoiMau.hidden = false;
  khuHuongDan.hidden = true;
  thongBao.textContent = "";
  let html = '<h2 id="tieu-de-man">Học từ vựng — chọn bộ từ</h2>' +
             '<button id="nut-nghe-lai-hd">Nghe lại hướng dẫn sử dụng</button>' +
             '<ul class="danh-sach-bo">';
  CAC_BO_TU.forEach(function (bo, chiSo) {
    html += '<li><button class="nut-bo" data-so="' + chiSo + '">' +
            bo.ten + ' (' + bo.tu.length + ' từ)</button></li>';
  });
  html += '</ul>';
  manHinh.innerHTML = html;

  khiBam("nut-nghe-lai-hd", hienHuongDan);
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
  phanTinh.hidden = true;    /* vào bộ từ: ẩn giới thiệu + hướng dẫn, 1 màn hình = 1 việc */
  nutDoiMau.hidden = true;
  thongBao.textContent = "";
  manHinh.innerHTML =
    '<h2 id="tieu-de-man">Bộ từ: ' + boHienTai.ten + ' (' + boHienTai.tu.length + ' từ)</h2>' +
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
  khiBam("nut-on-tap", batDauOnTap);
  khiBam("nut-chon-bo", hienDanhSachBo);

  focusVao(document.getElementById("tieu-de-man"));
}

/* ===== LỜI HƯỚNG DẪN RIÊNG CỦA BỘ TỪ (nếu có) ===== */
function hienGioiThieu() {
  manHinh.innerHTML =
    '<h2 id="tieu-de-man">Hướng dẫn: ' + boHienTai.ten + '</h2>' +
    '<p class="gioi-thieu">' + boHienTai.gioiThieu + '</p>' +
    '<button id="nut-bat-dau">Bắt đầu nghe thẻ</button>';

  khiBam("nut-bat-dau", batDauXemThe);

  /* Đọc lời hướng dẫn qua vùng aria-live để chắc chắn được nghe */
  thongBao.innerHTML = boHienTai.gioiThieu;
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

  let html =
    '<h2 id="tieu-de-man">Thẻ ' + (viTriThe + 1) + ' trên ' + boHienTai.tu.length +
    ': ' + bocEn(the.en) + '</h2>' +
    '<button type="button" id="nut-nghe-nghia">Nghe nghĩa</button> ';

  if (the.en.indexOf(" ") === -1) {
    html += '<button type="button" id="nut-danh-van">Đọc từng chữ cái</button>';
  }

  html += '<div id="mat-sau"></div>';

  manHinh.innerHTML = html;

  const nutDanhVan = document.getElementById("nut-danh-van");
  if (nutDanhVan) {
    nutDanhVan.addEventListener("click", function () {
      const chuoi = the.en.toLowerCase().split("").join(", ");
      thongBao.innerHTML = bocEn(chuoi);
    });
  }

  khiBam("nut-nghe-nghia", function () { hienNghia(the); });

  focusVao(document.getElementById("tieu-de-man"));
}

function hienNghia(the) {
  /* Hiện nghĩa trên thẻ + đổ vào vùng aria-live để screen reader tự đọc */
  const cauNghia = bocEn(the.en) + ' nghĩa là: ' + the.vi;
  document.getElementById("mat-sau").innerHTML = '<p class="nghia">' + cauNghia + '</p>';
  thongBao.innerHTML = cauNghia;

  /* Thay nút "Nghe nghĩa" bằng nút đi tiếp, focus vào đó luôn */
  const nutCu = document.getElementById("nut-nghe-nghia");
  const nutTiep = document.createElement("button");
  nutTiep.type = "button";
  const laTheCuoi = (viTriThe === boHienTai.tu.length - 1);
  nutTiep.textContent = laTheCuoi ? "Hết thẻ — sang phần bài tập" : "Thẻ tiếp theo";
  nutTiep.addEventListener("click", function () {
    if (laTheCuoi) {
      hienChuyenGiaiDoan();
    } else {
      viTriThe++;
      hienThe();
    }
  });
  nutCu.replaceWith(nutTiep);
  nutTiep.focus();
}

/* ===== MÀN CHUYỂN: nghe thẻ xong, chọn việc tiếp theo ===== */
function hienChuyenGiaiDoan() {
  const loi = 'Bạn đã nghe hết ' + boHienTai.tu.length + ' thẻ của bộ "' + boHienTai.ten +
              '". Giờ làm bài tập để kiểm tra nhé. Trả lời sai thì câu hỏi sẽ quay lại cho tới khi đúng.';
  manHinh.innerHTML =
    '<h2 id="tieu-de-man">' + loi + '</h2>' +
    '<button id="nut-bt-thu-tu">Làm bài tập theo thứ tự</button> ' +
    '<button id="nut-bt-tron">Làm bài tập xáo trộn</button> ' +
    '<button id="nut-xem-lai">Nghe lại thẻ từ đầu</button> ' +
    '<button id="nut-chon-bo">Chọn bộ khác</button>';

  khiBam("nut-bt-thu-tu", function () { batDauBaiTap(false); });
  khiBam("nut-bt-tron", function () { batDauBaiTap(true); });
  khiBam("nut-xem-lai", batDauXemThe);
  khiBam("nut-chon-bo", hienDanhSachBo);

  thongBao.textContent = "";
  focusVao(document.getElementById("tieu-de-man"));
}

/* ============================================================
   GIAI ĐOẠN 2 — BÀI TẬP TRẮC NGHIỆM + SRS TRONG BUỔI
   ============================================================ */
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

  let html = '<h2 id="tieu-de-man">Câu hỏi còn lại: ' + coc.length + ' — ' + cauHoi + '</h2>' +
             '<form id="form-bai-tap"><fieldset>' +
             '<legend>Mũi tên để chọn đáp án, Enter để nộp</legend>';

  baLuaChon.forEach(function (luaChon, i) {
    const noiDung = (chieu === "en2vi") ? luaChon.vi : bocEn(luaChon.en);
    html += '<label class="dap-an">' +
            '<input type="radio" name="dap-an" value="' + i + '"> ' +
            noiDung + '</label>';
  });

  html += '</fieldset>' +
          '<button type="submit">Nộp đáp án</button>';

  if (chieu === "en2vi" && the.en.indexOf(" ") === -1) {
    html += ' <button type="button" id="nut-danh-van">Đọc từng chữ cái</button>';
  }

  html += '</form>';
  manHinh.innerHTML = html;

  const nutDanhVan = document.getElementById("nut-danh-van");
  if (nutDanhVan) {
    nutDanhVan.addEventListener("click", function () {
      const chuoi = the.en.toLowerCase().split("").join(", ");
      thongBao.innerHTML = bocEn(chuoi);
    });
  }

  /* Enter khi đang đứng ở radio = nộp form (hành vi HTML chuẩn, không bắt phím) */
  document.getElementById("form-bai-tap").addEventListener("submit", function (e) {
    e.preventDefault();
    const daChon = document.querySelector('input[name="dap-an"]:checked');
    if (!daChon) {
      thongBao.textContent = "Bạn chưa chọn đáp án. Dùng phím mũi tên để chọn.";
      return;
    }
    chamDiem(baLuaChon[Number(daChon.value)], the);
  });

  focusVao(document.getElementById("tieu-de-man"));
}

function chamDiem(luaChon, the) {
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

  /* Khóa đáp án, thay nút nộp bằng nút đi tiếp, focus vào đó */
  document.querySelectorAll('input[name="dap-an"]').forEach(function (o) { o.disabled = true; });
  const form = document.getElementById("form-bai-tap");
  const nutTiep = document.createElement("button");
  nutTiep.type = "button";
  nutTiep.textContent = "Câu tiếp theo";
  nutTiep.addEventListener("click", hienCauHoi);
  form.querySelector('button[type="submit"]').replaceWith(nutTiep);
  nutTiep.focus();
}

/* ===== MÀN HÌNH: KẾT THÚC BÀI TẬP / ÔN TẬP ===== */
function hienKetThuc() {
  const tongKet = 'Bộ "' + boHienTai.ten + '": ' + tongSoThe + ' câu, số lần trả lời sai: ' + soLanSai + '.';

  if (cheDoOnTap) {
    manHinh.innerHTML =
      '<h2 id="tieu-de-man">Xong bài ôn tập! ' + tongKet + '</h2>' +
      '<button id="nut-on-lai">Ôn tập lại với câu hỏi mới</button> ' +
      '<button id="nut-ve-menu">Về menu bộ từ</button> ' +
      '<button id="nut-chon-bo">Chọn bộ khác</button>';

    khiBam("nut-on-lai", batDauOnTap);
    khiBam("nut-ve-menu", hienMenuBo);
    khiBam("nut-chon-bo", hienDanhSachBo);
  } else {
    manHinh.innerHTML =
      '<h2 id="tieu-de-man">Xong bài tập! ' + tongKet + '</h2>' +
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

/* ===== KHỞI ĐỘNG ===== */
hienHoiHuongDan();

/* Trình đọc màn hình cần chút thời gian dựng xong trang.
   Đặt lại con trỏ vào câu hỏi sau khi trang tải xong, để mũi tên dùng được ngay. */
window.addEventListener("load", function () {
  setTimeout(function () {
    const tieuDe = document.getElementById("tieu-de-man");
    const dangO = document.activeElement;
    if (tieuDe && (dangO === document.body || dangO === tieuDe)) {
      tieuDe.blur();
      focusVao(tieuDe);
    }
  }, 800);
});
