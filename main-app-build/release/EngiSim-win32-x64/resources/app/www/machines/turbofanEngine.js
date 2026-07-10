export function createTurbofanJetEngine(THREE) {
    const group = new THREE.Group();

    // 10 distinct parts
    
    // 1. Fan Blades
    const fanGeo = new THREE.CylinderGeometry(2, 2, 0.2, 16);
    fanGeo.rotateX(Math.PI / 2);
    const fanMat = new THREE.MeshStandardMaterial({color: 0xcccccc});
    const fanBlades = new THREE.Mesh(fanGeo, fanMat);
    fanBlades.position.z = 4;
    group.add(fanBlades);

    // 2. Low-Pressure Compressor
    const lpcGeo = new THREE.CylinderGeometry(1.5, 1.2, 1, 16);
    lpcGeo.rotateX(Math.PI / 2);
    const lpcMat = new THREE.MeshStandardMaterial({color: 0x888888});
    const lpc = new THREE.Mesh(lpcGeo, lpcMat);
    lpc.position.z = 2.5;
    group.add(lpc);

    // 3. High-Pressure Compressor
    const hpcGeo = new THREE.CylinderGeometry(1.2, 0.8, 1.5, 16);
    hpcGeo.rotateX(Math.PI / 2);
    const hpcMat = new THREE.MeshStandardMaterial({color: 0x666666});
    const hpc = new THREE.Mesh(hpcGeo, hpcMat);
    hpc.position.z = 1;
    group.add(hpc);

    // 4. Combustion Chamber
    const combGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
    combGeo.rotateX(Math.PI / 2);
    const combMat = new THREE.MeshStandardMaterial({color: 0xff4400});
    const combustionChamber = new THREE.Mesh(combGeo, combMat);
    combustionChamber.position.z = -0.5;
    group.add(combustionChamber);

    // 5. High-Pressure Turbine
    const hptGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 16);
    hptGeo.rotateX(Math.PI / 2);
    const hptMat = new THREE.MeshStandardMaterial({color: 0x555555});
    const hpt = new THREE.Mesh(hptGeo, hptMat);
    hpt.position.z = -1.5;
    group.add(hpt);

    // 6. Low-Pressure Turbine
    const lptGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 16);
    lptGeo.rotateX(Math.PI / 2);
    const lptMat = new THREE.MeshStandardMaterial({color: 0x777777});
    const lpt = new THREE.Mesh(lptGeo, lptMat);
    lpt.position.z = -2.5;
    group.add(lpt);

    // 7. Bypass Duct
    const bypassGeo = new THREE.CylinderGeometry(2.2, 2.2, 7, 32, 1, true);
    bypassGeo.rotateX(Math.PI / 2);
    const bypassMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa, transparent: true, opacity: 0.3, side: THREE.DoubleSide});
    const bypassDuct = new THREE.Mesh(bypassGeo, bypassMat);
    bypassDuct.position.z = 0.5;
    group.add(bypassDuct);

    // 8. Exhaust Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(2.2, 1.5, 1.5, 32, 1, true);
    nozzleGeo.rotateX(Math.PI / 2);
    const nozzleMat = new THREE.MeshStandardMaterial({color: 0x333333, side: THREE.DoubleSide});
    const exhaustNozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    exhaustNozzle.position.z = -3.75;
    group.add(exhaustNozzle);

    // 9. Spinner
    const spinnerGeo = new THREE.ConeGeometry(0.5, 1, 16);
    spinnerGeo.rotateX(Math.PI / 2);
    const spinnerMat = new THREE.MeshStandardMaterial({color: 0xeeeeee});
    const spinner = new THREE.Mesh(spinnerGeo, spinnerMat);
    spinner.position.z = 4.6;
    group.add(spinner);

    // 10. Engine Casing
    const casingGeo = new THREE.CylinderGeometry(2.3, 2.3, 8.5, 32, 1, true);
    casingGeo.rotateX(Math.PI / 2);
    const casingMat = new THREE.MeshStandardMaterial({color: 0x999999, transparent: true, opacity: 0.1, wireframe: true});
    const engineCasing = new THREE.Mesh(casingGeo, casingMat);
    engineCasing.position.z = 0.25;
    group.add(engineCasing);

    // Animation
    group.userData.animate = function(delta) {
        // Fans and low pressure turbine spin at one speed
        fanBlades.rotation.z -= delta * 5;
        spinner.rotation.z -= delta * 5;
        lpc.rotation.z -= delta * 5;
        lpt.rotation.z -= delta * 5;

        // High pressure components spin faster
        hpc.rotation.z -= delta * 10;
        hpt.rotation.z -= delta * 10;
    };

    // Quiz Questions
    group.userData.questions = [
        {
            question: "What is the primary purpose of the bypass duct in a turbofan engine?",
            options: ["To cool the combustion chamber", "To provide the majority of the thrust efficiently", "To exhaust burnt gases", "To compress air before it enters the core"],
            correctAnswer: 1
        },
        {
            question: "Which component compresses air just before it enters the combustion chamber?",
            options: ["Low-Pressure Compressor", "High-Pressure Compressor", "Fan Blades", "Low-Pressure Turbine"],
            correctAnswer: 1
        },
        {
            question: "What drives the high-pressure compressor?",
            options: ["The fan", "The low-pressure turbine", "The high-pressure turbine", "The exhaust nozzle"],
            correctAnswer: 2
        },
        {
            question: "In a turbofan engine, where does combustion occur?",
            options: ["High-Pressure Turbine", "Bypass Duct", "Combustion Chamber", "Exhaust Nozzle"],
            correctAnswer: 2
        },
        {
            question: "What happens to the velocity of the air as it passes through the exhaust nozzle?",
            options: ["It decreases", "It remains constant", "It increases", "It reverses direction"],
            correctAnswer: 2
        },
        {
            question: "Which turbine usually spins at a higher rotational speed?",
            options: ["Low-Pressure Turbine", "High-Pressure Turbine", "They spin at the same speed", "It depends on the altitude"],
            correctAnswer: 1
        }
    ];

    return group;
}
