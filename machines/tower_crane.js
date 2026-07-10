export function createTowerCrane(THREE) {
    const group = new THREE.Group();

    // 1. Base pad
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const basePad = new THREE.Mesh(baseGeo, baseMat);
    basePad.position.set(0, 0.25, 0);
    group.add(basePad);

    // 2. Mast/Tower
    const mastGeo = new THREE.BoxGeometry(1, 10, 1);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0xffd700 }); // Gold/Yellow
    const mast = new THREE.Mesh(mastGeo, mastMat);
    mast.position.set(0, 5.5, 0);
    group.add(mast);

    // 3. Slewing unit (Rotating part)
    const slewingGroup = new THREE.Group();
    slewingGroup.position.set(0, 10.5, 0);
    group.add(slewingGroup);

    const slewingGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 16);
    const slewingMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const slewingUnit = new THREE.Mesh(slewingGeo, slewingMat);
    slewingGroup.add(slewingUnit);

    // 4. Jib (Working arm)
    const jibGeo = new THREE.BoxGeometry(10, 0.5, 0.5);
    const jibMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const jib = new THREE.Mesh(jibGeo, jibMat);
    jib.position.set(4.5, 0.5, 0);
    slewingGroup.add(jib);

    // 5. Counter-jib
    const counterJibGeo = new THREE.BoxGeometry(4, 0.5, 0.5);
    const counterJibMat = new THREE.MeshStandardMaterial({ color: 0xaa5500 });
    const counterJib = new THREE.Mesh(counterJibGeo, counterJibMat);
    counterJib.position.set(-2.5, 0.5, 0);
    slewingGroup.add(counterJib);

    // 6. Counterweights
    const weightGeo = new THREE.BoxGeometry(1.5, 1, 1);
    const weightMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const counterWeight = new THREE.Mesh(weightGeo, weightMat);
    counterWeight.position.set(-3.5, 1.25, 0);
    slewingGroup.add(counterWeight);

    // 7. Operator Cab
    const cabGeo = new THREE.BoxGeometry(1, 1, 1);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0.6, -0.25, 0.6);
    slewingGroup.add(cab);

    // 8. Tie-bars (A-frame/Apex)
    const apexGeo = new THREE.ConeGeometry(0.5, 2, 4);
    const apexMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const apex = new THREE.Mesh(apexGeo, apexMat);
    apex.position.set(0, 1.75, 0);
    slewingGroup.add(apex);

    // 9. Trolley
    const trolleyGeo = new THREE.BoxGeometry(0.6, 0.3, 0.6);
    const trolleyMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const trolley = new THREE.Mesh(trolleyGeo, trolleyMat);
    trolley.position.set(5, 0.1, 0);
    slewingGroup.add(trolley);

    // 10. Hoist Hook
    const hookGeo = new THREE.CylinderGeometry(0.1, 0.2, 0.5, 8);
    const hookMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const hook = new THREE.Mesh(hookGeo, hookMat);
    hook.position.set(0, -1, 0);
    trolley.add(hook);

    // Animation Loop
    group.userData.update = function(time) {
        // Rotate slewing unit slowly
        slewingGroup.rotation.y = time * 0.2;
        
        // Move trolley back and forth along the jib
        trolley.position.x = 4.5 + Math.sin(time * 0.5) * 3;
        
        // Move hook up and down
        hook.position.y = -1.5 + Math.sin(time) * 1.0;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the main vertical part of a tower crane called?",
            options: ["Jib", "Mast", "Trolley", "Counter-jib"],
            correctIndex: 1
        },
        {
            question: "Which component allows the crane to rotate?",
            options: ["Slewing unit", "Apex", "Hoist", "Base pad"],
            correctIndex: 0
        },
        {
            question: "What runs along the jib to move the load horizontally?",
            options: ["Cab", "Hook", "Trolley", "Tie-bars"],
            correctIndex: 2
        },
        {
            question: "Where are the counterweights located on a tower crane?",
            options: ["On the mast", "On the trolley", "On the counter-jib", "On the base"],
            correctIndex: 2
        },
        {
            question: "What is the long horizontal arm that does the lifting called?",
            options: ["Jib", "Mast", "Slewing ring", "Pendant"],
            correctIndex: 0
        },
        {
            question: "Where does the operator usually sit?",
            options: ["In the base", "On the trolley", "In the cab near the slewing unit", "At the top of the apex"],
            correctIndex: 2
        }
    ];

    return group;
}
