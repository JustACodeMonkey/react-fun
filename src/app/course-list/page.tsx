'use client';

import React from 'react';
import Link from 'next/link'

interface Course {
  code: string;
  name: string;
}

function Course({ course }: { course: Course }) {
  return (
    <>
      <span>{course.name}</span>
      <span className="material-symbols-outlined">arrow_forward</span>
    </>
  );
}

const Courses = ({ courses }: { courses: Course[] }) => {
  return courses.map(course => (
    <li
      key={course.code}
      className="hover:bg-gray-700 hover:-mx-4 hover:px-4"
    >
      <Link href={`/course-list/${course.code}`} className="flex flex-row justify-between items-center gap-16 py-2 w-full">
        <Course course={course} />
      </Link>
    </li>
  ));
};

export default function CourseList() {
  const [courses, setCourses] = React.useState<Course[]>([]);

  // Calling useEffect with an empty array for the deps param will result in this method being called only once (except in dev mode, where it is called twice)
  // An empty array for deps acts the same as the componentDidMount lifecycle hook
  // If useEffect returns an arrow function, it acts the same as the componentWillUnmount lifecycle hook (so we can clean up if needed)
  // If the deps array has a changing value in it, then useEffect acts like the componentDidUpdate lifecycle hook
  React.useEffect(() => {
    const abortController = new AbortController();
    fetch('/data/courses.json', { signal: abortController.signal })
      .then(response => response.json())
      .then(data => setCourses(data));
    
    return () => abortController.abort();
  }, []);

  return (
    <div className="p-4 rounded-lg border-[1px] border-blue-50 border-opacity-25 min-w-80">
      <h1 className="text-2xl mb-4">Course List</h1>
      <ul className="w-full overflow-visible">
        <Courses courses={courses} />
      </ul>
    </div>
  );
}