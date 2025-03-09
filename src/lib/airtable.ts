import Airtable from 'airtable';

// Initialize Airtable with API key
const airtable = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
  endpointUrl: 'https://api.airtable.com'
});

// Constants for Airtable configuration
const BASE_ID = 'appuojNVDfs9U7ccy';
const TABLE_NAME = 'Survey Responses'; // Using the correct table name for our survey

// Function to submit survey response to Airtable
export const submitToAirtable = async (formData: any) => {
  try {
    // Validate API key
    if (!import.meta.env.VITE_AIRTABLE_API_KEY) {
      throw new Error('Airtable API key is missing');
    }

    const base = airtable.base(BASE_ID);

    // Log configuration (remove in production)
    console.log('Airtable Config:', {
      baseId: BASE_ID,
      tableName: TABLE_NAME,
      apiKeyPrefix: import.meta.env.VITE_AIRTABLE_API_KEY.substring(0, 10) + '...'
    });

    // Create record object matching the Survey Responses schema
    const recordData = {
      "Name": formData.name || '',
      "Email": formData.email || '',
      "Company": formData.company || '',
      "Role": formData.role || '',
      "Current Tools": formData.currentBimTools ? formData.currentBimTools.join(', ') : '',
      "Navisworks Export": formData.unreal || '',
      "Current Usage": formData.currentUsage || '',
      "Challenges": formData.challenges || '',
      "Desired Features": formData.desiredFeatures ? formData.desiredFeatures.join(', ') : '',
      "Additional Comments": formData.additionalComments || ''
    };

    // Log the record being created (remove in production)
    console.log('Creating Airtable record:', recordData);

    // Create a single record
    const record = await base(TABLE_NAME).create([
      { fields: recordData }
    ]);

    console.log('Airtable record created:', record);
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
        tableName: TABLE_NAME,
        hasApiKey: !!import.meta.env.VITE_AIRTABLE_API_KEY
      }
    });
    
    throw new Error(`Airtable submission failed: ${error.message || 'Unknown error'}`);
  }
};

// Function to fetch records from Airtable
export const fetchFromAirtable = async () => {
  try {
    const base = airtable.base(BASE_ID);

    const records = await base(TABLE_NAME).select({
      maxRecords: 100,
      view: "Grid view"  // Using the default view name
    }).firstPage();

    return records;
  } catch (error: any) {
    console.error('Error fetching from Airtable:', error);
    throw new Error(`Failed to fetch from Airtable: ${error.message || 'Unknown error'}`);
  }
}; 