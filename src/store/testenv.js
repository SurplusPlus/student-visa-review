/* eslint-disable */

require('dotenv').config();

const process_api_key = process.env.VUE_APP_AIRTABLE_API_KEY;
const airtable_base = process.env.VUE_APP_AIRTABLE_BASE;
const airtable_interviews_table = process.env.VUE_APP_AIRTABLE_INTERVIEWS_TABLE;
const airtable_interviews_view = process.env.VUE_APP_AIRTABLE_INTERVIEWS_VIEW;
const airtable_people_table = process.env.VUE_APP_AIRTABLE_PEOPLE_TABLE;
const airtable_people_view = process.env.VUE_APP_AIRTABLE_PEOPLE_VIEW;

console.log("apikey --> ", process_api_key);

