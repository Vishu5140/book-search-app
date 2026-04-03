import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

function Home() {
  const scrollRef = useRef(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");


  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  
  useEffect(() => {
    axios
      .get(
        "https://openlibrary.org/people/mekBot/books/want-to-read.json?limit=8"
      )
      .then((res) => {
        setData(res.data.reading_log_entries);
      })
      .catch(() => {
        setError("Failed to fetch data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <p className="text-center text-lg mt-10 text-white">
        Loading books...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    );

 
  const filteredData = data.filter((item) =>
    item?.work?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black p-6"
    >
    
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-cyan-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />
      </div>

      
      <h1
        data-scroll
        data-scroll-speed="1"
        className="text-3xl font-bold text-center mb-8 text-white"
      >
        📚 Book Collection
      </h1>

      
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const book = item.work;

            return (
              <div
                key={book.key}
                data-scroll
                data-scroll-speed="2"
                className="group relative bg-white/10 backdrop-blur-lg border border-cyan-400/30 rounded-2xl shadow-lg p-4 transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/30 hover:bg-cyan-500/10"
              >
                
                <div className="absolute inset-0 rounded-2xl border border-cyan-400 opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></div>

                
                <img
                  src={
                    book.cover_id
                      ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
                      : "https://via.placeholder.com/150"
                  }
                  alt={book.title}
                  className="h-48 w-full object-cover rounded-lg mb-3 transition-transform duration-500 group-hover:scale-105"
                />

              
                <h2 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition">
                  {book.title || "No Title"}
                </h2>

                
                <p className="text-gray-300 text-sm group-hover:text-gray-100 transition">
                  {book.author_names?.join(", ") || "Unknown Author"}
                </p>

        
                <p className="text-xs text-gray-400 mt-2">
                  First published: {book.first_publish_year || "N/A"}
                </p>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No books found 😢
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;