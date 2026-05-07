import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  it('should add a student to the database and return their id', () => {
    expect(db.nameToIDs('blair')).toStrictEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toStrictEqual([id1]);
  });

  it('should return an ID distinct from any ID in the database', () => {
    // we'll add 3 students and check to see that their IDs are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  it('should permit adding a student w/ same name as an existing student', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });
});

describe('getTranscript', () => {
  it('given the ID of a student, should return the student’s transcript', () => {
    const id1 = db.addStudent('blair');
    expect(db.getTranscript(id1)).not.toBeNull();
  });

  it('given the ID that is not the ID of any student, should throw an error', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw
    // must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });
});

describe('addGrade', () => {
  // satisfaction condition: add a new grade for an existing student
  it('should add the grade to the transcript of an existing student', () => {
    const id1 = db.addStudent('blair');
    const grade = { course: 'cs4530', grade: 95 };

    db.addGrade(id1, 'cs4530', grade);

    expect(db.getTranscript(id1).grades).toStrictEqual([grade]);
  });

  it('should let getGrade return the grade that was added for a course', () => {
    const id1 = db.addStudent('blair');
    const grade = { course: 'cs4530', grade: 95 };

    db.addGrade(id1, 'cs4530', grade);

    expect(db.getGrade(id1, 'cs4530')).toStrictEqual(grade);
  });

  // Spec 1: spec doesn't say what to do for an unknown ID
  // throw error
  it('should throw an error when adding a grade for an unknown student ID', () => {
    expect(() => db.addGrade(1, 'cs4530', { course: 'cs4530', grade: 95 })).toThrowError();
  });

  // Spec 2: spec doesn't say what to do if a grade already exists
  // choose to replace
  it('should replace the existing grade when the same course is added again', () => {
    const id1 = db.addStudent('blair');
    const firstGrade = { course: 'cs4530', grade: 80 };
    const secondGrade = { course: 'cs4530', grade: 95 };

    db.addGrade(id1, 'cs4530', firstGrade);
    db.addGrade(id1, 'cs4530', secondGrade);

    expect(db.getTranscript(id1).grades).toStrictEqual([secondGrade]);
  });
});
