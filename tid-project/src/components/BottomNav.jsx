import * as React from "react";
import { Link, useLocation } from "react-router";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export default function BottomNav() {
  const location = useLocation();

  return (
    <BottomNavigation sx={{ width: 500 }} value={location.pathname}>
      <BottomNavigationAction
        label="Collection"
        value="/"
        icon={<AlbumRoundedIcon />}
        component={Link}
        to="/"
      />
      <BottomNavigationAction
        label="Add"
        value="/add"
        icon={<AddRoundedIcon />}
        component={Link}
        to="/add"
      />
      <BottomNavigationAction
        label="Profile"
        value="/profile"
        icon={<PersonRoundedIcon />}
        component={Link}
        to="/profile"
      />
    </BottomNavigation>
  );
}
