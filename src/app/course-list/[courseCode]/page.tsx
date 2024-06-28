'use client';

import { Field, FieldArray, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation'
import React from 'react';
import * as Yup from 'yup';

interface IStudent {
  id:   number;
  name: string;
  code: string;
  mark?: string;
  comment?: string;
}

const Student = ({ student, index }: { student: IStudent, index: number }) => {
  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div className="flex flex-col">
        <span>{student.name}</span>
        <span className="text-sm text-gray-500">Student ID: {student.id}</span>
      </div>
      <fieldset className="flex flex-row items-center gap-2">
        <input type="hidden" name={`students.${index}.studentId`} value={student.id} />
        <div className="flex flex-col">
          <label htmlFor={`students.${index}.mark`}>Mark</label>
          <Field
            name={`students.${index}.mark`}
            className="text-center px-2 w-12"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={`students.${index}.comment`}>Comment</label>
          <Field
            name={`students.${index}.comment`}
            className="px-2 w-72"
          />
        </div>
      </fieldset>
    </div>
  );
};

const Students = ({ students }: { students: IStudent[] }) => {
  return students.map((student: IStudent, i: number) => (
    <li key={student.id} className="py-4">
      <Student student={student} index={i} />
    </li>
  ));
};

export default function CourseCode({ params }: { params: { courseCode: string }}) {
  const router = useRouter();
  const [students, setStudents] = React.useState<IStudent[]>([]);

  React.useEffect(() => {
    fetch('/data/students.json?courseCode=' + params.courseCode)
      .then(response => response.json())
      .then((data: IStudent[]) => setStudents(
        data.filter(student => student.code === params.courseCode).map(student => ({
          mark: '',
          comment: '',
          ...student,
        }))
      ));
  }, [params.courseCode]); // Run when the course code changes to get the new data (real data wouldn't be in json like this)

  const handleCancel = () => {
    router.push('/course-list');
  };

  const handleSave = () => {
    alert('If there was an API, we would update the student data now :)');
  };

  return (
    <div className="p-4 rounded-lg border-[1px] border-blue-50 border-opacity-25 w-full">
      <h1 className="text-2xl mb-4">Course details for {params.courseCode}</h1>

      <Formik
        initialValues={{ students }}
        onSubmit={handleSave}
        validationSchema={Yup.object({
          students: Yup.array().of(
            Yup.object().shape({
              mark: Yup.string()
                .matches(/^(D[-+]?|C[-+]?|B[-+]?|A[-+]?|I)$/, 'Invalid mark'),
              comment: Yup.string()
            })
          )
        })}
        validateOnBlur={true}
      >
        <Form>
          <ul className="mb-4">
            <FieldArray
              name="students"
              render={() => (
                <Students students={students} />
              )}
            />
          </ul>

          <div className="flex flex-row justify-between items-center gap-4 w-full">
            <button type="button" className='flex flex-row justify-center items-center gap-2 mt-4' onClick={handleCancel}>
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back</span>
            </button>

            <button type="submit" className='flex flex-row justify-center items-center gap-2 mt-4'>
              <span className="material-symbols-outlined">save</span>
              <span>Save</span>
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}