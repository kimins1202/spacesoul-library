export const CATEGORY_OPTIONS = [
  { value: 'vanhoc', label: 'Văn học' },
  { value: 'kynang', label: 'Kỹ năng' },
  { value: 'khoahoc', label: 'Khoa học' },
  { value: 'taichinh', label: 'Tài chính' },
  { value: 'congnghe', label: 'Công nghệ' },
  { value: 'thieunhi', label: 'Thiếu nhi' },
  { value: 'tusu', label: 'Tự sự' },
]

const aliases = {
  vanhoc: 'vanhoc', 'văn học': 'vanhoc',
  kynang: 'kynang', 'kỹ năng': 'kynang',
  khoahoc: 'khoahoc', 'khoa học': 'khoahoc',
  taichinh: 'taichinh', 'tài chính': 'taichinh',
  congnghe: 'congnghe', 'công nghệ': 'congnghe',
  thieunhi: 'thieunhi', 'thiếu nhi': 'thieunhi',
  tusu: 'tusu', 'tự sự': 'tusu',
}

export const normalizeCategory = (value) => {
  const category = String(value || '').trim().toLocaleLowerCase('vi-VN')
  return aliases[category] || category
}

export const categoryLabel = (value) => {
  const normalized = normalizeCategory(value)
  return CATEGORY_OPTIONS.find(category => category.value === normalized)?.label || value || 'Sách'
}
