import { useState } from 'react';

const ManageTags = ({ onClose }) => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [color, setColor] = useState('#000000');

  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags([...tags, { name: newTag, color }]);
      setNewTag('');
      setColor('#000000');
    }
  };

  return (
   
    <div className="fixed top-0 right-2 h-full bg-white z-50 p-6 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Tags</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-2xl font-bold">
          &times;
        </button>
      </div>

      <div className="flex items-center gap-2">
        
        <input
          type="text"
          placeholder="Tag name"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="border mt-4 h-10 w-50 border-blue-600 rounded-[10px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-6 w-5 mt-4 cursor-pointer"
        />

        <button
          onClick={handleAddTag}
          className="h-9 w-14 mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-[10px] text-sm font-medium transition"
        >
          Add
        </button>
      </div>

      <div className="mt-6">
        
        <ul className="space-y-4 bg bg-gray-100 max-h-64 ">
          {tags.map((tag, index) => (
            <li key={index} className="flex items-center gap-3">
              <span
                className="inline-block w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: tag.color }}
              />
              <span className="text-sm">{tag.name}</span>
              <li>
              <button className="text-sm">Edit</button>
              <button className="text-sm">Delete</button>
            </li>
            </li>
            
            
          ))}
          
        </ul>
      </div>
    </div>
    
  );
};

export default ManageTags;
