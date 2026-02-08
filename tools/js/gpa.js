document.addEventListener('DOMContentLoaded', () => {
    
    
    
    let appData = [];

    const container = document.getElementById('ueContainer');
    const globalAvgEl = document.getElementById('globalAvg');
    const addUeBtn = document.getElementById('addUeBtn');
    const resetBtn = document.getElementById('resetBtn');

    
    init();

    function init() {
        const stored = localStorage.getItem('epi_dynamic_grades');
        if (stored) {
            appData = JSON.parse(stored);
        } else {
            
            appData = [
                {
                    id: Date.now(),
                    name: "Exemple: UE Informatique",
                    coef: 1,
                    subjects: [
                        { id: Date.now() + 1, name: "Projet C", grade: 14, coef: 2 },
                        { id: Date.now() + 2, name: "Exam Algo", grade: 8, coef: 1 }
                    ]
                }
            ];
        }
        render();
        calculateAll();
    }

    
    function render() {
        container.innerHTML = '';

        if (appData.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#999; padding:40px;">
                <i class="fa-solid fa-ghost" style="font-size: 2rem; margin-bottom:10px;"></i><br>
                Nothing here yet. Click "Add Group/UE" to start.
            </div>`;
            return;
        }

        appData.forEach((ue, ueIndex) => {
            const card = document.createElement('div');
            card.className = 'ue-card';
            
            
            let subjectsHtml = '';
            ue.subjects.forEach((sub, subIndex) => {
                subjectsHtml += `
                <div class="subject-row">
                    <input type="text" class="sub-name-input" placeholder="Subject Name" value="${sub.name}" onchange="updateSub(${ueIndex}, ${subIndex}, 'name', this.value)">
                    <input type="number" class="sub-grade-input ${getGradeClass(sub.grade)}" placeholder="Note/20" value="${sub.grade}" oninput="updateSub(${ueIndex}, ${subIndex}, 'grade', this.value)">
                    <input type="number" class="sub-coef-input" placeholder="Coef" value="${sub.coef}" oninput="updateSub(${ueIndex}, ${subIndex}, 'coef', this.value)">
                    <button class="btn-del-sub" onclick="deleteSub(${ueIndex}, ${subIndex})"><i class="fa-solid fa-xmark"></i></button>
                </div>`;
            });

            card.innerHTML = `
                <div class="ue-header">
                    <div class="ue-info">
                        <input type="text" class="ue-name-input" value="${ue.name}" placeholder="Group Name (UE...)" onchange="updateUe(${ueIndex}, 'name', this.value)">
                        <input type="number" class="ue-coef-input" value="${ue.coef}" placeholder="Coef" title="Global Coef for this Group" oninput="updateUe(${ueIndex}, 'coef', this.value)">
                    </div>
                    <div class="ue-avg" id="avg-ue-${ueIndex}">--</div>
                    <div class="ue-actions">
                        <button class="btn-del-ue" onclick="deleteUe(${ueIndex})"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </div>
                <div class="ue-body">
                    ${subjectsHtml}
                </div>
                <div class="add-sub-container">
                    <button class="btn-add-sub" onclick="addSub(${ueIndex})"><i class="fa-solid fa-plus"></i> Add Subject/Grade</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    
    
    window.addSub = function(ueIndex) {
        appData[ueIndex].subjects.push({
            id: Date.now(),
            name: "",
            grade: "",
            coef: 1
        });
        saveAndRender();
    };

    window.addUe = function() {
        appData.push({
            id: Date.now(),
            name: "New Group",
            coef: 1,
            subjects: []
        });
        saveAndRender();
    };

    window.deleteSub = function(ueIndex, subIndex) {
        appData[ueIndex].subjects.splice(subIndex, 1);
        saveAndRender();
    };

    window.deleteUe = function(ueIndex) {
        if(confirm("Delete this entire group?")) {
            appData.splice(ueIndex, 1);
            saveAndRender();
        }
    };

    window.updateSub = function(ueIndex, subIndex, field, value) {
        
        if (field === 'grade' || field === 'coef') {
             
             if (value !== "") value = parseFloat(value);
        }
        appData[ueIndex].subjects[subIndex][field] = value;
        save();
        calculateAll(); 
        
        
        if (field === 'grade') {
            
            
            render(); 
            
            
            
            
            
            
            
            const input = document.activeElement;
            input.className = `sub-grade-input ${getGradeClass(value)}`;
        }
    };

    window.updateUe = function(ueIndex, field, value) {
        if (field === 'coef') value = parseFloat(value) || 0;
        appData[ueIndex][field] = value;
        save();
        calculateAll();
    };

    
    addUeBtn.addEventListener('click', window.addUe);
    resetBtn.addEventListener('click', () => {
        if(confirm("Clear all data?")) {
            appData = [];
            saveAndRender();
        }
    });

    
    function calculateAll() {
        let globalSum = 0;
        let globalCoefs = 0;

        appData.forEach((ue, index) => {
            let ueSum = 0;
            let ueCoefs = 0;
            let hasGrades = false;

            ue.subjects.forEach(sub => {
                if (sub.grade !== "" && !isNaN(sub.grade)) {
                    ueSum += sub.grade * sub.coef;
                    ueCoefs += sub.coef;
                    hasGrades = true;
                }
            });

            
            const ueAvgEl = document.getElementById(`avg-ue-${index}`);
            let ueAvgVal = 0;

            if (hasGrades && ueCoefs > 0) {
                ueAvgVal = ueSum / ueCoefs;
                if (ueAvgEl) {
                    ueAvgEl.innerText = ueAvgVal.toFixed(2);
                    ueAvgEl.style.color = ueAvgVal >= 10 ? '#27ae60' : '#c0392b';
                }

                
                
                globalSum += ueAvgVal * ue.coef;
                globalCoefs += ue.coef;

            } else {
                if (ueAvgEl) {
                    ueAvgEl.innerText = "--";
                    ueAvgEl.style.color = "#ccc";
                }
            }
        });

        
        if (globalCoefs > 0) {
            const finalAvg = globalSum / globalCoefs;
            globalAvgEl.innerText = finalAvg.toFixed(2);
            globalAvgEl.style.color = finalAvg >= 10 ? '#27ae60' : (finalAvg >= 8 ? '#d35400' : '#c0392b');
        } else {
            globalAvgEl.innerText = "--";
            globalAvgEl.style.color = "#8e44ad";
        }
    }

    function save() {
        localStorage.setItem('epi_dynamic_grades', JSON.stringify(appData));
    }

    function saveAndRender() {
        save();
        render();
        calculateAll();
    }

    function getGradeClass(grade) {
        if (grade === "" || grade === undefined) return "";
        return grade >= 10 ? "passing" : "failing";
    }
});
