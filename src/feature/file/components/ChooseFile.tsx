import React from 'react'

type IProps = {
  handleFile: (file: File) => void
}

export default function ChooseFile({
  handleFile
}: IProps) {
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e === null || e.target.files === null) return;

    const fileTypes = ["text/plain"];
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        handleFile(selectedFile);
      }
    }
  };
  return (
    <div>
      <input
        type="file"
        className="file-input file-input-bordered file-input-sm w-full max-w-xs"
        onChange={handleSelectFile}
      />
    </div>
  )
}
