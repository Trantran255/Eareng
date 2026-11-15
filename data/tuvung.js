/* ===== DỮ LIỆU CÁC BỘ TỪ VỰNG =====
   Muốn thêm/sửa từ: chỉ sửa file này theo đúng mẫu { en: "...", vi: "..." }.
   Bộ nào cần lời dẫn trước khi học thì thêm dòng gioiThieu: '...'. */
const CAC_BO_TU = [
  {
    ten: "Chào hỏi và giao tiếp cơ bản",
    tu: [
      { en: "Hello", vi: "Xin chào" },
      { en: "Goodbye", vi: "Tạm biệt" },
      { en: "Thank you", vi: "Cảm ơn" },
      { en: "Sorry", vi: "Xin lỗi" },
      { en: "Please", vi: "Làm ơn" },
      { en: "Yes", vi: "Vâng, có" },
      { en: "No", vi: "Không" }
    ]
  },
  {
    ten: "Gia đình",
    tu: [
      { en: "Family", vi: "Gia đình" },
      { en: "Father", vi: "Bố" },
      { en: "Mother", vi: "Mẹ" },
      { en: "Brother", vi: "Anh trai hoặc em trai" },
      { en: "Sister", vi: "Chị gái hoặc em gái" },
      { en: "Child", vi: "Đứa trẻ" }
    ]
  },
  {
    ten: "Số đếm từ 1 đến 10",
    tu: [
      { en: "One", vi: "Số 1" },
      { en: "Two", vi: "Số 2" },
      { en: "Three", vi: "Số 3" },
      { en: "Four", vi: "Số 4" },
      { en: "Five", vi: "Số 5" },
      { en: "Six", vi: "Số 6" },
      { en: "Seven", vi: "Số 7" },
      { en: "Eight", vi: "Số 8" },
      { en: "Nine", vi: "Số 9" },
      { en: "Ten", vi: "Số 10" }
    ]
  },
  {
    ten: "Số đếm từ 11 đến 19",
    gioiThieu: 'Các số từ 11 đến 19 là nhóm đặc biệt, không theo công thức nào, phải học thuộc lòng từng số. Chú ý nhất là <span lang="en">eleven</span> (11) và <span lang="en">twelve</span> (12) vì chúng khác hẳn các số còn lại.',
    tu: [
      { en: "Eleven", vi: "Số 11" },
      { en: "Twelve", vi: "Số 12" },
      { en: "Thirteen", vi: "Số 13" },
      { en: "Fourteen", vi: "Số 14" },
      { en: "Fifteen", vi: "Số 15" },
      { en: "Sixteen", vi: "Số 16" },
      { en: "Seventeen", vi: "Số 17" },
      { en: "Eighteen", vi: "Số 18" },
      { en: "Nineteen", vi: "Số 19" }
    ]
  },
  {
    ten: "Số tròn chục và số ghép đến 100",
    gioiThieu: 'Từ 20 trở đi, số tiếng Anh ghép theo công thức: số tròn chục cộng số lẻ. ' +
               'Ví dụ: <span lang="en">twenty</span> là 20, <span lang="en">one</span> là 1, ' +
               'ghép lại thành <span lang="en">twenty-one</span> là 21. ' +
               'Tương tự: <span lang="en">thirty-five</span> là 35, <span lang="en">sixty-two</span> là 62. ' +
               'Vậy chỉ cần thuộc các số tròn chục trong bộ này, bạn sẽ tự ghép được mọi số đến 99. ' +
               'Riêng số 100 là <span lang="en">one hundred</span>.',
    tu: [
      { en: "Twenty", vi: "Số 20" },
      { en: "Thirty", vi: "Số 30" },
      { en: "Forty", vi: "Số 40" },
      { en: "Fifty", vi: "Số 50" },
      { en: "Sixty", vi: "Số 60" },
      { en: "Seventy", vi: "Số 70" },
      { en: "Eighty", vi: "Số 80" },
      { en: "Ninety", vi: "Số 90" },
      { en: "One hundred", vi: "Số 100" },
      { en: "Twenty-one", vi: "Số 21" },
      { en: "Thirty-five", vi: "Số 35" },
      { en: "Forty-seven", vi: "Số 47" },
      { en: "Sixty-two", vi: "Số 62" },
      { en: "Ninety-nine", vi: "Số 99" }
    ]
  },
  {
    ten: "Màu sắc",
    tu: [
      { en: "Red", vi: "Đỏ" },
      { en: "Blue", vi: "Xanh dương" },
      { en: "Green", vi: "Xanh lá" },
      { en: "Yellow", vi: "Vàng" },
      { en: "Black", vi: "Đen" },
      { en: "White", vi: "Trắng" }
    ]
  },
  {
    ten: "Đồ ăn và thức uống",
    tu: [
      { en: "Rice", vi: "Cơm" },
      { en: "Water", vi: "Nước" },
      { en: "Bread", vi: "Bánh mì" },
      { en: "Milk", vi: "Sữa" },
      { en: "Egg", vi: "Trứng" },
      { en: "Coffee", vi: "Cà phê" }
    ]
  },
  {
    ten: "Động từ thông dụng phần 1",
    tu: [
      { en: "Eat", vi: "Ăn" },
      { en: "Drink", vi: "Uống" },
      { en: "Go", vi: "Đi" },
      { en: "Sleep", vi: "Ngủ" },
      { en: "Work", vi: "Làm việc" },
      { en: "Study", vi: "Học" }
    ]
  },
  {
    ten: "Tính từ cơ bản phần 1",
    tu: [
      { en: "Big", vi: "To, lớn" },
      { en: "Small", vi: "Nhỏ" },
      { en: "Good", vi: "Tốt" },
      { en: "Bad", vi: "Xấu, tệ" },
      { en: "Happy", vi: "Vui vẻ" },
      { en: "Beautiful", vi: "Đẹp" }
    ]
  },
  {
    ten: "Thời gian",
    tu: [
      { en: "Today", vi: "Hôm nay" },
      { en: "Tomorrow", vi: "Ngày mai" },
      { en: "Yesterday", vi: "Hôm qua" },
      { en: "Morning", vi: "Buổi sáng" },
      { en: "Night", vi: "Buổi tối" }
    ]
  },
  {
    ten: "Cơ thể người",
    tu: [
      { en: "Head", vi: "Đầu" },
      { en: "Face", vi: "Khuôn mặt" },
      { en: "Eye", vi: "Mắt" },
      { en: "Nose", vi: "Mũi" },
      { en: "Mouth", vi: "Miệng" },
      { en: "Ear", vi: "Tai" },
      { en: "Hand", vi: "Bàn tay" },
      { en: "Leg", vi: "Chân" },
      { en: "Hair", vi: "Tóc" }
    ]
  },
  {
    ten: "Quần áo",
    tu: [
      { en: "Shirt", vi: "Áo sơ mi" },
      { en: "T-shirt", vi: "Áo thun" },
      { en: "Pants", vi: "Quần dài" },
      { en: "Shorts", vi: "Quần đùi" },
      { en: "Dress", vi: "Váy đầm" },
      { en: "Shoes", vi: "Giày" },
      { en: "Hat", vi: "Mũ, nón" },
      { en: "Jacket", vi: "Áo khoác" }
    ]
  },
  {
    ten: "Thời tiết",
    tu: [
      { en: "Sunny", vi: "Nắng" },
      { en: "Rainy", vi: "Mưa" },
      { en: "Hot", vi: "Nóng" },
      { en: "Cold", vi: "Lạnh" },
      { en: "Windy", vi: "Có gió" },
      { en: "Cloudy", vi: "Nhiều mây" },
      { en: "Weather", vi: "Thời tiết" }
    ]
  },
  {
    ten: "Động vật",
    tu: [
      { en: "Dog", vi: "Chó" },
      { en: "Cat", vi: "Mèo" },
      { en: "Bird", vi: "Chim" },
      { en: "Fish", vi: "Cá" },
      { en: "Chicken", vi: "Gà" },
      { en: "Cow", vi: "Bò" },
      { en: "Pig", vi: "Heo" },
      { en: "Elephant", vi: "Voi" }
    ]
  },
  {
    ten: "Trái cây và rau củ",
    tu: [
      { en: "Apple", vi: "Táo" },
      { en: "Banana", vi: "Chuối" },
      { en: "Orange", vi: "Cam" },
      { en: "Mango", vi: "Xoài" },
      { en: "Watermelon", vi: "Dưa hấu" },
      { en: "Tomato", vi: "Cà chua" },
      { en: "Carrot", vi: "Cà rốt" },
      { en: "Vegetable", vi: "Rau củ" }
    ]
  },
  {
    ten: "Nhà cửa và đồ vật trong nhà",
    tu: [
      { en: "House", vi: "Nhà" },
      { en: "Room", vi: "Phòng" },
      { en: "Kitchen", vi: "Nhà bếp" },
      { en: "Bathroom", vi: "Phòng tắm" },
      { en: "Bedroom", vi: "Phòng ngủ" },
      { en: "Table", vi: "Cái bàn" },
      { en: "Chair", vi: "Cái ghế" },
      { en: "Bed", vi: "Cái giường" },
      { en: "Door", vi: "Cửa" },
      { en: "Window", vi: "Cửa sổ" }
    ]
  },
  {
    ten: "Trường học và học tập",
    tu: [
      { en: "School", vi: "Trường học" },
      { en: "Teacher", vi: "Giáo viên" },
      { en: "Student", vi: "Học sinh, sinh viên" },
      { en: "Book", vi: "Sách" },
      { en: "Pen", vi: "Bút mực" },
      { en: "Pencil", vi: "Bút chì" },
      { en: "Classroom", vi: "Lớp học" },
      { en: "Homework", vi: "Bài tập về nhà" }
    ]
  },
  {
    ten: "Nghề nghiệp",
    tu: [
      { en: "Doctor", vi: "Bác sĩ" },
      { en: "Nurse", vi: "Y tá" },
      { en: "Engineer", vi: "Kỹ sư" },
      { en: "Farmer", vi: "Nông dân" },
      { en: "Driver", vi: "Tài xế" },
      { en: "Cook", vi: "Đầu bếp" },
      { en: "Police officer", vi: "Cảnh sát" },
      { en: "Seller", vi: "Người bán hàng" }
    ]
  },
  {
    ten: "Phương tiện giao thông",
    tu: [
      { en: "Motorbike", vi: "Xe máy" },
      { en: "Car", vi: "Ô tô" },
      { en: "Bus", vi: "Xe buýt" },
      { en: "Bicycle", vi: "Xe đạp" },
      { en: "Train", vi: "Tàu hỏa" },
      { en: "Plane", vi: "Máy bay" },
      { en: "Taxi", vi: "Xe tắc xi" }
    ]
  },
  {
    ten: "Các ngày trong tuần",
    gioiThieu: 'Bảy ngày trong tuần đều kết thúc bằng <span lang="en">day</span>, nghĩa là "ngày". Chú ý riêng thứ Tư: viết là <span lang="en">Wednesday</span> nhưng chữ "d" đầu tiên không phát âm, nghe như "oen-xđây".',
    tu: [
      { en: "Monday", vi: "Thứ Hai" },
      { en: "Tuesday", vi: "Thứ Ba" },
      { en: "Wednesday", vi: "Thứ Tư" },
      { en: "Thursday", vi: "Thứ Năm" },
      { en: "Friday", vi: "Thứ Sáu" },
      { en: "Saturday", vi: "Thứ Bảy" },
      { en: "Sunday", vi: "Chủ nhật" }
    ]
  },
  {
    ten: "Cảm xúc",
    tu: [
      { en: "Sad", vi: "Buồn" },
      { en: "Angry", vi: "Tức giận" },
      { en: "Tired", vi: "Mệt" },
      { en: "Hungry", vi: "Đói" },
      { en: "Thirsty", vi: "Khát" },
      { en: "Scared", vi: "Sợ" },
      { en: "Excited", vi: "Hào hứng" }
    ]
  },
  {
    ten: "Tháng trong năm",
    tu: [
      { en: "January", vi: "Tháng 1" },
      { en: "February", vi: "Tháng 2" },
      { en: "March", vi: "Tháng 3" },
      { en: "April", vi: "Tháng 4" },
      { en: "May", vi: "Tháng 5" },
      { en: "June", vi: "Tháng 6" },
      { en: "July", vi: "Tháng 7" },
      { en: "August", vi: "Tháng 8" },
      { en: "September", vi: "Tháng 9" },
      { en: "October", vi: "Tháng 10" },
      { en: "November", vi: "Tháng 11" },
      { en: "December", vi: "Tháng 12" }
    ]
  },
  {
    ten: "Mùa và thiên nhiên",
    tu: [
      { en: "Spring", vi: "Mùa xuân" },
      { en: "Summer", vi: "Mùa hè" },
      { en: "Autumn", vi: "Mùa thu" },
      { en: "Winter", vi: "Mùa đông" },
      { en: "Sun", vi: "Mặt trời" },
      { en: "Moon", vi: "Mặt trăng" },
      { en: "Star", vi: "Ngôi sao" },
      { en: "Sky", vi: "Bầu trời" },
      { en: "Sea", vi: "Biển" },
      { en: "River", vi: "Sông" },
      { en: "Mountain", vi: "Núi" },
      { en: "Tree", vi: "Cây" }
    ]
  },
  {
    ten: "Đồ dùng cá nhân",
    tu: [
      { en: "Phone", vi: "Điện thoại" },
      { en: "Wallet", vi: "Ví tiền" },
      { en: "Key", vi: "Chìa khóa" },
      { en: "Bag", vi: "Túi xách" },
      { en: "Watch", vi: "Đồng hồ đeo tay" },
      { en: "Glasses", vi: "Kính mắt" },
      { en: "Umbrella", vi: "Cây dù" },
      { en: "Comb", vi: "Cái lược" },
      { en: "Toothbrush", vi: "Bàn chải đánh răng" }
    ]
  },
  {
    ten: "Mua sắm và tiền bạc",
    tu: [
      { en: "Money", vi: "Tiền" },
      { en: "Price", vi: "Giá cả" },
      { en: "Cheap", vi: "Rẻ" },
      { en: "Expensive", vi: "Đắt" },
      { en: "Buy", vi: "Mua" },
      { en: "Sell", vi: "Bán" },
      { en: "Market", vi: "Chợ" },
      { en: "Supermarket", vi: "Siêu thị" },
      { en: "Shop", vi: "Cửa hàng" },
      { en: "Pay", vi: "Trả tiền" }
    ]
  },
  {
    ten: "Nhà hàng và ăn uống",
    tu: [
      { en: "Restaurant", vi: "Nhà hàng" },
      { en: "Menu", vi: "Thực đơn" },
      { en: "Order", vi: "Gọi món" },
      { en: "Delicious", vi: "Ngon" },
      { en: "Sweet", vi: "Ngọt" },
      { en: "Sour", vi: "Chua" },
      { en: "Salty", vi: "Mặn" },
      { en: "Spicy", vi: "Cay" },
      { en: "Bill", vi: "Hóa đơn" },
      { en: "Waiter", vi: "Phục vụ nam" }
    ]
  },
  {
    ten: "Du lịch",
    tu: [
      { en: "Travel", vi: "Du lịch" },
      { en: "Hotel", vi: "Khách sạn" },
      { en: "Airport", vi: "Sân bay" },
      { en: "Ticket", vi: "Vé" },
      { en: "Passport", vi: "Hộ chiếu" },
      { en: "Beach", vi: "Bãi biển" },
      { en: "Map", vi: "Bản đồ" },
      { en: "Tourist", vi: "Khách du lịch" },
      { en: "Trip", vi: "Chuyến đi" },
      { en: "Luggage", vi: "Hành lý" }
    ]
  },
  {
    ten: "Địa điểm trong thành phố",
    tu: [
      { en: "City", vi: "Thành phố" },
      { en: "Street", vi: "Đường phố" },
      { en: "Park", vi: "Công viên" },
      { en: "Hospital", vi: "Bệnh viện" },
      { en: "Bank", vi: "Ngân hàng" },
      { en: "Post office", vi: "Bưu điện" },
      { en: "Church", vi: "Nhà thờ" },
      { en: "Pagoda", vi: "Chùa" },
      { en: "Bridge", vi: "Cây cầu" },
      { en: "Cinema", vi: "Rạp chiếu phim" }
    ]
  },
  {
    ten: "Sở thích và giải trí",
    tu: [
      { en: "Music", vi: "Âm nhạc" },
      { en: "Movie", vi: "Phim" },
      { en: "Game", vi: "Trò chơi" },
      { en: "Sport", vi: "Thể thao" },
      { en: "Football", vi: "Bóng đá" },
      { en: "Swim", vi: "Bơi" },
      { en: "Read", vi: "Đọc sách" },
      { en: "Sing", vi: "Hát" },
      { en: "Dance", vi: "Nhảy, khiêu vũ" },
      { en: "Cook", vi: "Nấu ăn" }
    ]
  },
  {
    ten: "Động từ thông dụng phần 2",
    tu: [
      { en: "See", vi: "Nhìn thấy" },
      { en: "Hear", vi: "Nghe" },
      { en: "Speak", vi: "Nói" },
      { en: "Read", vi: "Đọc" },
      { en: "Write", vi: "Viết" },
      { en: "Walk", vi: "Đi bộ" },
      { en: "Run", vi: "Chạy" },
      { en: "Open", vi: "Mở" },
      { en: "Close", vi: "Đóng" },
      { en: "Give", vi: "Cho, đưa" },
      { en: "Take", vi: "Lấy, cầm" },
      { en: "Help", vi: "Giúp đỡ" }
    ]
  },
  {
    ten: "Tính từ mô tả phần 2",
    tu: [
      { en: "New", vi: "Mới" },
      { en: "Old", vi: "Cũ, già" },
      { en: "Young", vi: "Trẻ" },
      { en: "Tall", vi: "Cao" },
      { en: "Short", vi: "Thấp, ngắn" },
      { en: "Fast", vi: "Nhanh" },
      { en: "Slow", vi: "Chậm" },
      { en: "Easy", vi: "Dễ" },
      { en: "Difficult", vi: "Khó" },
      { en: "Clean", vi: "Sạch" },
      { en: "Dirty", vi: "Bẩn" }
    ]
  },
  {
    ten: "Sức khỏe",
    tu: [
      { en: "Healthy", vi: "Khỏe mạnh" },
      { en: "Sick", vi: "Ốm, bệnh" },
      { en: "Medicine", vi: "Thuốc" },
      { en: "Headache", vi: "Đau đầu" },
      { en: "Fever", vi: "Sốt" },
      { en: "Cough", vi: "Ho" },
      { en: "Pain", vi: "Cơn đau" },
      { en: "Rest", vi: "Nghỉ ngơi" },
      { en: "Exercise", vi: "Tập thể dục" }
    ]
  }
];
