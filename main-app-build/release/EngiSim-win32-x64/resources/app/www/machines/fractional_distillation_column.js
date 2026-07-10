export function createFractionalDistillationColumn(THREE) {
    const group = new THREE.Group();

    // Materials
    const columnMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.4 });
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const furnaceMaterial = new THREE.MeshStandardMaterial({ color: 0xaa3333 });
    const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const coldMaterial = new THREE.MeshStandardMaterial({ color: 0x3366aa });
    const productMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaa33 });

    // 1. Main Column Body
    const columnGeom = new THREE.CylinderGeometry(2, 2, 20, 32);
    const mainColumn = new THREE.Mesh(columnGeom, columnMaterial);
    mainColumn.position.set(0, 10, 0);
    group.add(mainColumn);

    // 2. Furnace
    const furnaceGeom = new THREE.BoxGeometry(4, 5, 4);
    const furnace = new THREE.Mesh(furnaceGeom, furnaceMaterial);
    furnace.position.set(-6, 2.5, 0);
    group.add(furnace);

    // 3. Feed Pipe
    const feedPipeGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
    const feedPipe = new THREE.Mesh(feedPipeGeom, pipeMaterial);
    feedPipe.rotation.z = Math.PI / 2;
    feedPipe.position.set(-2.5, 4, 0);
    group.add(feedPipe);

    // 4. Internal Trays
    const traysGroup = new THREE.Group();
    const trayGeom = new THREE.CylinderGeometry(1.9, 1.9, 0.1, 32);
    for (let i = 2; i < 18; i += 2) {
        const tray = new THREE.Mesh(trayGeom, metalMaterial);
        tray.position.set(0, i, 0);
        traysGroup.add(tray);
    }
    group.add(traysGroup);

    // 5. Overhead Condenser
    const condenserGeom = new THREE.CylinderGeometry(1, 1, 4, 16);
    const condenser = new THREE.Mesh(condenserGeom, coldMaterial);
    condenser.rotation.z = Math.PI / 2;
    condenser.position.set(5, 19, 0);
    group.add(condenser);

    // 6. Vapor Lines
    const vaporLineGroup = new THREE.Group();
    const vLineGeom1 = new THREE.CylinderGeometry(0.3, 0.3, 5, 16);
    const vaporLine = new THREE.Mesh(vLineGeom1, pipeMaterial);
    vaporLine.rotation.z = Math.PI / 2;
    vaporLine.position.set(2, 20, 0);
    vaporLineGroup.add(vaporLine);
    
    const vLineGeom2 = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const vaporLineVertical = new THREE.Mesh(vLineGeom2, pipeMaterial);
    vaporLineVertical.position.set(4.5, 20.5, 0);
    vaporLineGroup.add(vaporLineVertical);
    group.add(vaporLineGroup);

    // 7. Reflux Drum
    const drumGeom = new THREE.CylinderGeometry(1.5, 1.5, 3, 16);
    const refluxDrum = new THREE.Mesh(drumGeom, metalMaterial);
    refluxDrum.rotation.x = Math.PI / 2;
    refluxDrum.position.set(8, 17, 0);
    group.add(refluxDrum);
    
    // Connect condenser to drum
    const drumPipeGeom = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16);
    const drumPipe = new THREE.Mesh(drumPipeGeom, pipeMaterial);
    drumPipe.position.set(6.5, 18, 0);
    drumPipe.rotation.z = -Math.PI / 4;
    group.add(drumPipe);

    // Reflux return pipe
    const refluxReturnGeom = new THREE.CylinderGeometry(0.2, 0.2, 7, 16);
    const refluxReturn = new THREE.Mesh(refluxReturnGeom, pipeMaterial);
    refluxReturn.position.set(4.5, 16.5, 0);
    refluxReturn.rotation.z = Math.PI / 2;
    group.add(refluxReturn);

    // 8. Distillate Outlet
    const distPipeGeom = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const distillateOutlet = new THREE.Mesh(distPipeGeom, productMaterial);
    distillateOutlet.rotation.z = Math.PI / 2;
    distillateOutlet.position.set(11.5, 17, 0);
    group.add(distillateOutlet);

    // 9. Side Strippers
    const stripperGeom = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    
    const stripper1 = new THREE.Mesh(stripperGeom, metalMaterial);
    stripper1.position.set(3.5, 12, 0);
    group.add(stripper1);
    
    const stripper2 = new THREE.Mesh(stripperGeom, metalMaterial);
    stripper2.position.set(3.5, 7, 0);
    group.add(stripper2);

    const stripperPipeGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const sPipe1 = new THREE.Mesh(stripperPipeGeom, pipeMaterial);
    sPipe1.rotation.z = Math.PI / 2;
    sPipe1.position.set(2.5, 12, 0);
    group.add(sPipe1);
    
    const sPipe2 = new THREE.Mesh(stripperPipeGeom, pipeMaterial);
    sPipe2.rotation.z = Math.PI / 2;
    sPipe2.position.set(2.5, 7, 0);
    group.add(sPipe2);

    // 10. Heavy Residue Outlet
    const residueGeom = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    const heavyResidueOutlet = new THREE.Mesh(residueGeom, pipeMaterial);
    heavyResidueOutlet.rotation.z = Math.PI / 2;
    heavyResidueOutlet.position.set(2, 0.5, 0);
    group.add(heavyResidueOutlet);

    // Animation: Vapor rising
    const bubbles = [];
    const bubbleGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    
    for (let i = 0; i < 30; i++) {
        const bubble = new THREE.Mesh(bubbleGeom, bubbleMat);
        bubble.position.set(
            (Math.random() - 0.5) * 3,
            Math.random() * 20,
            (Math.random() - 0.5) * 3
        );
        group.add(bubble);
        bubbles.push({
            mesh: bubble,
            speed: 1.0 + Math.random() * 2.0
        });
    }

    group.userData.update = function(delta) {
        bubbles.forEach(b => {
            b.mesh.position.y += b.speed * delta;
            if (b.mesh.position.y > 19) {
                b.mesh.position.y = 1;
                b.mesh.position.x = (Math.random() - 0.5) * 3;
                b.mesh.position.z = (Math.random() - 0.5) * 3;
            }
        });
    };

    group.userData.quiz = [
        {
            question: "What is the primary principle behind fractional distillation?",
            options: ["Differences in boiling points", "Differences in density", "Differences in solubility", "Differences in color"],
            correctAnswer: 0
        },
        {
            question: "Which part of the column has the highest temperature?",
            options: ["The bottom", "The top", "The middle", "The condenser"],
            correctAnswer: 0
        },
        {
            question: "What is the purpose of the internal trays or packing?",
            options: ["To increase contact area between vapor and liquid", "To hold the structure together", "To heat the fluids", "To decrease pressure"],
            correctAnswer: 0
        },
        {
            question: "Where do the most volatile components exit the column?",
            options: ["The top", "The bottom", "The side strippers", "The furnace"],
            correctAnswer: 0
        },
        {
            question: "What is reflux in fractional distillation?",
            options: ["Returning condensed liquid to the top of the column", "Heating the bottom of the column", "Adding raw material to the column", "Removing heavy residues"],
            correctAnswer: 0
        },
        {
            question: "Which of these is a common product of crude oil fractional distillation?",
            options: ["Gasoline", "Pure gold", "Sodium chloride", "Oxygen gas"],
            correctAnswer: 0
        }
    ];

    return group;
}
