export function createScramjetEngine(THREE) {
    const group = new THREE.Group();

    // 1. Inlet Cone
    const inletGeo = new THREE.CylinderGeometry(0.1, 1, 3, 32);
    inletGeo.rotateX(Math.PI / 2);
    const inletMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const inletCone = new THREE.Mesh(inletGeo, inletMat);
    inletCone.position.set(0, 0, 3.5);
    group.add(inletCone);

    // 2. Isolator
    const isoGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    isoGeo.rotateX(Math.PI / 2);
    const isoMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.5 });
    const isolator = new THREE.Mesh(isoGeo, isoMat);
    isolator.position.set(0, 0, 1);
    group.add(isolator);

    // 3. Fuel Injectors
    const fuelGeo = new THREE.TorusGeometry(0.8, 0.05, 16, 32);
    const fuelMat = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.9, roughness: 0.1 });
    const fuelInjectors = new THREE.Mesh(fuelGeo, fuelMat);
    fuelInjectors.position.set(0, 0, 0);
    group.add(fuelInjectors);

    // 4. Combustion Chamber
    const combGeo = new THREE.CylinderGeometry(1, 1.2, 2, 32);
    combGeo.rotateX(Math.PI / 2);
    const combMat = new THREE.MeshStandardMaterial({ color: 0x331111, metalness: 0.5, roughness: 0.7 });
    const combustionChamber = new THREE.Mesh(combGeo, combMat);
    combustionChamber.position.set(0, 0, -1);
    group.add(combustionChamber);

    // 5. Flame Holder
    const flameGeo = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
    const flameMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0x882200, metalness: 0.3, roughness: 0.4 });
    const flameHolder = new THREE.Mesh(flameGeo, flameMat);
    flameHolder.position.set(0, 0, -1);
    group.add(flameHolder);

    // 6. Cooling Jacket
    const coolGeo = new THREE.CylinderGeometry(1.25, 1.25, 2, 32, 1, true);
    coolGeo.rotateX(Math.PI / 2);
    const coolMat = new THREE.MeshStandardMaterial({ color: 0xb87333, wireframe: true, transparent: true });
    const coolingJacket = new THREE.Mesh(coolGeo, coolMat);
    coolingJacket.position.set(0, 0, -1);
    group.add(coolingJacket);

    // 7. Nozzle
    const nozGeo = new THREE.CylinderGeometry(1.2, 2, 3, 32);
    nozGeo.rotateX(Math.PI / 2);
    const nozMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7, roughness: 0.4 });
    const nozzle = new THREE.Mesh(nozGeo, nozMat);
    nozzle.position.set(0, 0, -3.5);
    group.add(nozzle);

    // 8. Expansion Ramp
    const rampGeo = new THREE.BoxGeometry(4, 0.2, 3);
    const rampMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });
    const expansionRamp = new THREE.Mesh(rampGeo, rampMat);
    expansionRamp.position.set(0, -1.5, -6.5);
    expansionRamp.rotation.x = -Math.PI / 12; // tilt it
    group.add(expansionRamp);

    // 9. Outer Shell
    const shellGeo = new THREE.CylinderGeometry(1.2, 2.2, 10, 32, 1, true);
    shellGeo.rotateX(Math.PI / 2);
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const outerShell = new THREE.Mesh(shellGeo, shellMat);
    outerShell.position.set(0, 0, -1);
    group.add(outerShell);

    // 10. Exhaust Plume
    const plumeGeo = new THREE.CylinderGeometry(1.8, 3, 5, 32);
    plumeGeo.rotateX(Math.PI / 2);
    const plumeMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const exhaustPlume = new THREE.Mesh(plumeGeo, plumeMat);
    exhaustPlume.position.set(0, 0, -7.5);
    group.add(exhaustPlume);

    group.tick = function(time) {
        const t = time * 0.005;

        // Exhaust plume pulsates
        exhaustPlume.scale.set(1 + 0.05 * Math.sin(t * 10), 1 + 0.05 * Math.sin(t * 10), 1 + 0.15 * Math.sin(t * 20));
        exhaustPlume.material.opacity = 0.5 + 0.2 * Math.sin(t * 15);
        exhaustPlume.material.color.setHSL((0.6 + 0.1 * Math.sin(t * 5)) % 1, 1, 0.5); // Color shift from blue to slightly cyan
        
        // Flame holder glow pulsates
        flameHolder.material.emissiveIntensity = 1 + 0.5 * Math.sin(t * 12);
        
        // Fuel injectors rotate
        fuelInjectors.rotation.z = t * 2;
        
        // Cooling jacket slight pulse to simulate flow
        coolingJacket.material.opacity = 0.6 + 0.4 * Math.sin(t * 5);
    };

    group.userData.quiz = [
        {
            question: "What does the 'scram' in scramjet stand for?",
            options: ["Supersonic Combustion Ramjet", "Sonic Compressed Ramjet", "Supercritical Ramjet", "Stratospheric Combustion Ramjet"],
            answer: "Supersonic Combustion Ramjet"
        },
        {
            question: "How does a scramjet compress incoming air?",
            options: ["Using a rotating compressor", "Using shockwaves from the vehicle's high speed", "Using a fan driven by a turbine", "Using liquid oxygen tanks"],
            answer: "Using shockwaves from the vehicle's high speed"
        },
        {
            question: "At what speeds do scramjets typically operate effectively?",
            options: ["Subsonic (Mach < 1)", "Transonic (Mach 1)", "Supersonic (Mach 2 - 3)", "Hypersonic (Mach > 5)"],
            answer: "Hypersonic (Mach > 5)"
        },
        {
            question: "What is the purpose of the isolator in a scramjet engine?",
            options: ["To store fuel", "To prevent unstart by isolating the inlet from combustion pressure fluctuations", "To cool the engine exterior", "To steer the vehicle"],
            answer: "To prevent unstart by isolating the inlet from combustion pressure fluctuations"
        },
        {
            question: "Why are flame holders used in the combustion chamber?",
            options: ["To stabilize the flame in the extremely fast supersonic airflow", "To increase the weight of the engine", "To reduce the temperature", "To ignite the fuel initially"],
            answer: "To stabilize the flame in the extremely fast supersonic airflow"
        },
        {
            question: "What mechanism is typically used to prevent the engine from melting due to extreme temperatures?",
            options: ["Regenerative cooling using the engine's own fuel", "Large radiators on the wings", "Flying exclusively at night", "Spraying water into the engine"],
            answer: "Regenerative cooling using the engine's own fuel"
        }
    ];

    return group;
}
