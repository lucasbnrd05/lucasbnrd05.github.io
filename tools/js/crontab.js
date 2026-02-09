document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['min', 'hour', 'dom', 'mon', 'dow'].map(id => document.getElementById(id));
    const readableText = document.getElementById('readableText');
    const resultString = document.getElementById('resultString');

    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; 
    const months = [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    inputs.forEach(input => input.addEventListener('input', updateCron));

    
    resultString.addEventListener('click', () => {
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(resultString.innerText);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = resultString.innerText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }

        const original = resultString.style.background;
        resultString.style.background = "#27ae60";
        resultString.innerText = "COPIED!";
        setTimeout(() => {
            resultString.style.background = original;
            updateCron(); 
        }, 1000);
    });

    window.setCron = function(str) {
        const parts = str.split(' ');
        if(parts.length === 5) {
            inputs.forEach((input, i) => input.value = parts[i]);
            updateCron();
        }
    };

    updateCron();

    function updateCron() {
        
        const vals = inputs.map(i => i.value.trim() || "*");
        const str = vals.join(' ');
        resultString.innerText = str;
        
        readableText.innerText = `“${describeCron(vals)}”`;
    }

    

    
    function formatList(value, mappingArray) {
        if (value === "*" || value === "") return "*";
        
        
        const parts = value.split(',').map(v => v.trim());

        
        const translatedParts = parts.map(part => {
            
            if (mappingArray && !isNaN(part)) {
                const index = parseInt(part);
                
                return mappingArray[index] !== undefined ? mappingArray[index] : part;
            }
            return part;
        });

        
        return translatedParts.join(', ');
    }

    function describeCron(parts) {
        const [min, hour, dom, mon, dow] = parts;
        let desc = "At ";

        
        
        if (min === "*" && hour === "*") {
            desc += "every minute";
        } 
        
        else if (min.includes("/")) {
            desc += `every ${min.replace("*/", "")} minute(s)`;
            if (hour !== "*") desc += ` past hour ${hour}`;
        }
        
        else {
            const hDisplay = (hour === "*") ? "every hour" : hour;
            const mDisplay = (min === "*") ? "every minute" : min;
            
            if (min === "0" && hour !== "*") {
                desc += `hour ${hour}:00`;
            } else {
                desc += `${hDisplay}:${mDisplay.padStart(2, '0')}`;
            }
        }

        
        if (dom !== "*") {
            desc += ` on day ${dom}`;
            if (mon === "*") desc += " of every month";
        }

        
        if (mon !== "*") {
            desc += ` in ${formatList(mon, months)}`;
        }

        
        if (dow !== "*") {
            desc += ` on ${formatList(dow, days)}`;
        }

        return desc + ".";
    }
});
