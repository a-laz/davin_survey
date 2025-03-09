# Change Log

## March 9, 2025 - Survey Updates Based on Nicole's Feedback

### Summary
Implemented several changes to improve survey clarity and terminology based on feedback from Nicole. The changes focus on making the survey more aligned with current industry terminology and improving the user experience.

### Terminology Updates
- Replaced all "BIM" references with "Virtual Design and Construction" throughout the application
- Updated "Unreal Engine" references to "Environment Outside of Navisworks" to be more inclusive of different tools
- Standardized terminology across the entire application for consistency

### Survey Structure Changes
1. **Question Relocation and Rewording**
   - Moved and updated the visualization question to the Current VDC Usage section
   - Changed "Have you used Unreal Engine for visualization?" to "Have you imported your model out of Navisworks into another tool?"
   - Added detailed options for tool usage:
     - No - I only use BIM model within Navisworks
     - Yes - With options for:
       - Procore
       - Gaming Engine (Unity or Unreal)
       - Scheduling
       - Logistics Planning
       - Other

2. **New Question Added**
   Added "What are you currently using Virtual Construction Design / 3D modeling for?" with options:
   - Not Using It
   - Clash Detection and Subcontractor Coordination
   - Phasing, Sequencing Logistics Planning
   - Claim Support
   - Marketing Videos
   - Other

### Form Design Decision
After careful consideration, we decided to keep the Personal Information section at the top and required rather than optional at the bottom. This decision was made to:
- Establish respondent context before technical feedback
- Ensure ability to follow up on valuable insights
- Set clear expectations upfront
- Maintain data quality with verified professional responses

### Contact Information Update
- Current placeholder email (info@bimsurvey.com) will be replaced with a team Gmail account
- Team to create and configure new Gmail account for survey responses

### Technical Implementation
- Updated React components to reflect new terminology
- Modified Supabase schema to accommodate new question options
- Updated form validation rules
- Maintained responsive design throughout changes

### Next Steps
- [ ] Create team Gmail account for survey responses
- [ ] Update email references in application
- [ ] Monitor initial responses for any usability issues
- [ ] Gather feedback on terminology changes 