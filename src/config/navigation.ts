import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import type { SvgIconComponent } from "@mui/icons-material";

import { ROUTES } from "@/constants/routes";

export interface NavigationItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
}

export const primaryNavigation: NavigationItem[] = [
  { label: "Home", path: ROUTES.home, icon: HomeRoundedIcon },
  { label: "Albums", path: ROUTES.albums, icon: CollectionsRoundedIcon },
  { label: "Upload", path: ROUTES.upload, icon: AddCircleRoundedIcon },
  { label: "Timeline", path: ROUTES.timeline, icon: TimelineRoundedIcon },
  { label: "Favorites", path: ROUTES.favorites, icon: FavoriteRoundedIcon },
];
