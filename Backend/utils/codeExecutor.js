import axios from 'axios';

const PISTON_API_URL = 'https://emscripten.org/api/v2/execute';
// Using a stable public Piston instances if emscripten fails
const FALLBACK_API_URL = 'https://piston.piston.rs/api/v2/execute';

// Language configuration mapping to Piston versions
const LANGUAGE_CONFIG = {
    'javascript': { language: 'javascript', version: '18.15.0' },
    'python': { language: 'python', version: '3.10.0' },
    'cpp': { language: 'c++', version: '10.2.0' },
    'java': { language: 'java', version: '15.0.2' }
};

/**
 * Executes source code against multiple test cases using the Piston API
 * @param {string} language - The programming language (e.g., 'javascript', 'python')
 * @param {string} sourceCode - The user's code to run
 * @param {Array} testCases - Array of objects with `input` and `expectedOutput`
 * @returns {Object} Evaluation report containing pass/fail stats and individual test results
 */
export const executeCode = async (language, sourceCode, testCases) => {
    const config = LANGUAGE_CONFIG[language.toLowerCase()];
    if (!config) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const results = [];
    let passedCount = 0;
    let totalTime = 0;

    for (const testCase of testCases) {
        try {
            // Piston API allows standard input to be sent
            const payload = {
                language: config.language,
                version: config.version,
                files: [
                    {
                        content: sourceCode
                    }
                ],
                stdin: testCase.input,
                compile_timeout: 10000,
                run_timeout: 3000,
            };

            let response;
            try {
                response = await axios.post(FALLBACK_API_URL, payload);
            } catch (err) {
                console.warn('Fallback Piston API failed, trying secondary...');
                response = await axios.post(PISTON_API_URL, payload);
            }

            const { run, compile } = response.data;

            // Handle compilation errors (e.g. C++)
            if (compile && compile.code !== 0) {
                return {
                    success: false,
                    errorType: 'Compilation Flow',
                    error: compile.stderr || compile.output,
                };
            }

            // Handle runtime errors
            if (run.code !== 0 && run.stderr) {
                results.push({
                    passed: false,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: run.stderr,
                    error: true
                });
                continue;
            }

            // Clean output by trimming trailing newlines
            const actualOutput = run.stdout ? run.stdout.trim() : '';
            const expectedOutput = testCase.expectedOutput ? testCase.expectedOutput.trim() : '';

            const passed = actualOutput === expectedOutput;
            if (passed) passedCount++;

            results.push({
                passed,
                input: testCase.input,
                expectedOutput,
                actualOutput,
                time: run.time
            });

            // Rough approximation of total execution time
            // Note: run.time from piston is often a string or missing, we handle it defensively
            if (run.time && typeof run.time === 'number') {
                totalTime += run.time;
            }

        } catch (error) {
            console.error('Code Execution Error:', error);
            throw new Error('Failed to execute code via Code Engine');
        }
    }

    return {
        success: true,
        passedCases: passedCount,
        totalCases: testCases.length,
        allPassed: passedCount === testCases.length,
        totalTimeMs: totalTime,
        results
    };
};
