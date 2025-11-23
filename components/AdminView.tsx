
import React from 'react';
import Scoreboard from './Scoreboard';
import { UserScore } from '../types';

interface AdminViewProps {
    scores: UserScore[];
}

const AdminView: React.FC<AdminViewProps> = ({ scores }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <Scoreboard data={scores} />
        </div>
    );
};

export default AdminView;
