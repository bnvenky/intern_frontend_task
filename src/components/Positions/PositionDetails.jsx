import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PositionDetails = () => {
  const [activeTab, setActiveTab] = useState('position');
  const { id } = useParams(); // Get the position ID from the URL
  const [position, setPosition] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);

  // Fetch Position Details
  useEffect(() => {
    const fetchPositionDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/positions/${id}`);
        setPosition(response.data);
      } catch (error) {
        console.error('Error fetching position details:', error);
      }
    };

    fetchPositionDetails();
  }, [id]);

  // Fetch Candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/candidates`);
        const candidatesData = response.data;

        // Fetch position details for each candidate
        const candidatesWithPosition = await Promise.all(
          candidatesData.map(async (candidate) => {
            if (candidate.position && candidate.position.length > 0) {
              try {
                const positionResponse = await axios.get(
                  `http://localhost:8080/api/positions/${candidate.position[0]}`
                );
                return {
                  ...candidate,
                  candidatePositionTitle: positionResponse.data.title, // Attach the title to the candidate
                };
              } catch (error) {
                console.error(`Error fetching position for candidate ${candidate._id}:`, error);
              }
            }
            return { ...candidate, candidatePositionTitle: null }; // Default if no position or error
          })
        );

        setCandidates(candidatesWithPosition);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  // Filter Candidates Based on Position
  useEffect(() => {
    if (position && candidates.length > 0) {
      const matchingCandidates = candidates.filter((candidate) =>
        candidate.candidatePositionTitle
          ?.toLowerCase()
          === (position.title?.toLowerCase())
      );
      setFilteredCandidates(matchingCandidates);
    }
  }, [position, candidates]);

  return (
    <div className="min-h-screen bg-white">

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Breadcrumb */}
        <div className="py-4">
          <div className="flex items-center text-lg">
            <Link to="/positions" className="text-blue-600 font-serif">Positions</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{position?.title}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button 
              className={`py-3 font-medium border-b-2 px-1 ${
                activeTab === 'position'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('position')}
            >
              Position
            </button>
            <button
              className={`py-3 font-medium border-b-2 px-1 ${
                activeTab === 'candidates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('candidates')}
            >
              Candidates
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="py-6">
          {activeTab === 'position' ? (
            <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Position Details</h2>
          
              {/* Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-48">Title</span>
                  <span className="text-gray-600">{position?.title || "N/A"}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-48">Company Name</span>
                  <span className="text-gray-600">{position?.companyName || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-48">Experience</span>
                  <span className="text-gray-600">{position?.experience || "N/A"}</span>
                </div>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-48">Technology</span>
                  <span className="text-gray-600">
                    {position?.technologies?.length > 0
                      ? position.technologies.map((tech) => tech.name).join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-48">Skills</span>
                  <span className="text-gray-600">
                    {position?.skills?.length > 0
                      ? position.skills.map((skill) => skill.name).join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-48">Job Description</span>
                  <span className="text-gray-600">{position?.jobDescription || "N/A"}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-48">Additional Note</span>
                  <span className="text-gray-600">{position?.additionalNotes || "N/A"}</span>
                </div>
              </div>
          
              {/* System Details Section */}
              <h2 className="text-lg font-medium text-gray-900 mt-8 mb-6">System Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-48">Created By</span>
                  <span className="text-gray-600">
                    {position?.createdBy || "N/A"}, {position?.createdAt || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-700 w-48">Modified By</span>
                  <span className="text-gray-600">
                    {position?.modifiedBy || "N/A"}, {position?.modifiedAt || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Candidate Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Position Title</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.length > 0 ? (
                      filteredCandidates.map((candidate) => (
                        <tr key={candidate._id} className="border-b">
                          <td className="px-6 py-4 text-sm text-blue-600">{candidate.firstName}</td>
                          <td className="px-6 py-4 text-sm">{candidate.email}</td>
                          <td className="px-6 py-4 text-sm">{candidate.phone}</td>
                          <td className="px-6 py-4 text-sm">
                            {candidate.candidatePositionTitle || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {candidate.skills?.map((skill) => skill.name).join(', ') || 'No skills listed'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PositionDetails;