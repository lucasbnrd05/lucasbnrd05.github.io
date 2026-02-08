document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['min', 'hour', 'dom', 'mon', 'dow'].map(id => document.getElementById(id));
    const readableText = document.getElementById('readableText');
    const resultString = document.getElementById('resultString');

    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; 
    const months = [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    
    inputs.forEach(input => input.addEventListener('input', updateCron));

    
    resultString.addEventListener('click', () => {
        navigator.clipboard.writeText(resultString.innerText);
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

    function describeCron(parts) {
        const [min, hour, dom, mon, dow] = parts;

        let desc = "At ";

        
        if (min === "*" && hour === "*") {
            desc += "every minute";
        } else if (min.includes("*/")) {
            desc += `every ${min.replace("*/", "")}th minute`;
        } else if (min !== "*" && hour === "*") {
            desc += `minute ${min} past every hour`;
        } else if (min === "0" && hour !== "*") {
            desc += `hour ${hour}:00`;
        } else if (min !== "*" && hour !== "*") {
            desc += `${hour}:${min.padStart(2, '0')}`;
        } else {
            desc += `${hour}:${min}`;
        }

        
        if (dom !== "*" && mon !== "*") {
            desc += ` on day ${dom} of ${getMonthName(mon)}`;
        } else if (dom !== "*") {
            desc += ` on day ${dom} of every month`;
        } else if (mon !== "*") {
            desc += ` in ${getMonthName(mon)}`;
        }

        
        if (dow !== "*") {
            desc += ` on ${getDayName(dow)}`;
        }

        return desc + ".";
    }

    function getMonthName(val) {
        if (!isNaN(val)) return months[parseInt(val)] || val;
        return val;
    }

    function getDayName(val) {
        if (!isNaN(val)) return days[parseInt(val)] || val;
        return val;
    }
});
