/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const EditPositionDetails = ({ position, onClose, onSave }) => {
  const [skillsMasterdata, setSkillsMasterdata] = useState([]);
  const [technologyMasterdata, setTechnologyMasterdata] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: position?.title || '',
    companyName: position?.companyName || '',
    experience: {
      min: position?.experience?.split('-')[0]?.replace(' years', '') || '',
      max: position?.experience?.split('-')[1]?.replace(' years', '') || ''
    },
    jobDescription: position?.jobDescription || '',
    technologies: position?.technologies?.map(tech => ({ value: tech.name, label: tech.name })) || [],
    skills: position?.skills?.map(skill => ({ value: skill.name, label: skill.name })) || [],
    additionalNotes: position?.additionalNotes || ''
  });

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

  // Helper function to transform skills data
  const transformSkillsForSelect = (skills) =>
    skills.map((skill) => ({ label: skill.name, value: skill.name }));

  // Helper function to transform technologies data
  const transformTechnologiesForSelect = (technologies) =>
    technologies.map((tech) => ({ label: tech.name, value: tech.name }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.companyName.trim()) {
      toast.error('Company name is required');
      return;
    }

    if (!formData.experience.min || !formData.experience.max) {
      toast.error('Experience range is required');
      return;
    }

    if (Number(formData.experience.min) > Number(formData.experience.max)) {
      toast.error("Minimum experience cannot exceed maximum experience.");
      return;
    }

    if (!formData.jobDescription.trim()) {
      toast.error('Job description is required');
      return;
    }

    if (formData.technologies.length === 0) {
      toast.error('At least one technology is required');
      return;
    }

    if (formData.skills.length === 0) {
      toast.error('At least one skill is required');
      return;
    }

    const updatedPosition = {
      ...position,
      ...formData,
      experience: `${formData.experience.min}-${formData.experience.max} years`,
      technologies: formData.technologies.map(tech => ({ name: tech.value })),
      skills: formData.skills.map(skill => ({ name: skill.value }))
    };

    try {
      setIsSubmitting(true);
      const response = await axios.put(
        `http://localhost:8080/api/positions/${position._id}`,
        updatedPosition
      );
      
      onSave(response.data);
      toast.success('Position updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating position:', error);
      toast.error(error.response?.data?.message || 'Failed to update position');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full md:w-2/3 lg:w-1/2 h-full flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Edit Position</h2>
            <div className="flex items-center mt-2">
              <span className="text-blue-600 font-medium">Positions</span>
              <span className="mx-2">/</span>
              <span className="text-gray-600">{formData.title}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
            </div>
            <div> 
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
            </div>
            <div>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience <span className="text-red-500">*</span>
              </label>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Min</label>
                  <select
                    value={formData.experience.min}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: { ...formData.experience, min: e.target.value },
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Max</label>
                  <select
                    value={formData.experience.max}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: { ...formData.experience, max: e.target.value },
                      })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    {[...Array(16)].map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Description <span className="text-red-500">*</span>
              </label>
            </div>
            <div>
              <textarea
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Technologies <span className="text-red-500">*</span>
              </label>
            </div>
            <div>
              <Select
                isMulti
                options={transformTechnologiesForSelect(technologyMasterdata)}
                onChange={(selected) => setFormData({ ...formData, technologies: selected || [] })}
                value={formData.technologies}
                className="mt-1"
                isDisabled={isSubmitting}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills <span className="text-red-500">*</span>
              </label>
            </div>
            <div>
              <Select
                isMulti
                value={formData.skills}
                onChange={(selected) => setFormData({ ...formData, skills: selected || [] })}
                options={transformSkillsForSelect(skillsMasterdata)}
                className="mt-1"
                isDisabled={isSubmitting}
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
            </div>  
            <div>  
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex justify-end gap-4 p-6 border-t bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPositionDetails;