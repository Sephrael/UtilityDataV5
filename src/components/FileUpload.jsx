import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { parseData } from '../utils/dataProcessing';

const FileUpload = ({ onDataLoaded }) => {
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const data = await parseData(file);
                onDataLoaded(data);
            } catch (error) {
                console.error("Error parsing file:", error);
                alert("Error parsing file. Please check the format.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">Click or drag file to upload</p>
            <p className="text-sm text-gray-500 mt-2">Supports .xlsx, .xls, .csv</p>
        </div>
    );
};

export default FileUpload;
