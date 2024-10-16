import React, { useState } from 'react';
import { api } from '../../../lib/api-client'; // Thay thế bằng đường dẫn chính xác đến API client

type File = {
    id: string; // Hoặc kiểu mà bạn sử dụng cho id
    file_name: string;
    // Thêm các thuộc tính khác nếu cần
};

const FileSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<File[]>([]);

    const handleSearch = async () => {
        try {
            // Gửi yêu cầu đến backend với searchTerm
            const response = await api.get('/file/search', {
                params: { name: searchTerm }, // Chỉ cần searchTerm
            });
            setResults(response.data); // Lưu kết quả vào state
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên file"
            />
            <button onClick={handleSearch}>Tìm kiếm</button>
            <div>
                {results.length > 0 ? (
                    <ul>
                        {results.map((file) => (
                            <li key={file.id}>{file.file_name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Không tìm thấy file nào.</p>
                )}
            </div>
        </div>
    );
};

export default FileSearch;
