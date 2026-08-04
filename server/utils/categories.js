const categoryAliases = {
  vanhoc: "vanhoc", "văn học": "vanhoc",
  kynang: "kynang", "kỹ năng": "kynang",
  khoahoc: "khoahoc", "khoa học": "khoahoc",
  taichinh: "taichinh", "tài chính": "taichinh",
  congnghe: "congnghe", "công nghệ": "congnghe",
  thieunhi: "thieunhi", "thiếu nhi": "thieunhi",
  tusu: "tusu", "tự sự": "tusu",
};

const normalizeCategory = value => {
  const category = String(value || "").trim().toLocaleLowerCase("vi-VN");
  return categoryAliases[category] || category;
};

module.exports = { normalizeCategory };
