/* eslint-disable react/prop-types */
import axios from "axios";
import { useState, useEffect } from "react";
import { FaTimes, FaPlus,} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select';

const AddPositionModal = ({ isOpen, onClose, onSave }) => {
  const [skillsMasterdata, setSkillsMasterdata] = useState([]);
  const [technologyMasterdata, setTechnologyMasterdata] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    experience: { min: "", max: "" },
    jobDescription: "",
    technologies: [],
    skills: [],
    rounds: [],
    currentSkill: "",
    currentRound: { name: "", interviewMode: "", duration: "" },
    additionalNotes: "",
  });

  // Manage body scroll state
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

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
    fetchTechnology();
  }, []);

  const fetchTechnology = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tech');
      setTechnologyMasterdata(response.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const handleRoundAdd = () => {
    const { name, interviewMode, duration } = formData.currentRound;
    if (name.trim() && interviewMode.trim() && duration.trim()) {
      setFormData({
        ...formData,
        rounds: [...formData.rounds, { ...formData.currentRound }],
        currentRound: { name: "", interviewMode: "", duration: "" },
      });
    } else {
      toast.error("All fields in Rounds are required.");
    }
  };

  const handleRoundRemove = (index) => {
    setFormData({
      ...formData,
      rounds: formData.rounds.filter((_, i) => i !== index),
    });
  };

  // Helper function to transform skills data
  const transformSkillsForSelect = (skills) =>
    skills.map((skill) => ({ label: skill.name, value: skill.name }));

  // Helper function to transform technologies data
  const transformTechnologiesForSelect = (technologies) =>
    technologies.map((tech) => ({ label: tech.name, value: tech.name }));

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields and show toast notifications
    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!formData.companyName.trim()) {
      toast.error("Company Name is required.");
      return;
    }

    if (!formData.experience.min || !formData.experience.max) {
      toast.error("Experience range is required.");
      return;
    }

    if (Number(formData.experience.min) > Number(formData.experience.max)) {
      toast.error("Minimum experience cannot exceed maximum experience.");
      return;
    }

    if (!formData.jobDescription.trim()) {
      toast.error("Job Description is required.");
      return;
    }

    if (formData.technologies.length === 0) {
      toast.error("Please add at least one technology.");
      return;
    }

    if (formData.skills.length === 0) {
      toast.error("Please add at least one skill.");
      return;
    }

    if (formData.rounds.length === 0) {
      toast.error("Please add at least one round.");
      return;
    }

    // All validations passed, proceed to save
    const newPosition = {
      title: formData.title.trim(),
      companyName: formData.companyName.trim(),
      experience: `${formData.experience.min}-${formData.experience.max} years`,
      technologies: formData.technologies,
      skills: formData.skills,
      jobDescription: formData.jobDescription.trim(),
      rounds: formData.rounds,
      additionalNotes: formData.additionalNotes.trim(),
    };

    onSave(newPosition);
    toast.success("Position added successfully!");

    setFormData({
      title: "",
      companyName: "",
      experience: { min: "", max: "" },
      jobDescription: "",
      technologies: [],
      skills: [],
      rounds: [],
      currentSkill: "",
      currentRound: { name: "", interviewMode: "", duration: "" },
      additionalNotes: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex justify-end">
        <div className="bg-white w-full md:w-2/3 lg:w-1/2 h-full flex flex-col">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 w-full flex justify-between items-center p-4 border-b-2 bg-white">
            <h2 className="text-2xl font-bold text-gray-700">New Position</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <form onSubmit={handleSubmit} >
              <div className="px-6 py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter job title"
                      className="mt-1 block w-full border-b-2 border-black focus:outline-none focus:border-gray-400"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      className="mt-1 block w-full border-b-2 border-black focus:outline-none focus:border-gray-400"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Experience <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="flex gap-4 mt-1">
                    <select
                      className="w-1/2 text-sm border-b-2 border-black focus:outline-none focus:border-gray-400"
                      value={formData.experience.min}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience: { ...formData.experience, min: e.target.value },
                        })
                      }
                    >
                      <option value="">Min</option>
                      {[...Array(11).keys()].map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                      <option value="10+">10+</option>
                    </select>
                    <select
                      className="w-1/2 text-sm border-b-2 border-black focus:outline-none focus:border-gray-400"
                      value={formData.experience.max}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience: { ...formData.experience, max: e.target.value },
                        })
                      }
                    >
                      <option value="">Max</option>
                      {[...Array(16).keys()].slice(1).map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                      <option value="15+">15+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      rows="4"
                      placeholder="Enter job description"
                      maxLength="1000"
                      className="mt-1 block w-full border-b-2 border-black focus:outline-none focus:border-gray-400"
                      value={formData.jobDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, jobDescription: e.target.value })
                      }
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                      {1000 - formData.jobDescription.length} characters remaining
                    </div>
                  </div>

                  {/*technologies*/}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Technologies <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div>
                    <Select
                      isMulti
                      options={transformTechnologiesForSelect(technologyMasterdata)}
                      value={formData.technologies.map((tech) => ({ label: tech, value: tech }))}
                      onChange={(selectedOptions) => {
                        setFormData((prev) => ({
                          ...prev,
                          technologies: selectedOptions.map((option) => option.value),
                        }));
                      }}
                      className="mt-1 border-b-black border-0 rounded-none focus:outline-none focus:ring-0"
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

                  {/*Skills*/}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Skills <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div>
                    <Select
                      isMulti
                      options={transformSkillsForSelect(skillsMasterdata)}
                      value={formData.skills.map((skill) => ({ label: skill, value: skill }))}
                      onChange={(selectedOptions) => {
                        setFormData((prev) => ({
                          ...prev,
                          skills: selectedOptions.map((option) => option.value),
                        }));
                      }}
                      className="mt-1 border-b-black border-0 rounded-none focus:outline-none focus:ring-0"
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

                  {/* Rounds */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rounds <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="text"
                      placeholder="Round Name"
                      className="w-1/3 flex-1 border-b-2 border-black focus:outline-none focus:border-gray-400"
                      value={formData.currentRound.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentRound: {
                            ...formData.currentRound,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Interview Mode"
                      className="w-1/3 flex-1 border-b-2 border-black focus:outline-none focus:border-gray-400"
                      value={formData.currentRound.interviewMode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentRound: {
                            ...formData.currentRound,
                            interviewMode: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Duration"
                      className="w-1/3 flex-1 border-b-2 border-black focus:outline-none focus:border-gray-400"
                      value={formData.currentRound.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentRound: {
                            ...formData.currentRound,
                            duration: e.target.value,
                          },
                        })
                      }
                    />
                    <button
                      type="button"
                      className="bg-teal-600 text-white px-4 py-2 rounded-md shadow hover:bg-teal-700"
                      onClick={handleRoundAdd}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.rounds.map((round, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-md"
                      >
                        {`${round.name} - ${round.interviewMode} - ${round.duration}`}
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => handleRoundRemove(index)}
                        >
                          <FaTimes size={14} />
                        </button>
                      </span>
                    ))}
                  </div> 
                </div>

                {/*Additional Notes*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div> 
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                  </div>
                  <div>
                    <textarea
                      rows="3"
                      placeholder="Add any additional notes"
                      className="mt-1 block w-full border-b-2 border-black focus:outline-none focus:border-gray-400"
                      value={formData.additionalNotes}
                      onChange={(e) =>
                        setFormData({ ...formData, additionalNotes: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Fixed Footer */}
          <div className="sticky w-full bottom-0 z-10 flex justify-end items-center p-4 border-t-2 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="ml-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPositionModal;