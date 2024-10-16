import React, { useState, useEffect } from 'react';
import { Button, List, Spin, Table, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import getAllFile, { SuccessGetAllFileData } from '../api/getAllFile.api';
import deleteFile from '../../file/api/deleteFile.api';
import MyForm from './SelectBar';
import '../../../style/Table.scss';
import getFile, { SuccessGetFileByCondition } from '../api/getFileByCondition.api'
import getFileByName from '../api/getFileByName.api';

interface File {
  id: number;
  file_name: string;
  status: 'COMPLETED' | 'TO_DO' | 'NEED_REVIEW';
}

const getStatusDisplay = (status: File['status']) => {
  switch (status) {
    case 'TO_DO':
      return { label: 'On going', color: 'text-green-500' };
    case 'NEED_REVIEW':
      return { label: 'Need Review', color: 'text-red-500' };
    case 'COMPLETED':
      return { label: 'Completed', color: 'text-blue-500' };
    default:
      return { label: 'Unknown', color: 'text-gray-500' };
  }
};

const ListFile: React.FC = () => {
  const [files, setFiles] = useState<SuccessGetAllFileData["files"]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<'TO_DO' | 'NEED_REVIEW' | 'COMPLETED' | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();


  const fetchFiles = async () => {
    setLoading(true);
    try {
      let data: SuccessGetAllFileData;

      console.log('Fetching files with status:', status);

      if (status) {
        data = await getFile(status);
      }
      else if (searchTerm) {
        data = await getFileByName(searchTerm)
      }
      else {
        data = await getAllFile();
      }


      setFiles(data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [status]);

  const handleSearch = () => {
    fetchFiles();
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
      notification.success({
        message: 'File deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      notification.error({
        message: 'Failed to delete file!',
      });
    }
  };

  if (loading) {
    return <Spin />;
  }


  return (
    <div>
      <div className='flex space-x-4 mb-8'>
        <div className="flex-3">
          <label htmlFor="status" className="block text-lg font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'COMPLETED' | 'TO_DO' | 'NEED_REVIEW' | undefined)}
            className="bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 p-2 w-full"
          >
            <option value="">All</option>
            <option value="TO_DO">On going</option>
            <option value="NEED_REVIEW">Need review</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="flex-2">
          <label htmlFor="search" className="block text-lg font-semibold text-gray-700 mb-2">Search by file name</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value as string)}
            placeholder="Enter file name..."
            className="ml-2 border border-gray-300 rounded-lg shadow-sm p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded-lg shadow-lg py-2 px-5 hover:bg-blue-600 transition duration-200 h-10 mt-auto"
        >
          Find
        </button>
      </div>
      <div className='overflow-y-auto max-h-50 rounded-lg'>
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">File Name</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="border border-gray-200 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file, index) => {
              const { label, color } = getStatusDisplay(file.status)
              return (
                <tr key={file.id} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="border border-gray-200 px-4 py-2 whitespace-nowrap">{index + 1}</td>
                  <td className="border border-gray-200 px-4 py-2 whitespace-nowrap">{file.id}</td>
                  <td className="border border-gray-200 px-4 py-2 whitespace-nowrap">{file.file_name}</td>
                  <td className={`border border-gray-200 px-4 py-2 whitespace-nowrap font-semibold ${color}`}>{label}</td>
                  <td className="border border-gray-200 flex justify-center p-4 space-x-4">
                    <Button type="primary" onClick={() => navigate(`/file/${file.id}`)}>
                      Open File
                    </Button>
                    <Button type="primary" onClick={() => handleDeleteFile(file.id)}>
                      Delete File
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default ListFile;