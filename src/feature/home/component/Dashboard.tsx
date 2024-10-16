import ListFile from './ListFile'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom';
import MyForm from './SelectBar';
import UploadFolderWithParse from './UploadFolder';
import React, { useState } from 'react';
import FileSearch from './SearchFile';


export default function Dashboard() {

  const navigate = useNavigate();
  const [refreshFileList, setRefreshFileList] = React.useState(false);


  const handleFileListUpdate = () => {
    setRefreshFileList((prev) => !prev);
  };


  return (
    <div className='flex justify-center'>
      <div className='w-2/3'>

        <div className='h-2'></div>
        <div>
          <h1 className='text-3xl font-bold text-blue-900 mb-4 flex justify-center'>DASHBOARD</h1>
          <div className='flex'>
            <Button type="primary" className="px-6 py-5 text-lg mb-4 text-white bg-blue-600 rounded-lg" onClick={() => navigate('/file')}>
              Upload File
            </Button>

            <UploadFolderWithParse updateFileList={handleFileListUpdate} />
          </div>

          <ListFile />
        </div>
      </div>
    </div>

  )
}
