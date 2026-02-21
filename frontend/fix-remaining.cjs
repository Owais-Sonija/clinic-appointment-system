const fs = require('fs');

// src/api/axiosInstance.ts
let content = fs.readFileSync('src/api/axiosInstance.ts', 'utf8');
content = '/// <reference types="vite/client" />\n' + content;
fs.writeFileSync('src/api/axiosInstance.ts', content);

// src/pages/Contact.tsx
content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
content = content.replace(/rows="5"/g, 'rows={5}');
fs.writeFileSync('src/pages/Contact.tsx', content);

// src/pages/dashboard/AdminDashboard.tsx
content = fs.readFileSync('src/pages/dashboard/AdminDashboard.tsx', 'utf8');
content = content.replace(/user\.name/g, 'user?.name');
fs.writeFileSync('src/pages/dashboard/AdminDashboard.tsx', content);

// src/pages/dashboard/DoctorDashboard.tsx
content = fs.readFileSync('src/pages/dashboard/DoctorDashboard.tsx', 'utf8');
content = content.replace(/a => a\.doctorId/g, '(a: any) => a.doctorId');
content = content.replace(/user\._id/g, 'user?._id');
content = content.replace(/async \(id, status\)/g, 'async (id: string, status: string)');
content = content.replace(/user\.name/g, 'user?.name');
fs.writeFileSync('src/pages/dashboard/DoctorDashboard.tsx', content);

// src/pages/dashboard/PatientDashboard.tsx
content = fs.readFileSync('src/pages/dashboard/PatientDashboard.tsx', 'utf8');
content = content.replace(/async \(id\)/g, 'async (id: string)');
content = content.replace(/=\s*\(status\)\s*=>/g, '= (status: string) =>');
content = content.replace(/user\.name/g, 'user?.name');
content = content.replace(/rows="3"/g, 'rows={3}');
fs.writeFileSync('src/pages/dashboard/PatientDashboard.tsx', content);

// src/pages/DoctorDetails.tsx
content = fs.readFileSync('src/pages/DoctorDetails.tsx', 'utf8');
content = content.replace(/\(slot, index\)/g, '(slot: any, index: number)');
fs.writeFileSync('src/pages/DoctorDetails.tsx', content);

// src/pages/Register.tsx
content = fs.readFileSync('src/pages/Register.tsx', 'utf8');
content = content.replace(/minLength="6"/g, 'minLength={6}');
fs.writeFileSync('src/pages/Register.tsx', content);
