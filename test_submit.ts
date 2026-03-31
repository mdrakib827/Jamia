import fetch from 'node-fetch';

async function testSubmit() {
  const response = await fetch("http://localhost:3000/api/admissions/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentNameBn: "টেস্ট",
      studentNameEn: "Test",
      fatherName: "Test Father",
      motherName: "Test Mother",
      dob: "2000-01-01",
      gender: "male",
      presentAddress: "Dhaka",
      permanentAddress: "Dhaka",
      previousInstitute: "None",
      classToAdmit: "হিফজ",
      contactNumber: "01700000000",
      guardianName: "Test Guardian",
      guardianContact: "01700000000",
      bloodGroup: "A+",
      year: "2026",
    }),
  });
  console.log(response.status);
  const text = await response.text();
  console.log(text);
}

testSubmit();
