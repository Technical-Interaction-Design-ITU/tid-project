import * as React from "react";
import { Link } from "react-router-dom";
import { BottomNavigation } from "@mui/material/BottomNavigation";
import { BottomNavigationAction } from "@mui/material/BottomNavigationAction";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export default function BottomNavi() {
  const [value, setValue] = React.useState("collection");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //value og to kan først sættes når sider er routed
  return (
    <BottomNavigation bn={{ width: 500 }} value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Collection"
        value="collectionpage"
        icon={<AlbumRoundedIcon />}
        component={Link}
        to="" //route
      />
      <BottomNavigationAction
        label="Add"
        value="addpage"
        icon={<AddRoundedIcon />}
        component={Link}
        to="" //route
      />
      <BottomNavigationAction
        label="Profile"
        value="profile"
        icon={<PersonRoundedIcon />}
        component={Link}
        to="" //route
      />
    </BottomNavigation>
  );
}
