import { Filter } from 'lucide-react';
import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center min-h-[200px]">
            <Filter className="animate-spin text-indigo-600 dark:text-indigo-400" size={40} />
        </div>
    );
};

export default Loading;
