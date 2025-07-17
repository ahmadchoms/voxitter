import { Crown, Trophy, Medal } from "lucide-react";

export const getRankIcon = (rank) => {
  switch (rank) {
    case 1:
      return Crown;
    case 2:
      return Trophy;
    case 3:
      return Medal;
    default:
      return null;
  }
};

export const getRankStyles = (rank) => {
  switch (rank) {
    case 1:
      return {
        gradient:
          "bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent",
        border: "border-amber-500/20",
        badge: "bg-amber-500 text-amber-50",
        avatar: "bg-gradient-to-r from-amber-400 to-yellow-500",
        points: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
        icon: "text-amber-400",
      };
    case 2:
      return {
        gradient:
          "bg-gradient-to-br from-slate-400/10 via-slate-500/5 to-transparent",
        border: "border-slate-400/20",
        badge: "bg-slate-400 text-slate-50",
        avatar: "bg-gradient-to-r from-slate-300 to-slate-400",
        points: "bg-slate-400/20 text-slate-300 border border-slate-400/30",
        icon: "text-slate-300",
      };
    case 3:
      return {
        gradient:
          "bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent",
        border: "border-orange-500/20",
        badge: "bg-orange-500 text-orange-50",
        avatar: "bg-gradient-to-r from-orange-400 to-amber-500",
        points: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        icon: "text-orange-400",
      };
    default:
      return {
        gradient: "bg-slate-900/50",
        border: "border-slate-800/50",
        badge: "bg-slate-700 text-slate-300",
        avatar: "bg-gradient-to-r from-slate-600 to-slate-700",
        points: "bg-slate-700/20 text-slate-300 border border-slate-700/30",
        icon: "text-slate-400",
      };
  }
};
