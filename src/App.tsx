import React, { useState } from 'react';
import { Building2, BarChart4, Layers, Send, CheckCircle, Database, Cpu, Building, HardHat, Workflow, Menu, X } from 'lucide-react';
import ShootingStars from './components/ShootingStars';
import { supabase } from './lib/supabase';
import { submitToAirtable } from './lib/airtable';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    currentBimTools: [] as string[],
    challenges: '',
    desiredFeatures: [] as string[],
    currentUsage: '',
    unreal: '',
    additionalComments: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...formData[name as keyof typeof formData] as string[], value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: (formData[name as keyof typeof formData] as string[]).filter(item => item !== value)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
  
    try {
      // Submit to Supabase
      const { error: supabaseError } = await supabase
        .from('survey_responses')
        .insert([{
          name: formData.name,
          email: formData.email,
          company: formData.company,
          role: formData.role,
          current_bim_tools: formData.currentBimTools,
          challenges: formData.challenges,
          desired_features: formData.desiredFeatures,
          usage_type: formData.currentUsage,
          unreal_experience: formData.unreal,
          additional_comments: formData.additionalComments
        }]);
  
      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(`Supabase submission failed: ${supabaseError.message}`);
      }

      // Submit to Airtable
      try {
        await submitToAirtable(formData);
      } catch (airtableError: any) {
        console.error('Airtable error:', airtableError);
        // Continue with success even if Airtable fails
        // You might want to log this or handle it differently
      }
      
      setSubmitted(true);
      console.log('Form submitted successfully:', formData);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="bg-dark-blue rounded-xl shadow-glow max-w-4xl w-full p-8 text-center border border-teal/20">
          <div className="flex justify-center mb-6">
            <CheckCircle className="text-teal w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold text-teal mb-4">Thank You for Your Feedback!</h1>
          <p className="text-lg text-gray mb-6">
            Your insights will help us develop better Virtual Design and Construction solutions that address real industry needs.
          </p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="btn-primary"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark-blue shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-teal" />
            <span className="text-2xl font-bold text-teal">BIMSurvey</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray hover:text-teal"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><a href="#about" className="text-gray hover:text-teal transition-colors">About</a></li>
              <li><a href="#survey" className="text-gray hover:text-teal transition-colors">Survey</a></li>
              <li><a href="#contact" className="text-gray hover:text-teal transition-colors">Contact</a></li>
            </ul>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-blue border-t border-teal-dark/30 py-4">
            <ul className="flex flex-col space-y-4 px-4">
              <li><a href="#about" className="text-gray hover:text-teal transition-colors block py-2" onClick={() => setMobileMenuOpen(false)}>About</a></li>
              <li><a href="#survey" className="text-gray hover:text-teal transition-colors block py-2" onClick={() => setMobileMenuOpen(false)}>Survey</a></li>
              <li><a href="#contact" className="text-gray hover:text-teal transition-colors block py-2" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
            </ul>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Shooting Stars Background */}
        <ShootingStars count={75} />
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal/20 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-teal mb-6 leading-tight">Help Shape the Future of Virtual Design and Construction Technology</h1>
          <p className="text-xl text-gray max-w-3xl mx-auto mb-10">
            We're exploring innovative ways to leverage environments outside of Navisworks to provide 
            multi-dimensional data visualization and analysis. Your input is invaluable.
          </p>
          <a 
            href="#survey" 
            className="btn-primary inline-block text-lg"
          >
            Take the Survey
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-dark-blue" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">Exploring Next-Gen Virtual Design and Construction Solutions</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card group">
              <div className="bg-dark w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-teal-dark group-hover:border-teal transition-colors">
                <Layers className="h-8 w-8 text-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-teal-dark group-hover:text-teal transition-colors">Multi-Dimensional VDC</h3>
              <p className="text-gray">
                Going beyond 3D to incorporate time, cost, sustainability, and other critical dimensions of project data.
              </p>
            </div>
            
            <div className="card group">
              <div className="bg-dark w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-teal-dark group-hover:border-teal transition-colors">
                <Cpu className="h-8 w-8 text-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-teal-dark group-hover:text-teal transition-colors">Environment Integration</h3>
              <p className="text-gray">
                Leveraging advanced visualization technology for immersive visualization and real-time collaboration.
              </p>
            </div>
            
            <div className="card group">
              <div className="bg-dark w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-teal-dark group-hover:border-teal transition-colors">
                <BarChart4 className="h-8 w-8 text-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-teal-dark group-hover:text-teal transition-colors">Advanced Analytics</h3>
              <p className="text-gray">
                Turning complex VDC data into actionable insights through sophisticated analysis tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Survey Section */}
      <section className="py-16 px-4" id="survey">
        <div className="max-w-4xl mx-auto bg-dark-blue rounded-xl shadow-lg p-8 border border-teal-dark/30">
          <h2 className="section-title">Virtual Design and Construction Applications Survey</h2>
          <p className="text-gray mb-8">
            Please share your thoughts to help us develop solutions that address your specific needs.
          </p>

          {submitError && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-teal-dark/30 text-teal-dark">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray mb-1">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray mb-1">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="Architect">Architect</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Construction Manager">Construction Manager</option>
                    <option value="BIM Manager">BIM Manager</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Facility Manager">Facility Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Current BIM Usage */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-teal-dark/30 text-teal-dark">Current Virtual Design and Construction Usage</h3>
              
              <div className="mb-6">
                <p className="block text-sm font-medium text-gray mb-2">Which Virtual Design and Construction tools do you currently use? (Select all that apply)</p>
                <div className="grid md:grid-cols-3 gap-3">
                  {['Revit', 'ArchiCAD', 'Tekla', 'Navisworks', 'BIM 360', 'Solibri', 'SketchUp', 'Rhino', 'Other'].map(tool => (
                    <div key={tool} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`tool-${tool}`}
                        name="currentBimTools"
                        value={tool}
                        checked={formData.currentBimTools.includes(tool)}
                        onChange={handleCheckboxChange}
                        className="checkbox"
                      />
                      <label htmlFor={`tool-${tool}`} className="ml-2 text-sm text-gray">{tool}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="unreal" className="block text-sm font-medium text-gray mb-1">
                  Have you imported your model out of Navisworks into another tool?
                </label>
                <select
                  id="unreal"
                  name="unreal"
                  value={formData.unreal}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Please select</option>
                  <option value="No - I only use BIM model within Navisworks">No - I only use BIM model within Navisworks</option>
                  <option value="Yes - Procore">Yes - Procore</option>
                  <option value="Yes - Gaming Engine (Unity or Unreal)">Yes - Gaming Engine (Unity or Unreal)</option>
                  <option value="Yes - Scheduling">Yes - Scheduling</option>
                  <option value="Yes - Logistics Planning">Yes - Logistics Planning</option>
                  <option value="Yes - Other">Yes - Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="currentUsage" className="block text-sm font-medium text-gray mb-1">
                  What are you currently using Virtual Construction Design / 3D modeling for?
                </label>
                <select
                  id="currentUsage"
                  name="currentUsage"
                  value={formData.currentUsage}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Please select</option>
                  <option value="Not Using It">Not Using It</option>
                  <option value="Clash Detection and Subcontractor Coordination">Clash Detection and Subcontractor Coordination</option>
                  <option value="Phasing, Sequencing Logistics Planning">Phasing, Sequencing Logistics Planning</option>
                  <option value="Claim Support">Claim Support</option>
                  <option value="Marketing Videos">Marketing Videos</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="challenges" className="block text-sm font-medium text-gray mb-1">
                  What challenges do you face with your current Virtual Design and Construction workflow?
                </label>
                <textarea
                  id="challenges"
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                ></textarea>
              </div>
            </div>

            {/* Future Needs */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-teal-dark/30 text-teal-dark">Future Needs</h3>
              
              <div className="mb-6">
                <p className="block text-sm font-medium text-gray mb-2">Which features would be most valuable in a next-gen solution for working in environments outside of Navisworks? (Select all that apply)</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Real-time collaboration', 
                    'VR/AR visualization', 
                    'AI-assisted design', 
                    'Automated clash detection',
                    'Energy analysis',
                    'Cost estimation',
                    'Construction sequencing',
                    'Facility management',
                    'IoT integration',
                    'Cloud-based access'
                  ].map(feature => (
                    <div key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`feature-${feature}`}
                        name="desiredFeatures"
                        value={feature}
                        checked={formData.desiredFeatures.includes(feature)}
                        onChange={handleCheckboxChange}
                        className="checkbox"
                      />
                      <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray">{feature}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                className="btn-primary inline-flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Survey
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-dark-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">Potential Virtual Design and Construction Applications</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card group">
              <div className="flex items-center mb-4">
                <div className="bg-dark p-3 rounded-full mr-4 border border-teal-dark group-hover:border-teal transition-colors">
                  <Building className="h-6 w-6 text-teal" />
                </div>
                <h3 className="text-xl font-semibold text-teal-dark group-hover:text-teal transition-colors">Architectural Visualization</h3>
              </div>
              <p className="text-gray">
                Photorealistic rendering and immersive walkthroughs using environments outside of Navisworks to communicate design intent.
              </p>
            </div>
            
            <div className="card group">
              <div className="flex items-center mb-4">
                <div className="bg-dark p-3 rounded-full mr-4 border border-teal-dark group-hover:border-teal transition-colors">
                  <HardHat className="h-6 w-6 text-teal" />
                </div>
                <h3 className="text-xl font-semibold text-teal-dark group-hover:text-teal transition-colors">Construction Simulation</h3>
              </div>
              <p className="text-gray">
                4D sequencing with detailed construction phasing to optimize schedules and identify potential issues.
              </p>
            </div>
            
            <div className="card group">
              <div className="flex items-center mb-4">
                <div className="bg-dark p-3 rounded-full mr-4 border border-teal-dark group-hover:border-teal transition-colors">
                  <Database className="h-6 w-6 text-teal" />
                </div>
                <h3 className="text-xl font-semibold text-teal-dark group-hover:text-teal transition-colors">Data Management</h3>
              </div>
              <p className="text-gray">
                Centralized platform for all project data, enabling better decision-making and information access.
              </p>
            </div>
            
            <div className="card group">
              <div className="flex items-center mb-4">
                <div className="bg-dark p-3 rounded-full mr-4 border border-teal-dark group-hover:border-teal transition-colors">
                  <Workflow className="h-6 w-6 text-teal" />
                </div>
                <h3 className="text-xl font-semibold text-teal-dark group-hover:text-teal transition-colors">Workflow Automation</h3>
              </div>
              <p className="text-gray">
                Streamlining repetitive tasks and processes to increase efficiency and reduce human error.
              </p>
            </div>
            
            <div className="card group">
              <div className="flex items-center mb-4">
                <div className="bg-dark p-3 rounded-full mr-4 border border-teal-dark group-hover:border-teal transition-colors">
                  <BarChart4 className="h-6 w-6 text-teal" />
                </div>
                <h3 className="text-xl font-semibold text-teal-dark group-hover:text-teal transition-colors">Performance Analysis</h3>
              </div>
              <p className="text-gray">
                Simulating building performance for energy, acoustics, lighting, and other critical factors.
              </p>
            </div>
            
            <div className="card group">
              <div className="flex items-center mb-4">
                <div className="bg-dark p-3 rounded-full mr-4 border border-teal-dark group-hover:border-teal transition-colors">
                  <Layers className="h-6 w-6 text-teal" />
                </div>
                <h3 className="text-xl font-semibold text-teal-dark group-hover:text-teal transition-colors">Multi-dimensional VDC</h3>
              </div>
              <p className="text-gray">
                Integrating cost (5D), sustainability (6D), and facility management (7D) data into your models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-gray py-12 border-t border-teal-dark/30" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="h-8 w-8 text-teal" />
                <span className="text-2xl font-bold text-teal">BIMSurvey</span>
              </div>
              <p className="text-gray">
                Helping shape the future of Virtual Design and Construction technology through industry feedback and innovation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-teal-dark">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray hover:text-teal transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray hover:text-teal transition-colors">About</a></li>
                <li><a href="#survey" className="text-gray hover:text-teal transition-colors">Survey</a></li>
                <li><a href="#contact" className="text-gray hover:text-teal transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-teal-dark">Contact Us</h3>
              <p className="text-gray mb-2">Have questions about our Virtual Design and Construction solutions?</p>
              <a 
                href="mailto:info@bimsurvey.com" 
                className="text-teal hover:text-teal-dark transition-colors"
              >
                davin.contact.us@gmail.com
              </a>
            </div>
          </div>
          
          <div className="border-t border-teal-dark/30 mt-8 pt-8 text-center text-gray">
            <p>&copy; 2025 BIMSurvey. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;