document.addEventListener('DOMContentLoaded', () => {
    
    const valA = document.getElementById('valA');
    const valB = document.getElementById('valB');
    const operator = document.getElementById('operator');
    
    const containerA = document.getElementById('bitsA');
    const containerB = document.getElementById('bitsB');
    const containerRes = document.getElementById('bitsRes');

    const dispA = document.getElementById('dispA');
    const dispB = document.getElementById('dispB');
    const dispRes = document.getElementById('dispRes');

    
    const flagN = document.getElementById('flagN');
    const flagZ = document.getElementById('flagZ');
    const flagC = document.getElementById('flagC');
    const flagV = document.getElementById('flagV');

    
    const floatInput = document.getElementById('floatInput');
    const hexFloatInput = document.getElementById('hexFloatInput');
    const containerIEEE = document.getElementById('bitsIEEE');
    const ieeeCalc = document.getElementById('ieeeCalc');

    
    renderBits(containerA, 'A');
    renderBits(containerB, 'B');
    renderBits(containerRes, 'Res', true);
    
    valA.addEventListener('input', updateBitwise);
    valB.addEventListener('input', updateBitwise);
    operator.addEventListener('change', updateBitwise);
    
    
    renderIEEEBits(containerIEEE);
    floatInput.addEventListener('input', updateFromFloat);
    
    
    updateBitwise();
    updateFromFloat();

    
    
    

    function toggleBitwise(source, index) {
        const input = source === 'A' ? valA : valB;
        let currentVal = parseInput(input.value);
        currentVal ^= (1 << index);
        input.value = (currentVal >>> 0).toString();
        updateBitwise();
    }

    function updateBitwise() {
        const a = parseInput(valA.value); 
        const b = parseInput(valB.value);
        const op = operator.value;
        let res = 0;

        
        let n = false, z = false, c = false, v = false;

        switch(op) {
            case 'AND': res = a & b; break;
            case 'OR':  res = a | b; break;
            case 'XOR': res = a ^ b; break;
            case 'LSHIFT': 
                res = a << b; 
                
                
                if (b > 0 && b <= 32) c = ((a >>> (32 - b)) & 1) === 1;
                break;
            case 'RSHIFT': 
                res = a >>> b; 
                if (b > 0 && b <= 32) c = ((a >>> (b - 1)) & 1) === 1;
                break;
            case 'ADD': 
                res = (a + b) | 0; 
                
                const unsignedSum = (a >>> 0) + (b >>> 0);
                c = unsignedSum > 0xFFFFFFFF;
                
                
                v = ((a ^ res) & (b ^ res) & 0x80000000) !== 0;
                break;
            case 'SUB': 
                res = (a - b) | 0;
                
                c = (b >>> 0) > (a >>> 0);
                
                
                v = ((a ^ b) & (a ^ res) & 0x80000000) !== 0;
                break;
        }

        
        z = (res === 0);
        n = (res < 0); 

        
        updateDisplay(containerA, a);
        updateDisplay(containerB, b);
        updateDisplay(containerRes, res);
        
        dispA.innerText = formatLabel(a);
        dispB.innerText = formatLabel(b);
        dispRes.innerText = formatLabel(res);

        
        setFlag(flagN, n);
        setFlag(flagZ, z);
        setFlag(flagC, c);
        setFlag(flagV, v);
    }

    function setFlag(el, active) {
        if (active) el.classList.add('active');
        else el.classList.remove('active');
    }

    function updateDisplay(container, value) {
        container.querySelectorAll('.bit').forEach(bit => {
            const idx = parseInt(bit.dataset.index);
            const isOn = (value & (1 << idx)) !== 0;
            bit.classList.toggle('on', isOn);
            bit.innerText = isOn ? '1' : '0';
        });
    }

    
    
    
    function renderIEEEBits(container) {
        container.innerHTML = '';
        for (let i = 31; i >= 0; i--) {
            const bit = document.createElement('div');
            let typeClass = '';
            if (i === 31) typeClass = 'bit-sign'; 
            else if (i >= 23) typeClass = 'bit-exp'; 
            else typeClass = 'bit-mant'; 

            bit.className = `bit ${typeClass}`;
            bit.dataset.index = i;
            bit.innerText = '0';
            if (i === 31 || i === 23) bit.style.marginRight = "10px";
            bit.addEventListener('click', () => toggleIEEE(i));
            container.appendChild(bit);
        }
    }

    function toggleIEEE(index) {
        const currentFloat = parseFloat(floatInput.value) || 0;
        const view = new DataView(new ArrayBuffer(4));
        view.setFloat32(0, currentFloat);
        let asInt = view.getUint32(0);
        
        
        
        asInt = (asInt ^ (1 << index)) >>> 0; 

        view.setUint32(0, asInt);
        floatInput.value = view.getFloat32(0);
        updateFromFloat();
    }

    function updateFromFloat() {
        let val = parseFloat(floatInput.value);
        if (isNaN(val) && floatInput.value.trim() !== "NaN") val = 0;

        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setFloat32(0, val);
        const asInt = view.getUint32(0);

        hexFloatInput.value = "0x" + asInt.toString(16).toUpperCase().padStart(8, '0');

        const bits = containerIEEE.querySelectorAll('.bit');
        bits.forEach(bit => {
            const idx = parseInt(bit.dataset.index);
            const isOn = (asInt & (1 << idx)) !== 0;
            bit.classList.toggle('on', isOn);
            bit.innerText = isOn ? '1' : '0';
        });

        
        const sign = (asInt >>> 31) & 1;
        const exp = (asInt >>> 23) & 0xFF;
        const mant = asInt & 0x7FFFFF;
        
        let html = "";
        if (exp === 255) {
            html = mant !== 0 ? "<strong>NaN</strong>" : `<strong>${sign ? '-' : '+'}Infinity</strong>`;
        } else if (exp === 0 && mant === 0) {
            html = `<strong>${sign ? '-' : '+'}0</strong>`;
        } else {
            const expReal = exp - 127;
            const mantVal = 1 + (mant / Math.pow(2, 23));
            html = `Sign: ${sign ? '-' : '+'} (${sign}) <br>`;
            html += `Exp: ${exp} - 127 = <strong>${expReal}</strong> <br>`;
            html += `Mant: 1.${mant.toString(2).padStart(23,'0')} ≈ <strong>${mantVal.toFixed(5)}</strong> <br>`;
            html += `Res: ${sign?-1:1} × ${mantVal.toFixed(5)} × 2<sup>${expReal}</sup>`;
        }
        ieeeCalc.innerHTML = html;
    }

    
    
    
    function renderBits(container, idPrefix, isStatic = false) {
        container.innerHTML = '';
        for (let i = 31; i >= 0; i--) {
            const bit = document.createElement('div');
            bit.className = isStatic ? 'bit bit-static' : 'bit';
            bit.dataset.index = i;
            bit.dataset.source = idPrefix;
            bit.innerText = '0';
            if ((i + 1) % 8 === 0 && i !== 31) bit.style.marginLeft = "10px";
            if (!isStatic) bit.addEventListener('click', () => toggleBitwise(idPrefix, i));
            container.appendChild(bit);
        }
    }

    function parseInput(str) {
        str = str.trim();
        if (str === "") return 0;
        if (str.startsWith('0x') || str.startsWith('0X') || /[a-fA-F]/.test(str)) {
            return parseInt(str, 16) || 0;
        }
        if (str.startsWith('0b')) {
            return parseInt(str.substring(2), 2) || 0;
        }
        return parseInt(str, 10) || 0;
    }

    function formatLabel(val) {
        const unsigned = val >>> 0;
        return `Dec: ${unsigned} | Hex: 0x${unsigned.toString(16).toUpperCase()}`;
    }
});
