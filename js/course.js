/**
 * course.js - Manages course display and filtering functionality
 * Handles dynamic rendering of course cards and filtering by course type
 */

document.addEventListener('DOMContentLoaded', function() {
    // Course data - replace with your actual course information
    const courses = [
        { 
            id: 1, 
            code: 'WDD 131', 
            name: 'Dynamic Web Fundamentals', 
            description: 'Learn the fundamentals of dynamic web development with JavaScript.',
            type: 'WDD', 
            credits: 3, 
            completed: true,
            semester: 'Spring 2023',
            instructor: 'Professor Smith'
        },
        { 
            id: 2, 
            code: 'CSE 121B', 
            name: 'JavaScript Language', 
            description: 'Advanced JavaScript programming concepts and patterns.',
            type: 'CSE', 
            credits: 4, 
            completed: true,
            semester: 'Fall 2022',
            instructor: 'Professor Johnson'
        },
        { 
            id: 3, 
            code: 'WDD 230', 
            name: 'Web Frontend Development I', 
            description: 'Introduction to frontend web development with HTML, CSS, and JavaScript.',
            type: 'WDD', 
            credits: 3, 
            completed: true,
            semester: 'Winter 2023',
            instructor: 'Professor Williams'
        },
        { 
            id: 4, 
            code: 'WDD 330', 
            name: 'Web Frontend Development II', 
            description: 'Advanced frontend development with modern JavaScript frameworks.',
            type: 'WDD', 
            credits: 3, 
            completed: false,
            semester: 'Fall 2023',
            instructor: 'Professor Brown'
        },
        { 
            id: 5, 
            code: 'CSE 341', 
            name: 'Web Backend Development', 
            description: 'Server-side development with Node.js and databases.',
            type: 'CSE', 
            credits: 3, 
            completed: false,
            semester: 'Winter 2024',
            instructor: 'Professor Davis'
        }
    ];

    // DOM Elements
    const courseContainer = document.getElementById('course-container');
    const allCoursesBtn = document.getElementById('all-courses');
    const wddCoursesBtn = document.getElementById('wdd-courses');
    const cseCoursesBtn = document.getElementById('cse-courses');
    const creditTotalElement = document.querySelector('.credit-total span');

    // Initialize the page
    let currentFilter = 'all';
    let filteredCourses = [];

    // Event Listeners
    allCoursesBtn?.addEventListener('click', () => filterCourses('all'));
    wddCoursesBtn?.addEventListener('click', () => filterCourses('WDD'));
    cseCoursesBtn?.addEventListener('click', () => filterCourses('CSE'));

    // Filter courses by type
    function filterCourses(filterType) {
        currentFilter = filterType;
        
        // Update active button states
        updateActiveButton(filterType);
        
        // Filter courses
        filteredCourses = filterType === 'all' 
            ? [...courses] 
            : courses.filter(course => course.type === filterType);
        
        // Display filtered courses
        displayCourses();
    }

    // Update active filter button
    function updateActiveButton(filterType) {
        const buttons = {
            'all': allCoursesBtn,
            'WDD': wddCoursesBtn,
            'CSE': cseCoursesBtn
        };

        // Remove active class from all buttons
        Object.values(buttons).forEach(btn => {
            if (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });

        // Add active class to selected button
        if (buttons[filterType]) {
            buttons[filterType].classList.add('active');
            buttons[filterType].setAttribute('aria-pressed', 'true');
        }
    }

    // Display courses in the DOM
    function displayCourses() {
        if (!courseContainer) return;

        // Clear existing content
        courseContainer.innerHTML = '';

        if (filteredCourses.length === 0) {
            courseContainer.innerHTML = '<p>No courses found.</p>';
            return;
        }

        // Create course cards
        filteredCourses.forEach(course => {
            const courseCard = document.createElement('article');
            courseCard.className = `course-card ${course.completed ? 'completed' : 'in-progress'}`;
            courseCard.setAttribute('data-course-id', course.id);
            courseCard.setAttribute('aria-labelledby', `course-${course.id}-title`);
            
            // Course status badge
            const statusBadge = document.createElement('span');
            statusBadge.className = 'status-badge';
            statusBadge.textContent = course.completed ? 'Completed' : 'In Progress';
            statusBadge.setAttribute('aria-label', `Status: ${course.completed ? 'Completed' : 'In Progress'}`);
            
            // Course header with code and name
            const courseHeader = document.createElement('header');
            const courseTitle = document.createElement('h4');
            courseTitle.id = `course-${course.id}-title`;
            courseTitle.textContent = `${course.code}: ${course.name}`;
            courseHeader.appendChild(courseTitle);
            courseHeader.appendChild(statusBadge);
            
            // Course details
            const courseDetails = document.createElement('div');
            courseDetails.className = 'course-details';
            
            const courseDescription = document.createElement('p');
            courseDescription.textContent = course.description;
            
            const courseMeta = document.createElement('div');
            courseMeta.className = 'course-meta';
            
            const credits = document.createElement('span');
            credits.textContent = `${course.credits} ${course.credits === 1 ? 'Credit' : 'Credits'}`;
            
            const semester = document.createElement('span');
            semester.textContent = course.semester;
            
            const instructor = document.createElement('span');
            instructor.textContent = `Instructor: ${course.instructor}`;
            
            courseMeta.append(credits, ' • ', semester, ' • ', instructor);
            courseDetails.append(courseDescription, courseMeta);
            
            // Assemble the card
            courseCard.append(courseHeader, courseDetails);
            courseContainer.appendChild(courseCard);
        });

        // Update total credits
        updateTotalCredits();
    }

    // Calculate and display total credits
    function updateTotalCredits() {
        if (!creditTotalElement) return;
        
        const totalCredits = filteredCourses.reduce((total, course) => 
            total + course.credits, 0
        );
        
        creditTotalElement.textContent = `${totalCredits} (${filteredCourses.length} courses)`;
        creditTotalElement.setAttribute('aria-label', `Total credits: ${totalCredits} from ${filteredCourses.length} courses`);
    }

    // Initialize the page
    function init() {
        // Load courses and display with initial filter
        filterCourses('all');
        
        // Add keyboard navigation for filter buttons
        document.querySelectorAll('.filter-buttons button').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }

    // Start the application
    init();
});
