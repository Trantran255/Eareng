/* ============================================================
   EarEng — WEB HỌC TỪ VỰNG CHO NGƯỜI MÙ. Toàn bộ logic trong 1 file.

   Mở web: máy đọc "nhấn Tab để bắt đầu". Nhấn Tab: máy đọc liền một mạch
   tên web → giới thiệu → hỏi "có cần nghe hướng dẫn không?"
   → (hướng dẫn) → danh sách bộ từ.
   - Máy chỉ đọc đúng những gì đang hiện trên màn hình, mỗi chữ một lần.
   - Phát âm tiếng Anh dùng bản thu giọng người thật của từ điển.
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
const phanTinh = document.getElementById("phan-tinh");     // câu "Để bắt đầu, nhấn Tab"

const SO_CAU_ON_TAP = 6;   // số câu của một bài ôn tập nhanh

let boHienTai = null;   // bộ từ đang học
let viTriThe = 0;       // đang xem thẻ thứ mấy (giai đoạn xem thẻ)
let coc = [];           // cọc câu hỏi (giai đoạn bài tập)
let tongSoThe = 0;
let soLanSai = 0;
let dangTron = false;   // bài tập có xáo trộn không
let cheDoOnTap = false; // đang làm ôn tập nhanh hay bài tập thường

/* ===== LỜI GIỚI THIỆU VÀ HƯỚNG DẪN =====
   Chữ nằm ở đây, chỉ được đưa lên trang khi tới màn hình cần hiện nó.
   Trang không giữ sẵn chữ ẩn nào. */
const LOI_GIOI_THIEU =
  'EarEng là trang web học từ vựng tiếng Anh dành cho người khiếm thị, dùng hoàn toàn bằng bàn phím và trình đọc màn hình. Không cần gõ chữ, không cần nhìn màn hình: chỉ cần nghe, chọn và nhấn phím. Không cần tài khoản, không lưu lại gì.';

const CAC_PHAN_HUONG_DAN = [
  { tieuDe: 'Phần 1: Các phím cần dùng',
    noiDung: 'Bạn chỉ cần 3 loại phím: phím mũi tên (lên, xuống, trái, phải) để di chuyển giữa các lựa chọn; phím Enter hoặc phím cách (Space) để chọn; phím Tab chỉ dùng một lần, lúc vừa mở web, để bắt đầu. Di chuyển tới lựa chọn nào, máy sẽ đọc lựa chọn đó. Khi đi hết danh sách, mũi tên sẽ quay vòng về đầu. Website không có ô nhập chữ nào, bạn không bao giờ cần gõ đáp án.' },
  { tieuDe: 'Phần 2: Màn hình đầu tiên',
    noiDung: 'Vừa mở web, nhấn Tab một lần. Máy đọc tên web, lời giới thiệu, rồi hỏi bạn có cần nghe hướng dẫn không. Chọn "Có" để nghe phần hướng dẫn này, chọn "Không" để vào thẳng danh sách bộ từ. Trong danh sách bộ từ luôn có nút "Nghe lại hướng dẫn sử dụng" nếu bạn cần. Ngay sau nút đó là mục "Bảng chữ cái tiếng Anh": mỗi chữ cái có phát âm theo từ điển và một từ ví dụ kèm nghĩa tiếng Việt.' },
  { tieuDe: 'Phần 3: Chọn bộ từ và học từ mới',
    noiDung: 'Dùng mũi tên để đi qua các bộ từ, tới bộ nào máy đọc tên bộ đó cùng số từ, nhấn Enter để vào. Trong menu của bộ từ, chọn "Học từ mới". Máy sẽ đọc từng thẻ theo thứ tự, và luôn đọc từ tiếng Anh trước. Mỗi thẻ có bốn lựa chọn, theo thứ tự: "Phát âm tiếng Anh" để nghe cách đọc từ; "Đọc từng chữ cái" để nghe cách viết; "Nghe nghĩa" để nghe nghĩa tiếng Việt; "Thẻ tiếp theo" để sang thẻ kế. Ba lựa chọn đầu có thể chọn lại nhiều lần để nghe lại. Nghe hết thẻ sẽ tới phần bài tập.' },
  { tieuDe: 'Phần 4: Cách làm bài tập trắc nghiệm',
    noiDung: 'Mỗi câu hỏi có 3 đáp án. Nhấn mũi tên xuống để đi vào đáp án thứ nhất, nhấn tiếp để qua đáp án thứ hai, thứ ba. Tới đáp án nào, máy đọc đáp án đó. Khi đã đứng ở đáp án mình muốn, nhấn Enter để trả lời. Trả lời đúng sẽ nghe một tiếng vui. Trả lời sai sẽ nghe một tiếng trầm, máy đọc đáp án đúng, và câu đó sẽ quay lại sau vài câu cho tới khi bạn trả lời đúng. Sau mỗi câu, nhấn Enter để qua câu tiếp theo.' },
  { tieuDe: 'Phần 5: Hai kiểu bài tập và ôn tập nhanh',
    noiDung: 'Sau khi nghe hết thẻ, bạn chọn "Bài tập theo thứ tự" (hỏi theo đúng thứ tự thẻ, luôn hỏi từ tiếng Anh sang nghĩa tiếng Việt) hoặc "Bài tập xáo trộn" (hỏi lộn xộn, hỏi cả hai chiều Anh sang Việt và Việt sang Anh). Ngoài ra, trong menu của mỗi bộ từ có "Ôn tập nhanh": bài trắc nghiệm ngắn 6 câu lấy ngẫu nhiên từ bộ đó. Mỗi lần vào ôn tập, câu hỏi được xáo mới, nên có thể ôn đi ôn lại nhiều lần.' },
  { tieuDe: 'Phần 6: Đổi chế độ màu',
    noiDung: 'Dành cho người còn nhìn được một phần. Nút "Đổi chế độ màu" nằm ngay sau hai nút "Có" và "Không" ở màn hình đầu tiên, và sau danh sách bộ từ. Nút này chuyển giữa nền đen chữ vàng và nền sáng chữ đen. Cả hai chế độ đều có độ tương phản cao đạt chuẩn. Lựa chọn được ghi nhớ cho những lần mở web sau.' },
  { tieuDe: 'Phần 7: Liên hệ',
    noiDung: 'Nếu bạn muốn thêm bộ từ vựng mới, hãy liên hệ Trân qua số điện thoại 0943 447 577.' }
];

