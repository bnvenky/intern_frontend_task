/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { FaTimes, FaCamera } from 'react-icons/fa';
import Select, { components } from 'react-select';
import AddPositionModal from '../Positions/AddPositionDetails';

// Custom Menu Component
const CustomMenu = ({ children, ...props }) => {
  
  return (
    <components.Menu {...props}>
      <div>
        {/* Show only first 4 options */}

        {React.Children.toArray(children).slice(0, 4)}
        
        {/* Show "No positions found" if there are no children */}
        {React.Children.count(children) === 0 && (
          <div className="text-center text-gray-500 py-2">No positions found</div>
        )}
      </div>
      <button
        className="w-full text-center bg-blue-500 text-white py-2 hover:bg-blue-600"
        onClick={(e) => {
          e.stopPropagation();
          props.selectProps.onAddNew();
        }}
      >
        + Add New Position
      </button>
    </components.Menu>
  );
};

function AddCandidates({ isOpen, onClose, onSubmit }) {
  const [skillsMasterdata, setSkillsMasterdata] = useState([]);
  const [QualificationData, setQualificationData] = useState([]);
  const [universityData, setUniversityData] = useState([]);
  const [positiondata, setPositiondata] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    email: '',
    gender: '',
    higherQualification: [],
    university: [],
    currentExperience: '',
    position: [],
    skills: [],
    avatar: null
  });

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/skills');
        setSkillsMasterdata(response.data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };
  
    fetchSkills();
    fetchPositions();
    fetchQualification();
    fetchUniversity();
  }, [onSubmit]);

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/positions');
      setPositiondata(response.data);
    } catch (error) {
      console.error('Failed to fetch position:', error);
    }
  };

  const fetchQualification = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/qualification');
      setQualificationData(response.data);
    } catch (error) {
      console.error('Failed to fetch position:', error);
    }
  };

  const fetchUniversity = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/university');
      setUniversityData(response.data);
    } catch (error) {
      console.error('Failed to fetch position:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file }); // Store the file object directly
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };

  const transformSkillsForSelect = (skills) =>
    skills.map((skill) => ({ label: skill.name, value: skill.name }));

  const transformQualificationForSelect = (Qualification) =>
    Qualification.map((skill) => ({ label: skill.name, value: skill.name }));

  const transformUniversityForSelect = (University) =>
    University.map((uni) => ({ label: uni.name, value: uni.name }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCandidates = {
      firstName:formData.firstName,
      lastName:formData.lastName,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      gender: formData.gender,
      higherQualification: formData.higherQualification,
      university: formData.university,
      currentExperience: formData.currentExperience,
      position: formData.position,
      skills: formData.skills,
      avatar: formData.avatar || 'https://via.placeholder.com/40'
    }

    onSubmit(newCandidates);
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      email: '',
      gender: '',
      higherQualification: [],
      university: [],
      currentExperience: '',
      position: [],
      skills: [],
      avatar: null
    });
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddPosition = async (newPosition) => {
    try {
      const response = await axios.post('http://localhost:8080/api/positions', newPosition);
      const updatedPositions = [...positiondata, response.data];
      setPositiondata(updatedPositions);

      setFormData((prev) => ({
        ...prev,
        position: [...prev.position, response.data.title],
      }));
    } catch (error) {
      console.error('Error adding position:', error);
    }
  };

  const transformPositionsForSelect = (positions) =>
    Array.isArray(positions)
      ? positions.map((position) => ({ label: position.title, value: position._id }))
      : [];

  const handlePositionChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      position: selectedOptions.map((option) => option.value),
    }));
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-3xl h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 w-full flex justify-between items-center p-4 border-b-2 bg-white">
          <h2 className="text-xl font-semibold">New Candidate</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Personal Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Personal Details:</h3>
            
            {/* Image Upload */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 ml-2'>  
          <div className="w-100">
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  name="firstName"
                  onChange={handleChange}
                  className="mt-1 block min-w-60 border-b-2 border-black focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  onChange={handleChange}
                  className="mt-2 block min-w-60 border-b-2 border-black focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <select className="mt-2 block  border-b-2 border-black focus:outline-none focus:border-gray-400">
                    <option>+91</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder=" xxx-xxx-xxxx"
                    onChange={handleChange}
                    className="mt-2 block p-2 border-b-2 border-black focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">Date-of-Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  name="dateOfBirth"
                  onChange={handleChange}
                  className="mt-2 block p-2 border-b-2 border-black focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <div className="mb-4 pt-5 pl-6 flex justify-center">
              <div className="relative pl-20">
                <div className="w-24 h-24  rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaCamera className="text-3xl text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
          </div>

          {/* Contact Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Contact Details:</h3>
            <div >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="candidate@gmail.com"
                  onChange={handleChange}
                  className="mt-2 block p-2 border-b-2 border-black focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  required
                  onChange={handleChange}
                  className="mt-2 block p-2 border-b-2 border-black focus:outline-none focus:border-gray-400"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Education Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Education Details:</h3>
            <div >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">
                  Higher Qualification <span className="text-red-500">*</span>
                </label>
                <Select
                    isMulti
                    required
                    options={transformQualificationForSelect(QualificationData)}
                    value={formData.higherQualification.map((skill) => ({ label: skill, value: skill }))}
                    onChange={(selectedOptions) => {
                      setFormData((prev) => ({
                        ...prev,
                        higherQualification: selectedOptions.map((option) => option.value),
                      }));
                    }}
                    className="mt-2 border-b-black border-0 rounded-none focus:outline-none focus:ring-0"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: 0,
                        borderBottom: '2px solid black',
                        borderRadius: 0,
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        padding: '0 4px',
                      }),
                    }}
                  />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">
                  University/College <span className="text-red-500">*</span>
                </label>
                <Select
                    isMulti
                    required
                    options={transformUniversityForSelect(universityData)}
                    value={formData.university.map((skill) => ({ label: skill, value: skill }))}
                    onChange={(selectedOptions) => {
                      setFormData((prev) => ({
                        ...prev,
                        university: selectedOptions.map((option) => option.value),
                      }));
                    }}
                    className="mt-2 border-b-black border-0 rounded-none focus:outline-none focus:ring-0"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: 0,
                        borderBottom: '2px solid black',
                        borderRadius: 0,
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        padding: '0 4px',
                      }),
                    }}
                  />
              </div>
            </div>
          </div>

          {/* Skills Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Skills Details:</h3>
            <div >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">
                  Current Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="currentExperience"
                  required
                  onChange={handleChange}
                  className="mt-2 block p-2 border-b-2 border-black focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <label className="block text-sm font-medium text-gray-700">
                  Positions <span className="text-red-500">*</span>
                </label>
                <Select
                  isMulti
                  required
                  options={transformPositionsForSelect(positiondata.slice().reverse())}
                  value={formData.position.map((id) => {
                    const matchedPosition = positiondata.find((pos) => pos._id === id);
                    return matchedPosition ? { label: matchedPosition.title, value: matchedPosition._id } : null;
                  }).filter(Boolean)}
                  onChange={handlePositionChange}
                  components={{ 
                    Menu: (props) => (
                      <CustomMenu {...props} selectProps={{ ...props.selectProps, onAddNew: () => setIsModalOpen(true) }} />
                    )
                  }}
                  
                  styles={{
                    menu: (base) => ({
                      ...base,
                      marginTop: 0,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }),
                    control: (base) => ({
                      ...base,
                      border: 0,
                      borderBottom: '2px solid black',
                      borderRadius: 0,
                      boxShadow: 'none',
                      '&:hover': {
                        borderBottom: '2px solid black',
                      }
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: '0 4px'
                    })
                  }}
                  className="mt-2"
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Skills <span className="text-red-500">*</span>
                  </label>
                </div>
                <div>
                  <Select
                    isMulti
                    required
                    options={transformSkillsForSelect(skillsMasterdata)}
                    value={formData.skills.map((skill) => ({ label: skill, value: skill }))}
                    onChange={(selectedOptions) => {
                      setFormData((prev) => ({
                        ...prev,
                        skills: selectedOptions.map((option) => option.value),
                      }));
                    }}
                    className="mt-2 border-b-black border-0 rounded-none focus:outline-none focus:ring-0"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: 0,
                        borderBottom: '2px solid black',
                        borderRadius: 0,
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        padding: '0 4px',
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t bg-white">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            Save & Schedule
          </button>
        </div>
      </div>
    </div>
    
    {/* Add Position Modal */}
    {isModalOpen && (
        <AddPositionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddPosition}
        />
      )}
    </>
  );
}

export default AddCandidates;