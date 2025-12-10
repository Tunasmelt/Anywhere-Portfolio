import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, Zap, Code, Mail, Briefcase, X, Palette, Database, GitBranch, LayoutGrid, Linkedin, Github, Sun, Moon, ChevronDown } from 'lucide-react';

// Global constants
const PROJECT_PLACEHOLDER_IMAGE = "https://placehold.co/600x400/1e293b/f8fafc?text=Project+Visual";
const PORTFOLIO_STORAGE_KEY = 'portfolio_data';
const CONTACT_MESSAGES_STORAGE_KEY = 'contact_messages';
const DATA_VERSION = '2.0'; // Increment this to force localStorage refresh

// --- Utility Functions ---

// Scroll-trigger animation helper: adds 'fade-show' when element enters viewport
const useFadeOnScroll = () => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (!('IntersectionObserver' in window)) {
            el.classList.add('fade-show');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(el);
        
        // Check if element is already in viewport on initial render
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('fade-show');
            observer.unobserve(el);
        }
        
        return () => observer.disconnect();
    }, []);

    return ref;
};

/**
 * Custom hook for managing state with localStorage persistence.
 * @param {string} key - The key for localStorage.
 * @param {*} initialState - The initial state value.
 */
const useLocalStorage = (key, initialState) => {
    const [value, setValue] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : initialState;
        } catch (error) {
            console.error("Error reading localStorage key “" + key + "”:", error);
            return initialState;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error writing localStorage key “" + key + "”:", error);
        }
    }, [key, value]);

    return [value, setValue];
};

// --- Custom Components ---

const SectionTitle = ({ children, id, className = "" }) => (
    <h2 id={id} className={`text-3xl sm:text-4xl font-extrabold pb-3 mb-8 relative inline-block ${className}`}>
        {children}
        <span className="block h-1 w-20 bg-gradient-to-r from-[#A28BA6] to-[#B9B9B0] dark:from-[#A28BA6] dark:to-[#B9B9B0] absolute bottom-0 left-0 rounded-full"></span>
    </h2>
);

