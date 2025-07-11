import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export const UsernameStatusIcon = ({ usernameAvailable, checkingUsername }) => {
    if (checkingUsername) {
      return <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />;
    }
  
    if (usernameAvailable === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  
    if (usernameAvailable === false) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  
    return null;
  };