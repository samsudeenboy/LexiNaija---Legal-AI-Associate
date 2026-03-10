

# LexiNaija - Legal AI Associate

A comprehensive AI-powered legal practice management suite designed specifically for Nigerian legal practitioners. LexiNaija combines advanced AI capabilities with deep knowledge of Nigerian law to provide intelligent legal assistance, document drafting, case management, and strategic advisory services.

## 🚀 Features

- **Case Strategy Advisor**: Generate SWOT analyses and litigation strategies with Nigerian legal context
- **Document Drafting**: AI-powered contract and legal document drafting compliant with Nigerian laws
- **Legal Research**: Advanced research capabilities with citations to Nigerian statutes and case law
- **Evidence Management**: Automated frontloading lists and witness statement analysis
- **Billing & Invoicing**: Professional fee note generation with Nigerian legal billing terminology
- **Corporate Compliance**: CAMA 2020 compliance advice and corporate document drafting
- **Practice Management**: Docket management, client tracking, and conflict checking

## 🏛️ Nigerian Legal Framework Integration

LexiNaija is specifically trained on:
- The Constitution of the Federal Republic of Nigeria 1999 (as amended)
- The Companies and Allied Matters Act (CAMA) 2020
- The Evidence Act 2011
- Land Use Act
- Key Supreme Court of Nigeria judgments
- Criminal Code and Penal Code
- Legal Practitioners (Remuneration for Legal Documentation and Other Land Matters) Order

## 🛠️ Installation & Setup

**Prerequisites:** Node.js 18+ 

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment configuration:
   ```bash
   cp .env.example .env.local
   ```
   
3. Configure your Gemini API key in `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Set environment variable: `GEMINI_API_KEY`
4. Deploy!

### Manual Deployment

```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### Core Features

#### 1. Legal Research
- Input your legal query
- Receive comprehensive analysis with Nigerian legal citations
- Get recommendations based on current laws and precedents

#### 2. Document Drafting
- Choose document type (contract, agreement, etc.)
- Fill in party details and key terms
- Generate professionally formatted legal documents

#### 3. Case Strategy
- Input case facts and your role
- Get SWOT analysis and strategic recommendations
- Receive litigation plans with Nigerian legal context

#### 4. Evidence Management
- Upload case documents
- Generate frontloading lists
- Analyze witness statements for cross-examination

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Customization

The app uses a professional legal theme with:
- Nigerian legal color scheme (navy blue and gold)
- Professional typography (Merriweather serif for legal documents)
- Responsive design for desktop and mobile

## 📝 Legal Disclaimer

This application is designed to assist legal practitioners but does not constitute legal advice. Always verify AI-generated content and consult relevant statutes and case law. The developers are not responsible for any legal decisions made based on the application's output.

## 🤝 Contributing

We welcome contributions from the Nigerian legal tech community. Please ensure all contributions maintain the app's focus on Nigerian legal framework and professional standards.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies (React, TypeScript, Vite)
- Powered by Google's Gemini AI for legal intelligence
- Designed specifically for the Nigerian legal system
