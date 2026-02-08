document.addEventListener('DOMContentLoaded', () => {
    const ipInput = document.getElementById('ipInput');
    const cidrInput = document.getElementById('cidrInput');

    
    for (let i = 1; i <= 32; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        if (i === 24) opt.selected = true;
        cidrInput.appendChild(opt);
    }

    
    ipInput.addEventListener('input', calculate);
    cidrInput.addEventListener('change', calculate);

    
    calculate();

    function calculate() {
        const ipStr = ipInput.value.trim();
        const cidr = parseInt(cidrInput.value);

        
        const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipPattern.test(ipStr)) {
            document.getElementById('resNet').innerText = "Invalid IP";
            return;
        }

        
        const ipLong = ipToLong(ipStr);
        const maskLong = -1 << (32 - cidr);
        
        const netLong = (ipLong & maskLong) >>> 0;
        const broadLong = (netLong | (~maskLong)) >>> 0;

        const firstHost = (netLong + 1) >>> 0;
        const lastHost = (broadLong - 1) >>> 0;
        
        
        let totalHosts = Math.pow(2, 32 - cidr) - 2;
        if (totalHosts < 0) totalHosts = 0;

        
        updateUI('resNet', netLong);
        updateUI('resBroad', broadLong);
        updateUI('resMask', maskLong);
        
        document.getElementById('resRange').innerText = 
            longToIp(firstHost) + " - " + longToIp(lastHost);
        document.getElementById('resCount').innerText = totalHosts.toLocaleString();

        
        document.getElementById('vizIP').innerText = toBinaryString(ipLong);
        document.getElementById('vizMask').innerText = toBinaryString(maskLong);
        document.getElementById('vizNet').innerText = toBinaryString(netLong);
    }

    function updateUI(id, longVal) {
        document.getElementById(id).innerText = longToIp(longVal);
        document.getElementById(id + 'Bin').innerText = toBinaryString(longVal);
    }

    
    function ipToLong(ip) {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
    }

    function longToIp(long) {
        return [
            (long >>> 24) & 0xFF,
            (long >>> 16) & 0xFF,
            (long >>> 8) & 0xFF,
            long & 0xFF
        ].join('.');
    }

    function toBinaryString(long) {
        let bin = (long >>> 0).toString(2).padStart(32, '0');
        
        return bin.replace(/(.{8})/g, '$1.').slice(0, -1);
    }
});
