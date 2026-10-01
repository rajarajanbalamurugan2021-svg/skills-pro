import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  Code2,
  Clock,
  Star,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { Course, CourseModule, CourseLesson } from '../types';
import { api } from '../services/api';

interface CoursesViewProps {
  courses: Course[];
  onCourseUpdated: () => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses: initialCoursesList,
  onCourseUpdated,
  onShowToast,
}) => {
  const [coursesList, setCoursesList] = useState<Course[]>(initialCoursesList);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'All',
    'Data Structures & Algorithms',
    'Full Stack',
    'System Design',
    'Aptitude & Soft Skills',
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getCourses();
      if (data && data.length > 0) {
        setCoursesList(data);
      }
    } catch (e) {
      // Keep initial courses list
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses =
    selectedCategory === 'All'
      ? coursesList
      : coursesList.filter((c) => c.category === selectedCategory);

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleToggleLesson = async (courseId: string, lessonId: string) => {
    try {
      const updated = await api.toggleLesson(courseId, lessonId);
      if (updated) {
        setCoursesList((prev) => prev.map((c) => (c.id === courseId ? updated : c)));
        if (activeCourse && activeCourse.id === courseId) {
          setActiveCourse(updated);
        }
        onCourseUpdated();
        onShowToast('Lesson progress updated!', 'success');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update lesson', 'error');
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const updated = await api.enrollCourse(courseId);
      if (updated) {
        setCoursesList((prev) => prev.map((c) => (c.id === courseId ? updated : c)));
        if (activeCourse && activeCourse.id === courseId) {
          setActiveCourse(updated);
        }
        onCourseUpdated();
        onShowToast('Enrolled in course successfully!', 'success');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Failed to enroll', 'error');
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4 text-rose-400" />;
      case 'code':
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case 'quiz':
        return <Award className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="p-8 text-center text-xs text-slate-400">
          Loading course tracks...
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="group bg-slate-900/80 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col shadow-xl hover:shadow-indigo-500/10"
          >
            {/* Thumbnail */}
            <div className="relative h-44 overflow-hidden bg-slate-950">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-bold text-indigo-300">
                  {course.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    course.level === 'Advanced'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : course.level === 'Intermediate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {course.level}
                </span>
              </div>

              {/* Progress Pill if Enrolled */}
              {course.enrolled && (
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{course.progressPercentage}% Done</span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Instructor & Meta */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <span className="truncate max-w-[120px] font-medium text-slate-300">
                    {course.instructor.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {/* Progress Bar */}
              {course.enrolled && (
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setActiveCourse(course);
                    if (course.modules[0]) {
                      setExpandedModules({ [course.modules[0].id]: true });
                    }
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all text-center"
                >
                  Curriculum ({course.modules.length} Modules)
                </button>

                {course.enrolled ? (
                  <button
                    onClick={() => {
                      setActiveCourse(course);
                      if (course.modules[0]) {
                        setExpandedModules({ [course.modules[0].id]: true });
                      }
                    }}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all"
                  >
                    Enroll Free
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Curriculum Modal / Detail Drawer */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {activeCourse.category}
                  </span>
                  <span className="text-xs text-slate-400">• {activeCourse.duration}</span>
                </div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {activeCourse.title}
                </h2>
                <p className="text-xs text-slate-400">
                  Instructor: {activeCourse.instructor.name} ({activeCourse.instructor.role})
                </p>
              </div>

              <button
                onClick={() => setActiveCourse(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Course Progress Summary */}
            <div className="px-5 py-3 bg-indigo-950/30 border-b border-indigo-900/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">
                  Your Course Completion
                </span>
                <p className="text-[11px] text-slate-400">
                  Check off lessons as you complete them to earn your certificate
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400">
                  {activeCourse.progressPercentage}%
                </span>
                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${activeCourse.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {activeCourse.modules.map((module) => {
                const isExpanded = expandedModules[module.id] ?? true;
                const completedCount = module.lessons.filter((l) => l.completed).length;

                return (
                  <div
                    key={module.id}
                    className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50"
                  >
                    <button
                      onClick={() => toggleModuleExpand(module.id)}
                      className="w-full px-4 py-3 bg-slate-800/40 hover:bg-slate-800/70 flex items-center justify-between transition-colors text-left"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{module.title}</h4>
                        <span className="text-[10px] text-slate-400">
                          {completedCount} of {module.lessons.length} lessons completed
                        </span>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-slate-800/60 p-1">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="px-3 py-2.5 flex items-center justify-between hover:bg-slate-800/30 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggleLesson(activeCourse.id, lesson.id)}
                                className="text-slate-500 hover:text-emerald-400 transition-colors"
                              >
                                {lesson.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                                )}
                              </button>

                              <div className="flex items-center gap-2">
                                {getLessonIcon(lesson.type)}
                                <span
                                  className={`text-xs ${
                                    lesson.completed
                                      ? 'text-slate-400 line-through'
                                      : 'text-slate-200 font-medium'
                                  }`}
                                >
                                  {lesson.title}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Placement preparation verified by top tech mentors.
              </span>
              <button
                onClick={() => setActiveCourse(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
