import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

// One crate in the list: title top-left, optional record count bottom-right.
// `count` is optional - nothing is shown until someone passes it in.
// onDelete: optional, adds a "⋮" menu with "Delete crate" (the parent asks for confirmation)
export default function CrateCard({ title, count, onClick, onDelete }) {
  const [menuAnchor, setMenuAnchor] = useState(null); // the ⋮ button while the menu is open

  return (
    // position: relative, so the ⋮ button can sit in the top-right corner.
    // It is NOT inside CardActionArea: that is already a <button>, and a button
    // inside a button is invalid (and tapping ⋮ would also open the crate).
    <Card sx={{ position: "relative" }}>
      <CardActionArea
        onClick={onClick}
        sx={{
          minHeight: 88,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
        }}
      >
        {/* right padding keeps long titles clear of the ⋮ button */}
        <Typography variant="subtitle1" sx={{ pr: onDelete ? 5 : 0 }}>
          {title}
        </Typography>
        {count !== undefined && (
          <Box
            sx={{
              alignSelf: "flex-end",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: 1,
              borderColor: "text.secondary",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Typography variant="caption">{count}</Typography>
          </Box>
        )}
      </CardActionArea>

      {onDelete && (
        <>
          <IconButton
            aria-label={`Options for crate ${title}`}
            aria-haspopup="true"
            aria-expanded={menuAnchor ? "true" : undefined}
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{ position: "absolute", top: 4, right: 4 }}
          >
            <MoreVertRoundedIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                onDelete();
              }}
              sx={{ color: "error.main", minHeight: 44 }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <DeleteRoundedIcon />
              </ListItemIcon>
              <ListItemText>Delete crate</ListItemText>
            </MenuItem>
          </Menu>
        </>
      )}
    </Card>
  );
}
