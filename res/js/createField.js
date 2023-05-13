export function createHtmlFields(fieldBx, name){
    const createBxHtml = `
        <div class="field__textEdge">
            <div class="${name}__field fieldBx fieldText"></div>
            <div class="${name}__field fieldBx fieldText">1</div>
            <div class="${name}__field fieldBx fieldText">2</div>
            <div class="${name}__field fieldBx fieldText">3</div>
            <div class="${name}__field fieldBx fieldText">4</div>
            <div class="${name}__field fieldBx fieldText">5</div>
            <div class="${name}__field fieldBx fieldText">6</div>
            <div class="${name}__field fieldBx fieldText">7</div>
            <div class="${name}__field fieldBx fieldText">8</div>
            <div class="${name}__field fieldBx fieldText">9</div>
        </div>
        <div class="field__bottom">
            <div class="field__numEdge">
                <div class="${name}__field fieldBx fieldText">A</div>
                <div class="${name}__field fieldBx fieldText">B</div>
                <div class="${name}__field fieldBx fieldText">C</div>
                <div class="${name}__field fieldBx fieldText">D</div>
                <div class="${name}__field fieldBx fieldText">E</div>
                <div class="${name}__field fieldBx fieldText">F</div>
                <div class="${name}__field fieldBx fieldText">G</div>
                <div class="${name}__field fieldBx fieldText">H</div>
                <div class="${name}__field fieldBx fieldText">I</div>
            </div>
            <div class="fields__containerBx">

            </div>
        </div>
    `;
    
    fieldBx.insertAdjacentHTML('beforeend', createBxHtml);
    
    
    const createFields = fieldBx.querySelector('.fields__containerBx');
    
    for (let i = 0; i < 9; i++) {
        let newFieldBx = document.createElement('div');
        newFieldBx.classList.add(`${name}__fieldContainer`, `field__container`);
        createFields.appendChild(newFieldBx);
    
        for (let j = 0; j < 9; j++) {
            let newField = document.createElement('div');
            newField.classList.add(`${name}Field`, 'fieldBx', 'mainField');
            newField.setAttribute('data-field-coord', JSON.stringify({x: j, y: i}));
            newFieldBx.appendChild(newField);
        }
    }
}