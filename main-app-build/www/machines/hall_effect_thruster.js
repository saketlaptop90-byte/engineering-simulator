export function createHallEffectThruster(THREE) {
    const group = new THREE.Group();

    // Materials
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.3 });
    const darkIronMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.5 });
    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xfffcf0, metalness: 0.1, roughness: 0.9 });
    const anodeMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.2 });
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.4 });
    const plasmaMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0.15, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });

    // 1. Inner Magnetic Pole (Cylinder in the center)
    const innerPoleGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.0, 32);
    const innerMagneticPole = new THREE.Mesh(innerPoleGeo, ironMat);
    innerMagneticPole.name = "Inner Magnetic Pole";
    
    // 2. Outer Magnetic Pole (Lathed shell)
    const opPoints = [
        new THREE.Vector2(1.8, 1.0),
        new THREE.Vector2(2.0, 1.0),
        new THREE.Vector2(2.0, -1.0),
        new THREE.Vector2(1.8, -1.0),
        new THREE.Vector2(1.8, 1.0)
    ];
    const outerPoleGeo = new THREE.LatheGeometry(opPoints, 64);
    const outerMagneticPole = new THREE.Mesh(outerPoleGeo, ironMat);
    outerMagneticPole.name = "Outer Magnetic Pole";
    
    // 3. Magnetic Circuit (Backplate)
    const mcPoints = [
        new THREE.Vector2(0.4, -1.0),
        new THREE.Vector2(2.0, -1.0),
        new THREE.Vector2(2.0, -1.2),
        new THREE.Vector2(0.4, -1.2),
        new THREE.Vector2(0.4, -1.0)
    ];
    const mcGeo = new THREE.LatheGeometry(mcPoints, 64);
    const magneticCircuit = new THREE.Mesh(mcGeo, darkIronMat);
    magneticCircuit.name = "Magnetic Circuit";
    
    // 4. Insulator Ring (Ceramic channel walls)
    const insPoints = [
        new THREE.Vector2(0.5, 1.0),
        new THREE.Vector2(0.6, 1.0),
        new THREE.Vector2(0.6, -0.8),
        new THREE.Vector2(1.7, -0.8),
        new THREE.Vector2(1.7, 1.0),
        new THREE.Vector2(1.8, 1.0),
        new THREE.Vector2(1.8, -0.9),
        new THREE.Vector2(0.5, -0.9),
        new THREE.Vector2(0.5, 1.0)
    ];
    const insGeo = new THREE.LatheGeometry(insPoints, 64);
    const insulatorRing = new THREE.Mesh(insGeo, ceramicMat);
    insulatorRing.name = "Insulator Ring";
    
    // 5. Anode / Gas Distributor
    const anodeGeo = new THREE.TorusGeometry(1.15, 0.05, 16, 64);
    anodeGeo.rotateX(Math.PI / 2);
    const anode = new THREE.Mesh(anodeGeo, anodeMat);
    anode.position.y = -0.7;
    anode.name = "Anode / Gas Distributor";
    
    // 6. Discharge Channel (Plasma glow)
    const dcPoints = [
        new THREE.Vector2(0.6, 1.0),
        new THREE.Vector2(1.7, 1.0),
        new THREE.Vector2(1.7, -0.7),
        new THREE.Vector2(0.6, -0.7),
        new THREE.Vector2(0.6, 1.0)
    ];
    const dcGeo = new THREE.LatheGeometry(dcPoints, 64);
    const dischargeChannel = new THREE.Mesh(dcGeo, plasmaMat);
    dischargeChannel.name = "Discharge Channel";
    
    // 7. Hollow Cathode
    const hcGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);
    const hollowCathode = new THREE.Mesh(hcGeo, cathodeMat);
    hollowCathode.position.set(2.4, 1.0, 0);
    hollowCathode.rotation.z = Math.PI / 6;
    hollowCathode.name = "Hollow Cathode";
    
    // 8. Cathode Keeper
    const keeperGeo = new THREE.TorusGeometry(0.1, 0.03, 16, 32);
    keeperGeo.rotateX(Math.PI / 2);
    const cathodeKeeper = new THREE.Mesh(keeperGeo, cathodeMat);
    cathodeKeeper.position.set(2.275, 1.2165, 0);
    cathodeKeeper.rotation.z = Math.PI / 6;
    cathodeKeeper.name = "Cathode Keeper";
    
    // 9. Mounting Structure
    const mountGeo = new THREE.BoxGeometry(4.5, 0.2, 4.5);
    const mountingStructure = new THREE.Mesh(mountGeo, darkIronMat);
    mountingStructure.position.y = -1.3;
    mountingStructure.name = "Mounting Structure";
    
    // 10. Ion Beam
    const beamGeo = new THREE.CylinderGeometry(3.5, 1.15, 6, 64, 1, true);
    beamGeo.translate(0, 3, 0);
    const ionBeam = new THREE.Mesh(beamGeo, beamMat);
    ionBeam.position.y = 1.0;
    ionBeam.name = "Ion Beam";

    // Adding 10 distinct parts to the main group
    group.add(
        innerMagneticPole,
        outerMagneticPole,
        magneticCircuit,
        dischargeChannel,
        anode,
        hollowCathode,
        cathodeKeeper,
        insulatorRing,
        mountingStructure,
        ionBeam
    );

    // Particles for Animation
    // Electron Particles (inside discharge channel)
    const electronCount = 200;
    const eGeo = new THREE.BufferGeometry();
    const ePos = new Float32Array(electronCount * 3);
    const eAngles = new Float32Array(electronCount);
    const eRadii = new Float32Array(electronCount);
    const eY = new Float32Array(electronCount);
    for(let i=0; i<electronCount; i++) {
        eAngles[i] = Math.random() * Math.PI * 2;
        eRadii[i] = 0.7 + Math.random() * 0.9;
        eY[i] = -0.7 + Math.random() * 1.7;
        ePos[i*3] = Math.cos(eAngles[i]) * eRadii[i];
        ePos[i*3+1] = eY[i];
        ePos[i*3+2] = Math.sin(eAngles[i]) * eRadii[i];
    }
    eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
    const eMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const electrons = new THREE.Points(eGeo, eMat);
    dischargeChannel.add(electrons);

    // Ion Particles (inside ion beam)
    const ionCount = 300;
    const iGeo = new THREE.BufferGeometry();
    const iPos = new Float32Array(ionCount * 3);
    const iProgress = new Float32Array(ionCount);
    const iAngles = new Float32Array(ionCount);
    const iRadii = new Float32Array(ionCount);
    for(let i=0; i<ionCount; i++) {
        iProgress[i] = Math.random();
        iAngles[i] = Math.random() * Math.PI * 2;
        iRadii[i] = 0.7 + Math.random() * 0.9;
        iPos[i*3] = 0; iPos[i*3+1] = 0; iPos[i*3+2] = 0;
    }
    iGeo.setAttribute('position', new THREE.BufferAttribute(iPos, 3));
    const iMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.05, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const ions = new THREE.Points(iGeo, iMat);
    ionBeam.add(ions);

    // Animation Tick
    group.tick = (time) => {
        // Electron spiraling (Hall current)
        const ep = electrons.geometry.attributes.position;
        for(let i=0; i<electronCount; i++) {
            eAngles[i] += 0.15; // Spiral speed
            ep.setX(i, Math.cos(eAngles[i]) * eRadii[i]);
            ep.setZ(i, Math.sin(eAngles[i]) * eRadii[i]);
        }
        ep.needsUpdate = true;

        // Ion acceleration
        const ip = ions.geometry.attributes.position;
        for(let i=0; i<ionCount; i++) {
            iProgress[i] += 0.01 + iProgress[i] * 0.03; // accelerate outwards
            if(iProgress[i] > 1.0) {
                iProgress[i] = 0;
                iAngles[i] = Math.random() * Math.PI * 2;
                iRadii[i] = 0.7 + Math.random() * 0.9;
            }
            const yPos = iProgress[i] * 6;
            const spread = iProgress[i] * 2.35;
            const currentRadius = iRadii[i] + spread;
            ip.setX(i, Math.cos(iAngles[i]) * currentRadius);
            ip.setY(i, yPos);
            ip.setZ(i, Math.sin(iAngles[i]) * currentRadius);
        }
        ip.needsUpdate = true;

        // Pulsate materials
        dischargeChannel.material.opacity = 0.2 + 0.1 * Math.sin(time * 10);
        ionBeam.material.opacity = 0.1 + 0.05 * Math.sin(time * 8);
    };

    // Quiz
    group.userData.quiz = [
        {
            question: "What is the primary function of the Hollow Cathode in a Hall Effect Thruster?",
            options: ["To supply electrons for ionization and beam neutralization", "To generate the magnetic field", "To accelerate the ions", "To store the propellant"],
            answer: "To supply electrons for ionization and beam neutralization"
        },
        {
            question: "Which component creates the radial magnetic field across the discharge channel?",
            options: ["The Anode", "The Magnetic Circuit and Poles", "The Insulator Ring", "The Hollow Cathode"],
            answer: "The Magnetic Circuit and Poles"
        },
        {
            question: "What is the purpose of the radial magnetic field?",
            options: ["To trap electrons, forcing them to spiral and increasing ionization efficiency", "To accelerate ions out of the thruster", "To heat up the propellant", "To neutralize the exhaust beam"],
            answer: "To trap electrons, forcing them to spiral and increasing ionization efficiency"
        },
        {
            question: "Why is an Insulator Ring (often made of boron nitride) used in the discharge channel?",
            options: ["To prevent ions from escaping", "To protect the magnetic poles from plasma erosion and prevent electrical shorting", "To increase the thrust", "To conduct heat away from the plasma"],
            answer: "To protect the magnetic poles from plasma erosion and prevent electrical shorting"
        },
        {
            question: "How are ions accelerated in a Hall Effect Thruster?",
            options: ["By a physical nozzle", "By chemical combustion", "By the axial electric field created between the anode and the trapped electron cloud", "By the magnetic field pushing them out"],
            answer: "By the axial electric field created between the anode and the trapped electron cloud"
        },
        {
            question: "What defines the 'Hall effect' in this thruster?",
            options: ["The creation of a physical hall for ions to pass through", "The azimuthal (circumferential) drift of electrons due to perpendicular electric and magnetic fields", "The heating of gas until it becomes a plasma", "The neutralization of the ion beam"],
            answer: "The azimuthal (circumferential) drift of electrons due to perpendicular electric and magnetic fields"
        }
    ];

    return group;
}
