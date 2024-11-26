import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaSearch,
  FaFilter,
  FaTh,
  FaList,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import PositionCard from './PositionCard';
import PositionsTable from './PositionsTable';
import AddPositionModal from './AddPositionDetails'



const Positions = () => {
  const [view, setView] = useState('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [positions, setPositions] = useState([]);
  const [skillsData, setSkillsData] = useState([])
  const [technologyData, setTechnologyData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(window.innerWidth > 768);
  const [filters, setFilters] = useState({
    technologies: [],
    experience: [],
    skills: [],
  });
  const [activeFilter, setActiveFilter] = useState(null);
  

  const positionsPerPage = 10;

  useEffect(() => {
    const handleResize = () => {
      const isMediumOrLargerScreen = window.innerWidth > 768;
      setIsMediumOrLarger(isMediumOrLargerScreen);
      if (!isMediumOrLargerScreen) {
        setView('kanban'); // Default to Kanban on smaller screens
      }
    };

    const debounceResize = debounce(handleResize, 300);

    handleResize(); // Initial check
    window.addEventListener('resize', debounceResize);

    return () => {
      window.removeEventListener('resize', debounceResize);
    };
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/positions');
        
        setPositions(response.data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };
    fetchPositions();
    fetchTechnologies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchTechnologies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tech');
      setTechnologyData(response.data);
      console.log('Fetched Technology Data:', technologyData);
    } catch (error) {
      console.error('Error fetching technologies:', error);
    }
  };

  const handleTechnologyChange = async (event) => {
    const { value, checked } = event.target;
    const updatedTechnologies = checked
      ? [...filters.technologies, value]
      : filters.technologies.filter((tech) => tech !== value);

   // console.log('Updated Technologies:', updatedTechnologies);
    setFilters({ ...filters, technologies: updatedTechnologies });

    if (updatedTechnologies.length > 0) {
      const skillsSet = new Set();
      for (const techId of updatedTechnologies) {
        //console.log(`Fetching skills for Technology ID: ${techId}`);
        try {
          const response = await axios.get(`http://localhost:8080/api/tech/${techId}/skills`);
          //console.log(`Skills for Technology ${techId}:`, response.data);
          const skillIds = response.data;
          for (const skillId of skillIds) {
            const skillResponse = await axios.get(`http://localhost:8080/api/skills/${skillId}`);
           // console.log(`Skill Details for ${skillId}:`, skillResponse.data);
            skillsSet.add(skillResponse.data);
          }
        } catch (error) {
          console.error('Error fetching skills:', error);
        }
      }
      const skillsArray = Array.from(skillsSet);
      //console.log('Updated Skills Data:', skillsArray);
      setSkillsData(skillsArray);
    } else {
      setSkillsData([]);
    }
  };

  

  const applyFilters = (positions) => {
    return positions.filter((position) => {
      // Match Experience
      const matchesExperience =
        filters.experience.length === 0 ||
        filters.experience.includes(position.experience);
  
      // Match Skills - Compare IDs instead of names
      const matchesSkills =
        filters.skills.length === 0 ||
        filters.skills.every((skill) =>
          position.skills?.some((posSkill) => posSkill.name === skill)
        );
  


        const matchesTechnology =
        filters.technologies.length === 0 ||
        position.technologies?.some((posTech) => 
          filters.technologies.includes(posTech._id)
        );
  
      // Match Search Term
      const matchesSearch =
        searchTerm === '' ||
        position.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
  
      return matchesTechnology && matchesExperience && matchesSkills && matchesSearch;
    });
  };
  

  const filteredPositions = applyFilters(positions);
  const pageCount = Math.ceil(filteredPositions.length / positionsPerPage);
  const currentPositions = filteredPositions.slice(
    currentPage * positionsPerPage,
    (currentPage + 1) * positionsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleAddPosition = async (newPosition) => {
    try {
      const response = await axios.post('http://localhost:8080/api/positions', newPosition);
      setPositions([...positions, response.data]);
      
    } catch (error) {
      console.error("Error adding position:", error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      technologies: [],
      experience: [],
      skills: [],
    });
    setSearchTerm('');
    setCurrentPage(0);
  };

  const closeFilterModal = () => {
    setShowFilter(false);
  };

  const handleSkillChange = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(name => name !== skill)
        : [...prev.skills, skill]
    }));
  };
  

  const renderTechnologies = () => {
    return technologyData.map((tech) => (
      <div key={tech._id}>
        <input
          type="checkbox"
          className='mr-2'
          id={tech._id}
          value={tech._id}
          checked={filters.technologies.includes(tech._id)}
          onChange={handleTechnologyChange}
        />
        <label htmlFor={tech._id}>{tech.name}</label>
      </div>
    ));
  };

  const renderSkillsDropdown = () => {
    return (
      <div>
        {skillsData.map((skill) => (
          <div key={skill}>
            <input
              type="checkbox"
              className="mr-2"
              id={skill}
              value={skill}
              checked={filters.skills.includes(skill)}
              onChange={() => handleSkillChange(skill)}
            />
            <label htmlFor={skill}>{skill}</label>
          </div>
        ))}
      </div>
    );
  };
  

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  return (
    <>
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Positions</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          Add
        </button>
      </div>

      {/* View and Filter Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setView('kanban')}
            className={`p-2 rounded ${view === 'kanban' ? 'bg-gray-200' : ''}`}
          >
            <FaTh />
          </button>
          {isMediumOrLarger && (
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded ${view === 'list' ? 'bg-gray-200' : ''}`}
            >
              <FaList />
            </button>
          )}
        </div>

        <div className="flex items-center justify-center space-x-4">
  {/* Search Bar */}
  <div className="relative">
    <input
      type="text"
      placeholder="Search Candidate"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
      }}
      className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
    />
    <FaSearch className="absolute left-3 top-3 text-gray-400" />
  </div>

  {/* Pagination count display and pagination controls */}
  <div className="flex items-center space-x-2">
    <div className="text-center text-sm text-gray-500">
      {currentPage + 1} / {pageCount}
    </div>
    <ReactPaginate
        previousLabel={<FaChevronLeft />}
        nextLabel={<FaChevronRight />}
        pageCount={pageCount} // Set total page count
        onPageChange={handlePageChange} // Handler to update currentPage
        containerClassName="pagination flex items-center space-x-2"
        activeClassName="bg-teal-600 text-white"
        pageClassName="p-2 border rounded-lg hover:bg-gray-100"
        breakClassName="p-2"
        forcePage={currentPage} // This ensures the component stays on the current page
        marginPagesDisplayed={0} // Hide extra page number links
        pageRangeDisplayed={0} // Hide page numbers
      />

  </div>

  {/* Filter Button */}
  <button
  onClick={() => setShowFilter(!showFilter)}
  className={`relative p-2 rounded hover:bg-gray-200 ${showFilter ? 'bg-gray-200' : ''}`}
