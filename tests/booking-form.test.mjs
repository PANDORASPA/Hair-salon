import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
const source=await readFile(new URL('../app/booking/BookingForm.jsx',import.meta.url),'utf8')
test('booking form loads server availability before submission',()=>{assert.match(source,/\/api\/availability/);assert.match(source,/slots/);assert.match(source,/disabled=.*slots/i)})
test('booking form submits structured appointment JSON',()=>{assert.match(source,/\/api\/appointments/);assert.match(source,/application\/json/);assert.match(source,/serviceId/);assert.match(source,/date/);assert.match(source,/time/)})

test('booking form presents a confirmation dialog with the pending appointment details',()=>{
  assert.match(source,/<dialog/i)
  assert.match(source,/Awaiting confirmation/)
  assert.match(source,/reference/i)
  assert.match(source,/service/i)
  assert.match(source,/date/i)
  assert.match(source,/time/i)
})

test('booking form locks repeat submissions and refreshes availability after success',()=>{
  assert.match(source,/submitting/)
  assert.match(source,/disabled=\{[^}]*submitting/i)
  assert.match(source,/This time has just been booked\. Please choose another time\./)
  assert.match(source,/loadAvailability/)
})
