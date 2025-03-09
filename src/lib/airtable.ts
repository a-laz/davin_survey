import Airtable from 'airtable';

// Initialize Airtable with API key
const airtable = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
});

// Constants for Airtable configuration
const BASE_ID = 'appuojNVDfs9U7ccy';
const TABLE_ID = 'tblgI35s7cmiGNb6m';

// Function to submit survey response to Airtable
export const submitToAirtable = async (formData: any) => {
  try {
    // Validate API key
    if (!import.meta.env.VITE_AIRTABLE_API_KEY) {
      throw new Error('Airtable API key is missing');
    }

    const base = airtable.base(BASE_ID);
    const table = base(TABLE_ID);

    // Log configuration (remove in production)
    console.log('Airtable Config:', {
      baseId: BASE_ID,
      tableId: TABLE_ID,
      apiKeyLength: import.meta.env.VITE_AIRTABLE_API_KEY.length
    });

    // Ensure arrays are properly formatted for Airtable
    const currentTools = Array.isArray(formData.currentBimTools) 
      ? formData.currentBimTools.join(', ')
      : formData.currentBimTools;

    const desiredFeatures = Array.isArray(formData.desiredFeatures)
      ? formData.desiredFeatures.join(', ')
      : formData.desiredFeatures;

    // Create record object
    const recordData = {
      "Name": formData.name || '',
      "Email": formData.email || '',
      "Company": formData.company || '',
      "Role": formData.role || '',
      "Current Tools": currentTools || '',
      "Navisworks Export": formData.unreal || '',
      "Current Usage": formData.currentUsage || '',
      "Challenges": formData.challenges || '',
      "Desired Features": desiredFeatures || '',
      "Additional Comments": formData.additionalComments || ''
    };

    // Log the record being created (remove in production)
    console.log('Creating Airtable record:', recordData);

    // Create a single record
    const record = await table.create(recordData);

    return record;
  } catch (error: any) {
    // Enhanced error logging
    console.error('Airtable Error Details:', {
      message: error.message,
      error: error,
      statusCode: error.statusCode,
      type: error.type || error.constructor.name,
      formData: formData,
      config: {
        baseId: BASE_ID,
        tableId: TABLE_ID,
        hasApiKey: !!import.meta.env.VITE_AIRTABLE_API_KEY
      }
    });
    
    throw new Error(`Airtable submission failed: ${error.message || 'Unknown error'}`);
  }
};

// Function to fetch survey responses from Airtable
export const fetchFromAirtable = async () => {
  try {
    const base = airtable.base(BASE_ID);
    const table = base(TABLE_ID);

    const records = await table.select({
      maxRecords: 100,
      view: 'Grid view'
    }).firstPage();

    return records;
  } catch (error: any) {
    console.error('Error fetching from Airtable:', error);
    throw new Error(`Failed to fetch from Airtable: ${error.message || 'Unknown error'}`);
  }
}; 