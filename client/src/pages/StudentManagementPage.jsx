import { useState } from "react";
import StudentDetail from "./StudentDetail";
import StudentList from "./StudentList";


const StudentManagementPage = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  return (
    <div>
      {selectedStudentId ? (
        <StudentDetail studentId={selectedStudentId} onClose={() => setSelectedStudentId(null)} />
      ) : (
        <StudentList onSelectStudent={setSelectedStudentId} />
      )}
    </div>
  );
};

export default StudentManagementPage;
