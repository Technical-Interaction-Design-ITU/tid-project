import RecordList from "../components/RecordList";
import AddToCrateDialog from "./AddToCrateDialog.jsx";
import {
  getCrates,
  getCollection,
  getWantList,
  moveToRecordList,
} from "../services/recordListServices.js";
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
  const [crates, setCrates] = useState([]);
  const [selectedCrate, setSelectedCrate] = useState(null);
  const [collection, setCollection] = useState(null);
  const [wantList, setWantList] = useState(null);
  const [listError, setListError] = useState(null);
  const [recordForCrate, setRecordForCrate] = useState(null); // record id while AddToCrateDialog is open
  const [crateMessage, setCrateMessage] = useState(null);

  // load the user's collection and wantList once
  useEffect(() => {
    Promise.all([getCollection(), getWantList()])
      .then(([c, w]) => {
        setCollection(c);
        setWantList(w);
      })
      .catch((err) => setListError(err.message));
  }, []);

  // the list shown in the collection / wantlist views
  const currentList = view === "wantlist" ? wantList : collection;

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

  // open AddToCrateDialog for a record in the collection
  function openAddToCrate(id) {
    setCrateMessage(null);
    setRecordForCrate(id);
  }

  // move a record from the wantList to the collection
  // (RecordList removes it from the screen once this resolves)
  async function handleAddToCollection(id) {
    await moveToRecordList(
      id,
      wantList.get("list_id"),
      collection.get("list_id"),
    );
  }

  return (
    <>
      <h1>
        {view === "crate" ? selectedCrate.get("list_name") : titles[view]}
      </h1>
      {view === "home" ? (
        <>
          <button onClick={() => setView("collection")}>My collection</button>
          <button onClick={() => setView("wantlist")}>Want list</button>

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
          {listError ? (
            <p>Could not load list: {listError}</p>
          ) : !currentList ? (
            <p>Loading records...</p>
          ) : (
            <RecordList
              listId={currentList.get("list_id")}
              onAddToCollection={view === "wantlist" ? handleAddToCollection : undefined}
              onAddToCrate={
                view === "collection" ? openAddToCrate : undefined
              }
            />
          )}
          {crateMessage && <p>{crateMessage}</p>}
          <AddToCrateDialog
            recordId={recordForCrate}
            onClose={() => setRecordForCrate(null)}
            onAdded={(crate) => {
              setCrateMessage(`Added to "${crate.get("list_name")}"`);
              setRecordForCrate(null);
            }}
          />
        </>
      )}
    </>
  );
}

export default CollectionPage;
