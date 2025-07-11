const { EyeOff, Eye } = require("lucide-react");
const { Button } = require("../ui/button");

const PasswordToggleButton = ({ show, toggle, disabled }) => (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        className="hover:bg-transparent p-1 h-auto"
        onClick={toggle}
        disabled={disabled}
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
    >
        {show ? (
            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
        ) : (
            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
        )}
    </Button>
  );

export default PasswordToggleButton;