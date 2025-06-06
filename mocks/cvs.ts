import { CV } from '@/types/cv';

export const mockCVs: CV[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+44 7123 456789',
    summary: 'Experienced researcher with a background in qualitative research methods and data analysis. Specializing in healthcare innovation and patient-centered care.',
    education: [
      {
        institution: 'University of Oxford',
        degree: 'PhD',
        field: 'Medical Sociology',
        startDate: '2015',
        endDate: '2019'
      },
      {
        institution: 'University College London',
        degree: 'MSc',
        field: 'Research Methods',
        startDate: '2013',
        endDate: '2014'
      }
    ],
    experience: [
      {
        company: 'NHS Innovation',
        position: 'Senior Researcher',
        startDate: '2019',
        endDate: 'Present',
        description: 'Leading qualitative research projects on healthcare delivery and patient experience. Conducting interviews, focus groups, and thematic analysis.'
      },
      {
        company: 'University of Manchester',
        position: 'Research Associate',
        startDate: '2014',
        endDate: '2019',
        description: 'Taught research methods to undergraduate students. Conducted mixed-methods research on healthcare systems.'
      }
    ],
    skills: [
      { name: 'Qualitative Research' },
      { name: 'NVIVO' },
      { name: 'Thematic Analysis' },
      { name: 'Academic Writing' },
      { name: 'Research Ethics' }
    ],
    languages: ['English', 'French'],
    publications: [
      'Smith, J. (2020). "Patient experiences in NHS emergency care." Journal of Health Services.',
      'Smith, J. & Jones, A. (2018). "Qualitative approaches to healthcare research." Research Methods Quarterly.'
    ],
    uploadDate: '2023-05-15',
    tags: ['Healthcare', 'Research', 'NHS', 'Teaching']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+44 7987 654321',
    summary: 'Data scientist with expertise in machine learning and statistical analysis. Experience in both academic and industry settings with a focus on STEM education.',
    education: [
      {
        institution: 'Imperial College London',
        degree: 'PhD',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2020'
      },
      {
        institution: 'University of Cambridge',
        degree: 'MEng',
        field: 'Engineering',
        startDate: '2012',
        endDate: '2016'
      }
    ],
    experience: [
      {
        company: 'Tech Innovations Ltd',
        position: 'Lead Data Scientist',
        startDate: '2020',
        endDate: 'Present',
        description: 'Developing machine learning models for predictive analytics. Leading a team of 5 data scientists on various projects.'
      },
      {
        company: 'University of Bristol',
        position: 'Lecturer in Data Science',
        startDate: '2018',
        endDate: '2020',
        description: 'Teaching undergraduate and postgraduate courses in data science, machine learning, and statistics. Supervising student projects.'
      }
    ],
    skills: [
      { name: 'Python' },
      { name: 'R' },
      { name: 'Machine Learning' },
      { name: 'Statistical Analysis' },
      { name: 'TensorFlow' },
      { name: 'Teaching' }
    ],
    languages: ['English', 'German'],
    publications: [
      'Johnson, S. (2021). "Applications of deep learning in STEM education." Journal of Educational Technology.',
      'Johnson, S. & Brown, T. (2019). "Predictive models for student performance." Data Science in Education.'
    ],
    uploadDate: '2023-06-20',
    tags: ['Data Science', 'STEM', 'Teaching', 'Machine Learning']
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+44 7654 321987',
    summary: 'Project manager with extensive experience in software development and team leadership. Skilled in agile methodologies and stakeholder management.',
    education: [
      {
        institution: 'London School of Economics',
        degree: 'MBA',
        field: 'Business Administration',
        startDate: '2010',
        endDate: '2012'
      },
      {
        institution: 'University of Edinburgh',
        degree: 'BSc',
        field: 'Computer Science',
        startDate: '2006',
        endDate: '2010'
      }
    ],
    experience: [
      {
        company: 'Global Software Solutions',
        position: 'Senior Project Manager',
        startDate: '2018',
        endDate: 'Present',
        description: 'Managing complex software development projects with budgets exceeding £1M. Implementing agile methodologies and ensuring on-time delivery.'
      },
      {
        company: 'Tech Startups Inc',
        position: 'Project Lead',
        startDate: '2012',
        endDate: '2018',
        description: 'Led cross-functional teams in developing innovative software solutions. Managed client relationships and project scope.'
      }
    ],
    skills: [
      { name: 'Project Management' },
      { name: 'Agile' },
      { name: 'Scrum' },
      { name: 'Stakeholder Management' },
      { name: 'Budgeting' },
      { name: 'Risk Management' }
    ],
    languages: ['English', 'Mandarin', 'Cantonese'],
    uploadDate: '2023-07-10',
    tags: ['Project Management', 'Software Development', 'Leadership']
  }
];