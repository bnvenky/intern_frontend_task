/* eslint-disable react/prop-types */
import { useState } from 'react';
import ActionMenu from './ActionMenu';
import { useNavigate } from 'react-router-dom';
import EditPositionDetails from './EditPositionDetails';

const PositionsTable = ({ positions }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null); // State to store the selected position

  const handleEditPosition = (position) => {
    setSelectedPosition(position); // Set the current position
    setIsEditModalOpen(true);
  };
  
  const navigate = useNavigate();

  const navigateToPositionDetails = (id) => {
    navigate(`/positions/${id}`); // Navigate to PositionDetails page
  };
  
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full max-h-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Company name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Job description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Experience</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Technologies</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Skills</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position._id} className="border-b">
                <td className="px-6 py-4 text-sm text-blue-600">{position.title}</td>
                <td className="px-6 py-4 text-sm">{position.companyName}</td>
                <td
                  className="px-6 py-4 text-sm truncate max-w-xs"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {position.jobDescription}
                </td>
                <td className="px-6 py-4 text-sm">{position.experience}</td>
                <td
                  className="px-6 py-4 text-sm truncate max-w-xs"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {position?.technologies?.map((tech) => tech?.name).join(', ') || 'No skills listed'}
                </td>
                <td
                  className="px-6 py-4 text-sm truncate max-w-xs"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {position?.skills?.map((skill) => skill?.name).join(', ') || 'No skills listed'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <ActionMenu
                    handleView={navigateToPositionDetails}
                    handleEdit={() => handleEditPosition(position)} // Pass current position to edit
                    positionId={position._id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && selectedPosition && (
        <EditPositionDetails
          position={selectedPosition} // Pass the selected position to the modal
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default PositionsTable;

