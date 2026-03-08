const OPERATIONAL_STATUS = ['Operating', 'Not Ready', 'Decommissioned'];
const MAINTENANCE_TYPE = ['Preventive', 'Corrective'];

function isPresent(val) {
  return val !== undefined && val !== null && String(val).trim() !== '';
}

function isNumeric(val) {
  if (val === undefined || val === null) return false;
  const n = Number(val);
  return !isNaN(n) && isFinite(n);
}

function validateLogin(body) {
  const errors = [];
  if (!isPresent(body?.email)) errors.push('email is required');
  if (!isPresent(body?.password)) errors.push('password is required');
  return errors.length ? errors : null;
}

function validateCreateAsset(body) {
  const errors = [];
  if (!isPresent(body?.facility_number)) errors.push('facility_number is required');
  if (!isPresent(body?.serial_number)) errors.push('serial_number is required');
  if (!isPresent(body?.device_type)) errors.push('device_type is required');
  if (!isPresent(body?.manufacturer)) errors.push('manufacturer is required');
  if (!isPresent(body?.model)) errors.push('model is required');
  if (!isPresent(body?.production_year)) errors.push('production_year is required');
  else if (!isNumeric(body.production_year)) errors.push('production_year must be numeric');
  if (!isPresent(body?.location)) errors.push('location is required');
  if (!isPresent(body?.operational_status)) errors.push('operational_status is required');
  else if (!OPERATIONAL_STATUS.includes(body?.operational_status)) {
    errors.push('operational_status must be Operating, Not Ready, or Decommissioned');
  }
  return errors.length ? errors : null;
}

function validateUpdateAsset(body) {
  const errors = [];
  if (body?.operational_status !== undefined) {
    if (!OPERATIONAL_STATUS.includes(body.operational_status)) {
      errors.push('operational_status must be Operating, Not Ready, or Decommissioned');
    }
  }
  if (body?.production_year !== undefined && body?.production_year !== null) {
    if (!isNumeric(body.production_year)) errors.push('production_year must be numeric');
  }
  return errors.length ? errors : null;
}

function validateRecordDailyCheck(body) {
  const errors = [];
  if (!isPresent(body?.asset_id)) errors.push('asset_id is required');
  if (!isPresent(body?.status)) errors.push('status is required');
  else if (!OPERATIONAL_STATUS.includes(body?.status)) {
    errors.push('status must be Operating, Not Ready, or Decommissioned');
  }
  return errors.length ? errors : null;
}

function validateUpdateDailyCheck(body) {
  const errors = [];
  if (body?.status !== undefined) {
    if (!OPERATIONAL_STATUS.includes(body.status)) {
      errors.push('status must be Operating, Not Ready, or Decommissioned');
    }
  }
  return errors.length ? errors : null;
}

function validateRecordMaintenance(body) {
  const errors = [];
  if (!isPresent(body?.asset_id)) errors.push('asset_id is required');
  if (!isPresent(body?.maintenance_type)) errors.push('maintenance_type is required');
  else if (!MAINTENANCE_TYPE.includes(body?.maintenance_type)) {
    errors.push('maintenance_type must be Preventive or Corrective');
  }
  if (!isPresent(body?.description)) errors.push('description is required');
  return errors.length ? errors : null;
}

function validateUpdateMaintenance(body) {
  const errors = [];
  if (body?.maintenance_type !== undefined) {
    if (!MAINTENANCE_TYPE.includes(body.maintenance_type)) {
      errors.push('maintenance_type must be Preventive or Corrective');
    }
  }
  if (body?.description !== undefined) {
    if (!isPresent(body.description)) errors.push('description cannot be empty');
  }
  return errors.length ? errors : null;
}

module.exports = {
  validateLogin,
  validateCreateAsset,
  validateUpdateAsset,
  validateRecordDailyCheck,
  validateUpdateDailyCheck,
  validateRecordMaintenance,
  validateUpdateMaintenance,
};
