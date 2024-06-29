'use client';

import { useRouter } from 'next/navigation'
import React, { FocusEvent } from 'react';

interface IStudent {
  id:   number;
  name: string;
  code: string;
  mark?: string;
  comment?: string;
}

/**
 * MarkInput
 * - Input for mark entry
 * - Only accepts marks of A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, and I
 * - Outputs a change event on blur ONLY when the mark has actually changed
 * @param 
 * @returns 
 */
const MarkInput = ({ mark, onChange }: { mark: string; onChange: (value: string) => void }) => {
  const [initial, setInitial] = React.useState(mark);
  const [current, setCurrent] = React.useState(mark);
  const [error, setError] = React.useState(false);

  const validKeys  = /^[ABCDI+\-]+$/;
  const validMarks = /^(D[-+]?|C[-+]?|B[-+]?|A[-+]?|I)$/;

  const isSpecialKey = (key: string) => {
    return ['Enter','Tab','ArrowDown','ArrowLeft','ArrowRight','ArrowUp','Backspace','Delete'].includes(key);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key       = event.key;
    const validMark = validMarks.test(event.currentTarget.value + key);
    if (!validMark && !isSpecialKey(key)) {
      event.preventDefault();
    }
  };

  const handleChange = (value: string) => {
    const validMark = validMarks.test(value);
    if (value && !validMark) {
      setError(true);
      return;
    }
    setError(false);
    setCurrent(value);
  };

  const handleBlur = () => initial !== current && onChange(current);

  return (
    <input
      value={current}
      onKeyDown={(event) => handleKeyDown(event)}
      onChange={(event) => handleChange(event.target.value)}
      onFocus={(event) => setInitial(event.target.value)}
      onBlur={handleBlur}
      className={"text-center px-1 w-12" + (error ? 'error' : '')}
    />
  );
};

/**
 * CommentInput
 * - Input for comments
 * - Allows all text with no length limit
 * - Outputs a change event on blur ONLY when the comment has actually changed
 * @param 
 * @returns 
 */
const CommentInput = ({ comment, onChange }: { comment: string; onChange: (value: string) => void }) => {
  const [initial, setInitial] = React.useState(comment);
  const [current, setCurrent] = React.useState(comment);

  const handleBlur = () => initial !== current && onChange(current);

  return (
    <input
      value={current}
      onChange={(event) => setCurrent(event.target.value)}
      onFocus={(event) => setInitial(event.target.value)}
      onBlur={handleBlur}
      className="w-72"
    />
  );
};

const Student = ({ student, onMarkChange, onCommentChange }: {
  student: IStudent;
  onMarkChange: (mark: string) => void;
  onCommentChange: (comment: string) => void;
 }) => {
  return (
    <>
      <td className="py-2">
        <div className="flex flex-col">
          <span>{student.name}</span>
          <span className="text-sm text-gray-500">Student ID: {student.id}</span>
        </div>
      </td>
      <td className="py-2 px-4">
        <MarkInput mark={student.mark ?? ''} onChange={onMarkChange} />
      </td>
      <td className="py-2">
        <CommentInput comment={student.comment ?? ''} onChange={onCommentChange} />
      </td>
    </>
  );
};

export default function CourseCode({ params }: { params: { courseCode: string }}) {
  const router = useRouter();
  const [students, setStudents] = React.useState<IStudent[]>([]);

  const [saveNote, setSaveNote] = React.useState('');
  const [showSaveNote, setShowSaveNote] = React.useState(false);
  const [timerId, setTimerId] = React.useState(-1);

  React.useEffect(() => {
    const abortController = new AbortController();
    fetch('/data/students.json?courseCode=' + params.courseCode, { signal: abortController.signal })
      .then(response => response.json())
      .then((data: IStudent[]) => setStudents(
        data.filter(student => student.code === params.courseCode).map(student => ({
          mark: '',
          comment: '',
          ...student,
        }))
      ));
    
    return () => abortController.abort();
  }, [params.courseCode]); // Run when the course code changes to get the new data (real data wouldn't be in json like this)

  const showSaveMessage = (msg: string) => {
    console.log(msg);
    setSaveNote(msg);
    setShowSaveNote(true);
    clearTimeout(timerId);
    setTimerId(window.setTimeout(() => setShowSaveNote(false), 4000));
  }

  const handleMarkChange = (student: IStudent, mark: string) => {
    showSaveMessage(`Received updated mark of ${mark} for ${student.name}. In a real app, we'd send the update to the server.`)
  };

  const handleCommentChange = (student: IStudent, comment: string) => {
    showSaveMessage(`Received updated comment of ${comment} for ${student.name}. In a real app, we'd send the update to the server.`)
  };

  const handleCancel = () => {
    router.push('/course-list');
  };

  return (
    <div className="p-4 rounded-lg border-[1px] border-blue-50 border-opacity-25 w-full">
      <h1 className="text-2xl mb-4">Course details for {params.courseCode}</h1>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left w-full">Student</th>
            <th className="text-left px-4">Mark</th>
            <th className="text-left">Comment</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student: IStudent, index: number) => (
            <tr key={student.id}>
              <Student
                student={student}
                onMarkChange={(mark) => handleMarkChange(student, mark)}
                onCommentChange={(comment) => handleCommentChange(student, comment)}
              />
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-row justify-between items-center gap-2 mt-4 w-full">
        <button type="button" className='flex flex-row justify-center items-center gap-2' onClick={handleCancel}>
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back</span>
        </button>
        {showSaveNote && <span className="block text-sm text-gray-500 text-right max-w-[500px]">{saveNote}</span>}
      </div>
    </div>
  );
}