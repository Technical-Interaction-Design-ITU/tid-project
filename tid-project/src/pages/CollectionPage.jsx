import RecordList from "../components/RecordList";
import { testRecords } from "../data/testRecords.js";
import { useState } from "react";
import { useNavigate } from "react-router";

const titles = {
  hub: "Home",
  collection: "My Collection",
  wantlist: "My Wantlist",
};

function CollectionPage() {
  const navigate = useNavigate();
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
          <div>
            <button onClick={() => navigate("/new-crate")}>New crate</button>
          </div>
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
