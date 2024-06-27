'use client';

import React from 'react';
import Link from 'next/link'

interface Course {
  code: string;
  name: string;
}

function Courses({ courses }: { courses: Course[] }) {
  return courses.map(course => (
    <li key={course.code} className="flex flex-row justify-between items-center gap-16 py-1">
      <span>{course.name}</span>
      <Link href={`/course-list/${course.code}`}>Go</Link>
    </li>
  ));
}

export default function CourseList() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const coursesRef            = React.useRef(courses);

  React.useEffect(() => {
    fetch('/data/courses.json')
      .then(response => response.json())
      .then(data => setCourses(data))
  }, [coursesRef]);

  return (
    <div className="p-4 rounded-lg border-[1px] border-blue-50 border-opacity-25">
      <h1 className="text-2xl mb-4">Course List</h1>
      <ul className="w-full">
        <Courses courses={courses} />
      </ul>
    </div>
  );
}