# AI-Powered CV Resume Builder

This project is an AI-powered CV and resume builder that helps you create professional, ATS-optimized resumes in minutes.

## Features

- **AI-Powered Optimization**: Tailored content for every job application.
- **Real-Time Preview**: See changes instantly with live LaTeX compilation.
- **Professional Templates**: Industry-standard designs that impress recruiters.
- **ATS-Optimized**: Built to pass Applicant Tracking Systems.
- **PostgreSQL Storage**: Secure, reliable data persistence.
- **Multi-User Support**: Individual profiles and configurations.
- **Export Options**: PDF and LaTeX source downloads.

## Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/thearpankumar/Agentic-CV-Resume-Builder.git
    cd Agentic-CV-Resume-Builder
    ```
2.  **Set up the environment:**
    ```bash
    cp .env.example .env
    ```
    Add your OpenAI API key to the `.env` file.
3.  **Start the database:**
    ```bash
    docker-compose up -d
    ```
4.  **Install dependencies and launch the application:**
    ```bash
    pip install -r requirements.txt
    python3 -m streamlit run app/main.py
    ```
    Open `http://localhost:8501` in your browser.

## Installation

### Prerequisites

- Python 3.11+
- Docker
- LaTeX (TeX Live or MiKTeX)
- OpenAI API Key

### Detailed Setup

**Linux/Ubuntu:**
```bash
# Install LaTeX
sudo apt-get update
sudo apt-get install texlive-full

# Install dependencies
pip install -r requirements.txt

# Start database and run
docker-compose up -d
python3 -m streamlit run app/main.py
```

**macOS:**
```bash
# Install LaTeX
brew install mactex

# Install dependencies
pip install -r requirements.txt

# Start database and run
docker-compose up -d
python3 -m streamlit run app/main.py
```

**Windows:**
```powershell
# Install LaTeX - Download MiKTeX from https://miktex.org/

# Install dependencies
pip install -r requirements.txt

# Start database and run
docker-compose up -d
python3 -m streamlit run app/main.py
```

## Contributing

Contributions are welcome! Please see the [contributing guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.