>
  <FaFilter />
  {Object.values(filters).some((f) => f.length > 0) && (
    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
      {Object.values(filters).flat().length}
    </span>
  )}
</button>
</div>

      </div>

      {/* Main Content */}
      <div className="flex space-x-4">
        {/* Kanban/List View */}
        <div className={`${showFilter ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
          {currentPositions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No positions found matching the filters.
            </div>
          ) : (
            <>
              {view === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPositions.map((position) => (
                    <PositionCard key={position._id} position={position} />
                  ))}
                </div>
              ) : (
                <PositionsTable positions={currentPositions} />
              )}
              
            </>
          )}
        </div>

        {/* Filter Modal */}
        {showFilter && (
          <div className="w-1/4 h-1/2 bg-white p-4 rounded-lg shadow-md z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filter by</h3>
              <button onClick={closeFilterModal} className="text-gray-400">
                <FaTimes />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 p-7">
              
              {/* Technologies Dropdown */}
              <div>
                <div
                  className="flex items-center justify-between font-medium cursor-pointer"
                  onClick={() => setActiveFilter(activeFilter === 'technologies' ? null : 'technologies')}
                >
                  <h4>Technologies</h4>
                  {activeFilter === 'technologies' ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {activeFilter === 'technologies' && (
                  <div className="ml-8 mt-2">
                    {renderTechnologies()}
                  </div>
                )}
              </div>
              

              {/* Skills Dropdown */}
              <div>
                <div
                  className="flex items-center justify-between font-medium cursor-pointer"
                  onClick={() => setActiveFilter(activeFilter === 'skills' ? null : 'skills')}
                >
                  <h4>Skills</h4>
                  {activeFilter === 'skills' ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {activeFilter === 'skills' && (
                  <div className="ml-8 mt-2">
                    {renderSkillsDropdown()}
                  </div>
                )}
              </div>

              {/* Experience Dropdown */}
              <div>
                <div
                  className="flex items-center justify-between font-medium cursor-pointer"
                  onClick={() =>
                    setActiveFilter(activeFilter === 'experience' ? null : 'experience')
                  }
                >
                  <h4>Experience</h4>
                  {activeFilter === 'experience' ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {activeFilter === 'experience' && (
                  <div className="ml-8 mt-2">
                    {['Fresher', '1 Year', '2 Years', '3+ Years'].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.experience.includes(option)}
                          onChange={() => handleFilterChange('experience', option)}
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              

              <button
                onClick={clearFilters}
                className="bg-teal-600 w-full text-white mt-6 py-2 px-4 rounded-lg hover:bg-teal-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddPositionModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddPosition}
        />
      )}
      
    </div>

    
    </>
  );
};

export default Positions;
