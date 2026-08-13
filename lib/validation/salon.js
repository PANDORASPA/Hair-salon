const clean = (value, max) => String(value ?? '').trim().slice(0, max)
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateAppointmentInput = (input = {}) => {
  const value = {
    serviceId: Number(input.serviceId), date: clean(input.date, 10), time: clean(input.time, 5),
    name: clean(input.name, 120), phone: clean(input.phone, 30), email: clean(input.email, 254).toLowerCase(), notes: clean(input.notes, 2000),
  }
  const errors = {}
  if (!Number.isSafeInteger(value.serviceId) || value.serviceId < 1) errors.serviceId = 'Select a valid service.'
  if (!datePattern.test(value.date) || Number.isNaN(Date.parse(`${value.date}T00:00:00Z`))) errors.date = 'Select a valid date.'
  if (!timePattern.test(value.time)) errors.time = 'Select a valid time.'
  if (value.name.length < 2) errors.name = 'Enter your name.'
  if (value.phone.length < 7) errors.phone = 'Enter a valid phone number.'
  if (value.email && !emailPattern.test(value.email)) errors.email = 'Enter a valid email address.'
  if (String(input.notes ?? '').trim().length > 2000) errors.notes = 'Notes are too long.'
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value }
}

module.exports = { validateAppointmentInput }
