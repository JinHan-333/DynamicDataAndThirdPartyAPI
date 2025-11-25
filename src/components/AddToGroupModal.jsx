import { useState, useEffect } from 'react';

function AddToGroupModal({ isOpen, onClose, onSave, groups, initialSelectedIds }) {
  const [selectedIds, setSelectedIds] = useState(new Set(initialSelectedIds));

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(initialSelectedIds));
    }
  }, [isOpen, initialSelectedIds]);

  const toggleGroup = (groupId) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedIds(newSelected);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-black border border-gray-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center uppercase tracking-wider">Add to List</h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {groups.map(group => (
              <div 
                key={group._id}
                onClick={() => toggleGroup(group._id)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <span className="text-gray-300 font-medium text-lg group-hover:text-white transition">
                  {group.name}
                </span>
                <div className={`w-6 h-6 border-2 rounded transition flex items-center justify-center ${
                  selectedIds.has(group._id) 
                    ? 'bg-white border-white' 
                    : 'border-gray-500 group-hover:border-white'
                }`}>
                  {selectedIds.has(group._id) && (
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-white text-white text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-black transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(Array.from(selectedIds))}
              className="px-6 py-2 bg-white text-black text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToGroupModal;