/* ===== BẢNG CHỮ CÁI TIẾNG ANH =====
   chu: chữ cái. viDu: một từ bắt đầu bằng (hoặc có chứa) chữ cái đó.
   nghia: nghĩa tiếng Việt của từ ví dụ. */
const BANG_CHU_CAI = [
  { chu: "A", viDu: "Apple",     nghia: "quả táo" },
  { chu: "B", viDu: "Book",      nghia: "quyển sách" },
  { chu: "C", viDu: "Cat",       nghia: "con mèo" },
  { chu: "D", viDu: "Dog",       nghia: "con chó" },
  { chu: "E", viDu: "Egg",       nghia: "quả trứng" },
  { chu: "F", viDu: "Fish",      nghia: "con cá" },
  { chu: "G", viDu: "Girl",      nghia: "bé gái" },
  { chu: "H", viDu: "Hat",       nghia: "cái mũ" },
  { chu: "I", viDu: "Ice",       nghia: "nước đá" },
  { chu: "J", viDu: "Juice",     nghia: "nước ép" },
  { chu: "K", viDu: "Key",       nghia: "chìa khóa" },
  { chu: "L", viDu: "Lion",      nghia: "sư tử" },
  { chu: "M", viDu: "Milk",      nghia: "sữa" },
  { chu: "N", viDu: "Nose",      nghia: "cái mũi" },
  { chu: "O", viDu: "Orange",    nghia: "quả cam" },
  { chu: "P", viDu: "Pen",       nghia: "cây bút" },
  { chu: "Q", viDu: "Queen",     nghia: "nữ hoàng" },
  { chu: "R", viDu: "Rain",      nghia: "mưa" },
  { chu: "S", viDu: "Sun",       nghia: "mặt trời" },
  { chu: "T", viDu: "Tree",      nghia: "cái cây" },
  { chu: "U", viDu: "Umbrella",  nghia: "cái ô" },
  { chu: "V", viDu: "Van",       nghia: "xe tải nhỏ" },
  { chu: "W", viDu: "Water",     nghia: "nước" },
  { chu: "X", viDu: "Box",       nghia: "cái hộp" },
  { chu: "Y", viDu: "Yellow",    nghia: "màu vàng" },
  { chu: "Z", viDu: "Zoo",       nghia: "sở thú" }
];
let viTriChu = 0;   // đang học chữ cái thứ mấy

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
   Ưu tiên 1: bản thu giọng người thật của từ điển (từ điển Oxford, giọng Anh Mỹ),
              tải thẳng từ mạng mỗi khi cần, không phải lưu file nào.
   Ưu tiên 2: bản thu giọng người thật trên kho Wikimedia.
   Ưu tiên 3: giọng tiếng Anh có sẵn trong trình duyệt / Windows.
   Cuối cùng: đưa chữ cho trình đọc màn hình.
   Từ nào nguồn trên không có thì tự động thử nguồn kế tiếp. */
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

