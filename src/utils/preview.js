const [filePreview, setFilePreview] = useState("");

useEffect(() => {
    fetch("/api/get-document/some-id")
        .then((res) => res.json())
        .then(({ fileHex, mimeType }) => {
            if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
                setFilePreview(hexToBase64(fileHex, mimeType)); // Base64 for direct preview
            } else if (mimeType.startsWith("text/")) {
                setFilePreview(hexToString(fileHex)); // Text preview
            } else {
                setFilePreview(hexToBlobURL(fileHex, mimeType)); // Blob URL for download
            }
        });
}, []);

return (
    <div>
        {filePreview.includes("base64") ? (
            <iframe src={filePreview} width="100%" height="500px" />
        ) : filePreview.startsWith("http") ? (
            <a href={filePreview} download="document">Download File</a>
        ) : (
            <pre>{filePreview}</pre>
        )}
    </div>
);
