import RecordList from "../components/RecordList";
import { testRecords } from "../data/testRecords.js";
import { useState } from "react";

const titles = {
  hub: "Home",
  collection: "My Collection",
  wantlist: "My Wantlist",
};

function CollectionPage() {
  const [view, setView] = useState("hub");
  const records = view === "collection" ? testRecords : testRecords;

  function handleAdd(id) {
    console.log("Add to collection:", id);
  }

  return (
    <>
      <h1>{titles[view]}</h1>
      {view === "hub" ? (
        <>
          <button onClick={() => setView("collection")}>My collection</button>
          <button onClick={() => setView("wantlist")}>Want list</button>
        </>
      ) : (
        <>
          <button onClick={() => setView("hub")}>Back</button>
          <RecordList
            records={records}
            onAdd={view === "wantlist" ? handleAdd : undefined}
          />
        </>
      )}
    </>
  );
}

export default CollectionPage;