const AnimatedButton = ({ children, onClick, className = "", Icon, type = "button", disabled = false, variant = "primary" }) => {
    let baseStyles = "flex items-center justify-center font-semibold px-6 py-3 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-lg active:shadow-sm disabled:opacity-50 disabled:pointer-events-none";
    let variantStyles;

    switch (variant) {
        case 'secondary':
            variantStyles = "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600";
            break;
        case 'danger':
            variantStyles = "bg-red-600 text-white hover:bg-red-700";
            break;
        default: // primary
            variantStyles = "bg-gradient-to-r from-[#A28BA6] to-[#B9B9B0] dark:from-[#A28BA6] dark:to-[#B9B9B0] text-white hover:shadow-xl hover:scale-105";
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variantStyles} ${className}`}
            disabled={disabled}
        >
            {Icon && <Icon className="w-5 h-5 mr-2" />}
            {children}
        </button>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Portfolio Sections ---

const Hero = ({ profile }) => {
    const ref = useRef(null);

    const scrollToProjects = () => {
        const element = document.getElementById('projects');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="hero" className="relative pt-24 lg:pt-20 pb-28 md:py-40 overflow-hidden text-center bg-gradient-to-br from-[#F1E3E4] to-[#E8D8DD] dark:from-[#1C1D21] dark:to-[#2A2B30] transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-[#A28BA6]/12 to-transparent dark:from-[#B9B9B0]/18 dark:to-transparent opacity-80 z-0"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3 animate-fade-in-up">
                        {profile.name || "John Doe"}
                    </h1>
                    <p className="text-lg sm:text-xl font-medium text-[#A28BA6] dark:text-[#B9B9B0] mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>{profile.designation}</p>
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-[#E4E4E4] mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        {profile.bio || "I transform complex data into actionable insights to drive strategic business growth."}
                    </p>
                    <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                        <AnimatedButton onClick={scrollToProjects} Icon={Briefcase} className="mx-auto" variant="primary">
                            View Key Projects
                        </AnimatedButton>
                    </div>
                </div>
            </div>
            <button
                onClick={scrollToProjects}
                aria-label="Scroll down to projects"
                className="hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-[#A28BA6] dark:text-[#B9B9B0] hover:text-[#B9B9B0] dark:hover:text-[#A28BA6] transition-colors"
            >
                {/* Mouse icon with scroll wheel */}
                <svg className="w-8 h-12" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Mouse body */}
                    <rect x="8" y="4" width="16" height="28" rx="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                    {/* Scroll wheel */}
                    <rect x="14" y="10" width="4" height="6" rx="2" fill="currentColor">
                        <animate attributeName="y" values="10;14;10" dur="1.5s" repeatCount="indefinite"/>
                    </rect>
                </svg>
                {/* Three arrows pointing down */}
                <div className="flex flex-col -space-y-1">
                    <svg className="w-5 h-3" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12L0 2L2 0L10 8L18 0L20 2L10 12Z" fill="currentColor" opacity="0.3"/>
                    </svg>
                    <svg className="w-5 h-3" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12L0 2L2 0L10 8L18 0L20 2L10 12Z" fill="currentColor" opacity="0.6"/>
                    </svg>
                    <svg className="w-5 h-3" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12L0 2L2 0L10 8L18 0L20 2L10 12Z" fill="currentColor" opacity="1"/>
                    </svg>
                </div>
            </button>
        </section>
    );
};

const TechnologyBar = ({ technologies }) => {
    return (
        <section id="technologies" className="py-12 pb-8 bg-gradient-to-br from-[#A28BA6] via-[#B9B9B0] to-[#CBCBCC] dark:from-[#1C1D21] dark:via-[#2A2B30] dark:to-[#1C1D21] relative overflow-hidden">
            {/* Custom background pattern for the "TECHNOLOGIES" section */}
            <div className="absolute inset-0 z-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(135deg, #A28BA6 0, #A28BA6 1px, transparent 1px, transparent 20px)',
                backgroundSize: '40px 40px',
            }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-center text-3xl md:text-4xl font-extrabold text-white uppercase tracking-widest mb-12">
                    Technologies
                </h2>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {technologies.map((tech, index) => (
                        <div 
                            key={index} 
                            className="flex flex-col items-center group cursor-pointer animate-fade-in-up"
                            style={{animationDelay: `${index * 0.1}s`}}
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f5f7f8] dark:bg-[#1C1D21] backdrop-blur-sm rounded-full flex items-center justify-center p-3 shadow-2xl ring-4 ring-[#E4E4E4] dark:ring-[#B9B9B0]/35 transition-all duration-300 group-hover:ring-[#A28BA6]/70 dark:group-hover:ring-[#A28BA6]/70 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
                                {tech.icon === 'Python' && <GitBranch className="w-9 h-9 sm:w-10 sm:h-10 text-[#A28BA6] dark:text-[#B9B9B0] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#B9B9B0]" />}
                                {tech.icon === 'SQL' && <Database className="w-9 h-9 sm:w-10 sm:h-10 text-[#A28BA6] dark:text-[#B9B9B0] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#B9B9B0]" />}
                                {tech.icon === 'Terminal' && <Code className="w-9 h-9 sm:w-10 sm:h-10 text-[#A28BA6] dark:text-[#B9B9B0] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#B9B9B0]" />}
                                {tech.icon === 'ML' && <LayoutGrid className="w-9 h-9 sm:w-10 sm:h-10 text-[#A28BA6] dark:text-[#B9B9B0] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#B9B9B0]" />}
                                {tech.icon === 'Tableau' && <Palette className="w-9 h-9 sm:w-10 sm:h-10 text-[#A28BA6] dark:text-[#B9B9B0] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#B9B9B0]" />}
                                {tech.icon === 'Excel' && <LayoutGrid className="w-9 h-9 sm:w-10 sm:h-10 text-[#A28BA6] dark:text-[#B9B9B0] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#B9B9B0]" />}
                                {tech.icon === 'PowerBI' && <Zap className="w-9 h-9 sm:w-10 sm:h-10 text-[#A28BA6] dark:text-[#B9B9B0] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#B9B9B0]" />}
                                {tech.icon === 'R' && <Code className="w-9 h-9 sm:w-10 sm:h-10 text-[#A28BA6] dark:text-[#B9B9B0] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#B9B9B0]" />}
                                {/* Fallback for custom text, using the text itself if icon mapping is missing */}
                                {(!tech.icon || !['Python', 'SQL', 'Terminal', 'ML', 'Tableau', 'Excel', 'PowerBI', 'R'].includes(tech.icon)) && (
                                    <span className="text-xl sm:text-2xl font-bold text-[#A28BA6] dark:text-[#B9B9B0] text-center uppercase leading-none group-hover:text-[#B9B9B0]">
                                        {tech.name.substring(0, 4)}
                                    </span>
                                )}
                            </div>
                            <p className="mt-3 text-base sm:text-lg font-semibold text-white dark:text-gray-100 group-hover:text-white/90 transition-colors">
                                {tech.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ project, theme }) => {
    const isDarkMode = theme === 'dark';

    // Tailwind classes based on theme
    const cardBg = isDarkMode ? 'bg-[#2A2B30] border-[#3a3a3a]' : 'bg-white border-gray-300';
    const titleColor = isDarkMode ? 'text-[#E4E4E4]' : 'text-gray-900';
    const textColor = isDarkMode ? 'text-[#E4E4E4]' : 'text-gray-700';
    const stepBg = isDarkMode ? 'bg-[#1C1D21] border-[#3a3a3a]' : 'bg-[#f6f6f6] border-[#e6e6e6]';
    const stepNumberBg = 'bg-gradient-to-r from-[#A28BA6] to-[#B9B9B0] text-white';
    const stepBorder = isDarkMode ? 'border-l border-[#A28BA6]' : 'border-l border-[#A28BA6]';

    return (
        <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 p-6 rounded-2xl border-2 ${cardBg} shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-all duration-500 mb-16`}>
            {/* Visual/Image Placeholder Section (Left) */}
            <div className="lg:w-1/2 flex-shrink-0 relative rounded-xl overflow-hidden shadow-2xl h-64 sm:h-80 md:h-96 bg-gray-700 dark:bg-black">
                <img
                    src={project.imageUrl || PROJECT_PLACEHOLDER_IMAGE}
                    alt={`${project.name} dashboard mockup`}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => e.currentTarget.src = PROJECT_PLACEHOLDER_IMAGE}
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#A28BA6] to-[#B9B9B0] dark:from-[#A28BA6] dark:to-[#B9B9B0] text-[#1C1D21] text-xs font-medium px-3 py-1 rounded-full shadow-md flex items-center">
                    <LayoutGrid className="w-3 h-3 mr-1 text-[#1C1D21]" />
                    Live Dashboard Mockup
                </div>
            </div>

            {/* Project Details Section (Right) */}
            <div className="lg:w-1/2">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-[#A28BA6] dark:text-[#B9B9B0] font-medium flex items-center">
                        <Zap className="w-4 h-4 mr-1" /> Project {project.id}
                    </p>
                    <a
                        href={project.repositoryUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm font-semibold text-[#A28BA6] dark:text-[#B9B9B0] hover:text-[#B9B9B0] dark:hover:text-[#A28BA6] transition-colors border border-[#A28BA6] dark:border-[#B9B9B0] px-4 py-2 rounded-xl"
                    >
                        <GitBranch className="w-4 h-4 mr-2" /> View Repository
                    </a>
                </div>

                <h3 className={`text-3xl font-extrabold mb-4 ${titleColor} fade-scroll`} ref={useFadeOnScroll()} style={{ transitionDelay: '60ms' }}>
                    {project.name}
                </h3>
                <p className={`mb-6 text-base ${textColor} fade-scroll`} ref={useFadeOnScroll()} style={{ transitionDelay: '100ms' }}>
                    {project.description}
                </p>

                <h4
                    className={`text-xl font-bold mb-4 ${titleColor} border-b border-[#A28BA6]/60 dark:border-[#B9B9B0]/50 pb-2 inline-block fade-scroll`}
                    ref={useFadeOnScroll()}
                    style={{ transitionDelay: '140ms' }}
                >
                    Key Steps & Process
                </h4>

                {/* Key Steps List */}
                <div className="space-y-4">
                    {project.keySteps?.map((step, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start p-4 rounded-xl shadow-md border ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} ${stepBg} fade-scroll`}
                            ref={useFadeOnScroll()}
                            style={{ transitionDelay: `${180 + idx * 70}ms` }}
                        >
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 font-bold text-sm ${stepNumberBg}`}>
                                {idx + 1}
                            </div>
                            <p className={`text-base ${textColor} pt-0.5`}>
                                {step}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

const Projects = ({ projects, theme }) => {
    // Fallback projects if data doesn't load properly
    const fallbackProjects = [
        {
            id: '1',
            order: 1,
            name: "E-commerce Customer Churn Prediction",
            description: "Developed an end-to-end ML pipeline to identify high-risk customer segments, reducing churn by 12% in the subsequent quarter through targeted retention campaigns.",
            repositoryUrl: "https://github.com/alex/churn-prediction",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
            keySteps: [
                "Data ingestion and cleaning from multiple e-commerce sources",
                "Feature engineering (RFM value, purchase frequency, engagement metrics)",
                "Built and optimized Random Forest model achieving 87% accuracy",
                "Created a web-based deployment interface for real-time predictions",
                "Reported key drivers of churn to marketing team with actionable insights"
            ]
        },
        {
            id: '2',
            order: 2,
            name: "Sales Performance Dashboard",
            description: "A comprehensive sales analytics dashboard that tracks KPIs, revenue trends, and regional performance in real-time. Built with Tableau and connected to live sales databases for dynamic insights.",
            repositoryUrl: "https://github.com/alex/sales-dashboard",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
            keySteps: [
                "Collected and cleaned sales data from multiple sources (SAP, Salesforce, Excel)",
                "Performed exploratory data analysis to identify key metrics and patterns",
                "Created interactive Tableau visualizations with drill-down capabilities",
                "Implemented automated monthly data refresh pipeline using Python ETL scripts",
                "Designed user-friendly interface enabling stakeholders to filter by region, product, and time period"
            ]
        },
        {
            id: '3',
            order: 3,
            name: "Market Segmentation & Customer Insights",
            description: "Applied unsupervised learning techniques to segment 500K+ customers into distinct personas, enabling targeted marketing campaigns that increased conversion rates by 18% and improved customer lifetime value.",
            repositoryUrl: "https://github.com/alex/customer-segmentation",
            imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
            keySteps: [
                "Aggregated customer behavior data from CRM, transaction logs, and web analytics",
                "Applied K-means clustering and hierarchical clustering techniques",
                "Validated clusters using silhouette scores and business logic",
                "Created detailed customer personas with demographic and behavioral characteristics",
                "Delivered presentations to executive team with strategic recommendations for each segment"
            ]
        },
    ];

    const projectsToRender = (projects && projects.length > 0) ? projects : fallbackProjects;

    return (
        <section id="projects" className="py-12 lg:py-16 bg-gradient-to-br from-[#E8D8DD] to-[#DDD1D8] dark:from-[#1C1D21] dark:to-[#2A2B30] transition-colors duration-500">
            <div className="container mx-auto px-4">
                <SectionTitle
                    className="text-gray-900 dark:text-white fade-scroll"
                    id="projects"
                    ref={useFadeOnScroll()}
                >
                    Key Analytical Projects
                </SectionTitle>

                <div className="space-y-20">
                    {projectsToRender.map((project, index) => (
                        <div
                            key={project.id || index}
                            className="fade-scroll"
                            ref={useFadeOnScroll()}
                            style={{ transitionDelay: `${index * 80 + 80}ms` }}
                        >
                            <ProjectCard
                                project={project}
                                theme={theme}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setStatus('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        setStatus('Sending...');

        try {
            // Save to localStorage
            const messages = JSON.parse(localStorage.getItem(CONTACT_MESSAGES_STORAGE_KEY) || '[]');
            const newMessage = {
                id: Date.now().toString(),
                name,
                email,
                message,
                timestamp: new Date().toISOString(),
                isRead: false
            };
            messages.push(newMessage);
            localStorage.setItem(CONTACT_MESSAGES_STORAGE_KEY, JSON.stringify(messages));

            setStatus('Message sent successfully! I will get back to you soon.');
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error("Error submitting contact form: ", error);
            setStatus('Failed to send message. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="py-20 lg:py-28 bg-[#F1E3E4] dark:bg-[#1C1D21] transition-colors duration-500">
            <div className="container mx-auto px-4 max-w-4xl">
                <SectionTitle
                    className="text-gray-900 dark:text-white"
                    id="contact"
                >
                    Get In Touch
                </SectionTitle>
                <p
                    className="text-xl text-center text-gray-800 dark:text-gray-200 mb-8"
                >
                    Have a question about a project or a potential collaboration? Send me a message!
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 bg-gradient-to-br from-[#F1E3E4] to-[#E8D8DD] dark:from-[#2A2B30] dark:to-[#1C1D21] p-8 rounded-xl shadow-2xl border-2 border-[#CBCBCC] dark:border-[#3a3a3a]"
                >
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[#d8d8d8] dark:border-[#3a3a3a] rounded-lg focus:ring-[#A28BA6] focus:border-[#A28BA6] dark:focus:ring-[#A28BA6] dark:focus:border-[#A28BA6] dark:bg-[#1C1D21] dark:text-[#E4E4E4] bg-white text-gray-800 transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[#d8d8d8] dark:border-[#3a3a3a] rounded-lg focus:ring-[#A28BA6] focus:border-[#A28BA6] dark:focus:ring-[#A28BA6] dark:focus:border-[#A28BA6] dark:bg-[#1C1D21] dark:text-[#E4E4E4] bg-white text-gray-800 transition-colors"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">Message</label>
                        <textarea
                            id="message"
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[#d8d8d8] dark:border-[#3a3a3a] rounded-lg focus:ring-[#A28BA6] focus:border-[#A28BA6] dark:focus:ring-[#A28BA6] dark:focus:border-[#A28BA6] dark:bg-[#1C1D21] dark:text-[#E4E4E4] bg-white text-gray-800 transition-colors resize-none"
                        ></textarea>
                    </div>
                    {status && (
                        <p
                            className={`text-center font-medium ${status.includes('success') ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {status}
                        </p>
                    )}
                    <AnimatedButton
                        type="submit"
                        Icon={Mail}
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Message'}
                    </AnimatedButton>
                </form>
            </div>
        </section>
    );
};



// --- Main App Component ---

const App = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useLocalStorage('theme', 'light');

    // --- Theme Management ---

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // --- Data Fetching ---

    const fetchPortfolioData = useCallback(async () => {
        try {
            // Load from localStorage
            const storedData = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
            
            if (storedData) {
                const fetchedData = JSON.parse(storedData);
                // Check if data version matches
                if (fetchedData.version !== DATA_VERSION) {
                    console.log('Data version mismatch, clearing old data');
                    localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
                } else {
                    // Sort projects by 'order' property before setting state
                    const sortedProjects = (fetchedData.projects || []).sort((a, b) => a.order - b.order);
                    setData({ ...fetchedData, projects: sortedProjects });
                    setIsLoading(false);
                    return;
                }
            }
            
            // Initialize default data if it doesn't exist or version mismatch
            const defaultData = {
                version: DATA_VERSION,
                    profile: {
                        name: "Alex Vercetti",
                        designation: "Senior Data Analyst",
                        bio: "I'm a data analyst with a passion for turning raw data into strategic insights that drive business decisions. With expertise in Python, SQL, and machine learning, I specialize in building predictive models, automating data workflows, and creating compelling visualizations. My approach combines technical rigor with clear communication, ensuring that complex analyses translate into actionable recommendations for stakeholders at all levels."
                    },
                    technologies: [
                        { name: "Python", icon: "Python" },
                        { name: "SQL", icon: "SQL" },
                        { name: "Terminal", icon: "Terminal" },
                        { name: "ML/AI", icon: "ML" },
                        { name: "Tableau", icon: "Tableau" },
                        { name: "Excel", icon: "Excel" },
                        { name: "Power BI", icon: "PowerBI" },
                        { name: "R", icon: "R" },
                    ],
                    projects: [
                        {
                            id: '1',
                            order: 1,
                            name: "E-commerce Customer Churn Prediction",
                            description: "Developed an end-to-end ML pipeline to identify high-risk customer segments, reducing churn by 12% in the subsequent quarter through targeted retention campaigns.",
                            repositoryUrl: "https://github.com/alex/churn-prediction",
                            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
                            keySteps: [
                                "Data ingestion and cleaning from multiple e-commerce sources",
                                "Feature engineering (RFM value, purchase frequency, engagement metrics)",
                                "Built and optimized Random Forest model achieving 87% accuracy",
                                "Created a web-based deployment interface for real-time predictions",
                                "Reported key drivers of churn to marketing team with actionable insights"
                            ]
                        },
                        {
                            id: '2',
                            order: 2,
                            name: "Sales Performance Dashboard",
                            description: "A comprehensive sales analytics dashboard that tracks KPIs, revenue trends, and regional performance in real-time. Built with Tableau and connected to live sales databases for dynamic insights.",
                            repositoryUrl: "https://github.com/alex/sales-dashboard",
                            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
                            keySteps: [
                                "Collected and cleaned sales data from multiple sources (SAP, Salesforce, Excel)",
                                "Performed exploratory data analysis to identify key metrics and patterns",
                                "Created interactive Tableau visualizations with drill-down capabilities",
                                "Implemented automated monthly data refresh pipeline using Python ETL scripts",
                                "Designed user-friendly interface enabling stakeholders to filter by region, product, and time period"
                            ]
                        },
                        {
                            id: '3',
                            order: 3,
                            name: "Market Segmentation & Customer Insights",
                            description: "Applied unsupervised learning techniques to segment 500K+ customers into distinct personas, enabling targeted marketing campaigns that increased conversion rates by 18% and improved customer lifetime value.",
                            repositoryUrl: "https://github.com/alex/customer-segmentation",
                            imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
                            keySteps: [
                                "Aggregated customer behavior data from CRM, transaction logs, and web analytics",
                                "Applied K-means clustering and hierarchical clustering techniques",
                                "Validated clusters using silhouette scores and business logic",
                                "Created detailed customer personas with demographic and behavioral characteristics",
                                "Delivered presentations to executive team with strategic recommendations for each segment"
                            ]
                        },
                    ]
                };
            setData(defaultData);
            // Save default data to localStorage
            localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(defaultData));
            setIsLoading(false);
        } catch (e) {
            console.error("General data fetching error:", e);
            setError("An error occurred while loading portfolio data.");
            setIsLoading(false);
        }
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchPortfolioData();
    }, [fetchPortfolioData]);


    // --- Render Logic ---

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 dark:border-indigo-400"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading Portfolio...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/10">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">Error Loading Data</p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{error}</p>
                    <p className="mt-4 text-sm text-gray-500">Please check your browser console for more details.</p>
                </div>
            </div>
        );
    }

    // The Portfolio View
    return (
        <div className={`min-h-screen font-sans ${theme}`}>
            <Header
                theme={theme}
                toggleTheme={toggleTheme}
            />
            <main>
                <Hero profile={data.profile} />
                <TechnologyBar technologies={data.technologies} />
                <Projects
                    projects={data.projects}
                    theme={theme}
                />
                <Contact />
            </main>
        </div>
    );
};

// --- Header and Footer Components (Moved outside App for clarity) ---

const NavItem = ({ href, children, Icon }) => {
    const handleClick = (e) => {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <a
            href={href}
            onClick={handleClick}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-sm lg:text-base"
        >
            <Icon className="w-5 h-5 mr-1 hidden sm:inline" />
            {children}
        </a>
    );
};

const Header = ({ theme, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { href: "#hero", label: "Home", Icon: Home },
        { href: "#technologies", label: "Skills", Icon: Code },
        { href: "#projects", label: "Projects", Icon: Briefcase },
        { href: "#contact", label: "Contact", Icon: Mail },
    ];

    return (
        <>
            {/* Left Sidebar Navigation - Desktop */}
            <aside className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-50 flex-col items-center py-6 px-3 bg-gray-100/95 dark:bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-400 dark:border-gray-800/50 transition-colors duration-500">
                {/* Navigation Icons */}
                <nav className="flex flex-col items-center space-y-6">
                    {navItems.map(item => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => {
                                e.preventDefault();
                                const targetId = item.href.substring(1);
                                const targetElement = document.getElementById(targetId);
                                if (targetElement) {
                                    targetElement.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="group relative flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors"
                            aria-label={item.label}
                        >
                            <item.Icon className="w-6 h-6" />
                            <span className="absolute left-full ml-4 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {item.label}
                            </span>
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Right Sidebar Social & Theme Toggle - Desktop */}
            <aside className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col items-center py-6 px-3 bg-gray-100/95 dark:bg-black/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-400 dark:border-gray-800/50 transition-colors duration-500">
                {/* Social & Theme Icons */}
                <nav className="flex flex-col items-center space-y-6">
                    <a href="mailto:your.email@example.com" className="group relative flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors" aria-label="Email">
                        <Mail className="w-6 h-6" />
                        <span className="absolute right-full mr-4 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Email
                        </span>
                    </a>
                    <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors" aria-label="LinkedIn">
                        <Linkedin className="w-6 h-6" />
                        <span className="absolute right-full mr-4 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            LinkedIn
                        </span>
                    </a>
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors" aria-label="GitHub">
                        <Github className="w-6 h-6" />
                        <span className="absolute right-full mr-4 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            GitHub
                        </span>
                    </a>
                    <button
                        onClick={toggleTheme}
                        className="group relative flex items-center justify-center w-12 h-12 text-gray-600 dark:text-gray-400 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        <span className="absolute right-full mr-4 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                </nav>
            </aside>

            {/* Mobile Top Navigation */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 transition-colors duration-500">
                <div className="px-4 py-3">
                    <div className="flex justify-between items-center">
                        <a href="#hero" className="text-2xl font-extrabold text-[#A28BA6] dark:text-[#B9B9B0] transition-colors" onClick={(e) => { e.preventDefault(); document.getElementById('hero').scrollIntoView({ behavior: 'smooth' }); }}>
                            <span className="text-2xl font-bold tracking-tight">AV</span>
                        </a>

                        <div className="flex items-center space-x-2">
                            <a href="mailto:your.email@example.com" className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors" aria-label="Email">
                                <Mail className="w-5 h-5" />
                            </a>
                            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors" aria-label="LinkedIn">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors" aria-label="GitHub">
                                <Github className="w-5 h-5" />
                            </a>
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors"
                                aria-label="Toggle navigation menu"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                        <div className="flex flex-col p-4 space-y-2">
                            {navItems.map(item => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        const targetId = item.href.substring(1);
                                        const targetElement = document.getElementById(targetId);
                                        if (targetElement) {
                                            targetElement.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-[#A28BA6] dark:hover:text-[#B9B9B0] transition-colors font-medium py-2"
                                >
                                    <item.Icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </nav>
                )}
            </header>
        </>
    );
};

export default App;