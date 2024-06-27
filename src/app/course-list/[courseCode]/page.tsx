'use client';

import Link from 'next/link';
import React from 'react';

interface Student {
  id:   number;
  name: string;
  code: string;
}

function Students({ students}: { students: Student[] }) {
  return students.map(student => (
    <li key={student.id} className="py-1">{student.name}</li>
  ));
}

export default function CourseId({ params }: { params: { courseCode: string }}) {
  const [students, setStudents] = React.useState<Student[]>([]);

  React.useEffect(() => {
    fetch('/data/students.json?courseCode=' + params.courseCode)
      .then(response => response.json())
      .then((data: Student[]) => setStudents(data.filter(student => student.code === params.courseCode)));
  }, [params.courseCode]);

  return (
    <div className="p-4 rounded-lg border-[1px] border-blue-50 border-opacity-25">
      <h1 className="text-2xl mb-4">Course details for {params.courseCode}</h1>
      <ul className="mb-4">
        <Students students={students} />
      </ul>
      <Link href="/course-list">Return to course list</Link>
    </div>
  );
}