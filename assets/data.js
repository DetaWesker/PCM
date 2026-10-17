/* PHOR COFFEE: ข้อมูลร้าน (แก้ที่ไฟล์นี้ไฟล์เดียว ทุกหน้าจะเปลี่ยนตาม)
   ช่องที่ลงท้ายด้วย En คือข้อความภาษาอังกฤษของช่องเดียวกัน ถ้าแก้ภาษาไทยให้แก้ภาษาอังกฤษด้วย */
/* =================================================================
   ข้อมูลร้าน: แก้ที่นี่ที่เดียว ทั้งเว็บจะเปลี่ยนตาม
   ================================================================= */
const PHOTO = {   // รูปจาก Google Maps ของร้าน (ใช้ทำเว็บตัวอย่างเท่านั้น ก่อนขึ้นจริงให้ขออนุญาตหรือใช้รูปของร้าน)
  front:   "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Tn_m2jv62i1lSgyo7zFiaDZQmGPC4N7f9pYmHBcqLi40Jss6Mt2XUM7TQ4Fa4L5LYcEiTuCCuzgLB9JM_ysQFmZmn_kVL0pwZYTdnvZSxf5WBk5CpH6Q_e_TpAhRVT0l6fpoUhAuIhZb7f",
  iced:    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TGe942btuUcycY5rJV0vhs8fYfeOkX7s3RBe5vG3CfznjFwcN-6gtWhmcncsyUMtKoRHWWQZbjWtTQgKIayUpIGw-3CoiK9n2SZjSQp5mcyrAZUFPC858HNcjJwS-ONghnxzBX",
  matcha:  "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Su_u8F8j-v1kD1Rfpn3pS6ixlUGXjX9KWRx0OAU_KkEpqYWmCHuIdGZEaD-KadzK9CV4xdqQ0H2gAMkz-vcc7Wv-m783Fnu_RDEiQC7m1qwk2jlJ2DnFHNeXOfwQn9VRQp9sEQmbJrHb3u",
  muffin:  "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Rp5k-K_X8apuJ4fAxGpfcusr_m2Fj78QTcxYkmErdXnUiJ_ezvt37k6tiniwiFVtJXftdQxqk8WC8A8O6ie8c_TdODh1gJlg5VahzF0IzThV90ALU-fhXhqJO-Gy-lZ1V70FUE6b-dfZw",
  bar:     "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SMLdiNI4d8-maXjIihtQ-eQODZlVenqjXU2nR-e3l7GrFcwUIyETcqgjbyvOGJflenMUKUm0PASjsUN9xoOX5_f66MQQsLGkr05wsYmhTeQD808WTMpfafnwMGLGpznmp4IPphk200b-kO",
  seating: "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QHzo24pwPWQKM7wb40MjR917jb52PlORJ8GVf4UdKtA8tnMlDoKzIUUz3N9Xnphia3_NjiUbcGRpERiR1E6HTMUKBsAljnNtYmAlg84s6sPpoIE4kCdvi9lpcjg8A6zD8JVYE9e9wp4fja",
  inside:  "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QsrQCakS43KFabOcUKQu2G8qP_q8Pcaah36sM89RZCGMUcvJztqGP_xXfVWMckva8UvehWh3Wz71idbVKL_OLaL0C_YmOD965lFiSMD0zeoRob63hPxKsvuH1OEi-Tbo0ehhCiJ7KkOFUx",
  cake:    "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RZEjpJlPqEAukjRtgMWgovpkG29WRZrz7YLSVZtK4xgJdCpJJPHdGPbw3Y_pnaFFuQTonGNptcNtxj9_aoyyyvLuGyVkA7yeZGpVZk1b5W0D4W1ZFQy3Iv9KQSop2jLN9IDYa5Ip1p8KI",
  brick:   "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QadB2rGrqUcO-HNUSD9VOnwVwj74Wz0IaiT6ZBt9fCVWMVhBqma50dJUxSWwYpBV23Vm3eQkQEf3qvG-VNei5GDk1bGp7zO6aT8ysJ6HeV1dbdYsna4BgB06Ky1XXK2OKpUNPDpfUjMI5j",
  signature:"https://lh3.googleusercontent.com/gps-cs-s/ANWiy9S8HhMTLJRcNqeafhWXqeIe8a7ss0kbjyUdgexmY0ffjGRh7fFagzfTtueVkhaB5skNWE-D7uUAmIfEq5LMXZYermrtycFwBhCgCLr_z30RztA3H2xQlQCGSEVBSQL9xntMFTNcNA7iezo",

  // รูปจากเพจ Facebook ของร้าน เก็บไว้ในโฟลเดอร์ assets/img (ขนาดเล็กสำหรับรูปย่ออยู่ใน assets/img/sm ชื่อไฟล์เดียวกัน)
  latteFlavours: "assets/img/latte-flavours.jpg",
  dirty:         "assets/img/dirty-coffee.jpg",
  hotLatte:      "assets/img/hot-latte.jpg",
  icedMatcha:    "assets/img/iced-matcha.jpg",
  icedChoc:      "assets/img/iced-chocolate.jpg",
  soda:          "assets/img/fruit-soda.jpg",
  appleCrumble:  "assets/img/apple-crumble.jpg",
  bakerySet:     "assets/img/coffee-bakery-set.jpg",
  latteCrumble:  "assets/img/latte-crumble.jpg",
};

