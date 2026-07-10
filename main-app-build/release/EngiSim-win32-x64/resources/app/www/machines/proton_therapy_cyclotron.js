export function createProtonTherapyCyclotron(THREE) {
    const machine = new THREE.Group();

    // Materials
    const ionSourceMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.8 });
    const deesMat = new THREE.MeshStandardMaterial({ color: 0xc87b3f, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide });
    const magnetMat = new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.6, roughness: 0.4 });
    const vacuumMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
    const deflectorMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    const transportMat = new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.5, roughness: 0.4 });
    const essMat = new THREE.MeshStandardMaterial({ color: 0x2288cc, metalness: 0.4, roughness: 0.5 });
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.7 });
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const patientBedMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const patientMat = new THREE.MeshStandardMaterial({ color: 0xccaaff });

    // 1. Ion Source
    const ionGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const ionSource = new THREE.Mesh(ionGeo, ionSourceMat);
    ionSource.position.set(0, 5, -30);
    machine.add(ionSource);

    // 2. Dees
    const deesGroup = new THREE.Group();
    const deeGeo = new THREE.CylinderGeometry(5, 5, 1, 32, 1, false, 0, Math.PI - 0.2);
    const dee1 = new THREE.Mesh(deeGeo, deesMat);
    dee1.position.set(0, 5, -30);
    dee1.rotation.y = 0.1;
    const dee2 = new THREE.Mesh(deeGeo, deesMat);
    dee2.position.set(0, 5, -30);
    dee2.rotation.y = Math.PI + 0.1;
    deesGroup.add(dee1, dee2);
    machine.add(deesGroup);

    // 3. Electromagnet
    const magnetGroup = new THREE.Group();
    const magnetRadius = 6;
    const upperMagnetGeo = new THREE.CylinderGeometry(magnetRadius, magnetRadius, 1.5, 32);
    const upperMagnet = new THREE.Mesh(upperMagnetGeo, magnetMat);
    upperMagnet.position.set(0, 7, -30);
    const lowerMagnet = new THREE.Mesh(upperMagnetGeo, magnetMat);
    lowerMagnet.position.set(0, 3, -30);
    const pillarGeo = new THREE.BoxGeometry(2, 2.5, 12);
    const pillar1 = new THREE.Mesh(pillarGeo, magnetMat);
    pillar1.position.set(-5, 5, -30);
    const pillar2 = new THREE.Mesh(pillarGeo, magnetMat);
    pillar2.position.set(5, 5, -30);
    magnetGroup.add(upperMagnet, lowerMagnet, pillar1, pillar2);
    machine.add(magnetGroup);

    // 4. Vacuum Chamber
    const vacuumGeo = new THREE.CylinderGeometry(5.5, 5.5, 2, 32);
    const vacuumChamber = new THREE.Mesh(vacuumGeo, vacuumMat);
    vacuumChamber.position.set(0, 5, -30);
    machine.add(vacuumChamber);

    // 5. Extraction Deflector
    const deflectorGeo = new THREE.BoxGeometry(2, 1.2, 0.5);
    const deflector = new THREE.Mesh(deflectorGeo, deflectorMat);
    deflector.position.set(0, 5, -24.5);
    machine.add(deflector);

    // 6. Beam Transport Line
    const transportLineGeo = new THREE.CylinderGeometry(0.4, 0.4, 20.5, 16);
    const transportLine = new THREE.Mesh(transportLineGeo, transportMat);
    transportLine.rotation.x = Math.PI / 2;
    transportLine.position.set(0, 5, -14.25);
    machine.add(transportLine);

    // 7. Energy Selection System
    const essGeo = new THREE.BoxGeometry(3, 3, 4);
    const ess = new THREE.Mesh(essGeo, essMat);
    ess.position.set(0, 5, -16);
    machine.add(ess);

    // 8. Gantry
    const gantryGroup = new THREE.Group();
    gantryGroup.position.set(0, 5, 0);

    const gantryRingGeo = new THREE.TorusGeometry(7, 1.2, 32, 64);
    const gantryRing = new THREE.Mesh(gantryRingGeo, gantryMat);
    gantryGroup.add(gantryRing);

    const gantryBackGeo = new THREE.CylinderGeometry(7, 7, 0.5, 32);
    const gantryBack = new THREE.Mesh(gantryBackGeo, gantryMat);
    gantryBack.rotation.x = Math.PI / 2;
    gantryBack.position.set(0, 0, -4);
    gantryGroup.add(gantryBack);

    const counterweightGeo = new THREE.BoxGeometry(4, 2, 2);
    const counterweight = new THREE.Mesh(counterweightGeo, gantryMat);
    counterweight.position.set(0, -6, 0);
    gantryGroup.add(counterweight);

    const radialPipeGeo = new THREE.CylinderGeometry(0.4, 0.4, 7);
    const radialPipe = new THREE.Mesh(radialPipeGeo, transportMat);
    radialPipe.position.set(0, 3.5, -4);
    gantryGroup.add(radialPipe);

    const longPipeGeo = new THREE.CylinderGeometry(0.4, 0.4, 4);
    const longPipe = new THREE.Mesh(longPipeGeo, transportMat);
    longPipe.rotation.x = Math.PI / 2;
    longPipe.position.set(0, 7, -2);
    gantryGroup.add(longPipe);

    machine.add(gantryGroup);

    // 9. Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.8, 1.5, 3, 16);
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.set(0, 5.5, 0);
    gantryGroup.add(nozzle);

    // 10. Patient Positioning System
    const ppsGroup = new THREE.Group();
    const bedBaseGeo = new THREE.CylinderGeometry(1, 1.5, 4.5, 16);
    const bedBase = new THREE.Mesh(bedBaseGeo, gantryMat);
    bedBase.position.set(0, 2.25, 0);
    ppsGroup.add(bedBase);

    const bedGeo = new THREE.BoxGeometry(2.5, 0.2, 8);
    const bed = new THREE.Mesh(bedGeo, patientBedMat);
    bed.position.set(0, 4.5, 2);
    ppsGroup.add(bed);

    const patientGeo = new THREE.CapsuleGeometry(0.4, 3, 8, 16);
    const patient = new THREE.Mesh(patientGeo, patientMat);
    patient.rotation.x = Math.PI / 2;
    patient.position.set(0, 4.8, 1);
    ppsGroup.add(patient);

    machine.add(ppsGroup);

    // Parts list
    machine.parts = [
        { name: "Ion Source", description: "Produces protons by stripping electrons from hydrogen gas." },
        { name: "Dees", description: "Hollow, D-shaped electrodes that alternate voltage to accelerate protons." },
        { name: "Electromagnet", description: "Generates a strong magnetic field to keep protons in a circular path." },
        { name: "Vacuum Chamber", description: "Provides a vacuum environment so protons don't collide with air molecules." },
        { name: "Extraction Deflector", description: "Extracts the proton beam from the cyclotron once it reaches target energy." },
        { name: "Beam Transport Line", description: "Guides the extracted proton beam to the treatment room." },
        { name: "Energy Selection System", description: "Adjusts the energy (and thus penetration depth) of the proton beam." },
        { name: "Gantry", description: "A massive rotating structure that allows the beam to be delivered from any angle." },
        { name: "Nozzle", description: "Shapes and monitors the proton beam before it enters the patient." },
        { name: "Patient Positioning System", description: "A robotic bed that precisely aligns the patient with the beam." }
    ];

    // Animation (Protons and Gantry)
    const protons = [];
    const protonGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const protonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x00ffff, emissiveIntensity: 2 });

    for (let i = 0; i < 5; i++) {
        const p = new THREE.Mesh(protonGeo, protonMat);
        p.visible = false;
        machine.add(p);
        protons.push({ mesh: p, offset: i * 0.2 });
    }

    machine.animation = (time) => {
        // Gantry slowly rotates back and forth
        const rotAngle = Math.sin(time * 0.5) * Math.PI / 4;
        gantryGroup.rotation.z = rotAngle;
        
        const cycleDuration = 4.0; // animation cycle in seconds
        
        protons.forEach(p => {
            let t = ((time % cycleDuration) / cycleDuration + p.offset) % 1.0;
            
            if (t < 0.3) {
                p.mesh.visible = true;
                let spiralT = t / 0.3;
                let radius = spiralT * 5;
                let angle = spiralT * Math.PI * 20.5; // ends exactly at positive Z axis
                p.mesh.position.set(Math.cos(angle) * radius, 5, -30 + Math.sin(angle) * radius);
            } else if (t < 0.6) {
                p.mesh.visible = true;
                let lineT = (t - 0.3) / 0.3;
                let z = -25 + lineT * 21; // from -25 to -4
                p.mesh.position.set(0, 5, z);
            } else if (t < 0.9) {
                p.mesh.visible = true;
                let gantryT = (t - 0.6) / 0.3;
                let localPos = new THREE.Vector3();
                
                if (gantryT < 0.4) {
                    let st = gantryT / 0.4;
                    localPos.set(0, st * 7, -4);
                } else if (gantryT < 0.6) {
                    let st = (gantryT - 0.4) / 0.2;
                    localPos.set(0, 7, -4 + st * 4);
                } else {
                    let st = (gantryT - 0.6) / 0.4;
                    localPos.set(0, 7 - st * 7, 0);
                }
                
                let r_x = -localPos.y * Math.sin(rotAngle);
                let r_y = localPos.y * Math.cos(rotAngle);
                
                p.mesh.position.set(r_x, r_y + 5, localPos.z);
            } else {
                p.mesh.visible = false;
            }
        });
    };

    // Quiz
    machine.quiz = [
        { question: "What is the primary function of the 'Dees' in a cyclotron?", options: ["To bend the proton beam", "To accelerate protons using alternating voltage", "To generate the magnetic field", "To produce hydrogen ions"], answer: 1 },
        { question: "Why is a vacuum chamber necessary in a cyclotron?", options: ["To prevent protons from colliding with air molecules", "To cool down the magnets", "To protect the operator from radiation", "To increase the magnetic field strength"], answer: 0 },
        { question: "What does the Electromagnet do?", options: ["Accelerates the protons", "Extracts the protons", "Forces protons to move in a spiral path", "Reduces proton energy"], answer: 2 },
        { question: "What is the purpose of the Energy Selection System?", options: ["To change the direction of the beam", "To adjust the penetration depth of the protons", "To cool the gantry", "To rotate the patient"], answer: 1 },
        { question: "What is the function of the Gantry in proton therapy?", options: ["To generate the protons", "To rotate the treatment nozzle around the patient", "To shield the room from radiation", "To measure the patient's heart rate"], answer: 1 },
        { question: "What does the Ion Source use to produce protons?", options: ["Helium gas", "Hydrogen gas", "Oxygen gas", "Nitrogen gas"], answer: 1 }
    ];

    return machine;
}
