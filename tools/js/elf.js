document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const errorBox = document.getElementById('errorBox');
    const resultCard = document.getElementById('resultCard');

    // UI Elements
    const outMagic = document.getElementById('elfMagic');
    const outType = document.getElementById('elfType');
    const outMachine = document.getElementById('elfMachine');
    const outClass = document.getElementById('elfClass');
    const outData = document.getElementById('elfData');
    const outEntry = document.getElementById('elfEntry');
    const hexView = document.getElementById('hexView');

    // Event Listeners
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) processFile(fileInput.files[0]);
    });

    function processFile(file) {
        errorBox.style.display = 'none';
        resultCard.style.display = 'none';

        if (file.size > 50 * 1024 * 1024) {
            showError("File too large (>50MB).");
            return;
        }

        const blobSlice = file.slice(0, 64);
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const buffer = event.target.result;
                parseELFHeader(buffer);
                renderHexDump(buffer);
                resultCard.style.display = 'block';
            } catch (err) {
                showError(err.message);
            }
        };
        reader.onerror = () => showError("Read error.");
        reader.readAsArrayBuffer(blobSlice);
    }

    function parseELFHeader(buffer) {
        const view = new DataView(buffer);

        // 1. Magic Number
        if (view.getUint8(0) !== 0x7F || view.getUint8(1) !== 0x45 || 
            view.getUint8(2) !== 0x4C || view.getUint8(3) !== 0x46) {
            throw new Error("Invalid Magic Number. Not an ELF binary.");
        }
        outMagic.textContent = "ELF (Executable Linkable Format)";

        // 2. Class & Endianness
        const classByte = view.getUint8(4);
        let is64 = (classByte === 2);
        outClass.textContent = is64 ? "64-bit" : "32-bit";

        const dataByte = view.getUint8(5);
        let isLittle = (dataByte === 1);
        outData.textContent = isLittle ? "Little Endian (LSB)" : "Big Endian (MSB)";

        // 3. Object Type (Offset 0x10 / 16 bytes)
        const typeVal = view.getUint16(16, isLittle);
        const typeMap = {
            1: "REL (Relocatable / .o)",
            2: "EXEC (Executable)",
            3: "DYN (Shared Object / .so)",
            4: "CORE (Core Dump)"
        };
        outType.textContent = typeMap[typeVal] || `Unknown (0x${typeVal.toString(16)})`;

        // 4. Target Machine (Offset 0x12 / 18 bytes)
        const machineVal = view.getUint16(18, isLittle);
        const machineMap = {
            0x03: "x86 (Intel 32-bit)",
            0x3E: "AMD64 (x86_64)",
            0x28: "ARM (32-bit)",
            0xB7: "AArch64 (ARM 64-bit)",
            0xF3: "RISC-V"
        };
        outMachine.textContent = machineMap[machineVal] || `Unknown (0x${machineVal.toString(16)})`;

        // 5. Entry Point (Offset 0x18 / 24 bytes)
        let entry = "0x0";
        if (is64)
        {
            const bigVal = view.getBigUint64(24, isLittle);
            entry = "0x" + bigVal.toString(16).toUpperCase();
        } 
        else 
        {
            const val = view.getUint32(24, isLittle);
            entry = "0x" + val.toString(16).toUpperCase();
        }
        outEntry.textContent = entry;
    }

    function renderHexDump(buffer) {
        const bytes = new Uint8Array(buffer);
        let hexString = "";
        for (let i = 0; i < bytes.length && i < 64; i++) {
            let val = bytes[i].toString(16).toUpperCase().padStart(2, '0');
            // Colors: Magic(Magenta), Type(Orange), Machine(Blue)
            if (i < 4) hexString += `<span class="highlight-magic">${val}</span> `;
            else if (i >= 16 && i < 18)
                hexString += `<span style="color:orange">${val}</span> `;
            else if (i >= 18 && i < 20)
                hexString += `<span style="color:cyan">${val}</span> `;
            else
                hexString += val + " ";
            
            if ((i + 1) % 16 === 0)
                hexString += "\n";
        }
        hexView.innerHTML = hexString;
    }

    function showError(msg) {
        errorBox.textContent = "⚠️ " + msg;
        errorBox.style.display = 'block';
    }
});
