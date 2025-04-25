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
    <div className="fixed top-0 right-0 h-full w-[300px] bg-white shadow-lg p-6 transition-transform duration-300 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Tags</h2>
        <button onClick={onClose} className="text-red-500 text-lg font-bold">&times;</button>
      </div>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tag name"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10"
        />
        <button onClick={handleAddTag} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Tag
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Tag List</h3>
        <ul className="space-y-2">
          {tags.map((tag, index) => (
            <li key={index} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span>{tag.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageTags;
