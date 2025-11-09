import streamlit as st
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config.settings import settings
from database.connection import get_db_connection, get_db_session
from database.queries import UserQueries
from components.pdf_preview import render_pdf_preview
from components.latex_editor import render_latex_editor
from components.sidebar import render_sidebar, get_user_api_key
from components.visual_resume_builder import VisualResumeBuilder
from utils.pdf_generator import PDFGenerator
from ai_integration.openai_client import OpenAIClient

# Settings are automatically loaded from Pydantic Settings

# Configure Streamlit page
st.set_page_config(
    page_title="Professional Resume Builder",
    page_icon="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333333'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z'/><polyline points='14,2 14,8 20,8'/></svg>",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load Dark Theme CSS
try:
    with open('styles/dark_theme.css', 'r') as f:
        dark_theme_css = f.read()
except FileNotFoundError:
    dark_theme_css = ""
    
try:
    with open('styles/animations.css', 'r') as f:
        animations_css = f.read()
except FileNotFoundError:
    animations_css = ""

# Combine and inject CSS
st.markdown(f"""
<style>
{dark_theme_css}
{animations_css}
</style>
""", unsafe_allow_html=True)

# Load JavaScript for micro-interactions
try:
    with open('styles/micro_interactions.js', 'r') as f:
        micro_js = f.read()
    
    # Enhanced background effects
    st.components.v1.html(f"""
    <script>
    {micro_js}
    
    // Initialize particle system immediately
    document.addEventListener('DOMContentLoaded', function() {{
        // Create particle system for background
        const particleSystem = new ParticleSystem();
        particleSystem.init();
        
        // Add floating particles effect
        const floatingParticles = new FloatingParticles();
        floatingParticles.init();
        
        // Add glowing orbs effect
        const glowingOrbs = new GlowingOrbs();
        glowingOrbs.init();
        
        // Initialize cursor effects
        const cursorEffects = new CursorEffects();
        cursorEffects.init();
        
        // Initialize theme manager
        const themeManager = new ThemeManager();
        themeManager.init();
    }});
    
    // Additional particle effects class
    class FloatingParticles {{
        init() {{
            const container = document.createElement('div');
            container.className = 'floating-particles';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                overflow: hidden;
            `;
            
            for (let i = 0; i < 20; i++) {{
                const particle = document.createElement('div');
                particle.className = 'floating-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 2}px;
                    height: ${Math.random() * 4 + 2}px;
                    background: linear-gradient(45deg, #00d4ff, #0099cc);
                    border-radius: 50%;
                    opacity: ${Math.random() * 0.6 + 0.2};
                    animation: float ${Math.random() * 10 + 10}s infinite linear;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                container.appendChild(particle);
            }}
            
            document.body.appendChild(container);
        }}
    }}
    
    class GlowingOrbs {{
        init() {{
            const container = document.createElement('div');
            container.className = 'glowing-orbs';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
                overflow: hidden;
            `;
            
            for (let i = 0; i < 5; i++) {{
                const orb = document.createElement('div');
                orb.className = 'glowing-orb';
                orb.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 100 + 50}px;
                    height: ${Math.random() * 100 + 50}px;
                    background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
                    border-radius: 50%;
                    filter: blur(20px);
                    animation: orbFloat ${Math.random() * 15 + 15}s infinite ease-in-out;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                `;
                container.appendChild(orb);
            }}
            
            document.body.appendChild(container);
        }}
    }}
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {{
            0%, 100% {{ transform: translateY(0px) translateX(0px); }}
            25% {{ transform: translateY(-20px) translateX(10px); }}
            50% {{ transform: translateY(10px) translateX(-10px); }}
            75% {{ transform: translateY(-10px) translateX(5px); }}
        }}
        
        @keyframes orbFloat {{
            0%, 100% {{ transform: translate(0, 0) scale(1); }}
            33% {{ transform: translate(30px, -30px) scale(1.1); }}
            66% {{ transform: translate(-20px, 20px) scale(0.9); }}
        }}
        
        .stApp {{
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d1b69 100%);
            position: relative;
            overflow-x: hidden;
        }}
        
        .stApp::before {{
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
            z-index: -2;
            animation: backgroundShift 20s infinite ease-in-out;
        }}
        
        @keyframes backgroundShift {{
            0%, 100% {{ opacity: 0.8; }}
            50% {{ opacity: 1; }}
        }}
    `;
    document.head.appendChild(style);
    </script>
    """, height=0)
except FileNotFoundError:
    pass

def initialize_session_state():
    """Initialize session state variables"""
    if 'session_id' not in st.session_state:
        import uuid
        st.session_state.session_id = str(uuid.uuid4())[:8]  # Short unique ID
    if 'current_user' not in st.session_state:
        st.session_state.current_user = None
    if 'latex_code' not in st.session_state:
        st.session_state.latex_code = ""
    if 'pdf_path' not in st.session_state:
        st.session_state.pdf_path = None
    if 'template_style' not in st.session_state:
        st.session_state.template_style = "arpan"
    if 'active_sections' not in st.session_state:
        st.session_state.active_sections = [
            "professional_summary",
            "projects",
            "professional_experience",
            "research_experience",
            "academic_collaborations",
            "education",
            "technical_skills"
        ]
    if 'ai_generated_summary' not in st.session_state:
        st.session_state.ai_generated_summary = ""
    if 'summary_generation_count' not in st.session_state:
        st.session_state.summary_generation_count = 0
    if 'job_posting_input' not in st.session_state:
        st.session_state.job_posting_input = ""
    if 'font_size' not in st.session_state:
        st.session_state.font_size = "10pt"
    if 'enforce_one_page_limit' not in st.session_state:
        st.session_state.enforce_one_page_limit = True

def check_database_connection():
    """Check if database is connected"""
    try:
        db_conn = get_db_connection()
        if not db_conn.test_connection():
            st.error("Database connection failed. Please make sure PostgreSQL is running.")
            st.info("Run: `docker-compose up -d` to start the database")
            return False
        return True
    except Exception as e:
        st.error(f"Database error: {e}")
        return False

def render_visual_builder_tab():
    """Render the visual resume builder tab"""
    try:
        # Get current user ID from session state (from sidebar component)
        current_user_id = st.session_state.get('current_user_id')

        if not current_user_id:
            st.warning("Please select a user in the Details tab first to use the Visual Builder.")
            st.info("Go to the **Details** tab and select a user to get started.")
            return

        # Initialize visual builder
        visual_builder = VisualResumeBuilder()

        # Render the visual builder interface (now includes PDF generation at the end)
        layout_changed = visual_builder.render_visual_builder(current_user_id)

    except Exception as e:
        st.error(f"Error in Visual Builder: {e}")
        st.info("Please try refreshing the page or contact support if the issue persists.")

def optimize_resume_for_job(job_description: str):
    """Optimize resume for specific job posting using AI"""
    from components.tabbed_sidebar import gather_user_data, regenerate_latex_with_optimization
    
    if not st.session_state.current_user_id:
        st.error("Please select a user first!")
        return
    
    user_api_key = st.session_state.get('user_api_key', '')
    openai_client = OpenAIClient(api_key=user_api_key)
    
    try:
        if openai_client.is_available():
            with st.spinner("🤖 AI is optimizing your resume for this job..."):
                # Analyze job posting
                job_analysis = openai_client.analyze_job_posting(job_description)
                
                # Gather user data
                user_data = gather_user_data()
                
                # Select best projects
                projects = user_data.get('projects', [])
                if projects:
                    selected_projects = openai_client.select_best_projects(projects, job_description, max_projects=3)
                    st.session_state.optimized_projects = selected_projects
                
                # Generate optimized professional summary
                summary = openai_client.generate_professional_summary(user_data, job_description)
                if summary:
                    st.session_state.ai_generated_summary = summary
                    
                    # Update LaTeX with optimized content
                    regenerate_latex_with_optimization()
                    
                    st.success("🎯 Resume optimized for the job posting!")
                    st.info("Switch to LaTeX Editor tab to see the optimized resume.")
        else:
            st.error("AI service not available. Please check your OpenAI API key.")
            
    except Exception as e:
        st.error(f"Error optimizing resume: {e}")

def main():
    """Main application function"""
    initialize_session_state()
    
    # Get OpenAI API key from .env file (no user input required)
    user_api_key = get_user_api_key()
    
    # Store in session state for use throughout the app
    st.session_state.user_api_key = user_api_key
    
    # Header
    st.markdown("<h1 class='main-header'>AI-Powered CV Resume Builder</h1>", unsafe_allow_html=True)
    
    # Check database connection
    if not check_database_connection():
        st.stop()
    
    # Check for OpenAI API key - now handled by user input
    # if not settings.is_openai_available:
    #     st.warning("OpenAI API key not found in settings. Please add it to your .env file for AI features.")
    
    # Initialize active tab in session state
    if 'active_main_tab' not in st.session_state:
        st.session_state.active_main_tab = 'details'
    
    # Left sidebar with horizontal tab navigation
    with st.sidebar:
        st.markdown("<h2 class='section-header'>Resume Builder</h2>", unsafe_allow_html=True)

        # Settings at the top for visibility
        st.markdown("### ⚙️ Settings")

        # Multi-page toggle
        multi_page_enabled = st.checkbox(
            "📄 Enable Multi-page Resume",
            value=not st.session_state.get('enforce_one_page_limit', True),
            key="top_multi_page_toggle",
            help="Check this to allow multi-page comprehensive resumes"
        )

        # Update session state
        st.session_state.enforce_one_page_limit = not multi_page_enabled

        if multi_page_enabled:
            st.success("Multi-page mode ON")
        else:
            st.info("Single-page mode ON")

        st.markdown("---")

        # Tab selection buttons - stacked horizontally (one below the other)
        st.markdown('<div class="sidebar-nav-tabs">', unsafe_allow_html=True)

        # Details tab
        details_style = "nav-tab-active" if st.session_state.active_main_tab == 'details' else "nav-tab-inactive"
        if st.button("Details", key="details_tab", use_container_width=True):
            st.session_state.active_main_tab = 'details'
            st.rerun()

        # Visual Builder tab
        visual_style = "nav-tab-active" if st.session_state.active_main_tab == 'visual' else "nav-tab-inactive"
        if st.button("Visual Builder", key="visual_tab", use_container_width=True):
            st.session_state.active_main_tab = 'visual'
            st.rerun()

        # LaTeX Editor tab
        latex_style = "nav-tab-active" if st.session_state.active_main_tab == 'latex' else "nav-tab-inactive"
        if st.button("LaTeX Editor", key="latex_tab", use_container_width=True):
            st.session_state.active_main_tab = 'latex'
            st.rerun()

        st.markdown('</div>', unsafe_allow_html=True)

        # Resume Settings in the same navigation area
        st.markdown("---")
        st.markdown("### ⚙️ Settings")

        # One-page limit toggle
        enforce_one_page = st.checkbox(
            "📄 Multi-page Resume",
            value=not st.session_state.get('enforce_one_page_limit', True),
            key="nav_multi_page_toggle",
            help="Enable for multi-page comprehensive resumes"
        )

        # Update session state (invert because checkbox is for multi-page)
        st.session_state.enforce_one_page_limit = not enforce_one_page

        # Template style
        template_style = st.selectbox(
            "Template",
            ["arpan", "simple"],
            key="template_style",
            index=0 if st.session_state.get('template_style', 'arpan') == 'arpan' else 1
        )
        # Don't set session state here - the widget already handles it

        st.markdown("---")

    # Main content area - changes based on active tab
    if st.session_state.active_main_tab == 'details':
        # Show data entry forms
        st.markdown("<h2 class='resume-details-header'>📋 Resume Details</h2>", unsafe_allow_html=True)
        
        # Import and render the tabbed sidebar component
        from components.tabbed_sidebar import render_tabbed_sidebar
        render_tabbed_sidebar()
        
    elif st.session_state.active_main_tab == 'visual':
        # Show visual resume builder
        st.markdown("<h2 class='visual-builder-header'>🎨 Visual Resume Builder</h2>", unsafe_allow_html=True)
        render_visual_builder_tab()
        
    elif st.session_state.active_main_tab == 'latex':
        # Show LaTeX editor
        st.markdown("<h2 class='latex-editor-header'>📝 LaTeX Editor</h2>", unsafe_allow_html=True)
        
        # Import and render LaTeX editor
        from components.latex_editor import render_latex_editor
        latex_changed = render_latex_editor()
        
        # Force PDF preview update if LaTeX changed
        from components.pdf_preview import render_pdf_preview
        if latex_changed:
            render_pdf_preview(force_update=True)
    
    # Footer
    st.markdown("---")
    st.markdown("*Built with Streamlit, PostgreSQL, and AI*")

if __name__ == "__main__":
    main()