import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom Materials
    const laserMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ff88, 
        emissive: 0x00ff88, 
        emissiveIntensity: 2, 
        transparent: true, 
        opacity: 0.8 
    });
    
    const beamSplitterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ffff,
        metalness: 0.2,
        roughness: 0.1,
        transmission: 0.9,
        ior: 1.5,
        transparent: true,
        opacity: 0.8,
        emissive: 0x228888,
        emissiveIntensity: 0.5
    });

    const mirrorMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.05,
        envMapIntensity: 2.0
    });

    const vacuumTubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.8,
        roughness: 0.4,
        transparent: true,
        opacity: 0.3
    });
    
    const spacetimeMaterial = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x4400aa,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    // 1. Central Station Base
    const baseGeom = new THREE.CylinderGeometry(5, 5, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.set(0, 0, 0);
    group.add(baseMesh);
    parts.push({
        name: "Central Station Beam Splitter Housing",
        description: "The main vacuum chamber housing the crucial beam splitter.",
        material: "Dark Steel",
        function: "Maintains an ultra-high vacuum environment to prevent laser scattering.",
        assemblyOrder: 1,
        connections: ["Beam Splitter", "X-Arm Tube", "Y-Arm Tube", "Laser Source"],
        failureEffect: "Loss of vacuum; noise completely overwhelms any gravitational wave signal.",
        cascadeFailures: ["Laser Path Distortion", "Mirror Degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 2. Beam Splitter
    const bsGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const bsMesh = new THREE.Mesh(bsGeom, beamSplitterMaterial);
    bsMesh.rotation.x = Math.PI / 2;
    bsMesh.rotation.y = Math.PI / 4;
    bsMesh.position.set(0, 1.5, 0);
    group.add(bsMesh);
    parts.push({
        name: "Beam Splitter",
        description: "A highly specialized half-silvered mirror.",
        material: "Coated Fused Silica",
        function: "Splits the incoming laser beam into two identical beams sent down perpendicular arms.",
        assemblyOrder: 2,
        connections: ["Central Station Base", "Laser Source"],
        failureEffect: "Unequal beam splitting or complete loss of interference pattern.",
        cascadeFailures: ["Signal Loss"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 3. Laser Source
    const laserSourceGeom = new THREE.BoxGeometry(2, 1.5, 3);
    const laserSourceMesh = new THREE.Mesh(laserSourceGeom, chrome);
    laserSourceMesh.position.set(-6, 1.5, -6);
    laserSourceMesh.lookAt(0, 1.5, 0);
    group.add(laserSourceMesh);
    parts.push({
        name: "High-Power Nd:YAG Laser",
        description: "Extremely stable continuous-wave solid-state laser.",
        material: "Chrome / Electronics",
        function: "Provides the monochromatic light necessary for precise interferometry.",
        assemblyOrder: 3,
        connections: ["Beam Splitter", "Central Station Base"],
        failureEffect: "No light source; interferometer is non-functional.",
        cascadeFailures: [],
        originalPosition: { x: -6, y: 1.5, z: -6 },
        explodedPosition: { x: -10, y: 3, z: -10 }
    });

    // Incoming Laser Beam
    const inBeamGeom = new THREE.CylinderGeometry(0.05, 0.05, 8.5, 16);
    const inBeamMesh = new THREE.Mesh(inBeamGeom, laserMaterial);
    inBeamMesh.position.set(-3, 1.5, -3);
    inBeamMesh.rotation.x = Math.PI / 2;
    inBeamMesh.rotation.z = Math.PI / 4;
    group.add(inBeamMesh);
    parts.push({
        name: "Input Laser Beam",
        description: "The primary laser beam before splitting.",
        material: "Photons",
        function: "Carries the initial phase information.",
        assemblyOrder: 4,
        connections: ["Laser Source", "Beam Splitter"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: -3, y: 1.5, z: -3 },
        explodedPosition: { x: -5, y: 5, z: -5 }
    });

    // 4. X-Arm Vacuum Tube
    const xTubeGeom = new THREE.CylinderGeometry(1.5, 1.5, 20, 32);
    const xTubeMesh = new THREE.Mesh(xTubeGeom, vacuumTubeMaterial);
    xTubeMesh.rotation.z = Math.PI / 2;
    xTubeMesh.position.set(12, 1.5, 0);
    group.add(xTubeMesh);
    parts.push({
        name: "X-Arm Vacuum Tube",
        description: "A 4km long (scaled down) ultra-high vacuum pipe.",
        material: "Steel/Glass",
        function: "Protects the laser beam from air currents and scattering.",
        assemblyOrder: 5,
        connections: ["Central Station Base", "X-Arm End Test Mass"],
        failureEffect: "Beam scatters, destroying phase coherence.",
        cascadeFailures: ["Signal Noise"],
        originalPosition: { x: 12, y: 1.5, z: 0 },
        explodedPosition: { x: 12, y: 8, z: 0 }
    });

    // X-Arm Laser Beam
    const xBeamGeom = new THREE.CylinderGeometry(0.05, 0.05, 20, 16);
    const xBeamMesh = new THREE.Mesh(xBeamGeom, laserMaterial);
    xBeamMesh.rotation.z = Math.PI / 2;
    xBeamMesh.position.set(12, 1.5, 0);
    group.add(xBeamMesh);
    
    // 5. Y-Arm Vacuum Tube
    const yTubeGeom = new THREE.CylinderGeometry(1.5, 1.5, 20, 32);
    const yTubeMesh = new THREE.Mesh(yTubeGeom, vacuumTubeMaterial);
    yTubeMesh.rotation.x = Math.PI / 2;
    yTubeMesh.position.set(0, 1.5, 12);
    group.add(yTubeMesh);
    parts.push({
        name: "Y-Arm Vacuum Tube",
        description: "The perpendicular 4km vacuum pipe.",
        material: "Steel/Glass",
        function: "Allows measurement of differential length changes.",
        assemblyOrder: 6,
        connections: ["Central Station Base", "Y-Arm End Test Mass"],
        failureEffect: "Beam scatters, destroying phase coherence.",
        cascadeFailures: ["Signal Noise"],
        originalPosition: { x: 0, y: 1.5, z: 12 },
        explodedPosition: { x: 0, y: 8, z: 12 }
    });

    // Y-Arm Laser Beam
    const yBeamGeom = new THREE.CylinderGeometry(0.05, 0.05, 20, 16);
    const yBeamMesh = new THREE.Mesh(yBeamGeom, laserMaterial);
    yBeamMesh.rotation.x = Math.PI / 2;
    yBeamMesh.position.set(0, 1.5, 12);
    group.add(yBeamMesh);

    // 6. X-Arm Test Mass (Mirror)
    const xMirrorGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const xMirrorMesh = new THREE.Mesh(xMirrorGeom, mirrorMaterial);
    xMirrorMesh.rotation.z = Math.PI / 2;
    xMirrorMesh.position.set(22, 1.5, 0);
    xMirrorMesh.name = "xMirror";
    group.add(xMirrorMesh);
    parts.push({
        name: "X-Arm End Test Mass",
        description: "A highly polished, perfectly isolated mirror.",
        material: "Fused Silica",
        function: "Reflects the laser back to the beam splitter and acts as a free-falling mass to be moved by gravitational waves.",
        assemblyOrder: 7,
        connections: ["X-Arm Vacuum Tube", "Suspension System"],
        failureEffect: "Misalignment causes beam to hit tube walls.",
        cascadeFailures: ["Total Signal Loss"],
        originalPosition: { x: 22, y: 1.5, z: 0 },
        explodedPosition: { x: 30, y: 1.5, z: 0 }
    });

    // 7. Y-Arm Test Mass (Mirror)
    const yMirrorGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const yMirrorMesh = new THREE.Mesh(yMirrorGeom, mirrorMaterial);
    yMirrorMesh.rotation.x = Math.PI / 2;
    yMirrorMesh.position.set(0, 1.5, 22);
    yMirrorMesh.name = "yMirror";
    group.add(yMirrorMesh);
    parts.push({
        name: "Y-Arm End Test Mass",
        description: "A highly polished, perfectly isolated mirror.",
        material: "Fused Silica",
        function: "Reflects the laser back to the beam splitter; moves differently than X-arm when a wave passes.",
        assemblyOrder: 8,
        connections: ["Y-Arm Vacuum Tube", "Suspension System"],
        failureEffect: "Misalignment causes beam to hit tube walls.",
        cascadeFailures: ["Total Signal Loss"],
        originalPosition: { x: 0, y: 1.5, z: 22 },
        explodedPosition: { x: 0, y: 1.5, z: 30 }
    });

    // 8. Photodetector
    const detectorGeom = new THREE.BoxGeometry(2, 2, 2);
    const detectorMesh = new THREE.Mesh(detectorGeom, aluminum);
    detectorMesh.position.set(6, 1.5, -6);
    detectorMesh.lookAt(0, 1.5, 0);
    group.add(detectorMesh);
    parts.push({
        name: "Photodetector",
        description: "Highly sensitive light detector at the anti-symmetric port.",
        material: "Semiconductor/Aluminum",
        function: "Measures the interference pattern of the recombined beams. In the absence of a GW, there is destructive interference (no light).",
        assemblyOrder: 9,
        connections: ["Central Station Base"],
        failureEffect: "Cannot read out the interference signal.",
        cascadeFailures: [],
        originalPosition: { x: 6, y: 1.5, z: -6 },
        explodedPosition: { x: 10, y: 3, z: -10 }
    });

    // Detector Beam (normally dark, flashes when wave passes)
    const outBeamGeom = new THREE.CylinderGeometry(0.05, 0.05, 8.5, 16);
    const outBeamMesh = new THREE.Mesh(outBeamGeom, laserMaterial);
    outBeamMesh.position.set(3, 1.5, -3);
    outBeamMesh.rotation.x = Math.PI / 2;
    outBeamMesh.rotation.z = -Math.PI / 4;
    outBeamMesh.material = outBeamMesh.material.clone(); // Clone to animate opacity independently
    outBeamMesh.material.opacity = 0; // Starts dark
    outBeamMesh.name = "outBeam";
    group.add(outBeamMesh);

    // 9. Spacetime Grid (Visual representation)
    const gridGeom = new THREE.PlaneGeometry(60, 60, 30, 30);
    const gridMesh = new THREE.Mesh(gridGeom, spacetimeMaterial);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -2;
    gridMesh.name = "spacetimeGrid";
    group.add(gridMesh);
    parts.push({
        name: "Spacetime Fabric (Visualization)",
        description: "A theoretical representation of the spacetime fabric.",
        material: "Neon Wireframe",
        function: "Visualizes the ripples in spacetime (Gravitational Waves) passing through the detector.",
        assemblyOrder: 10,
        connections: [],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    const description = "The Astrophysics Gravitational Wave Detector (modeled after LIGO) is a massive Michelson interferometer. It uses highly stable lasers, split and sent down two perpendicular, kilometer-scale vacuum tubes. The beams bounce off suspended test masses and recombine. When a gravitational wave passes, it stretches space in one direction and compresses it in another, altering the relative lengths of the arms and causing a measurable shift in the interference pattern at the photodetector.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Beam Splitter in a gravitational wave detector?",
            options: [
                "To amplify the laser's power",
                "To split the incoming laser into two perpendicular beams",
                "To cool the test masses",
                "To absorb stray photons"
            ],
            correct: 1,
            explanation: "The beam splitter divides the laser light so it can travel down both the X and Y arms simultaneously.",
            difficulty: "Easy"
        },
        {
            question: "Why do the laser beams travel through vacuum tubes?",
            options: [
                "To prevent the laser from burning the air",
                "To reduce the speed of light",
                "To prevent air molecules from scattering the laser light and introducing noise",
                "To keep the mirrors warm"
            ],
            correct: 2,
            explanation: "Even a few air molecules would scatter the laser photons, creating phase noise that would overwhelm the incredibly tiny signal of a gravitational wave.",
            difficulty: "Medium"
        },
        {
            question: "When no gravitational wave is present, what is the state of the light at the photodetector?",
            options: [
                "Maximum brightness (Constructive interference)",
                "Complete darkness (Destructive interference)",
                "Rapidly flashing",
                "A rainbow pattern"
            ],
            correct: 1,
            explanation: "The interferometer is 'locked' on a dark fringe. The arms are tuned so that the returning light waves perfectly cancel each other out (destructive interference) at the detector. A gravitational wave disrupts this cancellation, causing light to appear.",
            difficulty: "Hard"
        },
        {
            question: "What property of spacetime do gravitational waves alter?",
            options: [
                "Its temperature",
                "Its mass",
                "The actual distance between points (strain)",
                "The speed of light within it"
            ],
            correct: 2,
            explanation: "Gravitational waves cause a strain in spacetime, literally stretching the physical distance in one direction while compressing it in a perpendicular direction.",
            difficulty: "Medium"
        }
    ];

    // Animation logic
    let initialVertices = null;

    function animate(time, speed, meshes) {
        let xMirror, yMirror, outBeam, grid;
        
        group.children.forEach(child => {
            if (child.name === "xMirror") xMirror = child;
            if (child.name === "yMirror") yMirror = child;
            if (child.name === "outBeam") outBeam = child;
            if (child.name === "spacetimeGrid") grid = child;
        });
        
        if (!grid || !xMirror || !yMirror || !outBeam) return;

        if (!initialVertices && grid.geometry.attributes.position) {
            initialVertices = new Float32Array(grid.geometry.attributes.position.array);
        }

        const waveSpeed = time * speed * 2;
        const waveAmplitude = 0.5;
        const waveFrequency = 0.2;

        if (initialVertices) {
            const positions = grid.geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                const x = initialVertices[i * 3];
                const y = initialVertices[i * 3 + 1];
                
                const distance = Math.sqrt(x*x + y*y);
                const zOffset = Math.sin(-distance * waveFrequency + waveSpeed) * waveAmplitude;
                
                const angle = Math.atan2(y, x);
                const quadrupole = Math.cos(2 * angle) * Math.sin(waveSpeed);
                
                positions.setZ(i, zOffset + quadrupole * 0.5);
            }
            positions.needsUpdate = true;
        }

        const strainEffect = Math.sin(waveSpeed);
        xMirror.position.x = 22 + strainEffect * 0.5;
        yMirror.position.z = 22 - strainEffect * 0.5;

        if (outBeam && outBeam.material) {
            outBeam.material.opacity = Math.pow(Math.sin(waveSpeed), 2) * 0.8;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGravitationalWaveDetector() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
