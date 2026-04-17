export default function FileUploader({
  files,
  onFilesChange,
  onRemoveFile,
  label = "Images",
}) {
  const handleChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      onFilesChange(selectedFiles);
    }
    event.target.value = "";
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
      />

      {files.length > 0 && (
        <div className="rounded-3xl bg-white p-4 text-sm text-slate-700">
          <div className="mb-3 font-semibold text-slate-900">
            Selected files
          </div>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="text-sm text-slate-500 transition hover:text-slate-900"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
