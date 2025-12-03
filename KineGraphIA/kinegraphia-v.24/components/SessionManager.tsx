
import React, { useState } from 'react';
import { Session } from '../types';
import { SaveIcon } from './icons/SaveIcon';
import { FolderOpenIcon } from './icons/FolderOpenIcon';

interface SessionManagerProps {
    sessions: Session[];
    onSave: (name: string) => void;
    onLoad: (session: Session) => void;
    onDelete: (timestamp: string) => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ sessions, onSave, onLoad, onDelete }) => {
    const [sessionName, setSessionName] = useState('');
    const [showLoadModal, setShowLoadModal] = useState(false);

    const handleSave = () => {
        if (!sessionName.trim()) {
            alert('Si us plau, introdueix un nom per a la sessió.');
            return;
        }
        onSave(sessionName);
        setSessionName('');
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString('ca-ES');
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Gestió de sessions</h3>
            <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        placeholder="Nom de la sessió..."
                        className="flex-grow p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#0C7B93] focus:border-transparent"
                    />
                    <button onClick={handleSave} className="bg-[#0C7B93] text-white p-2 rounded-md hover:bg-[#085a6e] transition-colors duration-300" title="Desa la sessió">
                        <SaveIcon className="w-5 h-5" />
                    </button>
                </div>
                <button onClick={() => setShowLoadModal(true)} className="w-full bg-[#10B981] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#059669] transition-colors duration-300 flex items-center justify-center space-x-2">
                    <FolderOpenIcon className="w-5 h-5" />
                    <span>Carrega sessió ({sessions.length})</span>
                </button>
            </div>

            {showLoadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Sessions guardades</h2>
                        <div className="flex-grow overflow-y-auto">
                            {sessions.length > 0 ? (
                                <ul className="space-y-2">
                                    {sessions.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(session => (
                                        <li key={session.timestamp} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{session.name}</p>
                                                <p className="text-xs text-gray-500">{formatDate(session.timestamp)}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => { onLoad(session); setShowLoadModal(false); }} className="text-sm bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600">Carrega</button>
                                                <button onClick={() => onDelete(session.timestamp)} className="text-sm bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">Esborra</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No hi ha sessions guardades.</p>
                            )}
                        </div>
                         <button onClick={() => setShowLoadModal(false)} className="mt-4 self-end bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">Tanca</button>
                    </div>
                </div>
            )}
        </div>
    );
};