/* Đọc bằng giọng máy. chamLai: true thì đọc chậm hơn (dùng khi đọc từng chữ cái). */
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

const mayPhat = new Audio();   // máy phát bản thu từ điển
let luotPhat = 0;              // số thứ tự lượt phát, để lượt cũ không chen vào lượt mới
let henGioPhat = null;         // hẹn giờ tự phát khi vừa mở thẻ
const nguonTot = {};           // nhớ nguồn nào phát được cho từng từ

/* Dừng mọi tiếng phát âm đang phát hoặc đang chờ phát */
function dungPhatAm() {
  clearTimeout(henGioPhat);
  luotPhat++;
  mayPhat.pause();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

/* Các địa chỉ bản thu của một từ, theo thứ tự ưu tiên */
function dsNguon(chu) {
  const thuong = chu.toLowerCase().replace(/[^a-z' -]/g, "").trim();
  const gach = encodeURIComponent(thuong.replace(/ /g, "_"));
  const hoa = encodeURIComponent(thuong.charAt(0).toUpperCase() + thuong.slice(1));
  const oxford = "https://ssl.gstatic.com/dictionary/static/sounds/oxford/";
  const wiki = "https://commons.wikimedia.org/wiki/Special:FilePath/En-us-";
  return [
    oxford + gach + "--_us_1.mp3",
    wiki + encodeURIComponent(thuong) + ".ogg",
    wiki + hoa + ".ogg"
  ];
}

/* Phát âm một từ tiếng Anh bằng bản thu từ điển; không có thì dùng giọng máy */
function phatAmTuDien(chu, dsRieng) {
  dungPhatAm();
  const luot = luotPhat;
  const ds = nguonTot[chu] ? [nguonTot[chu]] : (dsRieng || dsNguon(chu));
  let i = 0;

  function thu() {
    if (luot !== luotPhat) return;
    if (i >= ds.length) { phatAmAnh(chu, false); return; }
    const diaChi = ds[i++];
    let xong = false;
    const hetCho = setTimeout(hong, 3000);   /* mạng chậm quá 3 giây thì thử nguồn kế */

    function hong() {
      if (xong) return;
      xong = true;
      clearTimeout(hetCho);
      mayPhat.onerror = null;
      mayPhat.onplaying = null;
      if (luot === luotPhat) { mayPhat.pause(); thu(); }
    }

    mayPhat.onerror = hong;
    mayPhat.onplaying = function () {
      xong = true;
      clearTimeout(hetCho);
      nguonTot[chu] = diaChi;
    };
    mayPhat.src = diaChi;
    mayPhat.play().catch(hong);
  }
  thu();
}

/* Tự phát âm từ sau khi trình đọc màn hình đọc xong dòng chữ đầu màn */
function tuPhatSau(chu, miliGiay) {
  clearTimeout(henGioPhat);
  henGioPhat = setTimeout(function () { phatAmTuDien(chu); }, miliGiay);
}

/* Phát âm tên một chữ cái bằng bản thu từ điển.
   Riêng chữ A: mục "a" trong từ điển Oxford là mạo từ (đọc là "ờ"), không phải tên chữ cái,
   nên chữ A lấy bản thu tên chữ cái ở kho Wikimedia. */
function phatAmChuCai(chu) {
  if (chu === "A") {
    const wiki = "https://commons.wikimedia.org/wiki/Special:FilePath/En-us-";
    phatAmTuDien("A", [wiki + "a.ogg", wiki + "A.ogg"]);
  } else {
    phatAmTuDien(chu);
  }
}

/* Đọc từng chữ cái: mỗi chữ cái một nhịp, bằng giọng máy tiếng Anh */
function docTungChu(chu) {
  dungPhatAm();
  phatAmAnh(chu.toLowerCase().split("").join(", "), true);
}

/* Từ tiếng Anh hiện to trên màn hình. Trình đọc màn hình không đọc chữ này
   (giọng của nó đọc tiếng Anh không chuẩn); thay vào đó web phát bản thu từ điển. */
function hienTuAnh(chu) {
  return '<span aria-hidden="true" lang="en" style="display:block;font-size:40px;margin-top:8px;">' +
         chu + '</span>';
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
  dungPhatAm();
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
   - Trang không chứa chữ ẩn, không có nhãn ẩn. Chữ của màn nào chỉ được đưa lên trang
     khi tới màn đó, và bị xóa hẳn khi sang màn khác.
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
  /* Xóa hẳn câu mở đầu khỏi trang (không ẩn, mà xóa) */
  if (phanTinh.parentNode) phanTinh.parentNode.removeChild(phanTinh);
  thongBao.textContent = "";

  manHinh.innerHTML =
    MO_KHOI +
      '<span style="display:block;font-size:34px;margin-bottom:14px;">' +
        bocEn("EarEng") + ' — Học từ vựng tiếng Anh bằng tai. </span>' +
      '<span style="display:block;font-size:22px;font-weight:normal;margin-bottom:14px;">' +
        'Giới thiệu: ' + LOI_GIOI_THIEU + ' </span>' +
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
   Nội dung lấy từ CAC_PHAN_HUONG_DAN ở đầu file này.
   Mỗi phần hiện thành một mục. Mũi tên xuống tới mục nào, máy đọc mục đó. */
function hienHuongDan() {
  thongBao.textContent = "";

  const kieuMuc = 'display:block;width:100%;text-align:left;font-size:20px;' +
                  'font-weight:normal;line-height:1.6;margin:10px 0;';

  let html = MO_KHOI + 'Hướng dẫn sử dụng. ' +
             'Nhấn mũi tên xuống để nghe từng phần.</div>';

  CAC_PHAN_HUONG_DAN.forEach(function (phan) {
    html += '<button type="button" style="' + kieuMuc + '">' +
            '<strong>' + phan.tieuDe + '.</strong> ' + phan.noiDung + '</button>';
  });

  html += '<button id="nut-xong-hd">Đã nghe xong hướng dẫn, vào học</button>';
  manHinh.innerHTML = html;

  khiBam("nut-xong-hd", hienDanhSachBo);

  focusVao(document.getElementById("tieu-de-man"));
}

/* ===== MÀN HÌNH 1: DANH SÁCH BỘ TỪ ===== */
function hienDanhSachBo() {
  thongBao.textContent = "";
  let html = MO_KHOI + 'Học từ vựng — chọn bộ từ</div>' +
             '<button id="nut-nghe-lai-hd">Nghe lại hướng dẫn sử dụng</button>' +
             '<ul class="danh-sach-bo">' +
             '<li><button class="nut-bo" id="nut-bang-chu-cai">Bảng chữ cái tiếng Anh (' +
             BANG_CHU_CAI.length + ' chữ cái)</button></li>';
  CAC_BO_TU.forEach(function (bo, chiSo) {
    html += '<li><button class="nut-bo" data-so="' + chiSo + '">' +
            bo.ten + ' (' + bo.tu.length + ' từ)</button></li>';
  });
  html += '</ul>' + NUT_MAU_HTML;
  manHinh.innerHTML = html;

  khiBam("nut-nghe-lai-hd", hienHuongDan);
  khiBam("nut-bang-chu-cai", function () { viTriChu = 0; hienChuCai(); });
  ganNutMau();
  document.querySelectorAll(".nut-bo[data-so]").forEach(function (nut) {
    nut.addEventListener("click", function () {
      boHienTai = CAC_BO_TU[Number(nut.dataset.so)];
      hienMenuBo();
    });
  });

  focusVao(document.getElementById("tieu-de-man"));
}

/* ============================================================
   BẢNG CHỮ CÁI TIẾNG ANH — học lần lượt từng chữ cái
   ============================================================ */
function hienChuCai() {
  thongBao.textContent = "";
  const muc = BANG_CHU_CAI[viTriChu];
  const tong = BANG_CHU_CAI.length;
  const laChuCuoi = (viTriChu === tong - 1);

  /* Chữ cái và từ ví dụ hiện to trên màn hình; web tự phát âm bằng bản thu từ điển,
     trình đọc màn hình không đọc hai dòng này. */
  manHinh.innerHTML =
    MO_KHOI + 'Chữ cái ' + (viTriChu + 1) + ' trên ' + tong + '.' +
      hienTuAnh(muc.chu + ' ' + muc.chu.toLowerCase()) +
      '<span aria-hidden="true" style="display:block;font-size:24px;font-weight:normal;">Từ ví dụ: ' +
        bocEn(muc.viDu) + '</span>' +
    '</div>' +
    '<button type="button" id="nut-pa-chu">Phát âm chữ cái</button> ' +
    '<button type="button" id="nut-pa-vi-du">Phát âm từ ví dụ</button> ' +
    '<button type="button" id="nut-nghia-vi-du">Nghe nghĩa từ ví dụ</button> ' +
    '<button type="button" id="nut-chu-tiep">' +
      (laChuCuoi ? 'Hết bảng chữ cái — học lại từ đầu' : 'Chữ cái tiếp theo') + '</button> ' +
    '<button type="button" id="nut-chon-bo">Về danh sách bộ từ</button>';

  khiBam("nut-pa-chu", function () { phatAmChuCai(muc.chu); });
  khiBam("nut-pa-vi-du", function () { phatAmTuDien(muc.viDu); });
  khiBam("nut-nghia-vi-du", function () {
    dungPhatAm();
    docLen('Từ ví dụ nghĩa là: ' + muc.nghia + '.');
  });
  khiBam("nut-chu-tiep", function () {
    viTriChu = laChuCuoi ? 0 : viTriChu + 1;
    hienChuCai();
  });
  khiBam("nut-chon-bo", hienDanhSachBo);

  focusVao(document.getElementById("tieu-de-man"));
  /* Chờ máy đọc xong "Chữ cái ... trên ..." rồi tự phát âm chữ cái */
  henGioPhat = setTimeout(function () { phatAmChuCai(muc.chu); }, 1800);
}

/* ===== MENU CỦA MỘT BỘ TỪ ===== */
function hienMenuBo() {
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
    MO_KHOI + 'Thẻ ' + (viTriThe + 1) + ' trên ' + boHienTai.tu.length + '.' +
    hienTuAnh(the.en) + '</div>' +
    '<button type="button" id="nut-nghe-tu">Phát âm tiếng Anh</button> ';

  if (the.en.indexOf(" ") === -1) {
    html += '<button type="button" id="nut-danh-van">Đọc từng chữ cái</button> ';
  }

  html += '<button type="button" id="nut-nghe-nghia">Nghe nghĩa</button> ' +
          '<button type="button" id="nut-the-tiep">' +
          (laTheCuoi ? 'Hết thẻ — sang phần bài tập' : 'Thẻ tiếp theo') + '</button>';

  manHinh.innerHTML = html;

  khiBam("nut-nghe-tu", function () { phatAmTuDien(the.en); });

  const nutDanhVan = document.getElementById("nut-danh-van");
  if (nutDanhVan) {
    nutDanhVan.addEventListener("click", function () { docTungChu(the.en); });
  }

  khiBam("nut-nghe-nghia", function () {
    /* Hiện nghĩa ở vùng thông báo phía dưới; trình đọc màn hình đọc đúng dòng đó */
    dungPhatAm();
    docLen('Nghĩa là: ' + the.vi + '.');
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
  /* Chờ máy đọc xong "Thẻ ... trên ..." rồi tự phát âm từ tiếng Anh */
  tuPhatSau(the.en, 1800);
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
    ? 'Từ sau đây nghĩa là gì?' + hienTuAnh(the.en)
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
    nutNgheTu.addEventListener("click", function () { phatAmTuDien(the.en); });
  }

  const nutDanhVan = document.getElementById("nut-danh-van");
  if (nutDanhVan) {
    nutDanhVan.addEventListener("click", function () { docTungChu(the.en); });
  }

  document.querySelectorAll(".nut-dap-an").forEach(function (nut) {
    nut.addEventListener("click", function () {
      chamDiem(baLuaChon[Number(nut.dataset.so)], the, baLuaChon);
    });
  });

  focusVao(document.getElementById("tieu-de-man"));
  /* Hỏi từ tiếng Anh: chờ máy đọc xong câu hỏi rồi tự phát âm từ đó */
  if (chieu === "en2vi") {
    tuPhatSau(the.en, 3000);
  }
}

function chamDiem(luaChon, the, baLuaChon) {
  const dung = (luaChon.en === the.en);
  dungPhatAm();
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
   Không tự đặt con trỏ lúc mở trang, để trình đọc màn hình tự đọc từ đầu trang:
   tên tab, rồi câu "Để bắt đầu, nhấn phím Tab một lần". */
hienManBatDau();
