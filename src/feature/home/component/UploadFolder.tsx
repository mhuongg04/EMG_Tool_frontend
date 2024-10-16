import React, { useRef, useState } from 'react';
import parser from '../../file/utils/reader';
import { api } from "../../../lib/api-client";
import { IFileData, IFileInfo } from '../../file/utils/reader';

type IProps = {
    updateFileList: () => void;
};

export default function UploadFolderWithParse({ updateFileList }: IProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleSelectFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const txtFiles = filesArray.filter((file) => file.type === "text/plain");
            setSelectedFiles(txtFiles);
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError("No files selected");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const uploadPromises = selectedFiles.map(async (file) => {
                const fileContent = await file.text();
                const { fileInfo } = parser(fileContent);

                const { data: response } = await api.post('/file/upload', {
                    hash_value: fileInfo.hashValue,
                    patient_name: fileInfo.patientName,
                    patient_age: fileInfo.patientAge,
                    patient_sex: fileInfo.patientSex,
                    date: fileInfo.date,
                    time: fileInfo.time,
                    muscle_name: fileInfo.muscleName,
                    muscle_side: fileInfo.muscleSide,
                    file_name: file.name,
                });

                if (response.signedUrl) {
                    await fetch(response.signedUrl, {
                        method: 'PUT',
                        body: new Blob([fileContent], { type: 'text/plain' })
                    });
                }
            });

            await Promise.all(uploadPromises);
            updateFileList();
        } catch (error) {
            console.error('Error uploading files:', error);
            setError("Failed to upload files.");
        } finally {
            setLoading(false);
            setSelectedFiles([]); // Reset selected files after upload
        }

        window.location.reload();
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };


    return (
        <div>
            <button
                onClick={selectedFiles.length === 0 ? handleButtonClick : handleUpload}
                className={`ml-4 flex items-center justify-center text-lg text-white rounded-lg py-2 px-5 ${selectedFiles.length === 0 ? 'bg-blue-600' : 'bg-green-600'}`}
            >
                {selectedFiles.length === 0 ? 'Upload Files' : 'Start Upload'}
            </button>

            <input
                type="file"
                ref={fileInputRef}
                {...({ webkitdirectory: true } as any)}
                multiple
                onChange={handleSelectFolder}
                style={{ display: 'none' }}
            />

            {loading && <p>Uploading files...</p>}
            {error && <p className="text-error">{error}</p>}
        </div>
    );
}
