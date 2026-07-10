import * as THREE from 'three';
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine() {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const chronalEnergy = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 4,
        transparent: true,
        opacity: 0.7
    });

    const voidMatter = new THREE.MeshStandardMaterial({
        color: 0x050505,
        metalness: 0.8,
        roughness: 0.2
    });

    // 1. The Paradox Engine (Central Hub)
    const engineGeo = new THREE.OctahedronGeometry(40, 0);
    const engine = new THREE.Mesh(engineGeo, chrome);
    group.add(engine);
    meshes.engine = engine;

    parts.push({
        name: 'Paradox_Engine',
        description: 'Computes quantum state vectors across all possible historical branches.',
        material: 'Chrome / Tesseract Matrix',
        function: 'Identifies timelines that threaten the stability of the central continuum.',
        assemblyOrder: 1,
        connections: ['Shear_Blades', 'Chronal_Capacitors'],
        failureEffect: 'Temporal feedback loop causing the user to have never existed.',
        cascadeFailures: ['Grandfather Paradox', 'Complete Causality Breakdown'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    // 2. Chronal Capacitors
    const capsGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const capGeo = new THREE.CylinderGeometry(10, 10, 80, 16);
        const cap = new THREE.Mesh(capGeo, voidMatter);
        
        // Energy coil inside
        const coilGeo = new THREE.TorusGeometry(8, 1, 16, 64);
        for(let j=0; j<10; j++) {
            const coil = new THREE.Mesh(coilGeo, chronalEnergy);
            coil.position.y = -30 + (j*6.6);
            coil.rotation.x = Math.PI/2;
            cap.add(coil);
        }

        const angle = (i/4) * Math.PI * 2;
        cap.position.set(Math.cos(angle)*60, 0, Math.sin(angle)*60);
        capsGroup.add(cap);
        meshes[`cap_${i}`] = cap;
    }
    group.add(capsGroup);
    meshes.capsGroup = capsGroup;

    parts.push({
        name: 'Chronal_Capacitors',
        description: 'Stores raw temporal potential extracted from collapsed futures.',
        material: 'VoidMatter / Chronal Energy',
        function: 'Powers the shearing blades.',
        assemblyOrder: 2,
        connections: ['Paradox_Engine'],
        failureEffect: 'Localized time freezing.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    // 3. The Shear Blades (Massive reality-cutting arms)
    const bladesGroup = new THREE.Group();
    
    // Blade 1
    const blade1Shape = new THREE.Shape();
    blade1Shape.moveTo(0, 0);
    blade1Shape.lineTo(0, 150);
    blade1Shape.bezierCurveTo(50, 150, 100, 100, 150, 0);
    blade1Shape.lineTo(0, 0);
    const blade1Geo = new THREE.ExtrudeGeometry(blade1Shape, { depth: 5, bevelEnabled: true, bevelSize: 2 });
    const blade1 = new THREE.Mesh(blade1Geo, darkSteel);
    blade1.position.set(-10, 0, 0);
    blade1.rotation.y = Math.PI/2;
    bladesGroup.add(blade1);
    meshes.blade1 = blade1;

    // Blade 2
    const blade2 = new THREE.Mesh(blade1Geo, darkSteel);
    blade2.position.set(10, 0, 0);
    blade2.rotation.y = -Math.PI/2;
    blade2.rotation.x = Math.PI; // flip it
    bladesGroup.add(blade2);
    meshes.blade2 = blade2;

    group.add(bladesGroup);

    parts.push({
        name: 'Ontological_Shear_Blades',
        description: 'Physical manifestations of causality-severing algorithms.',
        material: 'DarkSteel',
        function: 'Cuts away doomed or corrupted timelines from the multiverse tree.',
        assemblyOrder: 3,
        connections: ['Paradox_Engine'],
        failureEffect: 'Accidental pruning of the prime timeline.',
        cascadeFailures: ['Existence Failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 200 }
    });

    // 4. Timeline Visualizer (Instanced curves)
    const timelineCount = 500;
    const curvePoints = [];
    for(let i=0; i<10; i++) curvePoints.push(new THREE.Vector3(0, i*20, 0));
    const curveGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePoints), 20, 0.5, 8, false);
    
    const timelinesMesh = new THREE.InstancedMesh(curveGeo, chronalEnergy, timelineCount);
    for(let i=0; i<timelineCount; i++) {
        const mat = new THREE.Matrix4();
        // Spread them out like branches of a tree
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 200 + 50;
        mat.makeTranslation(Math.cos(angle)*radius, -100, Math.sin(angle)*radius);
        
        // Tilt them outward
        const tilt = new THREE.Matrix4().makeRotationZ((Math.random() - 0.5) * 1.5);
        mat.multiply(tilt);
        
        timelinesMesh.setMatrixAt(i, mat);
    }
    timelinesMesh.instanceMatrix.needsUpdate = true;
    group.add(timelinesMesh);
    meshes.timelines = { mesh: timelinesMesh, count: timelineCount };

    parts.push({
        name: 'Multiversal_Branches',
        description: 'Physical representation of branching probability vectors.',
        material: 'Chronal Energy',
        function: 'The target of the pruning shears.',
        assemblyOrder: 4,
        connections: [],
        failureEffect: 'Branch overgrowth causing universe collision.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -200 }
    });

    const description = "Timeline Pruning Shears. A monumental construct used by Type Omega entities to trim away dead, corrupted, or paradoxical timelines to preserve the health of the Prime Continuum.";

    const quizQuestions = [
        {
            question: "In quantum mechanics, what interpretation natively supports the existence of branching timelines?",
            options: [
                "Copenhagen Interpretation",
                "Many-Worlds Interpretation",
                "Pilot-Wave Theory",
                "Objective Collapse Theory"
            ],
            correctAnswer: 1,
            explanation: "The Many-Worlds Interpretation (MWI) posits that wavefunctions never collapse; instead, the universe branches into multiple distinct realities for every possible quantum outcome."
        },
        {
            question: "What is a 'closed timelike curve' (CTC) in General Relativity?",
            options: [
                "A black hole's event horizon.",
                "The boundary of the observable universe.",
                "A path in spacetime that returns to its own past.",
                "The trajectory of a photon in a vacuum."
            ],
            correctAnswer: 2,
            explanation: "A CTC is a worldline in a Lorentzian manifold (spacetime) that is closed, meaning a particle traveling along it would return to its own past, theoretically allowing time travel."
        },
        {
            question: "According to the Chronology Protection Conjecture proposed by Stephen Hawking, why is time travel to the past impossible?",
            options: [
                "Tachyons destroy any time machine.",
                "Quantum vacuum fluctuations build up to infinity and destroy the time machine before it can operate.",
                "The universe's mass is insufficient to bend spacetime that much.",
                "Time is merely a psychological construct."
            ],
            correctAnswer: 1,
            explanation: "Hawking proposed that the laws of physics prevent time travel on all but sub-microscopic scales, specifically arguing that vacuum fluctuations would diverge to infinity and destroy the CTC."
        },
        {
            question: "If you cut a timeline, what happens to the entropy of the multiverse system (assuming it is an isolated system)?",
            options: [
                "It must always decrease.",
                "It must always increase or remain constant.",
                "It becomes zero.",
                "It fluctuates wildly."
            ],
            correctAnswer: 1,
            explanation: "The Second Law of Thermodynamics states that the total entropy of an isolated system can never decrease over time. Even in a multiverse scenario, the global entropy bound must increase."
        },
        {
            question: "What paradox involves traveling back in time and preventing a causal event from happening, thus preventing the time travel itself?",
            options: [
                "Fermi Paradox",
                "Twin Paradox",
                "Bootstrap Paradox",
                "Grandfather Paradox"
            ],
            correctAnswer: 3,
            explanation: "The Grandfather Paradox is a famous inconsistency in time travel scenarios where an event prevents its own cause (e.g., killing one's grandfather prevents one's own birth)."
        }
    ];

    function animate(time, speed, meshesObj, exploded) {
        if(meshesObj.engine) {
            meshesObj.engine.rotation.x = time * speed * 2;
            meshesObj.engine.rotation.y = time * speed * 1.5;
        }

        if(!exploded) {
            // Scissor action
            if(meshesObj.blade1 && meshesObj.blade2) {
                // Open and close slowly
                const angle = (Math.sin(time * speed * 0.5) + 1) * 0.2; // 0 to 0.4 rads
                meshesObj.blade1.rotation.z = angle;
                meshesObj.blade2.rotation.z = -angle + Math.PI; // account for flip
            }

            if(meshesObj.capsGroup) {
                meshesObj.capsGroup.rotation.y = time * speed * 0.2;
            }
        }

        if(meshesObj.timelines) {
            const mesh = meshesObj.timelines.mesh;
            const count = meshesObj.timelines.count;
            const dummy = new THREE.Object3D();
            
            for(let i=0; i<count; i++) {
                mesh.getMatrixAt(i, dummy.matrix);
                const pos = new THREE.Vector3().setFromMatrixPosition(dummy.matrix);
                
                // Swaying like trees in a wind
                const sway = Math.sin(time*speed + i) * 0.01;
                const rotMatrix = new THREE.Matrix4().makeRotationX(sway);
                
                dummy.matrix.multiply(rotMatrix);
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
