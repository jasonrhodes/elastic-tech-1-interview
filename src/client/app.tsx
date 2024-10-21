import React, { useEffect, useState } from "react";
import "./app.css";

interface MediaItem {
  nasa_id: string;
  center: string;
  date_created: string;
  description: string;
  keywords: string[];
  title: string;
  thumbnail_href?: string;
}

interface MediaResponse {
  total_hits: number;
  items: MediaItem[];
}

interface APIResponse {
  data: MediaResponse;
}

const INITIAL_STATE = {
  total_hits: 0,
  items: [],
};

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MediaResponse>(INITIAL_STATE);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/media?q=${search}&media_type=image&page=${page}`,
        { mode: "cors" }
      );
      const parsedResponse = (await response.json()) as APIResponse;
      setData(parsedResponse.data);
    };
    fetchData();
  }, [search, page]);

  const onChangeSearch = (value: string) => {
    setSearch(value);
  };

  function handleNavigation(nextPage: number) {
    setPage(page + nextPage);
  }

  return (
    <div>
      <div>
        <label>Search for something cool</label>
        <input
          type="text"
          id="input_search"
          onChange={(e) => onChangeSearch(e.target.value)}
        />
      </div>
      <NavigationButtons
        currentPage={page}
        totalItems={data.total_hits}
        onNavigate={handleNavigation}
      />
      <Grid items={data.items} />
    </div>
  );
}

function NavigationButtons({
  totalItems = 0,
  onNavigate,
  currentPage,
}: {
  totalItems?: number;
  currentPage: number;
  onNavigate: (nextPage: number) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        marginTop: 8,
      }}
    >
      <button
        disabled={currentPage === 1}
        onClick={() => {
          onNavigate(-1);
        }}
      >
        Previous
      </button>
      <p>{totalItems} items found</p>
      <button
        disabled={totalItems === 0}
        onClick={() => {
          onNavigate(+1);
        }}
      >
        Next
      </button>
    </div>
  );
}

function Grid({ items }: { items?: MediaItem[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {items?.map((item) => {
        return (
          <div style={{ width: 250, margin: 8 }}>
            <img
              src={item.thumbnail_href}
              alt={item.title}
              height={225}
              width={250}
            />
            <p>{item.title}</p>
            <p className="description">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
