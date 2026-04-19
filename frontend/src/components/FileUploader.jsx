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
    // Reset input
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <label className="block cursor-pointer group">
        <div className="relative rounded-3xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-indigo-50 p-10 text-center shadow-sm hover:border-indigo-400 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity">
            <svg
              className="h-12 w-12 text-slate-400 group-hover:text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16l4-4m0 0l-4-4m4 4H7m6 0v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-3xl"
          />

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2 backdrop-blur-sm border shadow-sm text-sm font-semibold text-slate-700 group-hover:text-indigo-700">
              <span>📁</span>
              Click or drag files
            </div>
            <p className="text-sm text-slate-600 group-hover:text-slate-700">
              {label} (JPG, PNG, up to 10MB each)
            </p>
          </div>
        </div>
      </label>

      {files.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                📷
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">
                  {files.length} {files.length === 1 ? "file" : "files"}{" "}
                  selected
                </h4>
                <p className="text-sm text-slate-500">
                  Total{" "}
                  {(files.reduce((total, file) => total + file.size, 0) /
                    1024 /
                    1024) |
                    0}{" "}
                  MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => files.forEach((_, index) => onRemoveFile(index))}
              className="rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2 text-sm font-semibold transition-all hover:shadow-sm"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto -mx-1.5 px-1.5 pb-1.5">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="group relative rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50 border border-slate-200 p-3 hover:shadow-md transition-all hover:border-indigo-300"
              >
                <div className="aspect-video rounded-xl bg-slate-100 overflow-hidden relative">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <span className="text-2xl">
                        {file.name.split(".").pop()?.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-slate-300 text-rose-500 hover:border-rose-300 hover:bg-rose-50 shadow-lg transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center hover:scale-110"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-xs text-white font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-white/90">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
