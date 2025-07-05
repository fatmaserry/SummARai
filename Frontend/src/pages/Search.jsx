import { useState, useEffect } from "react";
import { Search, NotFound } from "../components/Icons";
import { FiRefreshCw } from "react-icons/fi";
import {
  getBooksByTitle,
  getBooksByAuthor,
  searchBooks,
} from "../api/summary/search";

import { getAllGenres } from "../api/summary/get-summaries";
import { useNavigate } from "react-router-dom";
import SearchDomainToggle from "../components/toggle";
import Spinner from "../components/spinner";

export default function SearchBooks() {
  const options = ["الكتاب", "المؤلف", "النوع"];
  const [genreOptions, setGenreOptions] = useState([]);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(["الكتاب"]);
  const [inputs, setInputs] = useState({ الكتاب: "" });
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Genres
  const [genreSearch, setGenreSearch] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  // Search domain state
  const [searchDomain, setSearchDomain] = useState("BOOK");

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20; // fixed page size

  // Toggle effect
  useEffect(() => {
    setSelected(["الكتاب"]);
    setInputs({ الكتاب: "" });
    setResults([]);
    setHasSearched(false);
    setGenreSearch("");
    setShowGenreDropdown(false);
    setPage(0);
    setTotalPages(1);
    setTotalElements(0);
  }, [searchDomain]);



  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await getAllGenres();
        setGenreOptions(genres.map((genre) => genre.description));
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      }
    };

    fetchGenres();
  }, []);

  const toggleOption = (option) => {
    if (searchDomain === "USER" && option !== "الكتاب") {
      return;
    }
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

  // filter genres
  const filteredGenres = genreOptions.filter(
    (genre) =>
      genre.includes(genreSearch) && !(inputs["النوع"] || []).includes(genre)
  );
  // validate the search input
  const validateSearch = () => {
    if (searchDomain === "USER") {
      if (
        !selected.includes("الكتاب") ||
        !inputs["الكتاب"] ||
        inputs["الكتاب"].trim() === ""
      ) {
        return 0;
      }
    } else if (searchDomain === "BOOK") {
      const isKetabValid =
        selected.includes("الكتاب") &&
        inputs["الكتاب"] &&
        inputs["الكتاب"].trim() !== "";

      const isMo2lfValid =
        selected.includes("المؤلف") &&
        inputs["المؤلف"] &&
        inputs["المؤلف"].trim() !== "";

      const isNo3Valid =
        selected.includes("النوع") &&
        inputs["النوع"] &&
        Array.isArray(inputs["النوع"]) &&
        inputs["النوع"].length > 0;

      if (!(isKetabValid || isMo2lfValid || isNo3Valid)) {
        return 0;
      }
    }

    return 1;
  };

  const pageBlockSize = usePageBlockSize();
  const getPageNumbers = () => {
    const currentBlock = Math.floor(page / pageBlockSize);
    const startPage = currentBlock * pageBlockSize;
    let endPage = startPage + pageBlockSize - 1;
    if (endPage >= totalPages) endPage = totalPages - 1;

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return { pages, startPage, endPage };
  };


  const handleImageClick = (book) => {
    navigate("/summary", { state: { book } });
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
    handleSearch(pageNumber); // trigger search for new page
  };

  // Handle Search for Summaries
  const handleSearch = async (pageNumber = 0) => {
    try {
      setLoading(true);
      let response;

      if (searchDomain === "USER") {
        if (!inputs["الكتاب"]) return;
        const body = {
          type: "USER",
          title: inputs["الكتاب"],
        };
        response = await searchBooks(body, pageNumber, pageSize);
        if (response) {
          setResults(response.data.content.map((summary) => ({
            ...summary,
            image_url: "/assets/images/summarai_cover.png",
          })));
        } else {
          setResults([]);
        }
      } else {
        const type = "BOOK";
        const body = {
          type,
          ...(inputs["الكتاب"] ? { title: inputs["الكتاب"] } : {}),
          ...(inputs["المؤلف"] ? { author: inputs["المؤلف"] } : {}),
          ...(inputs["النوع"] && inputs["النوع"].length > 0 ? { genres: inputs["النوع"] } : {}),
        };
        response = await searchBooks(body, pageNumber, pageSize);
        setResults(response?.data?.content || []);
      }

      if (response) {
        const data = response.data;
        setPage(data.pageable.pageNumber || 0);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else {
        setPage(0);
        setTotalPages(1);
        setTotalElements(0);
      }
      setHasSearched(true);
    } catch (error) {
      console.error("Search failed", error);
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-right flex flex-col gap-4">
      <h2 className="text-3xl font-semibold text-white m-2">اختر طريقة البحث</h2>
      <div className="flex flex-col lg:flex-row gap-4 items-center m-2">
        <h3 className="text-base font-medium text-white">
          يمكنك اختيار العديد من الطرق معا
        </h3>

        {/* Search Domain */}
        <SearchDomainToggle value={searchDomain} onChange={setSearchDomain} />
      </div>

      {/* Search Buttons */}
      <div className="flex flex-col lg:flex-row w-full justify-between items-center m-2">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-3 mb-6">
          <div className="flex h-fit items-center gap-3">
            {options.map((option) => {
              const isDisabled = searchDomain === "USER" && option !== "الكتاب";
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  disabled={isDisabled}
                  className={`px-4 py-2 text-base rounded-full font-semibold border transition-all duration-200
              ${isSelected
                      ? "bg-[#765CDE] text-white border-[#765CDE]"
                      : "bg-[#4E3693]/60 text-white border-[#765CDE]"
                    }
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
                >
                  {isSelected && <span className="text-white text-sm ml-2 ">✔</span>}
                  {option}
                </button>
              );
            })}
          </div>


          <button
            onClick={() => handleSearch(0)}
            disabled={!validateSearch()}
            className={`w-10 h-10 rounded-md flex items-center justify-center ${!validateSearch() ? "bg-gray-400 cursor-not-allowed" : "bg-[#765CDE]"
              }`}
          >
            <Search className="w-4 h-4 text-white" />
          </button>


        </div>

        {/* Reset button */}
        {hasSearched && <button
          onClick={() => {
            setResults([]);
            setHasSearched(false);
          }}
          className="flex items-center gap-2 bg-[#765CDE] hover:bg-[#5a47b0] transition-colors duration-300 text-white font-semibold text-base px-5 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#5a47b0]"
          aria-label="بحث جديد"
          type="button"
        >
          <FiRefreshCw size={15} />
          <span>بحث جديد</span>
        </button>}
      </div>


      {/* Input Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:w-[80%]">
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

        {searchDomain === "BOOK" && selected.includes("المؤلف") && (
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

      {/* Genre selection and dropdown */}
      {searchDomain === "BOOK" && selected.includes("النوع") && (
        <div className="relative">
          {/* Selected genres as tags */}
          <div className="flex flex-wrap gap-2 mb-2 max-w-sm">
            {(inputs["النوع"] || []).map((genre) => (
              <span
                key={genre}
                className="flex items-center py-1 bg-[#765CDE] text-white rounded-full text-base px-4 justify-center gap-3"
              >
                {genre}
                <button
                  type="button"
                  onClick={() =>
                    setInputs((prev) => ({
                      ...prev,
                      النوع: prev["النوع"].filter((g) => g !== genre),
                    }))
                  }
                  className="text-white font-bold text-base"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Genre search input */}
          <input
            type="text"
            placeholder="ابحث عن النوع"
            className="bg-[#1C1F36] border border-[#765CDE] w-full md:w-1/2 lg:w-1/4 text-white text-right px-3 py-2 rounded-xl placeholder:text-[#6E7493] text-base font-medium focus:outline-none"
            value={genreSearch}
            onChange={(e) => {
              setGenreSearch(e.target.value);
              setShowGenreDropdown(true);
            }}
            onFocus={() => setShowGenreDropdown(true)}
            onBlur={() => {
              setTimeout(() => setShowGenreDropdown(false), 150);
            }}
          />

          {/* Dropdown list */}
          {showGenreDropdown && filteredGenres.length > 0 && (
            <ul className="genre-dropdown absolute z-10 bg-[#1C1F36] border w-full md:w-1/2 lg:w-1/4 border-[#765CDE] rounded-md max-h-48 overflow-auto mt-1">
              {filteredGenres.map((genre) => (
                <li
                  key={genre}
                  onMouseDown={() => {
                    setInputs((prev) => ({
                      ...prev,
                      النوع: [...(prev["النوع"] || []), genre],
                    }));
                    setGenreSearch("");
                    setShowGenreDropdown(false);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-[#765CDE] text-white text-base"
                >
                  {genre}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
      }

      {/* Search Results */}
      {loading ? (
        <Spinner />
      ) : hasSearched ? (
        results.length > 0 ? (
          <div
            className={`mt-8 p-4 rounded-lg relative`}
            style={{ minHeight: "400px", paddingBottom: "80px" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {results.map((book) => (
                <div
                  key={book.id}
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                  style={{ aspectRatio: "3 / 4", maxWidth: "200px" }}
                  onClick={() => handleImageClick(book)}
                >
                  <img
                    src={book.image_url}
                    alt={book.title}
                    className={`w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 ${searchDomain === "USER" ? "bg-white" : ""
                      }`}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                    <p className="text-white text-center px-2 text-2xl font-semibold select-none">
                      {book.title || "بدون عنوان"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-8">
            <NotFound />
            <p className="text-white text-3xl mt-4">لم يتم العثور على نتائج</p>
          </div>
        )
      ) : null
      }


      {/* Pagination */}
      {
        hasSearched && totalPages > 1 && (() => {
          const { pages, startPage, endPage } = getPageNumbers();

          return (
            <div
              className="fixed bottom-0 left-0 w-full bg-[#1C1F36] border-t border-[#765CDE] py-3 flex justify-center items-center z-50"
              style={{ minHeight: "60px" }}
            >
              {/* Previous block button */}
              <button
                onClick={() => {
                  if (page > 0) {
                    const prevBlockPage = Math.max(0, startPage - 1);
                    setPage(prevBlockPage);
                    handleSearch(prevBlockPage);
                  }
                }}
                disabled={page === 0}
                className="disabled:opacity-50 mx-3"
              >
                <img
                  src="/assets/images/sword.png"
                  alt="next"
                  width={60}
                  height={100}
                  className="transform rotate-[46deg] hover:cursor-pointer"
                />
              </button>

              {/* First page and ellipsis if needed */}
              {startPage > 0 && (
                <>
                  <button
                    onClick={() => handlePageClick(0)}
                    className={`p-[15px] pt-[3px] pb-0 mx-2 rounded-full ${page === 0 ? "bg-white text-[#765CDE]" : "bg-[#4E3693]/60"}`}
                  >
                    1
                  </button>
                  <span className="px-2 mx-2 text-white">...</span>
                </>
              )}

              {/* Page numbers in current block */}
              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageClick(p)}
                  className={`p-[15px] pt-[3px] pb-0 mx-2 rounded-full ${page === p ? "bg-white text-[#765CDE]" : "bg-primary-400"}`}
                >
                  {p + 1}
                </button>
              ))}

              {/* Ellipsis and last page if needed */}
              {endPage < totalPages - 1 && (
                <>
                  <span className="px-2 mx-2 text-white">...</span>
                  <button
                    onClick={() => handlePageClick(totalPages - 1)}
                    className={`p-[15px] pt-[3px] pb-0 rounded-full mx-2 ${page === totalPages - 1 ? "bg-white text-[#765CDE]" : "bg-primary-400"}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Next block button */}
              <button
                onClick={() => {
                  if (page < totalPages - 1) {
                    const nextBlockPage = Math.min(totalPages - 1, endPage + 1);
                    setPage(nextBlockPage);
                    handleSearch(nextBlockPage);
                  }
                }}
                disabled={page === totalPages - 1}
                className="disabled:opacity-50 mx-3"
              >
                <img
                  src="/assets/images/sword.png"
                  alt="prev"
                  width={60}
                  height={100}
                  className="transform rotate-[-134deg] hover:cursor-pointer"
                />
              </button>
            </div>
          );
        })()
      }
    </div >
  );
}

function usePageBlockSize() {
  const [pageBlockSize, setPageBlockSize] = useState(10);

  useEffect(() => {
    const updatePageBlockSize = () => {
      if (window.innerWidth < 640) {
        setPageBlockSize(2);
      } else {
        setPageBlockSize(10);
      }
    };

    updatePageBlockSize();
    window.addEventListener("resize", updatePageBlockSize);
    return () => window.removeEventListener("resize", updatePageBlockSize);
  }, []);

  return pageBlockSize;
}