import { useState } from "react";
import { Search, NotFound } from "../components/Icons";
import {
  getBooksByTitle,
  getBooksByAuthor,
  searchBooks,
} from "../api/booksApi";

export default function SearchBooks() {
  const options = ["الكتاب", "المؤلف", "النوع"];
  const genreOptions = [
    "رواية تاريخية",
    "فلسفة",
    "قصص قصيرة",
    "خيال علمي",
    "واقعية سحرية",
    "مغامرة",
  ];

  const [selected, setSelected] = useState([]);
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const toggleOption = (option) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
    if (selected.includes(option)) {
      setInputs((prev) => {
        const newInputs = { ...prev };
        delete newInputs[option];
        return newInputs;
      });
    }
  };
  const handleSearch = async () => {
    try {
      let response;

      if (selected.length === 1 && selected.includes("الكتاب")) {
        response = await getBooksByTitle(inputs["الكتاب"] || "");
      } else if (selected.length === 1 && selected.includes("المؤلف")) {
        response = await getBooksByAuthor(inputs["المؤلف"] || "");
      } else if (selected.length >= 2 || selected.includes("النوع")) {
        const body = {
          title: inputs["الكتاب"] || null,
          author: inputs["المؤلف"] || null,
          genres: inputs["النوع"] || [],
        };
        response = await searchBooks(body);
      }
      setResults(response?.data?.content || []);
      setHasSearched(true); // Set to true after search is performed
    } catch (error) {
      console.error("Search failed", error);
      setResults([]);
      setHasSearched(true); // Also set to true even if search fails
    }
  };

  return (
    <div className="text-right mr-4">
      <h2 className="text-xl font-semibold text-white mb-2">
        اختر طريقة البحث
      </h2>
      <h3 className="text-base font-medium text-white mb-4">
        يمكنك اختيار العديد من الطرق معا
      </h3>

      {/* Search Buttons */}
      <div className="flex flex-wrap items-end gap-2 mb-6">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              onClick={() => toggleOption(option)}
              className={`px-4 py-2 text-base rounded-full font-semibold border transition-all duration-200
                ${
                  isSelected
                    ? "bg-[#765CDE] text-white border-[#765CDE]"
                    : "bg-[#4E3693]/60 text-white border-[#765CDE]"
                }
              `}
            >
              {option}
            </button>
          );
        })}

        <button
          onClick={handleSearch}
          className="w-10 h-10 rounded-md bg-[#765CDE] flex items-center justify-center mr-20"
        >
          <Search className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-4 w-1/2 mb-6">
        {selected.includes("الكتاب") && (
          <input
            type="text"
            placeholder="ادخل اسم الكتاب"
            className="bg-[#1C1F36] border border-[#765CDE] text-white text-right px-3 py-2 rounded-xl placeholder:text-[#6E7493] text-base font-medium focus:outline-none"
            value={inputs["الكتاب"] || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, الكتاب: e.target.value }))
            }
          />
        )}

        {selected.includes("المؤلف") && (
          <input
            type="text"
            placeholder="ادخل اسم المؤلف"
            className="bg-[#1C1F36] border border-[#765CDE] text-white text-right px-3 py-2 rounded-xl placeholder:text-[#6E7493] text-base font-medium focus:outline-none"
            value={inputs["المؤلف"] || ""}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, المؤلف: e.target.value }))
            }
          />
        )}
      </div>

      {/* Genre Grid */}
      {selected.includes("النوع") && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 w-fit">
          {genreOptions.map((genre) => {
            const isSelected = (inputs["النوع"] || []).includes(genre);
            return (
              <button
                key={genre}
                onClick={() =>
                  setInputs((prev) => {
                    const currentGenres = prev["النوع"] || [];
                    return {
                      ...prev,
                      النوع: currentGenres.includes(genre)
                        ? currentGenres.filter((g) => g !== genre)
                        : [...currentGenres, genre],
                    };
                  })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200
                    ${
                      isSelected
                        ? "bg-[#765CDE] text-white border-[#765CDE] "
                        : "bg-[#4E3693]/60 text-white border-[#765CDE]"
                    }
                  `}
              >
                {isSelected && <span className="text-white text-sm">✔</span>}
                {genre}
              </button>
            );
          })}
        </div>
      )}
      {hasSearched ? (
    results.length > 0 ? (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          نتائج البحث:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((book) => (
            <div key={book.id} className="w-full">
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-48 object-cover rounded-xl border border-[#765CDE]"
              />
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center mt-8">
        <NotFound />
        <p className="text-white text-xl mt-4">لم يتم العثور على نتائج</p>
      </div>
    )
  ) : null}
    </div>
  );
}
