import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Emissive Materials for High-Tech look
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0022ff,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0022,
        emissive: 0xcc0011,
        emissiveIntensity: 2,
        roughness: 0.1,
        metalness: 0.8
    });

    const electronUpMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const electronDownMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const fieldLineMat = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xaa8800,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });

    // Helper for adding parts
    function addPart(name, mesh, description, functionDesc, assemblyOrder, connections, originalPos, explodedPos, materialName = 'steel') {
        mesh.position.copy(originalPos);
        mesh.name = name;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name,
            description,
            material: materialName,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect: 'System collapse, loss of structural integrity or loss of signal.',
            cascadeFailures: ['Vacuum breach', 'Thermal runaway', 'Quantum decoherence'],
            originalPosition: { x: originalPos.x, y: originalPos.y, z: originalPos.z },
            explodedPosition: { x: explodedPos.x, y: explodedPos.y, z: explodedPos.z }
        });
    }

    // 1. BASE CRYOGENIC STAGE (Lathe)
    const basePoints = [];
    for(let i=0; i<=20; i++) {
        const t = i / 20;
        const radius = 15 - Math.pow(t, 2) * 5 + Math.sin(t * Math.PI * 8) * 0.5;
        const height = t * 10 - 15;
        basePoints.push(new THREE.Vector2(radius, height));
    }
    const baseGeo = new THREE.LatheGeometry(basePoints, 128);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    addPart('CryogenicStage', baseMesh, 'Main cryogenic cooling platform for maintaining superconducting temperatures.', 'Cools spintronic elements to eliminate thermal noise.', 1, ['VacuumFlange'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -20, 0), 'darkSteel');

    // 2. COOLING FINS
    const finGroup = new THREE.Group();
    for(let i=0; i<15; i++) {
        const finGeo = new THREE.TorusGeometry(14, 0.2, 16, 100);
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.rotation.x = Math.PI / 2;
        fin.position.y = -14 + i * 0.6;
        finGroup.add(fin);
    }
    addPart('CoolingFins', finGroup, 'Radial cooling fins for heat dissipation.', 'Increases surface area for heat exchange.', 2, ['CryogenicStage'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -30, 0), 'aluminum');

    // 3. VACUUM FLANGE
    const flangeShape = new THREE.Shape();
    flangeShape.absarc(0, 0, 16, 0, Math.PI * 2, false);
    const flangeHole = new THREE.Path();
    flangeHole.absarc(0, 0, 12, 0, Math.PI * 2, true);
    flangeShape.holes.push(flangeHole);
    const flangeGeo = new THREE.ExtrudeGeometry(flangeShape, { depth: 1, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 3, curveSegments: 32 });
    const flangeMesh = new THREE.Mesh(flangeGeo, steel);
    flangeMesh.rotation.x = Math.PI / 2;
    addPart('VacuumFlange', flangeMesh, 'Heavy-duty steel flange.', 'Seals the ultra-high vacuum chamber.', 3, ['CryogenicStage', 'GlassChamber'], new THREE.Vector3(0, -4, 0), new THREE.Vector3(0, -10, 0), 'steel');

    // 4. BOLTS FOR FLANGE
    const boltsGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const boltGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 6);
        const bolt = new THREE.Mesh(boltGeo, chrome);
        bolt.position.set(Math.cos(angle) * 14, -3.5, Math.sin(angle) * 14);
        boltsGroup.add(bolt);
    }
    addPart('FlangeBolts', boltsGroup, 'Hexagonal titanium bolts.', 'Secures the vacuum flange.', 4, ['VacuumFlange'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -15, 0), 'chrome');

    // 5. PINNED MAGNETIC LAYER (Bottom Layer)
    const layerShape = new THREE.Shape();
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        if(i === 0) layerShape.moveTo(Math.cos(angle)*6, Math.sin(angle)*6);
        else layerShape.lineTo(Math.cos(angle)*6, Math.sin(angle)*6);
    }
    // Add micro-structure holes
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const hole = new THREE.Path();
        hole.absarc(Math.cos(angle)*3, Math.sin(angle)*3, 0.5, 0, Math.PI*2, true);
        layerShape.holes.push(hole);
    }
    const pinnedGeo = new THREE.ExtrudeGeometry(layerShape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, curveSegments: 16 });
    const pinnedMesh = new THREE.Mesh(pinnedGeo, neonBlue); // Representing fixed magnetization
    pinnedMesh.rotation.x = Math.PI / 2;
    addPart('PinnedMagneticLayer', pinnedMesh, 'Hard ferromagnetic layer (e.g. CoFeB) with fixed magnetization.', 'Provides a reference spin orientation for electrons.', 5, ['BottomElectrode', 'CopperSpacer'], new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, -5, 0), 'neonBlue');

    // 6. COPPER SPACER LAYER (Non-magnetic)
    const spacerGeo = new THREE.ExtrudeGeometry(layerShape, { depth: 0.2, bevelEnabled: false, curveSegments: 16 });
    const spacerMesh = new THREE.Mesh(spacerGeo, copper);
    spacerMesh.rotation.x = Math.PI / 2;
    addPart('CopperSpacer', spacerMesh, 'Ultra-thin non-magnetic conductive layer.', 'Separates the magnetic layers while allowing spin-polarized electrons to tunnel/pass.', 6, ['PinnedMagneticLayer', 'FreeMagneticLayer'], new THREE.Vector3(0, -0.3, 0), new THREE.Vector3(0, 0, 0), 'copper');

    // 7. FREE MAGNETIC LAYER (Top Layer)
    const freeGeo = new THREE.ExtrudeGeometry(layerShape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, curveSegments: 16 });
    const freeMesh = new THREE.Mesh(freeGeo, neonRed);
    freeMesh.rotation.x = Math.PI / 2;
    addPart('FreeMagneticLayer', freeMesh, 'Soft ferromagnetic layer whose magnetization can be flipped by an external field.', 'Acts as a spin detector based on alignment with the pinned layer.', 7, ['CopperSpacer', 'TopElectrode'], new THREE.Vector3(0, 0.4, 0), new THREE.Vector3(0, 5, 0), 'neonRed');

    // 8. BOTTOM ELECTRODE (Lathe)
    const elecPoints = [];
    elecPoints.push(new THREE.Vector2(0, 0));
    elecPoints.push(new THREE.Vector2(2, 0));
    elecPoints.push(new THREE.Vector2(1, 2));
    elecPoints.push(new THREE.Vector2(0.5, 8));
    elecPoints.push(new THREE.Vector2(0, 8));
    const elecGeo = new THREE.LatheGeometry(elecPoints, 64);
    const bottomElec = new THREE.Mesh(elecGeo, copper);
    bottomElec.rotation.x = Math.PI;
    addPart('BottomElectrode', bottomElec, 'Lower electrical contact.', 'Injects unpolarized current into the spin valve.', 8, ['PinnedMagneticLayer'], new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, -10, 0), 'copper');

    // 9. TOP ELECTRODE
    const topElec = new THREE.Mesh(elecGeo, copper);
    addPart('TopElectrode', topElec, 'Upper electrical contact.', 'Collects the modulated current after GMR scattering.', 9, ['FreeMagneticLayer'], new THREE.Vector3(0, 0.9, 0), new THREE.Vector3(0, 10, 0), 'copper');

    // 10. ELECTROMAGNET CORE LEFT
    const coreGeo = new THREE.CylinderGeometry(1.5, 1.5, 12, 32);
    const coreLeft = new THREE.Mesh(coreGeo, darkSteel);
    coreLeft.rotation.z = Math.PI / 2;
    addPart('MagneticCoreLeft', coreLeft, 'Soft iron core for electromagnet.', 'Focuses the magnetic flux onto the free layer.', 10, ['CoilLeft'], new THREE.Vector3(-12, 0, 0), new THREE.Vector3(-25, 0, 0), 'darkSteel');

    // 11. ELECTROMAGNET COILS LEFT
    const coilGroupLeft = new THREE.Group();
    for(let i=0; i<40; i++) {
        const coilRingGeo = new THREE.TorusGeometry(2.5, 0.2, 16, 32);
        const coilRing = new THREE.Mesh(coilRingGeo, copper);
        coilRing.rotation.y = Math.PI / 2;
        coilRing.position.x = -17 + (i * 0.25);
        coilGroupLeft.add(coilRing);
    }
    addPart('CoilLeft', coilGroupLeft, 'Superconducting copper windings.', 'Generates external magnetic field to flip the free layer.', 11, ['MagneticCoreLeft'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(-30, 0, 0), 'copper');

    // 12. ELECTROMAGNET CORE RIGHT
    const coreRight = new THREE.Mesh(coreGeo, darkSteel);
    coreRight.rotation.z = Math.PI / 2;
    addPart('MagneticCoreRight', coreRight, 'Soft iron core for electromagnet.', 'Completes the magnetic flux circuit.', 12, ['CoilRight'], new THREE.Vector3(12, 0, 0), new THREE.Vector3(25, 0, 0), 'darkSteel');

    // 13. ELECTROMAGNET COILS RIGHT
    const coilGroupRight = new THREE.Group();
    for(let i=0; i<40; i++) {
        const coilRingGeo = new THREE.TorusGeometry(2.5, 0.2, 16, 32);
        const coilRing = new THREE.Mesh(coilRingGeo, copper);
        coilRing.rotation.y = Math.PI / 2;
        coilRing.position.x = 17 - (i * 0.25);
        coilGroupRight.add(coilRing);
    }
    addPart('CoilRight', coilGroupRight, 'Superconducting copper windings.', 'Works with left coil to generate homogeneous B-field.', 13, ['MagneticCoreRight'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 0, 0), 'copper');

    // 14. MAGNETIC FIELD LINES VISUALIZER
    const fieldLinesGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-9, 0, Math.cos(i*Math.PI/4)*2),
            new THREE.Vector3(-4, Math.sin(i*Math.PI/4)*4, Math.cos(i*Math.PI/4)*4),
            new THREE.Vector3(4, Math.sin(i*Math.PI/4)*4, Math.cos(i*Math.PI/4)*4),
            new THREE.Vector3(9, 0, Math.cos(i*Math.PI/4)*2)
        );
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
        const line = new THREE.Mesh(tubeGeo, fieldLineMat);
        fieldLinesGroup.add(line);
    }
    addPart('FieldLines', fieldLinesGroup, 'Visualization of magnetic flux lines.', 'Shows the external field penetrating the free layer.', 14, [], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 15, 0), 'glass');

    // 15. ELECTRON SPIN STREAM (Complex Particle System representation)
    const electronGroup = new THREE.Group();
    const electrons = [];
    for(let i=0; i<60; i++) {
        const elGroup = new THREE.Group();
        
        // Electron body
        const elGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const isUp = i % 2 === 0;
        const elMesh = new THREE.Mesh(elGeo, isUp ? electronUpMat : electronDownMat);
        elGroup.add(elMesh);

        // Spin vector arrow
        const arrowGeo = new THREE.ConeGeometry(0.1, 0.4, 16);
        const arrowMesh = new THREE.Mesh(arrowGeo, isUp ? electronUpMat : electronDownMat);
        arrowMesh.position.y = isUp ? 0.3 : -0.3;
        arrowMesh.rotation.x = isUp ? 0 : Math.PI;
        elGroup.add(arrowMesh);
        
        // Spin ring
        const ringGeo = new THREE.TorusGeometry(0.25, 0.02, 16, 32);
        const ringMesh = new THREE.Mesh(ringGeo, isUp ? electronUpMat : electronDownMat);
        ringMesh.rotation.x = Math.PI/2;
        elGroup.add(ringMesh);

        elGroup.userData = {
            isUp: isUp,
            offsetY: Math.random() * 16 - 8,
            speed: 0.05 + Math.random() * 0.05,
            radius: Math.random() * 2,
            angle: Math.random() * Math.PI * 2
        };

        electronGroup.add(elGroup);
        electrons.push(elGroup);
    }
    addPart('ElectronStream', electronGroup, 'Flow of conduction electrons with distinct spin states (up/down).', 'Illustrates spin-dependent scattering in the GMR effect.', 15, ['TopElectrode', 'BottomElectrode'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 20, 0), 'glass');
    meshes['electrons'] = electrons;

    // 16. SENSOR PROBES & HYDRAULICS
    const probeGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const pAngle = (i / 4) * Math.PI * 2;
        
        // Piston casing
        const caseGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
        const caseMesh = new THREE.Mesh(caseGeo, darkSteel);
        caseMesh.position.set(Math.cos(pAngle)*7, 2, Math.sin(pAngle)*7);
        caseMesh.lookAt(new THREE.Vector3(0,0,0));
        probeGroup.add(caseMesh);

        // Piston rod
        const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
        const rodMesh = new THREE.Mesh(rodGeo, chrome);
        rodMesh.position.set(Math.cos(pAngle)*5.5, 1, Math.sin(pAngle)*5.5);
        rodMesh.lookAt(new THREE.Vector3(0,0,0));
        probeGroup.add(rodMesh);
        
        // Probe tip
        const tipGeo = new THREE.ConeGeometry(0.2, 1, 16);
        const tipMesh = new THREE.Mesh(tipGeo, copper);
        tipMesh.position.set(Math.cos(pAngle)*4, 0.5, Math.sin(pAngle)*4);
        tipMesh.lookAt(new THREE.Vector3(0,0,0));
        tipMesh.rotation.x -= Math.PI/2;
        probeGroup.add(tipMesh);
    }
    addPart('DiagnosticProbes', probeGroup, 'High-precision nano-voltmeters and tunneling probes.', 'Measures the magnetoresistance ratio.', 16, ['FreeMagneticLayer'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -15), 'chrome');

    // 17. GLASS ENCLOSURE (Tinted)
    const glassGeo = new THREE.CylinderGeometry(14, 14, 30, 64, 1, true);
    const glassMesh = new THREE.Mesh(glassGeo, tinted);
    addPart('GlassChamber', glassMesh, 'Ultra-high vacuum tempered glass enclosure.', 'Maintains vacuum and shields from external electromagnetic noise.', 17, ['VacuumFlange'], new THREE.Vector3(0, 11, 0), new THREE.Vector3(0, 30, 0), 'tinted');

    // 18. STRUCTURAL CAGE
    const cageGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const cAngle = (i / 8) * Math.PI * 2;
        const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 30, 16);
        const pillar = new THREE.Mesh(pillarGeo, steel);
        pillar.position.set(Math.cos(cAngle)*14.2, 11, Math.sin(cAngle)*14.2);
        cageGroup.add(pillar);
        
        // Add glowing neon strips on pillars
        const stripGeo = new THREE.CylinderGeometry(0.32, 0.32, 10, 16);
        const strip = new THREE.Mesh(stripGeo, neonBlue);
        strip.position.set(Math.cos(cAngle)*14.2, 11, Math.sin(cAngle)*14.2);
        cageGroup.add(strip);
    }
    // Top ring
    const topRingGeo = new THREE.TorusGeometry(14.2, 0.4, 16, 64);
    const topRing = new THREE.Mesh(topRingGeo, darkSteel);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.y = 26;
    cageGroup.add(topRing);
    
    addPart('StructuralCage', cageGroup, 'Reinforced steel cage with biometric feedback strips.', 'Protects the delicate glass chamber from implosion.', 18, ['VacuumFlange'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 40, 0), 'steel');

    // 19. CONTROL CONSOLE
    const consoleGeo = new THREE.ExtrudeGeometry(
        new THREE.Shape([
            new THREE.Vector2(-4, 0),
            new THREE.Vector2(4, 0),
            new THREE.Vector2(4, 3),
            new THREE.Vector2(2, 6),
            new THREE.Vector2(-2, 6),
            new THREE.Vector2(-4, 3)
        ]),
        { depth: 8, bevelEnabled: true, bevelThickness: 0.5, curveSegments: 8 }
    );
    const consoleMesh = new THREE.Mesh(consoleGeo, plastic);
    consoleMesh.rotation.y = Math.PI / 2;
    consoleMesh.position.set(0, -18, 16);

    // Console Screen
    const screenGeo = new THREE.PlaneGeometry(6, 3);
    const screenMesh = new THREE.Mesh(screenGeo, neonBlue);
    screenMesh.position.set(0, 4.5, 2.1);
    screenMesh.rotation.x = -Math.PI / 6;
    consoleMesh.add(screenMesh);
    
    addPart('ControlConsole', consoleMesh, 'Quantum spin diagnostic interface.', 'Controls the applied magnetic field and measures resistance.', 19, ['CryogenicStage'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -10, 30), 'plastic');


    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "What is the primary function of the Copper Spacer in a Spin Valve?",
            options: [
                "To generate a strong magnetic field",
                "To cool down the system",
                "To separate magnetic layers while allowing spin-polarized electrons to pass",
                "To absorb excess electrons"
            ],
            correctAnswer: 2,
            explanation: "The non-magnetic conductive spacer (like Copper) prevents direct magnetic exchange coupling between the ferromagnetic layers while being thin enough to allow electrons to pass through without losing their spin orientation."
        },
        {
            question: "What physical phenomenon occurs when the magnetizations of the Pinned and Free layers are anti-parallel?",
            options: [
                "Giant Magnetoresistance (high electrical resistance)",
                "Superconductivity (zero electrical resistance)",
                "Thermal runaway",
                "Nuclear magnetic resonance"
            ],
            correctAnswer: 0,
            explanation: "When the layers are anti-parallel, electrons of both spin-up and spin-down experience strong scattering in at least one of the layers, leading to a high overall electrical resistance known as Giant Magnetoresistance (GMR)."
        },
        {
            question: "Why is the Pinned Magnetic Layer 'pinned'?",
            options: [
                "It is physically bolted to the chassis",
                "Its magnetization is fixed and unaffected by small external fields",
                "It restricts the flow of electrons",
                "It is glued using cryogenic epoxy"
            ],
            correctAnswer: 1,
            explanation: "The pinned layer is typically coupled to an antiferromagnetic layer, locking its magnetic orientation in place. It serves as a fixed reference for the electron spins."
        },
        {
            question: "What dictates whether an electron easily passes through the Free Magnetic Layer?",
            options: [
                "The temperature of the cryogenic stage",
                "The physical density of the copper",
                "The alignment of the electron's spin with the layer's magnetization",
                "The speed of the electron"
            ],
            correctAnswer: 2,
            explanation: "Spin-dependent scattering means that an electron whose spin is parallel to the layer's magnetization scatters less (lower resistance) than one whose spin is anti-parallel."
        },
        {
            question: "How does the external electromagnet influence the Spin Valve?",
            options: [
                "It forces the copper to become magnetic",
                "It flips the magnetization direction of the Free Magnetic Layer",
                "It physically rotates the entire device",
                "It provides electrical power to the console"
            ],
            correctAnswer: 1,
            explanation: "The applied magnetic field from the coils is strong enough to reorient the 'soft' Free Magnetic Layer, switching the device between parallel (low resistance) and anti-parallel (high resistance) states."
        }
    ];

    // ==========================================
    // ANIMATION FUNCTION
    // ==========================================
    let cycle = 0;

    function animate(time, speed, currentMeshes) {
        cycle += speed * 0.01;

        // 1. Oscillate Free Layer Color/Magnetization to simulate flipping
        const isParallel = Math.sin(cycle * 0.5) > 0;
        if(isParallel) {
            currentMeshes['FreeMagneticLayer'].material = neonBlue; // Parallel to pinned layer
            currentMeshes['FieldLines'].material.color.setHex(0x0044ff);
        } else {
            currentMeshes['FreeMagneticLayer'].material = neonRed;  // Anti-parallel
            currentMeshes['FieldLines'].material.color.setHex(0xff0022);
        }
        
        // Pulse field lines opacity
        currentMeshes['FieldLines'].material.opacity = 0.2 + Math.abs(Math.sin(cycle * 2)) * 0.4;
        
        // Pulse the electromagnets slightly to show power draw
        const scalePulse = 1 + Math.abs(Math.sin(cycle * 0.5)) * 0.05;
        currentMeshes['CoilLeft'].scale.set(scalePulse, scalePulse, scalePulse);
        currentMeshes['CoilRight'].scale.set(scalePulse, scalePulse, scalePulse);

        // 2. Animate Electrons flowing from Bottom to Top Electrode
        const els = currentMeshes['electrons'];
        els.forEach(el => {
            const data = el.userData;
            data.offsetY += data.speed * speed * 30;
            
            // Loop electrons back to bottom
            if(data.offsetY > 10) {
                data.offsetY = -10;
                // Re-randomize position
                data.radius = Math.random() * 2;
                data.angle = Math.random() * Math.PI * 2;
            }

            el.position.x = Math.cos(data.angle) * data.radius;
            el.position.z = Math.sin(data.angle) * data.radius;
            el.position.y = data.offsetY;

            // Spin the electron ring
            el.children[2].rotation.z += data.speed * speed * 60;

            // Apply GMR scattering logic visually
            // If in free layer region (y between 0 and 1)
            if(data.offsetY > 0 && data.offsetY < 1) {
                // If electron spin doesn't match free layer, scatter wildly
                const electronMatches = (data.isUp && isParallel) || (!data.isUp && !isParallel);
                
                if(!electronMatches) {
                    // Strong scattering: jitter position
                    el.position.x += (Math.random() - 0.5) * 0.5;
                    el.position.z += (Math.random() - 0.5) * 0.5;
                    el.scale.set(0.5, 0.5, 0.5); // "Loses energy"
                } else {
                    // Passes cleanly
                    el.scale.set(1, 1, 1);
                }
            } else {
                el.scale.set(1, 1, 1);
            }
        });
        
        // 3. Rotate Cooling Fins
        currentMeshes['CoolingFins'].rotation.y += speed * 0.02;

        // 4. Animate Control Console Screen (Flicker)
        if(currentMeshes['ControlConsole']) {
            const screen = currentMeshes['ControlConsole'].children[0];
            if(screen) {
                screen.material.emissiveIntensity = 1 + Math.random() * 0.5;
            }
        }
    }

    return {
        group,
        parts,
        description: "An advanced Spintronics Spin Valve demonstrating Giant Magnetoresistance (GMR). Features hyper-detailed cryogenic cooling, ultra-high vacuum containment, superconducting electromagnets, and an active subatomic simulation of spin-polarized electron scattering through magnetic thin films.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createSpinValve() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
