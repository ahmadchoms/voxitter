export function HelperText({ error, note }) {
    return (
        <>
            {note && <p className="text-xs text-gray-500">{note}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </>
    );
}