/* eslint-disable react/prop-types */
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import CandidateActionMenu from './CandidateActionMenu';
import EditCandidates from './EditCandidates';


const PositionsTable = ({ candidates }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null); // State to store the selected position

  
  
  const navigate = useNavigate();

  const navigateToPositionDetails = (id) => {
    navigate(`/candidate/${id}`); // Navigate to PositionDetails page
  };

  const handleEditPosition = (position) => {
    console.log("Selected Position:", position); // Debugging log
    setSelectedPosition(position); // Set the current position
    setIsEditModalOpen(true); // Open the edit modal
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full max-h-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Candidate Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Higher Qualification</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Current Experience</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Skills/Technology</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((position) => (
              <tr key={position._id} className="border-b">
                <td className="px-6 py-4 text-sm text-blue-600">
                <div className="flex items-center">
                <img src={`http://localhost:8080`+position.avatar} alt="" className="w-8 h-8 rounded-full mr-3" />
                <span className="text-sm text-blue-600">{position.firstName}</span>
              </div>
                </td>
                <td className="px-6 py-4 text-sm">{position.email}</td>
                <td
                  className="px-6 py-4 text-sm truncate max-w-xs"
                >
                  {position.phone}
                </td>
                <td className="px-6 py-4 text-sm">{position?.higherQualification?.map((qual) => qual?.name)}</td>
                <td
                  className="px-6 py-4 text-sm  truncate max-w-xs"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {position.currentExperience}
                </td>
                <td
                  className="px-6 py-4 text-sm truncate max-w-xs"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {position?.skills?.map((skill) => skill?.name).join(', ') || 'No skills listed'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <CandidateActionMenu
                    handleView={navigateToPositionDetails}
                    handleEdit={() =>handleEditPosition(position)} // Pass the handleEditPosition function
                    positionId={position._id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && selectedPosition && (
        <EditCandidates
          isOpen={isEditModalOpen} // Explicitly pass isOpen prop
          candidate={selectedPosition} // Pass the selected position to the modal
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default PositionsTable;
