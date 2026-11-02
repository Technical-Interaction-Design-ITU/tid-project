import { useState } from "react";

// this is copy of the new todo item page from to do list project

export default function NewTodo({ onAdd }) {
  const [text, setText] = useState("");

  function handleSearch(event) {
    // Add logic that makes an API call and renders result list
  }

  function handleAdd(event) {
    // Add logic that adds the record to collection
  }

  return (
    // back button

    // search field:
    <form onSubmit={handleSearch}>
      {/* onSubmit fires both on button click and Enter key (both phone and keyboard)*/}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task"
      />
      <button className="button" disabled={text.trim().length === 0}>
        Search
      </button>
    </form>
  );
}
