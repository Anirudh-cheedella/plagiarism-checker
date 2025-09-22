document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('plagiarismForm');
    const doc1Input = document.getElementById('doc1');
    const doc2Input = document.getElementById('doc2');
    const submitBtn = document.getElementById('submitBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsSection = document.getElementById('resultsSection');
    const summaryDiv = document.getElementById('summary');
    const doc1ContentDiv = document.getElementById('doc1Content');
    const doc2ContentDiv = document.getElementById('doc2Content');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        resultsSection.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        doc1ContentDiv.innerHTML = '';
        doc2ContentDiv.innerHTML = '';
        summaryDiv.innerHTML = '';

        const doc1File = doc1Input.files[0];
        const doc2File = doc2Input.files[0];
        if (!doc1File || !doc2File) return alert('Please upload both documents.');

        Promise.all([readTextFile(doc1File), readTextFile(doc2File)])
            .then(([doc1Text, doc2Text]) => checkPlagiarism(doc1Text, doc2Text));
    });

    function readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e.target.error);
            reader.readAsText(file);
        });
    }

    function checkPlagiarism(text1, text2) {
        // --- Normalize and tokenize
        const tokenize = text => text
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .split(/\s+/)
            .filter(Boolean);
    
        const words1 = tokenize(text1);
        const words2 = tokenize(text2);
    
        // --- Auto-adjust k
        let k = Math.min(5, words1.length, words2.length);
        if (k < 1) return displayResults(text1, text2, [], [], 0);
    
        // --- Track start indices of each word in original text
        const indices1 = [];
        let pos = 0;
        for (let i = 0; i < words1.length; i++) {
            indices1.push(pos);
            pos += words1[i].length + 1;
        }
    
        const indices2 = [];
        pos = 0;
        for (let i = 0; i < words2.length; i++) {
            indices2.push(pos);
            pos += words2[i].length + 1;
        }
    
        // --- Compare all k-grams
        const matches = [];
        for (let i = 0; i <= words1.length - k; i++) {
            const phrase1 = words1.slice(i, i + k).join(' ');
            for (let j = 0; j <= words2.length - k; j++) {
                const phrase2 = words2.slice(j, j + k).join(' ');
                if (phrase1 === phrase2) {
                    matches.push({
                        doc1Start: indices1[i],
                        doc1End: indices1[i + k - 1] + words1[i + k - 1].length,
                        doc2Start: indices2[j],
                        doc2End: indices2[j + k - 1] + words2[j + k - 1].length
                    });
                }
            }
        }
    
        // --- Merge overlapping matches
        const mergedMatches1 = mergeIntervals(matches.map(m => ({ start: m.doc1Start, end: m.doc1End })));
        const mergedMatches2 = mergeIntervals(matches.map(m => ({ start: m.doc2Start, end: m.doc2End })));
    
        // --- Calculate similarity percentages
        const similarity1 = mergedMatches1.reduce((sum, m) => sum + (m.end - m.start), 0) / text1.length * 100;
        const similarity2 = mergedMatches2.reduce((sum, m) => sum + (m.end - m.start), 0) / text2.length * 100;
    
        // --- Display results
        displayResults(text1, text2, mergedMatches1, mergedMatches2, ((similarity1 + similarity2) / 2).toFixed(2));
    }
    
    // Function to merge overlapping intervals
    function mergeIntervals(intervals) {
        if (!intervals.length) return [];
        intervals.sort((a, b) => a.start - b.start);
        const merged = [intervals[0]];
        for (let i = 1; i < intervals.length; i++) {
            const last = merged[merged.length - 1], curr = intervals[i];
            if (curr.start <= last.end) last.end = Math.max(last.end, curr.end);
            else merged.push(curr);
        }
        return merged;
    }

    function displayResults(text1, text2, matches1, matches2, similarity) {
        loadingIndicator.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        summaryDiv.textContent = `Overall Similarity: ${similarity}%`;
        doc1ContentDiv.innerHTML = highlightText(text1, matches1);
        doc2ContentDiv.innerHTML = highlightText(text2, matches2);
    }

    function highlightText(text, matches) {
        let html = '', currentIndex = 0;
        matches.forEach(match => {
            html += text.substring(currentIndex, match.start);
            html += `<span class="plagiarism-highlight">${text.substring(match.start, match.end)}</span>`;
            currentIndex = match.end;
        });
        html += text.substring(currentIndex);
        return html;
    }

    // --- Animated Background ---
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    const numDots = 100, maxDistance = 150;
    const dots = [];

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function createDots() {
        for (let i = 0; i < numDots; i++) dots.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 1, vy: (Math.random() - 0.5) * 1, radius: 2 });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < numDots; i++) {
            const d1 = dots[i];
            ctx.beginPath();
            ctx.fillStyle = "#00ffe5"; // cyan dots
            ctx.shadowColor = "#ff00aa"; // magenta glow
            ctx.shadowBlur = 12;
            ctx.arc(d1.x, d1.y, d1.radius + 1, 0, Math.PI * 2);
            ctx.fill();
    
            // Lines between nearby dots
            for (let j = i + 1; j < numDots; j++) {
                const d2 = dots[j],
                      dx = d1.x - d2.x,
                      dy = d1.y - d2.y,
                      d = Math.sqrt(dx * dx + dy * dy);
                if (d < maxDistance) {
                    ctx.strokeStyle = `rgba(0, 255, 229, ${1 - d / maxDistance})`; // soft cyan lines
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(d1.x, d1.y);
                    ctx.lineTo(d2.x, d2.y);
                    ctx.stroke();
                }
            }
        }
        ctx.shadowBlur = 0; // reset glow
    }
    
    
    function update() {
        dots.forEach(dot => {
            dot.x += dot.vx; dot.y += dot.vy;
            if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
            if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
        });
    }
    function animate() { update(); draw(); requestAnimationFrame(animate); }

    window.onload = function () { resizeCanvas(); createDots(); animate(); }
    window.addEventListener('resize', resizeCanvas);
});
