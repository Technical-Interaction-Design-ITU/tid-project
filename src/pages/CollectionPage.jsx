import RecordList from "../components/RecordList";
import { testRecords } from "../data/testRecords.js";
import { getCrates } from "../services/recordListServices.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// This page can render three different views:
const titles = {
  home: "Home",
  collection: "My Collection",
  wantlist: "My Wantlist",
};

function CollectionPage() {
  const navigate = useNavigate();
  const [view, setView] = useState("home");
  const records = view === "collection" ? testRecords : testRecords;
  const [crates, setCrates] = useState([]);
  const [selectedCrate, setSelectedCrate] = useState(null);

  // load the user's crates (again) whenever we are back on the home view
  useEffect(() => {
    if (view !== "home") return;
    getCrates()
      .then(setCrates)
      .catch((err) => console.error(err));
  }, [view]);

  function openCrate(crate) {
    setSelectedCrate(crate);
    setView("crate");
  }

  function handleAdd(id) {
    console.log("Add to collection:", id);
  }

  return (
    <>
      <h1>
        {view === "crate" ? selectedCrate.get("list_name") : titles[view]}
      </h1>
      {view === "home" ? (
        <>
          <button onClick={() => setView("Collection")}>My collection</button>
          <button onClick={() => setView("Wantlist")}>Want list</button>

          <h2>your crates: </h2>

          <div>
            <button onClick={() => navigate("/new-crate")}>New crate</button>
          </div>

          {crates.map((crate) => (
            <button key={crate.id} onClick={() => openCrate(crate)}>
              {crate.get("list_name")}
            </button>
          ))}
        </>
      ) : view === "crate" ? (
        <>
          <button onClick={() => setView("home")}>Back</button>
          <RecordList listId={selectedCrate.get("list_id")} />
        </>
      ) : (
        <>
          <button onClick={() => setView("home")}>Back</button>
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
