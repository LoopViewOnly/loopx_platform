
import React from 'react';

interface ContinueProgressModalProps {
    userName: string;
    onAgree: () => void;
}

const ContinueProgressModal: React.FC<ContinueProgressModalProps> = ({ userName, onAgree }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4">
            <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-sm mx-auto text-center shadow-glass">
                <h2 className="text-3xl font-bold text-blue-300 mb-4">Welcome Back, {userName}!</h2>
                <p className="text-gray-200 text-lg mb-6">
                    You will continue from where you left off.
                </p>
                <button
                    onClick={onAgree}
                    className="w-full px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-600/30"
                >
                    Agree
                </button>
            </div>
        </div>
    );
};

export default ContinueProgressModal;
