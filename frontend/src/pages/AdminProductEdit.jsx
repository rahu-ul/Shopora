import React from 'react';
import Sidebar from '../component/Admin/Sidebar';
import UpdateProduct from '../component/Admin/UpdateProduct';

const AdminProductEdit = () => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <div className="flex-grow">
                <UpdateProduct />
            </div>
        </div>
    );
};

export default AdminProductEdit;
