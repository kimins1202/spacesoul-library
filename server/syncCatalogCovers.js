const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("./models/Book");

dotenv.config();

// Danh sách công khai cố định; script không gửi dữ liệu đọc từ database ra ngoài.
const catalog = [
  ["Tâm Lý Học Về Tiền", "Morgan Housel"],
  ["Atomic Habits", "James Clear"],
  ["Dế Mèn Phiêu Lưu Ký", "Tô Hoài"],
  ["Nhà Giả Kim", "Paulo Coelho"],
  ["Cho Tôi Xin Một Vé Đi Tuổi Thơ", "Nguyễn Nhật Ánh"],
  ["Tôi Thấy Hoa Vàng Trên Cỏ Xanh", "Nguyễn Nhật Ánh"],
  ["Muôn Kiếp Nhân Sinh", "Nguyên Phong"],
  ["Tuổi Trẻ Đáng Giá Bao Nhiêu", "Rosie Nguyễn"],
  ["Lược Sử Thời Gian", "Stephen Hawking"],
  ["Sapiens: Lược Sử Loài Người", "Yuval Noah Harari"],
  ["Clean Code", "Robert C. Martin"],
  ["Trí Tuệ Nhân Tạo: Cuộc Cách Mạng Mới", "Kai-Fu Lee"],
  ["Hoàng Tử Bé", "Antoine de Saint-Exupéry"],
  ["Kính Vạn Hoa", "Nguyễn Nhật Ánh"],
  ["Nhà Đầu Tư Thông Minh", "Benjamin Graham"],
  ["Đắc Nhân Tâm", "Dale Carnegie"]
];

const normalize = value => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]/g, "");

const findOnOpenLibrary = async (title, author) => {
  const params = new URLSearchParams({
    title,
    author,
    limit: "10",
    fields: "title,author_name,cover_i,isbn,number_of_pages_median"
  });
  const response = await fetch(`https://openlibrary.org/search.json?${params}`);
  if (!response.ok) return null;

  const data = await response.json();
  const expectedTitle = normalize(title);
  const expectedAuthor = normalize(author);
  const candidate = data.docs?.find(item => {
    const titleMatches = normalize(item.title || "").includes(expectedTitle)
      || expectedTitle.includes(normalize(item.title || ""));
    const authorMatches = (item.author_name || []).some(name => {
      const normalizedName = normalize(name);
      return normalizedName.includes(expectedAuthor) || expectedAuthor.includes(normalizedName);
    });
    return item.cover_i && titleMatches && authorMatches;
  }) || data.docs?.find(item => item.cover_i);

  if (!candidate?.cover_i) return null;
  return {
    cover: `https://covers.openlibrary.org/b/id/${candidate.cover_i}-L.jpg`,
    isbn: candidate.isbn?.find(value => value.length === 13) || candidate.isbn?.[0] || "",
    pages: candidate.number_of_pages_median || 0
  };
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library");
    let updated = 0;
    let googleAvailable = true;

    for (const [title, author] of catalog) {
      try {
        let metadata = null;
        if (googleAvailable) {
          const query = encodeURIComponent(`intitle:"${title}" inauthor:"${author}"`);
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&printType=books`);
          if (response.status === 429) googleAvailable = false;
          if (response.ok) {
            const data = await response.json();
            const exact = data.items?.find(item => {
              const foundTitle = normalize(item.volumeInfo?.title || "");
              return foundTitle.includes(normalize(title)) || normalize(title).includes(foundTitle);
            });
            const candidate = exact || data.items?.[0];
            const links = candidate?.volumeInfo?.imageLinks;
            const cover = links?.large || links?.medium || links?.small || links?.thumbnail;
            if (cover) {
              metadata = {
                cover: cover.replace(/^http:/, "https:").replace("&edge=curl", ""),
                isbn: candidate.volumeInfo.industryIdentifiers?.find(item => item.type === "ISBN_13")?.identifier || "",
                pages: candidate.volumeInfo.pageCount || 0
              };
            }
          }
        }

        metadata ||= await findOnOpenLibrary(title, author);
        if (!metadata) continue;

        const result = await Book.updateMany(
          { title, author },
          {
            $set: {
              cover: metadata.cover,
              isbn: metadata.isbn,
              pages: metadata.pages
            }
          }
        );
        if (result.modifiedCount) updated += result.modifiedCount;
      } catch (error) {
        console.warn(`Bỏ qua "${title}": ${error.message}`);
      }
    }
    console.log(`Đã cập nhật bìa thực tế cho ${updated} đầu sách.`);
  } catch (error) {
    console.error(`Không thể đồng bộ bìa: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
