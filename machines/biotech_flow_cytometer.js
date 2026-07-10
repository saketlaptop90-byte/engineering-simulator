import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const blueLaserMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const redLaserMat = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const violetLaserMat = new THREE.MeshBasicMaterial({ color: 0x8800ff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    const cellMat = new THREE.MeshPhysicalMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.5, transparent: true, opacity: 0.9, roughness: 0.1 });
    const sheathMat = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.2, transmission: 0.9, roughness: 0.0 });
    const signalMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });

    // 1. Base / Housing
    const baseGeo = new THREE.BoxGeometry(22, 2, 22);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.set(0, -1, 0);
    group.add(base);
    parts.push({
        name: "Optical Bench Chassis",
        description: "Vibration-damped base ensuring perfect alignment of lasers and optical elements.",
        material: "Dark Steel",
        function: "Structural support",
        assemblyOrder: 1,
        connections: ["Lasers", "Flow Cell", "PMT Array"],
        failureEffect: "Optical misalignment",
        cascadeFailures: ["Signal loss", "Resolution drop"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 2. Flow Cell (Hydrodynamic focusing chamber)
    const flowCellGeo = new THREE.CylinderGeometry(0.6, 0.6, 6, 32);
    const flowCell = new THREE.Mesh(flowCellGeo, glass);
    flowCell.position.set(0, 5, 0);
    group.add(flowCell);
    parts.push({
        name: "Quartz Flow Cell",
        description: "High-purity quartz cuvette where cells are individually interrogated by intersecting laser beams.",
        material: "Quartz Glass",
        function: "Hydrodynamic focusing and optical window",
        assemblyOrder: 2,
        connections: ["Fluidics", "Optics"],
        failureEffect: "Clogs or leaks",
        cascadeFailures: ["Sample loss", "Poor CVs"],
        originalPosition: { x: 0, y: 5, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // Sheath fluid visual inside flow cell
    const sheathFluid = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 5.8, 16), sheathMat);
    sheathFluid.position.set(0, 5, 0);
    group.add(sheathFluid);

    // 3. Sample Injection Tube (SIT)
    const sitGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const sit = new THREE.Mesh(sitGeo, steel);
    sit.position.set(0, 9, 0);
    group.add(sit);
    parts.push({
        name: "Sample Injection Tube (SIT)",
        description: "Fine capillary that introduces the sample core into the center of the sheath fluid stream.",
        material: "Steel",
        function: "Sample delivery",
        assemblyOrder: 3,
        connections: ["Flow Cell", "Sample Pump"],
        failureEffect: "No sample flow",
        cascadeFailures: ["No events detected"],
        originalPosition: { x: 0, y: 9, z: 0 },
        explodedPosition: { x: 0, y: 18, z: 0 }
    });

    // 4. Lasers & Beams
    // Blue Laser (488nm)
    const blueLaserBody = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 1), aluminum);
    blueLaserBody.position.set(-8, 5, 0);
    group.add(blueLaserBody);
    const blueBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 8, 8), blueLaserMat);
    blueBeam.rotation.z = Math.PI / 2;
    blueBeam.position.set(-4, 5, 0);
    group.add(blueBeam);
    
    parts.push({
        name: "488nm Blue Solid-State Laser",
        description: "Primary excitation source for scattered light (FSC/SSC) and fluorophores like FITC or PE.",
        material: "Aluminum / Diode",
        function: "Cellular excitation",
        assemblyOrder: 4,
        connections: ["Flow Cell", "Power Supply"],
        failureEffect: "Loss of 488nm excitation",
        cascadeFailures: ["No scatter signals", "No FITC/PE signals"],
        originalPosition: { x: -8, y: 5, z: 0 },
        explodedPosition: { x: -16, y: 5, z: 0 }
    });

    // Red Laser (640nm)
    const redLaserBody = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1), aluminum);
    redLaserBody.position.set(-7, 4.5, 1);
    group.add(redLaserBody);
    const redBeamGeo = new THREE.CylinderGeometry(0.04, 0.04, 7.5, 8);
    const redBeam = new THREE.Mesh(redBeamGeo, redLaserMat);
    // Angle beam towards center (0, 4.5, 0)
    redBeam.position.set(-3.5, 4.5, 0.5);
    redBeam.lookAt(0, 4.5, 0);
    redBeam.rotateX(Math.PI / 2); // Cylinder alignment
    group.add(redBeam);

    parts.push({
        name: "640nm Red Diode Laser",
        description: "Secondary laser for exciting red fluorophores like APC or Alexa Fluor 647.",
        material: "Aluminum",
        function: "Secondary excitation",
        assemblyOrder: 5,
        connections: ["Flow Cell", "Power Supply"],
        failureEffect: "Loss of 640nm excitation",
        cascadeFailures: ["No APC signals"],
        originalPosition: { x: -7, y: 4.5, z: 1 },
        explodedPosition: { x: -14, y: 2, z: 4 }
    });

    // 5. Detectors
    // Forward Scatter (FSC) Detector
    const fscBody = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16), plastic);
    fscBody.rotation.z = Math.PI / 2;
    fscBody.position.set(8, 5, 0);
    group.add(fscBody);
    parts.push({
        name: "Forward Scatter (FSC) Photodiode",
        description: "Measures light scattered at low angles (0.5 to 2 degrees) to determine relative cell size.",
        material: "Plastic / Photodiode",
        function: "Measures cell volume/size",
        assemblyOrder: 6,
        connections: ["Flow Cell", "Signal Processing"],
        failureEffect: "No size data",
        cascadeFailures: ["Cannot threshold on cells", "Loss of scatter gating"],
        originalPosition: { x: 8, y: 5, z: 0 },
        explodedPosition: { x: 16, y: 5, z: 0 }
    });

    // Side Scatter and Fluorescence PMT Array (Octagon/Trigon)
    const pmtArrayGeo = new THREE.BoxGeometry(6, 8, 5);
    const pmtArray = new THREE.Mesh(pmtArrayGeo, chrome);
    pmtArray.position.set(0, 5, -8);
    group.add(pmtArray);
    parts.push({
        name: "PMT Array & Optics Block",
        description: "Housing for Photomultiplier Tubes (PMTs), dichroic mirrors, and bandpass filters. Captures side-scattered light and fluorescence.",
        material: "Chrome / Glass",
        function: "Detects orthogonal scatter and multi-color fluorescence",
        assemblyOrder: 7,
        connections: ["Flow Cell", "Electronics"],
        failureEffect: "Loss of fluorescence data",
        cascadeFailures: ["Cannot identify cellular subpopulations"],
        originalPosition: { x: 0, y: 5, z: -8 },
        explodedPosition: { x: 0, y: 5, z: -16 }
    });

    // Orthogonal scattered light beam (from flow cell to PMTs)
    const scatterBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.4, 5, 16), signalMat);
    scatterBeam.rotation.x = Math.PI / 2;
    scatterBeam.position.set(0, 5, -3);
    group.add(scatterBeam);

    // 6. Fluidics Tanks
    const tankGeo = new THREE.CylinderGeometry(2, 2, 8, 32);
    const sheathTank = new THREE.Mesh(tankGeo, plastic);
    sheathTank.position.set(-8, 4, 8);
    group.add(sheathTank);
    parts.push({
        name: "Sheath Fluid Plenum",
        description: "Pressurized reservoir containing buffered saline. Creates the laminar flow required for hydrodynamic focusing.",
        material: "Plastic",
        function: "Provides sheath fluid",
        assemblyOrder: 8,
        connections: ["Flow Cell", "Compressor"],
        failureEffect: "Loss of core stream focusing",
        cascadeFailures: ["Clogs", "Wide CVs", "Poor sorting"],
        originalPosition: { x: -8, y: 4, z: 8 },
        explodedPosition: { x: -16, y: 8, z: 16 }
    });

    const wasteTank = new THREE.Mesh(tankGeo, tinted);
    wasteTank.position.set(8, 4, 8);
    group.add(wasteTank);
    parts.push({
        name: "Waste Fluid Reservoir",
        description: "Collects sample and sheath fluid after interrogation.",
        material: "Tinted Plastic",
        function: "Waste collection",
        assemblyOrder: 9,
        connections: ["Flow Cell", "Vacuum System"],
        failureEffect: "Waste overflow",
        cascadeFailures: ["Biohazard risk", "System shutdown"],
        originalPosition: { x: 8, y: 4, z: 8 },
        explodedPosition: { x: 16, y: 8, z: 16 }
    });

    // Tubing
    const path1 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-8, 8, 8),
        new THREE.Vector3(-4, 9, 4),
        new THREE.Vector3(0, 9, 0.5)
    );
    const tubeGeo1 = new THREE.TubeGeometry(path1, 20, 0.1, 8, false);
    const tubing1 = new THREE.Mesh(tubeGeo1, rubber);
    group.add(tubing1);

    const path2 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 2, 0.5),
        new THREE.Vector3(4, 1, 4),
        new THREE.Vector3(8, 8, 8)
    );
    const tubeGeo2 = new THREE.TubeGeometry(path2, 20, 0.1, 8, false);
    const tubing2 = new THREE.Mesh(tubeGeo2, rubber);
    group.add(tubing2);

    // Cells Array for Animation
    const cells = [];
    const cellCount = 30;
    for (let i = 0; i < cellCount; i++) {
        const cell = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), cellMat.clone());
        cell.position.set(0, 8 + (i * 0.3), 0);
        cell.userData = { offset: i * 0.3, type: Math.random() > 0.5 ? 't-cell' : 'b-cell' };
        group.add(cell);
        cells.push(cell);
    }

    const description = "Ultra High-Tech Flow Cytometer: A sophisticated instrument for multi-parametric single-cell analysis and high-speed cell sorting. Uses hydrodynamic focusing to pass cells single-file through multiple laser interrogation points, capturing scatter and fluorescence data via PMT arrays.";

    const quizQuestions = [
        {
            question: "What is the primary purpose of the sheath fluid in a flow cytometer?",
            options: [
                "To wash the cells", 
                "To provide hydrodynamic focusing of the sample core", 
                "To excite the fluorochromes", 
                "To cool the lasers"
            ],
            correct: 1,
            explanation: "Sheath fluid coaxially surrounds the sample stream, compressing it via hydrodynamic focusing so that cells pass through the laser beam strictly one by one.",
            difficulty: "Medium"
        },
        {
            question: "Forward scatter (FSC) primarily provides information about:",
            options: [
                "Cell complexity or granularity", 
                "Cell surface markers", 
                "Relative cell size/volume", 
                "DNA content"
            ],
            correct: 2,
            explanation: "FSC measures light scattered at low angles and is roughly proportional to the diameter or relative size of the cell.",
            difficulty: "Easy"
        },
        {
            question: "Side scatter (SSC) primarily provides information about:",
            options: [
                "Internal complexity or granularity", 
                "Cell size", 
                "Cell viability", 
                "Membrane integrity"
            ],
            correct: 0,
            explanation: "SSC measures light scattered orthogonally (at 90 degrees) and correlates with internal cellular complexity, such as granules or nucleus shape.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the sample pressure is increased significantly relative to the sheath pressure?",
            options: [
                "The laser power increases", 
                "The core stream widens, reducing precision and widening CVs", 
                "The cells move slower", 
                "Fluorescence intensity increases proportionally"
            ],
            correct: 1,
            explanation: "Increasing sample pressure pushes more sample volume through, widening the sample core. This allows more cells through per second but decreases focusing precision, causing cells to hit off-center parts of the laser beam, which increases measurement variance (wider CVs).",
            difficulty: "Hard"
        }
    ];

    let timeElapsed = 0;

    function animate(time, speed, meshes) {
        timeElapsed += speed * 0.01;
        
        // Pulse the lasers slightly
        blueLaserMat.opacity = 0.7 + Math.sin(time * 10) * 0.1;
        redLaserMat.opacity = 0.7 + Math.cos(time * 12) * 0.1;

        // Flow cells through the flow cell
        cells.forEach((cell, index) => {
            // Speed of flow
            cell.position.y -= speed * 0.08;
            
            // Loop cells back to top
            if (cell.position.y < 2) {
                cell.position.y = 8 + (Math.random() * 0.5);
                // Tiny random offset to simulate slight imperfections in focusing
                cell.position.x = (Math.random() - 0.5) * 0.03;
                cell.position.z = (Math.random() - 0.5) * 0.03;
            }

            // Laser Interaction logic
            // Blue Laser is at y = 5.0
            // Red Laser is at y = 4.5
            
            if (Math.abs(cell.position.y - 5.0) < 0.1) {
                // Flash intensely when hitting blue laser
                cell.material.emissiveIntensity = 3.0;
                cell.scale.set(1.5, 1.5, 1.5);
                scatterBeam.material.opacity = 0.8;
                scatterBeam.material.color.setHex(0x00ff88);
            } else if (Math.abs(cell.position.y - 4.5) < 0.1) {
                // Flash differently when hitting red laser
                if (cell.userData.type === 't-cell') {
                    cell.material.color.setHex(0xff0055);
                    cell.material.emissive.setHex(0xff0055);
                    cell.material.emissiveIntensity = 2.0;
                    scatterBeam.material.opacity = 0.6;
                    scatterBeam.material.color.setHex(0xff0055);
                } else {
                    cell.material.emissiveIntensity = 0.2;
                }
                cell.scale.set(1.2, 1.2, 1.2);
            } else {
                // Return to normal
                cell.material.emissiveIntensity = 0.5;
                cell.scale.set(1, 1, 1);
                cell.material.color.setHex(0x00ff88);
                cell.material.emissive.setHex(0x00ff88);
                
                if (Math.abs(cell.position.y - 5.0) >= 0.1 && Math.abs(cell.position.y - 4.5) >= 0.1) {
                    scatterBeam.material.opacity = 0.2; // dim scatter beam
                }
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createFlowCytometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
