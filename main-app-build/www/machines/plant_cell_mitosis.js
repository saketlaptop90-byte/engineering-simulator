export function createPlantCellMitosis(THREE) {
    const group = new THREE.Group();

    // 1. Cell Wall (fixed, outer boundary)
    const cellWallGeo = new THREE.BoxGeometry(10, 10, 10);
    const cellWallMat = new THREE.MeshLambertMaterial({ color: 0x8FBC8F, transparent: true, opacity: 0.3, wireframe: true });
    const cellWall = new THREE.Mesh(cellWallGeo, cellWallMat);
    group.add(cellWall);

    // 2. Cytoplasm
    const cytoplasmGeo = new THREE.BoxGeometry(9.8, 9.8, 9.8);
    const cytoplasmMat = new THREE.MeshLambertMaterial({ color: 0xE0FFD1, transparent: true, opacity: 0.1 });
    const cytoplasm = new THREE.Mesh(cytoplasmGeo, cytoplasmMat);
    group.add(cytoplasm);

    // 3. Nucleus / Nuclear Envelope
    const nucleusGeo = new THREE.SphereGeometry(3, 32, 32);
    const nucleusMat = new THREE.MeshLambertMaterial({ color: 0xFFB6C1, transparent: true, opacity: 0.5 });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    group.add(nucleus);

    // 4. Chromosomes (Left and Right sets for anaphase separation)
    const chromosomes = new THREE.Group();
    const chromoGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
    const chromoMat = new THREE.MeshLambertMaterial({ color: 0x8B008B });
    
    const leftChromosomes = new THREE.Group();
    const rightChromosomes = new THREE.Group();

    for(let i=0; i<4; i++) {
        const lc = new THREE.Mesh(chromoGeo, chromoMat);
        lc.position.set(0, (i-1.5)*1, 0);
        lc.rotation.z = Math.PI / 4;
        leftChromosomes.add(lc);

        const rc = new THREE.Mesh(chromoGeo, chromoMat);
        rc.position.set(0, (i-1.5)*1, 0);
        rc.rotation.z = -Math.PI / 4;
        rightChromosomes.add(rc);
    }
    chromosomes.add(leftChromosomes);
    chromosomes.add(rightChromosomes);
    group.add(chromosomes);

    // 5. Spindle Fibers
    const spindleGeo = new THREE.CylinderGeometry(2, 2, 8, 16);
    const spindleMat = new THREE.MeshLambertMaterial({ color: 0xADD8E6, transparent: true, opacity: 0.3, wireframe: true });
    const spindleFibers = new THREE.Mesh(spindleGeo, spindleMat);
    spindleFibers.rotation.z = Math.PI / 2;
    group.add(spindleFibers);

    // 6. Centrosomes / Spindle Poles
    const poleGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const poleMat = new THREE.MeshLambertMaterial({ color: 0xFFA500 });
    const pole1 = new THREE.Mesh(poleGeo, poleMat);
    pole1.position.set(-4, 0, 0);
    const pole2 = new THREE.Mesh(poleGeo, poleMat);
    pole2.position.set(4, 0, 0);
    const centrosomes = new THREE.Group();
    centrosomes.add(pole1);
    centrosomes.add(pole2);
    group.add(centrosomes);

    // 7. Metaphase Plate (Invisible helper or faint plane)
    const plateGeo = new THREE.PlaneGeometry(8, 8);
    const plateMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const metaphasePlate = new THREE.Mesh(plateGeo, plateMat);
    metaphasePlate.rotation.y = Math.PI / 2;
    group.add(metaphasePlate);

    // 8. Phragmoplast (Barrel-shaped structure of microtubules)
    const phragmoGeo = new THREE.CylinderGeometry(3, 3, 2, 16);
    const phragmoMat = new THREE.MeshLambertMaterial({ color: 0x32CD32, transparent: true, opacity: 0.4, wireframe: true });
    const phragmoplast = new THREE.Mesh(phragmoGeo, phragmoMat);
    phragmoplast.rotation.z = Math.PI / 2;
    group.add(phragmoplast);

    // 9. Cell Plate
    const cellPlateGeo = new THREE.BoxGeometry(0.5, 9, 9);
    const cellPlateMat = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const cellPlate = new THREE.Mesh(cellPlateGeo, cellPlateMat);
    group.add(cellPlate);

    // 10. Daughter Cells (Nuclei re-forming)
    const daughterNucleiGeo = new THREE.SphereGeometry(2, 32, 32);
    const dNucleus1 = new THREE.Mesh(daughterNucleiGeo, nucleusMat);
    dNucleus1.position.set(-3, 0, 0);
    const dNucleus2 = new THREE.Mesh(daughterNucleiGeo, nucleusMat);
    dNucleus2.position.set(3, 0, 0);
    const daughterCells = new THREE.Group();
    daughterCells.add(dNucleus1);
    daughterCells.add(dNucleus2);
    group.add(daughterCells);

    // Animation state
    let time = 0;

    function animate(delta) {
        time += delta * 0.5;
        const cycle = time % 10; // 10 second cycle

        if (cycle < 2) {
            // Prophase: Nucleus fades, chromosomes condense
            nucleus.material.opacity = 0.5 * (1 - cycle/2);
            daughterCells.visible = false;
            phragmoplast.visible = false;
            cellPlate.visible = false;
            leftChromosomes.position.x = 0;
            rightChromosomes.position.x = 0;
            chromosomes.visible = true;
            spindleFibers.visible = true;
            spindleFibers.scale.set(0.1, 1, 0.1);
            metaphasePlate.visible = false;
        } else if (cycle < 4) {
            // Metaphase: Chromosomes at plate, spindle fibers fully formed
            const t = (cycle - 2) / 2;
            spindleFibers.scale.set(t, 1, t);
            metaphasePlate.visible = true;
        } else if (cycle < 6) {
            // Anaphase: Chromosomes separate
            const t = (cycle - 4) / 2;
            leftChromosomes.position.x = -3 * t;
            rightChromosomes.position.x = 3 * t;
            spindleFibers.scale.set(1 - 0.5*t, 1, 1 - 0.5*t);
            metaphasePlate.visible = false;
        } else if (cycle < 8) {
            // Telophase / Cytokinesis part 1: Nuclei reform, phragmoplast forms
            const t = (cycle - 6) / 2;
            chromosomes.visible = (1 - t) > 0.5;
            daughterCells.visible = true;
            dNucleus1.material.opacity = 0.5 * t;
            dNucleus2.material.opacity = 0.5 * t;
            spindleFibers.visible = false;
            
            phragmoplast.visible = true;
            phragmoplast.scale.set(t, 1, t);
        } else {
            // Cytokinesis part 2: Cell plate grows
            const t = (cycle - 8) / 2;
            phragmoplast.visible = false;
            cellPlate.visible = true;
            cellPlate.scale.set(1, t, t);
        }
    }

    return { group, animate };
}

export const quiz = [
    {
        question: "Which structure forms the cell plate in plant cells during cytokinesis?",
        options: ["Centrosome", "Phragmoplast", "Spindle fibers", "Metaphase plate"],
        answer: "Phragmoplast"
    },
    {
        question: "Plant cells lack which of the following structures that are present in animal cell mitosis?",
        options: ["Centrioles", "Spindle fibers", "Chromosomes", "Nuclear envelope"],
        answer: "Centrioles"
    },
    {
        question: "In which phase do sister chromatids separate and move towards opposite poles?",
        options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        answer: "Anaphase"
    },
    {
        question: "What is the primary function of the spindle fibers?",
        options: ["Forming the cell wall", "Separating chromosomes", "Replicating DNA", "Synthesizing proteins"],
        answer: "Separating chromosomes"
    },
    {
        question: "During which phase do chromosomes align at the cell's equator?",
        options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        answer: "Metaphase"
    },
    {
        question: "What structure forms the new cell wall between two daughter plant cells?",
        options: ["Cleavage furrow", "Cell plate", "Nucleolus", "Cytoskeleton"],
        answer: "Cell plate"
    }
];
