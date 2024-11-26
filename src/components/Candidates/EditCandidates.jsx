/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaCamera } from 'react-icons/fa';
import Select, { components } from 'react-select';
import AddPositionModal from '../Positions/AddPositionDetails';

// Custom Menu Component
const CustomMenu = ({ children, ...props }) => {
  return (
    <components.Menu {...props}>
      <div>
        {React.Children.toArray(children).slice(0, 4)}
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


function EditCandidates({ isOpen, candidate, onClose, onSubmit  }) {
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
    if (candidate) {
      setFormData({
        firstName: candidate.firstName || '',
        lastName: candidate.lastName || '',
        phone: candidate.phone || '',
        dateOfBirth: candidate.dateOfBirth ? candidate.dateOfBirth.split('T')[0] : '',
        email: candidate.email || '',
        gender: candidate.gender || '',
        higherQualification: candidate.higherQualification?.map(qual => ({
          value: qual._id,
          label: qual.name
        })) || [],
        university: candidate.university?.map(uni => ({
          value: uni._id,
          label: uni.name
        })) || [],
        currentExperience: candidate.currentExperience || '',
        position: candidate.position || [],
        skills: candidate.skills?.map(skill => ({
          value: skill._id,
          label: skill.name
        })) || [],
        avatar: candidate.avatar || null
      });
      
      if (candidate.avatar) {
        setPreviewImage(`http://localhost:8080${candidate.avatar}`);
      }
    }
  }, [candidate]);

useEffect(()=>{
  fetchSkills();
  fetchPositions();
  fetchQualification();
  fetchUniversity();
},[]);



  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/skills');
      setSkillsMasterdata(response.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const fetchQualification = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/qualification');
      setQualificationData(response.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const fetchUniversity = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/university');
      setUniversityData(response.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/positions');
      setPositiondata(response.data);
    } catch (error) {
      console.error('Failed to fetch position:', error);
    }
  };

  const transformSkillsForSelect = (skills) =>
    skills.map((skill) => ({ label: skill.name, value: skill.name }));

  const transformQualificationForSelect = (Qualification) =>
    Qualification.map((skill) => ({ label: skill.name, value: skill.name }));

  const transformUniversityForSelect = (University) =>
    University.map((skill) => ({ label: skill.name, value: skill.name }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData object for file upload
    const formDataToSend = new FormData();
    
    // Append basic fields
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('currentExperience', formData.currentExperience);
    
    // Handle array fields
    formDataToSend.append('higherQualification',
      formData.higherQualification.map(qual => qual.value)
    );
    
    formDataToSend.append('university', 
      formData.university.map(uni => uni.value)
    );
    
    formDataToSend.append('position', formData.position);
    
    formDataToSend.append('skills', 
      formData.skills.map(skill => skill.value)
    );
  
    // Handle file upload
    if (formData.avatar instanceof File) {
      formDataToSend.append('avatar', formData.avatar);
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8080/api/candidates/${candidate._id}`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (response.data) {
        onSubmit(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Failed to update candidate:', error);
    }
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const transformPositionsForSelect = (positions) =>
    Array.isArray(positions)
      ? positions.map((position) => ({ label: position.title, value: position._id }))
      : [];

      const handlePositionChange = (selectedOptions) => {
        setFormData((prev) => ({
          ...prev,
          position: selectedOptions.map((option) => option.value)
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
                  value={formData.firstName}
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
                  value={formData.lastName}
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
                    value={formData.phone}
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
                  value={formData.dateOfBirth}
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
                  value={formData.email}
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
                  value={formData.gender}
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
                    value={formData.higherQualification}
                onChange={(selected) => setFormData({ ...formData, higherQualification: selected || [] })}
                options={transformQualificationForSelect(QualificationData)}
              
                
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
                    value={formData.university}
                onChange={(selected) => setFormData({ ...formData, university: selected || [] })}
                options={transformUniversityForSelect(universityData)}
              
                
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
                  value={formData.currentExperience}
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
                  value={formData.position.map((posId) => {
                    const position = positiondata.find((p) => p._id === posId);
                    return position ? { label: position.title, value: position._id } : null;
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
                
                value={formData.skills}
                onChange={(selected) => setFormData({ ...formData, skills: selected || [] })}
                options={transformSkillsForSelect(skillsMasterdata)}
              
                
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

export default EditCandidates;