document.addEventListener('DOMContentLoaded', () => {
    
    const btn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('outputArea');
    
    
    const tagCauseSelect = document.getElementById('tagCause');
    const tagCauseCustom = document.getElementById('tagCauseCustom');

    
    const outSubject = document.getElementById('outSubject');
    const outBody = document.getElementById('outBody');
    
    const copySubjectBtn = document.getElementById('copySubjectBtn');
    const copyBodyBtn = document.getElementById('copyBodyBtn');

    

    
    tagCauseSelect.addEventListener('change', () => {
        if (tagCauseSelect.value === 'OTHER') {
            tagCauseCustom.style.display = 'block';
            tagCauseCustom.focus();
        } else {
            tagCauseCustom.style.display = 'none';
        }
    });

    
    btn.addEventListener('click', generateMail);

    
    copySubjectBtn.addEventListener('click', () => copyToClipboard(outSubject, copySubjectBtn));
    copyBodyBtn.addEventListener('click', () => copyToClipboard(outBody, copyBodyBtn));


    

    function generateMail() {
        
        let tag1 = document.getElementById('tagContext').value.trim().toUpperCase() || "PROJET";
        
        let tag2 = "";
        if (tagCauseSelect.value === 'OTHER') {
            tag2 = tagCauseCustom.value.trim().toUpperCase() || "TAG";
        } else {
            tag2 = tagCauseSelect.value;
        }

        const topic = document.getElementById('mailTopic').value || "No Subject";
        const rawBody = document.getElementById('mailBody').value;
        const name = document.getElementById('sigName').value || "Student";
        const login = document.getElementById('sigLogin').value || "login";

        
        tag1 = tag1.replace(/[\[\]]/g, "");
        tag2 = tag2.replace(/[\[\]]/g, "");

        
        const cleanTopic = removeAccents(topic);
        const subjectLine = `[${tag1}][${tag2}] ${cleanTopic}`;

        
        const formattedText = formatBodyText(rawBody);
        
        
        
        
        const signature = `\n\n-- \n${name}\n${login}`;
        
        const finalBody = `${formattedText}${signature}`;

        
        outSubject.value = subjectLine;
        outBody.value = finalBody;

        
        outputArea.style.display = 'block';
        outputArea.scrollIntoView({ behavior: 'smooth' });
    }

    
    function formatBodyText(text) {
        
        text = text.replace(/Cordialement,?/gi, "Regards,");
        text = text.replace(/Sincerely,?/gi, "Regards,");

        
        const paragraphs = text.split(/\n\s*\n/);
        let result = "";

        paragraphs.forEach((para, index) => {
            
            const words = para.replace(/\n/g, " ").split(/\s+/);
            let currentLine = "";

            words.forEach(word => {
                
                if (currentLine.length === 0) {
                    currentLine = word;
                } 
                
                else if ((currentLine.length + 1 + word.length) > 72) {
                    result += currentLine + "\n"; 
                    currentLine = word;           
                } 
                else {
                    currentLine += " " + word;
                }
            });
            
            result += currentLine;
            
            if (index < paragraphs.length - 1) {
                result += "\n\n";
            }
        });

        return result;
    }

    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    
    function copyToClipboard(element, button) {
        element.select();
        document.execCommand('copy');
        const originalText = button.textContent;
        button.textContent = "Copied!";
        button.style.background = "#1b5e20"; 
        button.style.color = "white";
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = "#2e7d32";
        }, 1500);
    }
});
