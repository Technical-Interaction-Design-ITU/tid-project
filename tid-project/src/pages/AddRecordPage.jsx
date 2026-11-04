import { useState } from "react";
import TextForm from "../components/TextForm";

export default function AddRecordPage({ onBack }) {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(query) {
    console.log("Searching for:", query);
    setSearchQuery(query);
    // Later: call the Discogs API here and store the results in state
  }

  return (
    <div>
      {/* back button */}
      <button className="button" type="button" onClick={onBack}>
        Back
      </button>

      {/* search field */}
      <TextForm
        placeholder="Text search"
        buttonLabel="Search"
        onSubmit={handleSearch}
        clearOnSubmit={false}
      />

      {/* results area */}
      {searchQuery === "" ? (
        <p>Search for a record to add</p>
      ) : (
        <p>Results for "{searchQuery}" will appear here</p>
      )}
    </div>
  );
}