const SITE = {
  name: "PHOR COFFEE",
  aboutTitle: "ร้านกาแฟริมถนนร่มเกล้า 1",
  aboutTitleEn: "A coffee shop on Rom Klao 1 Road",
  about: "ในร้านเปิดแอร์ ข้างนอกมีที่นั่งใต้ต้นไม้ใหญ่ มีกาแฟ มัทฉะ และขนมอบทุกวัน",
  aboutEn: "Air-conditioned seating inside and tables under a big tree outside. Coffee, matcha and fresh bakes every day.",

  // รูปที่เลื่อนเปลี่ยนเองทุก 5 วินาที ข้างข้อความแนะนำร้าน (หน้าข้อมูล)  pos = จุดโฟกัสของรูป
  aboutPhotos: [
    { img: PHOTO.bar,          pos: "50% 50%", alt: "เคาน์เตอร์บาร์กาแฟภายในร้าน",  altEn: "Coffee bar counter inside the shop" },
    { img: PHOTO.latteCrumble, pos: "50% 48%", alt: "ลาเต้เย็นกับเค้กแอปเปิลครัมเบิล", altEn: "Iced latte with apple crumble cake" },
    { img: PHOTO.hotLatte,     pos: "50% 62%", alt: "ลาเต้ร้อนกับน้ำเปล่า",          altEn: "Hot latte with a glass of water" },
    { img: PHOTO.icedMatcha,   pos: "50% 72%", alt: "มัทฉะลาเต้เย็น",               altEn: "Iced matcha latte" },
    { img: PHOTO.appleCrumble, pos: "50% 80%", alt: "เค้กแอปเปิลครัมเบิล",           altEn: "Apple crumble cake" },
  ],

  // index 0 = อาทิตย์ ... 6 = เสาร์  ใส่ null ถ้าวันนั้นปิด
  hours: Array(7).fill(["07:30", "18:00"]),

  rating: 4.8, ratingCount: 184,
  quotes: [   // ข้อความรีวิวจริงจาก Google Maps
    "ร้านบรรยากาศดี พนักงานบริการสุภาพ เค้กและเครื่องดื่มอร่อยหลายเมนู",
    "ร้านกาแฟเล็ก ๆ แต่บรรยากาศดี กาแฟดีมาก พนักงานเป็นกันเอง บริการดี",
    "กาแฟหอมกรุ่น พนักงานน่ารัก อัธยาศัยดี",
  ],
  quotesEn: [   // แปลจากรีวิวด้านบน เรียงลำดับเดียวกัน
    "Great atmosphere and polite staff. Many of the cakes and drinks are delicious.",
    "A small coffee shop with a great atmosphere. Excellent coffee, friendly staff and good service.",
    "Fragrant coffee, lovely staff and a warm welcome.",
  ],

  // เมนู: ชื่อมาจากรูปและรีวิวของร้าน แต่ "ราคาเป็นตัวเลขสมมติ" ต้องเปลี่ยนเป็นราคาจริงก่อนให้ร้านดู
  // แต่ละหมวดคือแฟ้ม 1 อัน  cover = รูปในแฟ้ม  img = รูปของเมนูนั้น  pos = จุดโฟกัสของรูป (แนวนอน แนวตั้ง)
  // ในแฟ้มโชว์ได้ 4 แผ่น: เลือกเมนูที่มีรูปก่อน ที่เหลือเรียงตามลำดับ  รายการเต็มอยู่ใต้แฟ้ม
  // เมนูที่มีรูป กดที่แผ่นในแฟ้มหรือรูปย่อในรายการ จะเปิดดูรูปใหญ่
  menu: [
    { id: "coffee", group: "กาแฟ", groupEn: "Coffee", cover: { img: PHOTO.signature, pos: "50% 85%" }, items: [
      { name: "เอสเปรสโซ", nameEn: "Espresso", price: 55 },
      { name: "อเมริกาโน่", nameEn: "Americano", desc: "ร้อน / เย็น", descEn: "Hot / Iced", price: 65, img: PHOTO.iced, pos: "50% 65%" },
      { name: "ลาเต้", nameEn: "Latte", desc: "ร้อน / เย็น", descEn: "Hot / Iced", price: 75, img: PHOTO.hotLatte, pos: "50% 59%" },
      { name: "ลาเต้เย็นรสพิเศษ", nameEn: "Flavored Iced Latte", desc: "วานิลลา / มาร่อน / มะพร้าว", descEn: "Vanilla / Marron / Coconut", price: 85, img: PHOTO.latteFlavours, pos: "50% 76%" },
      { name: "เดอร์ตี้", nameEn: "Dirty Coffee", desc: "เอสเปรสโซช็อตบนนมเย็น", descEn: "Espresso shot over cold milk", price: 95, img: PHOTO.dirty, pos: "50% 80%" },
      { name: "คาปูชิโน่", nameEn: "Cappuccino", desc: "ร้อน / เย็น", descEn: "Hot / Iced", price: 75 },
      { name: "มอคค่า", nameEn: "Mocha", desc: "เย็น", descEn: "Iced", price: 85 },
      { name: "กาแฟดริป", nameEn: "Drip Coffee", price: 120 },
    ]},
    { id: "drinks", group: "เครื่องดื่ม", groupEn: "Drinks", cover: { img: PHOTO.matcha, pos: "50% 90%" }, items: [
      { name: "มัทฉะลาเต้", nameEn: "Matcha Latte", desc: "เย็น", descEn: "Iced", price: 90, img: PHOTO.icedMatcha, pos: "50% 70%" },
      { name: "ช็อกโกแลตเย็น", nameEn: "Iced Chocolate", desc: "ดาร์กช็อกโกแลตเบลเยียม", descEn: "Belgian dark chocolate", price: 85, img: PHOTO.icedChoc, pos: "50% 61%" },
      { name: "โซดาผลไม้", nameEn: "Fruit Soda", desc: "เย็น", descEn: "Iced", price: 70, img: PHOTO.soda, pos: "50% 87%" },
      { name: "ชาไทย", nameEn: "Thai Tea", desc: "เย็น", descEn: "Iced", price: 65 },
    ]},
    { id: "desserts", group: "ขนมหวาน", groupEn: "Desserts", cover: { img: PHOTO.cake, pos: "50% 30%" }, items: [
      { name: "ครัวซองต์เนย", nameEn: "Butter Croissant", price: 75 },
      { name: "มัฟฟินบลูเบอร์รี่ครัมเบิล", nameEn: "Blueberry Crumble Muffin", price: 85, img: PHOTO.muffin, pos: "50% 90%" },
      { name: "เค้กมัทฉะ", nameEn: "Matcha Cake", price: 110, img: PHOTO.cake, pos: "50% 20%" },
      { name: "เค้กแอปเปิลครัมเบิล", nameEn: "Apple Crumble Cake", price: 95, img: PHOTO.appleCrumble, pos: "50% 74%" },
      { name: "เซ็ตกาแฟร้อนกับเบเกอรี่", nameEn: "Coffee & Bakery Set", desc: "กาแฟร้อนคู่เบเกอรี่", descEn: "Hot coffee paired with a pastry", price: 129, img: PHOTO.bakerySet, pos: "50% 70%" },
      { name: "บาสก์ชีสเค้ก", nameEn: "Basque Cheesecake", price: 120 },
    ]},
  ],
  menuFoot: "",     // ข้อความท้ายเมนู เช่น เงื่อนไขราคา (ว่างไว้ = ไม่แสดง)

  address: "62/2 ถนนร่มเกล้า 1 แขวงคลองสองต้นนุ่น เขตลาดกระบัง กรุงเทพมหานคร 10520",
  addressEn: "62/2 Rom Klao 1 Road, Khlong Song Ton Nun, Lat Krabang, Bangkok 10520",
  lat: 13.731199, lng: 100.7211521,
  gmapsUrl: "https://maps.app.goo.gl/8rWYxtbHiZkrK4PL9",
  parking: "มีที่จอดรถหน้าร้าน",
  parkingEn: "Parking in front of the shop",

  phone: "0909359566",
  phoneDisplay: "090 935 9566",
  line: "https://lin.ee/Zi9W3QH",
  email: "phorcoffee@gmail.com",
  facebook: "",     // ใส่ลิงก์เพจจริง ถ้าว่างจะไม่แสดง
  instagram: "",
};
