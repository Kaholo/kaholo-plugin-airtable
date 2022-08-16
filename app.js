const fetch = require("node-fetch");
const { bootstrap } = require("@kaholo/plugin-library");

const API_URL = "https://api.airtable.com/v0";

async function listRecords(params) {
  const {
    apiKey,
    base,
    table,
    view,
    fieldsFilter,
    formulaFilter,
    sortBy,
    sortOrder,
    totalMaxRecords,
  } = params;

  const listRecordsUrl = new URL(`${API_URL}/${base}/${table}`);
  const requestOptions = { headers: { Authorization: `Bearer ${apiKey}` } };

  // this mutates the first argument
  setUrlParams(listRecordsUrl.searchParams, {
    view,
    fieldsFilter,
    formulaFilter,
    sortBy,
    sortOrder,
    totalMaxRecords,
  });

  let response = await fetch(listRecordsUrl.toString(), requestOptions);
  let result = await response.json();
  let records = [...result.records];
  let { offset } = result;

  /* eslint-disable no-await-in-loop */
  while (offset) {
    listRecordsUrl.searchParams.set("offset", offset);
    /* eslint-disable no-await-in-loop */
    response = await fetch(listRecordsUrl.toString(), requestOptions);
    result = await response.json();
    /* eslint-enable no-await-in-loop */
    offset = result.offset;
    records = records.concat(result.records);
  }
  /* eslint-enable no-await-in-loop */

  return records;
}

function setUrlParams(urlParams, {
  fieldsFilter,
  formulaFilter,
  view,
  sortBy,
  sortOrder,
  totalMaxRecords,
}) {
  if (fieldsFilter) {
    fieldsFilter.forEach((filter) => urlParams.append("fields", filter));
    // workaround for Airtable defect (20220415)
    // if only one field must specify it twice.
    // otherwise TypeError: result.records is not iterable
    if (fieldsFilter.length === 1) {
      fieldsFilter.forEach((filter) => urlParams.append("fields", filter));
    }
  }

  if (formulaFilter) {
    urlParams.set("filterByFormula", formulaFilter);
  }

  if (view) {
    urlParams.set("view", view);
  }

  if (sortOrder === "none" && sortBy) {
    console.error("\"Sort By\" was specified but with \"Sort Order\" of \"None\" it will have no effect.");
  }

  if (sortOrder !== "none") {
    if (sortBy) {
      urlParams.set("sort[0][field]", sortBy);
      urlParams.set("sort[0][direction]", sortOrder);
    } else {
      throw new Error("Sorting requires the \"Sort By\" parameter to contain a field name.");
    }
  }

  if (totalMaxRecords) {
    urlParams.set("maxRecords", totalMaxRecords);
  }
}

module.exports = bootstrap({
  listRecords,
}, {});
