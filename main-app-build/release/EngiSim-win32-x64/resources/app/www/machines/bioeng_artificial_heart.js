import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom materials for biological/high-tech feel
    const oxygenatedMat = new THREE.MeshPhysicalMaterial({
        color: 0xff0033,
        emissive: 0xff0033,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5
    });

    const deoxygenatedMat = new THREE.MeshPhysicalMaterial({
        color: 0x0033ff,
        emissive: 0x0033ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5
    });

    const diaphragmMat = new THREE.MeshStandardMaterial({
        color: 0xcc00cc,
        emissive: 0x660066,
        emissiveIntensity: 0.4,
        roughness: 0.4,
        metalness: 0.1
    });

    const housingMat = new THREE.MeshPhysicalMaterial({
        color: 0xdddddd,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transmission: 0.2
    });

    const connectorMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.9,
        roughness: 0.5
    });

    const addPart = (mesh, name, desc, matName, func, order, conns, failEff, cascade, origPos, explPos) => {
        mesh.position.set(origPos.x, origPos.y, origPos.z);
        mesh.userData = { name };
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        parts.push({
            name,
            description: desc,
            material: matName,
            function: func,
            assemblyOrder: order,
            connections: conns,
            failureEffect: failEff,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos,
            mesh
        });
    };

    // 1. Left Ventricle Housing
    const lvGeo = new THREE.CapsuleGeometry(1.5, 2, 32, 32);
    const lvMesh = new THREE.Mesh(lvGeo, housingMat);
    addPart(lvMesh, "Left Ventricle Housing", "Main pumping chamber for oxygenated blood", "Titanium/Polyurethane", "Pumps oxygenated blood to the body", 1, ["Aorta Connector", "Left Atrium Connector", "Left Diaphragm"], "Loss of systemic circulation", ["Organ failure", "Brain hypoxia"], {x: 1.2, y: 0, z: 0}, {x: 4, y: 0, z: 2});

    // 2. Right Ventricle Housing
    const rvGeo = new THREE.CapsuleGeometry(1.4, 1.8, 32, 32);
    const rvMesh = new THREE.Mesh(rvGeo, housingMat);
    addPart(rvMesh, "Right Ventricle Housing", "Pumping chamber for deoxygenated blood", "Titanium/Polyurethane", "Pumps deoxygenated blood to the lungs", 2, ["Pulmonary Artery Connector", "Right Atrium Connector", "Right Diaphragm"], "Loss of pulmonary circulation", ["Systemic hypoxia"], {x: -1.2, y: 0, z: 0}, {x: -4, y: 0, z: 2});

    // 3. Left Diaphragm (Pneumatic)
    const lDiaphGeo = new THREE.SphereGeometry(1.4, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const lDiaphMesh = new THREE.Mesh(lDiaphGeo, diaphragmMat);
    lDiaphMesh.rotation.x = Math.PI;
    addPart(lDiaphMesh, "Left Pneumatic Diaphragm", "Flexible membrane driven by air pulses", "Polyurethane", "Displaces blood in the left ventricle", 3, ["Left Ventricle Housing", "Driveline"], "Left ventricle stops pumping", ["Systemic circulatory arrest"], {x: 1.2, y: -1, z: 0}, {x: 4, y: -3, z: 2});

    // 4. Right Diaphragm (Pneumatic)
    const rDiaphGeo = new THREE.SphereGeometry(1.3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const rDiaphMesh = new THREE.Mesh(rDiaphGeo, diaphragmMat);
    rDiaphMesh.rotation.x = Math.PI;
    addPart(rDiaphMesh, "Right Pneumatic Diaphragm", "Flexible membrane driven by air pulses", "Polyurethane", "Displaces blood in the right ventricle", 4, ["Right Ventricle Housing", "Driveline"], "Right ventricle stops pumping", ["Pulmonary circulatory arrest"], {x: -1.2, y: -0.9, z: 0}, {x: -4, y: -3, z: 2});

    // 5. Aorta Connector (Oxygenated)
    const aortaGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32);
    const aortaMesh = new THREE.Mesh(aortaGeo, oxygenatedMat);
    aortaMesh.rotation.z = -Math.PI / 6;
    addPart(aortaMesh, "Aortic Outflow Tract", "Connects left ventricle to aorta", "Woven Dacron", "Routes high-pressure oxygenated blood", 5, ["Left Ventricle Housing", "Mechanical Valve"], "Aortic dissection/rupture", ["Massive internal hemorrhage"], {x: 1.8, y: 2, z: 0}, {x: 5, y: 4, z: 0});

    // 6. Pulmonary Artery Connector (Deoxygenated)
    const paGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
    const paMesh = new THREE.Mesh(paGeo, deoxygenatedMat);
    paMesh.rotation.z = Math.PI / 6;
    addPart(paMesh, "Pulmonary Outflow Tract", "Connects right ventricle to pulmonary artery", "Woven Dacron", "Routes deoxygenated blood to lungs", 6, ["Right Ventricle Housing", "Mechanical Valve"], "Pulmonary circulation fails", ["Hypoxia"], {x: -1.8, y: 1.8, z: 0}, {x: -5, y: 4, z: 0});

    // 7. Mechanical Valves (Inlet/Outlet)
    const valveGeo = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
    const valveMesh1 = new THREE.Mesh(valveGeo, connectorMat);
    valveMesh1.rotation.x = Math.PI / 2;
    addPart(valveMesh1, "Left Mechanical Valve", "Unidirectional blood flow control", "Pyrolytic Carbon", "Prevents backflow into left atrium/ventricle", 7, ["Left Ventricle Housing", "Aorta Connector"], "Blood regurgitation", ["Heart failure", "Thrombosis"], {x: 1.2, y: 1.2, z: 0}, {x: 4, y: 2.5, z: -2});

    const valveMesh2 = new THREE.Mesh(valveGeo, connectorMat);
    valveMesh2.rotation.x = Math.PI / 2;
    addPart(valveMesh2, "Right Mechanical Valve", "Unidirectional blood flow control", "Pyrolytic Carbon", "Prevents backflow into right atrium/ventricle", 8, ["Right Ventricle Housing", "Pulmonary Artery Connector"], "Blood regurgitation", ["Heart failure", "Thrombosis"], {x: -1.2, y: 1.1, z: 0}, {x: -4, y: 2.5, z: -2});

    // 8. Driveline
    const drivelineGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(0, -3, 0),
        new THREE.Vector3(2, -4, 2),
        new THREE.Vector3(3, -5, 3)
    ]), 64, 0.3, 16, false);
    const drivelineMesh = new THREE.Mesh(drivelineGeo, rubber);
    addPart(drivelineMesh, "Pneumatic Driveline", "Tubes carrying pressurized air", "Silicone/Polyurethane", "Powers the diaphragms from external console", 9, ["Left Diaphragm", "Right Diaphragm", "External Controller"], "Loss of pumping power", ["Immediate device failure", "Death"], {x: 0, y: 0, z: 0}, {x: 0, y: -6, z: 4});


    const description = "The Total Artificial Heart (TAH) is a complex bionic device designed to completely replace the two lower chambers (ventricles) of a failing heart. It utilizes pneumatic pulses from an external driveline to oscillate flexible diaphragms, precisely mimicking the pulsatile flow of a natural human heart. Constructed from advanced biocompatible materials like pyrolytic carbon and polyurethane, it maintains systemic and pulmonary circulation for patients awaiting heart transplantation.";

    const quizQuestions = [
        {
            question: "What is the primary function of the pneumatic diaphragms in the artificial heart?",
            options: [
                "To filter impurities from the blood",
                "To displace blood and create pumping action",
                "To generate electricity for the valves",
                "To oxygenate the blood directly"
            ],
            correct: 1,
            explanation: "The pneumatic diaphragms oscillate due to air pressure from the driveline, pushing blood out of the ventricles mimicking natural systole.",
            difficulty: "Medium"
        },
        {
            question: "Why are mechanical valves made of pyrolytic carbon?",
            options: [
                "It is highly magnetic",
                "It dissolves in blood over time",
                "It is extremely durable and resists blood clotting (thrombosis)",
                "It is a cheap and flexible plastic"
            ],
            correct: 2,
            explanation: "Pyrolytic carbon is used for artificial heart valves because of its exceptional thromboresistance (doesn't cause blood clots) and extreme durability to withstand millions of cycles.",
            difficulty: "Hard"
        },
        {
            question: "What does the driveline connect the artificial heart to?",
            options: [
                "The patient's lungs",
                "An external pneumatic driver/controller console",
                "The brain's nervous system",
                "An internal pacemaker battery"
            ],
            correct: 1,
            explanation: "The driveline exits the patient's body and connects to an external console that generates the precise pulses of air needed to operate the heart.",
            difficulty: "Easy"
        }
    ];

    let pulsePhase = 0;

    const animate = (time, speed, meshes) => {
        // Heartbeat animation (systole and diastole)
        pulsePhase += speed * 0.05;
        
        // Simulating the "lub-dub" double pulse
        const beat = Math.sin(pulsePhase) * Math.cos(pulsePhase * 2);
        const scaleBase = 1.0;
        const scalePulse = beat > 0 ? beat * 0.08 : 0; // Only expand
        
        // Animate housing (subtle)
        const lvMesh = meshes.find(m => m.userData.name === "Left Ventricle Housing");
        const rvMesh = meshes.find(m => m.userData.name === "Right Ventricle Housing");
        
        if (lvMesh) {
            lvMesh.scale.set(scaleBase + scalePulse, scaleBase + scalePulse * 1.2, scaleBase + scalePulse);
        }
        if (rvMesh) {
            rvMesh.scale.set(scaleBase + scalePulse, scaleBase + scalePulse * 1.2, scaleBase + scalePulse);
        }

        // Animate diaphragms (more pronounced)
        const lDiaphMesh = meshes.find(m => m.userData.name === "Left Pneumatic Diaphragm");
        const rDiaphMesh = meshes.find(m => m.userData.name === "Right Pneumatic Diaphragm");

        if (lDiaphMesh) {
            lDiaphMesh.scale.y = scaleBase + beat * 0.3;
            lDiaphMesh.material.emissiveIntensity = 0.4 + scalePulse * 5;
        }
        if (rDiaphMesh) {
            rDiaphMesh.scale.y = scaleBase + beat * 0.3;
            rDiaphMesh.material.emissiveIntensity = 0.4 + scalePulse * 5;
        }

        // Pulse the blood connectors
        const aortaMesh = meshes.find(m => m.userData.name === "Aortic Outflow Tract");
        const paMesh = meshes.find(m => m.userData.name === "Pulmonary Outflow Tract");

        if (aortaMesh) {
            aortaMesh.material.emissiveIntensity = 0.5 + scalePulse * 4;
        }
        if (paMesh) {
            paMesh.material.emissiveIntensity = 0.5 + scalePulse * 4;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createArtificialHeart() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
