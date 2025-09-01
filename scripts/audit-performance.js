#!/usr/bin/env node

/**
 * Performance Audit Script for Raizel
 * Uses Lighthouse CI to audit performance, accessibility, best practices, and SEO
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  urls: [
    'http://localhost:3000',
    'http://localhost:3000/landing',
    'http://localhost:3000/feed'
  ],
  thresholds: {
    performance: 90,
    accessibility: 90,
    'best-practices': 90,
    seo: 90
  },
  outputDir: './lighthouse-reports',
  budget: {
    'first-contentful-paint': 2000,
    'largest-contentful-paint': 4000,
    'cumulative-layout-shift': 0.1,
    'total-blocking-time': 300
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

console.log('🚀 Starting Performance Audit...\n');

// Install lighthouse-ci if not available
try {
  execSync('npx lhci --version', { stdio: 'ignore' });
} catch (error) {
  console.log('📦 Installing Lighthouse CI...');
  execSync('npm install -g @lhci/cli', { stdio: 'inherit' });
}

// Create Lighthouse CI configuration
const lhciConfig = {
  ci: {
    collect: {
      url: config.urls,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: config.thresholds.performance / 100 }],
        'categories:accessibility': ['error', { minScore: config.thresholds.accessibility / 100 }],
        'categories:best-practices': ['error', { minScore: config.thresholds['best-practices'] / 100 }],
        'categories:seo': ['error', { minScore: config.thresholds.seo / 100 }],
        'first-contentful-paint': ['error', { maxNumericValue: config.budget['first-contentful-paint'] }],
        'largest-contentful-paint': ['error', { maxNumericValue: config.budget['largest-contentful-paint'] }],
        'cumulative-layout-shift': ['error', { maxNumericValue: config.budget['cumulative-layout-shift'] }],
        'total-blocking-time': ['error', { maxNumericValue: config.budget['total-blocking-time'] }]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: config.outputDir
    }
  }
};

// Write configuration file
fs.writeFileSync(
  path.join(process.cwd(), 'lighthouserc.json'),
  JSON.stringify(lhciConfig, null, 2)
);

// Run Lighthouse CI
try {
  console.log('🔍 Running Lighthouse CI...');
  execSync('npx lhci autorun', { stdio: 'inherit' });
  
  console.log('\n✅ Performance audit completed successfully!');
  console.log(`📊 Reports saved to: ${config.outputDir}`);
  
  // Generate summary report
  generateSummaryReport();
  
} catch (error) {
  console.error('\n❌ Performance audit failed!');
  console.error('Error:', error.message);
  process.exit(1);
}

function generateSummaryReport() {
  const reportPath = path.join(config.outputDir, 'manifest.json');
  
  if (fs.existsSync(reportPath)) {
    const manifest = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    console.log('\n📈 Performance Summary:');
    console.log('========================');
    
    manifest.forEach((run, index) => {
      const url = config.urls[index] || 'Unknown URL';
      console.log(`\n🌐 ${url}`);
      
      if (run.summary) {
        const { performance, accessibility, 'best-practices': bestPractices, seo } = run.summary;
        
        console.log(`   Performance: ${Math.round(performance * 100)}% ${getScoreEmoji(performance)}`);
        console.log(`   Accessibility: ${Math.round(accessibility * 100)}% ${getScoreEmoji(accessibility)}`);
        console.log(`   Best Practices: ${Math.round(bestPractices * 100)}% ${getScoreEmoji(bestPractices)}`);
        console.log(`   SEO: ${Math.round(seo * 100)}% ${getScoreEmoji(seo)}`);
      }
    });
    
    // Generate HTML report
    generateHTMLReport(manifest);
  }
}

function getScoreEmoji(score) {
  if (score >= 0.9) return '🟢';
  if (score >= 0.7) return '🟡';
  return '🔴';
}

function generateHTMLReport(manifest) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raizel Performance Report</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
            background: #FBFDFF;
            color: #1F2937;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .header h1 {
            color: #0F6FF6;
            margin-bottom: 0.5rem;
        }
        .score-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        .score-card {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            border: 1px solid #E6EEF7;
        }
        .score-card h3 {
            margin-top: 0;
            color: #0B1220;
        }
        .metrics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1rem;
        }
        .metric {
            text-align: center;
            padding: 1rem;
            background: #F5F9FF;
            border-radius: 12px;
        }
        .metric-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #0F6FF6;
        }
        .metric-label {
            font-size: 0.875rem;
            color: #6B7280;
            margin-top: 0.25rem;
        }
        .score-emoji {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        .footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #E6EEF7;
            color: #6B7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Raizel Performance Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="score-grid">
            ${manifest.map((run, index) => {
              const url = config.urls[index] || 'Unknown URL';
              const { performance, accessibility, 'best-practices': bestPractices, seo } = run.summary || {};
              
              return `
                <div class="score-card">
                    <h3>${url}</h3>
                    <div class="score-emoji">${getScoreEmoji(performance)}</div>
                    <div class="metrics">
                        <div class="metric">
                            <div class="metric-value">${Math.round(performance * 100)}%</div>
                            <div class="metric-label">Performance</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${Math.round(accessibility * 100)}%</div>
                            <div class="metric-label">Accessibility</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${Math.round(bestPractices * 100)}%</div>
                            <div class="metric-label">Best Practices</div>
                        </div>
                        <div class="metric">
                            <div class="metric-value">${Math.round(seo * 100)}%</div>
                            <div class="metric-label">SEO</div>
                        </div>
                    </div>
                </div>
              `;
            }).join('')}
        </div>
        
        <div class="footer">
            <p>Performance thresholds: Performance ≥ ${config.thresholds.performance}%, Accessibility ≥ ${config.thresholds.accessibility}%, Best Practices ≥ ${config.thresholds['best-practices']}%, SEO ≥ ${config.thresholds.seo}%</p>
        </div>
    </div>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(config.outputDir, 'summary.html'), html);
  console.log(`📄 HTML report generated: ${config.outputDir}/summary.html`);
}
