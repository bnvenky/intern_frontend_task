/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionMenu from './ActionMenu';
import EditPositionDetails from './EditPositionDetails';

const PositionCard = ({ position }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleEditPosition = () => {
    setIsEditModalOpen(true);
  };
  const navigate = useNavigate();

  const navigateToPositionDetails = (id) => {
    navigate(`/positions/${id}`); // Navigate to PositionDetails page
  };
  
  return (
    <>
    <div
      id={`position-${position?._id}`}
      className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-blue-600">
          {position?.title || 'Untitled Position'}
        </h3>
        <div className="text-gray-500 hover:text-gray-700">
          <ActionMenu handleView={navigateToPositionDetails} handleEdit={handleEditPosition} positionId={position._id} />
        </div>
      </div>

      <div className="space-y-2">
        {/* Company Name */}
        <div className="text-sm">
          <p className="text-gray-500">
            Company: <span className="font-medium">{position?.companyName || 'N/A'}</span>
          </p>
        </div>

        {/* Experience */}
        <div className="text-sm">
          <p className="text-gray-500">
            Experience: <span className="font-medium">{position?.experience || 'Not Specified'}</span>
          </p>
        </div>

        {/* Technologies */}
        <div className="text-sm">
          <p className="text-gray-500">
            Technologies:{' '}
            <span className="font-medium">
              {position?.technologies?.map((tech) => tech?.name).join(', ') || 'No Technologies listed'}
            </span>
          </p>
        </div>

        {/* Skills */}
        <div className="text-sm">
          <p className="text-gray-500">
            Skills:{' '}
            <span className="font-medium">
              {position?.skills?.map((skill) => skill?.name).join(', ') || 'No skills listed'}
            </span>
          </p>
        </div>

        {/* Job Description */}
        <div className="text-sm">
          <p className="text-gray-500">Job Description:</p>
          <span className="text-gray-500 font-medium line-clamp-2">
            {position?.jobDescription || 'No description available'}
          </span>
        </div>
      </div>
    </div>
    
    {isEditModalOpen && (
      <EditPositionDetails
      position={position}
      onClose={() => setIsEditModalOpen(false)}
      onSave={() => setIsEditModalOpen(false)} 
      />
    )}
    
    </>
  );
};

export default PositionCard;