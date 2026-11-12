import { useState } from "react";

export default function TextForm({
  placeholder,
  buttonLabel,
  onSubmit,
  clearOnSubmit = true,
}) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault(); // 1. stop the page reload
    const trimmed = text.trim(); // .trim removes spaces in the start and end of search word.
    if (trimmed.length === 0) return; // ignore empty submits
    onSubmit(trimmed); // 2. hand the text to the parent page
    if (clearOnSubmit) setText("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
      />
      <button className="button" disabled={text.trim().length === 0}>
        {buttonLabel}
      </button>
    </form>
  );
}
