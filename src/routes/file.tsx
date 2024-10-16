import axios, { AxiosError } from "axios";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import getFile from "../feature/file/api/getFile.api";
import getSignedUrl from "../feature/file/api/getSignedUrl.api";
import ChooseFile from "../feature/file/components/ChooseFile";
import Main from "../feature/file/components/Main";
import parser, { IFileData, IFileInfo } from "../feature/file/utils/reader";

export function FileRoute() {
  const { id } = useParams<{ id: string | undefined }>();
  const [showUploadInput, setShowUploadInput] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [fileData, setFileData] = React.useState<IFileData | null>(null);
  const [fileInfo, setFileInfo] = React.useState<IFileInfo | null>(null);
  const [fileId, setFileId] = React.useState<string | null>(null);

  const isUpload = id === undefined;

  useEffect(() => {
    if (isUpload) {
      setShowUploadInput(true);
    } else {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getFile(id);
          if (data.signedUrl) {
            const res = await axios.get(data.signedUrl);
            const fileData = parser(res.data);
            setFileData(fileData.fileData);
            setFileInfo({
              ...fileData.fileInfo,
              fileName: data.file.file_name,
            });
          }
        } catch (e) {
          if (e instanceof AxiosError) {

            if (e.response?.status === 404) {
              setError(
                "File not found or you don't have permission to access this file"
              );
            }
            else {
              setError("Server error, please submit error to admin");
            }
          }
          else {
            setError("Something went wrong, please submit error to admin");
          }
        }
        setLoading(false);
      };
      fetchData();
    }
  }, []);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const buffer = reader.result as ArrayBuffer;
      const utf8decoder = new TextDecoder("utf-8");
      const content = utf8decoder.decode(buffer);
      const data = parser(content);
      setFileData(data.fileData);
      setFileInfo({
        fileName: file.name,
        ...data.fileInfo,
      });

      try {
        const fileCloudData = await getSignedUrl({
          ...data.fileInfo,
          fileName: file.name,
        });
        window.history.replaceState(
          null,
          `File ${fileCloudData.file.id}`,
          `/file/${fileCloudData.file.id}`
        );
        setFileId(fileCloudData.file.id);
        setShowUploadInput(false);

        if (fileCloudData.signedUrl) {
          setUploading(true);
          await axios.put(fileCloudData.signedUrl, buffer);
          setUploading(false);
        }
      } catch (e) {
        console.error("Error uploading");
        setError("Error uploading file, please submit error to admin");
        setShowUploadInput(false);
      }
    };
  };

  if (showUploadInput) {
    return (
      <div className="flex justify-center">
        <div className="h-[100vh] flex justify-center flex-col">
          <ChooseFile handleFile={handleFile} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error}</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <h1 className="flex gap-2 m-4">
        <span className="loading loading-spinner"></span>
        Loading...
      </h1>
    );
  }

  if (fileData === null || fileInfo === null) {
    return (
      <div>
        <h1>Some thing went wrong, pleas refresh page</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-none">
          <Link to={"/"} className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost">{fileInfo?.fileName}</a>
        </div>
        <div className="flex-none">
          {uploading && (
            <div>
              <h1 className="flex gap-2">
                <span className="loading loading-spinner"></span>
                Uploading
              </h1>
            </div>
          )}
        </div>
      </div>
      {!loading && (
        <div>
          <Main
            fileInfo={fileInfo}
            fileData={fileData}
            fileId={id || fileId || undefined}
          />
        </div>
      )}
    </div>
  );
}
