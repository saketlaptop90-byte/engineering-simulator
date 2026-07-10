import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const gModeGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        transmission: 0.9,
        roughness: 0.1,
        metalness: 0.1,
    });

    const pModeGlowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0xff4400,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
    });

    const coreEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 3.0,
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xcc2200,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.5,
        wireframe: true,
    });

    // Central Stellar Core
    const coreGeometry = new THREE.SphereGeometry(1, 64, 64);
    const coreMesh = new THREE.Mesh(coreGeometry, coreEnergyMaterial);
    coreMesh.name = "StellarCore";
    group.add(coreMesh);
    parts.push({
        name: "StellarCore",
        description: "The ultra-dense stellar core where fusion occurs and g-modes (gravity waves) are most prominent.",
        material: "Core Energy Plasma",
        function: "Generates the fundamental acoustic and gravity waves through nuclear fusion processes.",
        assemblyOrder: 1,
        connections: ["GModePropagator", "RadiativeZoneShell"],
        failureEffect: "Loss of core resonance signal, collapsing the seismological model.",
        cascadeFailures: ["GModePropagator", "PModeAcousticCavity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // Radiative Zone (G-Mode Propagation)
    const radiativeZoneGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const radiativeZoneMesh = new THREE.Mesh(radiativeZoneGeo, gModeGlowMaterial);
    radiativeZoneMesh.name = "RadiativeZoneShell";
    group.add(radiativeZoneMesh);
    parts.push({
        name: "RadiativeZoneShell",
        description: "The inner region where energy is transported by radiation. G-modes (buoyancy waves) propagate here but are evanescent in the convection zone.",
        material: "Cyan Plasma Wave",
        function: "Propagates gravity modes (g-modes) outwards from the core.",
        assemblyOrder: 2,
        connections: ["StellarCore", "ConvectionZoneBoundary"],
        failureEffect: "Damping of g-modes before they reach the boundary, leading to incomplete mixed-mode coupling.",
        cascadeFailures: ["MixedModeCouplingRegion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // Convection Zone Boundary (Tachocline / Coupling Region)
    const boundaryGeo = new THREE.TorusGeometry(1.8, 0.1, 16, 100);
    const boundaryMesh = new THREE.Mesh(boundaryGeo, copper);
    boundaryMesh.rotation.x = Math.PI / 2;
    boundaryMesh.name = "MixedModeCouplingRegion";
    group.add(boundaryMesh);
    parts.push({
        name: "MixedModeCouplingRegion",
        description: "The interface between the radiative interior and convective envelope where g-modes and p-modes couple.",
        material: "Copper Resonance Ring",
        function: "Transfers energy between internal gravity waves and external acoustic waves, forming 'mixed modes' observed in red giants.",
        assemblyOrder: 3,
        connections: ["RadiativeZoneShell", "PModeAcousticCavity"],
        failureEffect: "Decoupling of core and envelope oscillations, preventing observation of core properties.",
        cascadeFailures: ["SurfaceObservationGrid"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    // Convection Zone (P-Mode Cavity)
    const convectionZoneGeo = new THREE.IcosahedronGeometry(2.5, 4);
    const convectionZoneMesh = new THREE.Mesh(convectionZoneGeo, pModeGlowMaterial);
    convectionZoneMesh.name = "PModeAcousticCavity";
    group.add(convectionZoneMesh);
    parts.push({
        name: "PModeAcousticCavity",
        description: "The outer envelope where acoustic waves (p-modes) are trapped and resonate, driven by turbulent convection.",
        material: "Orange Plasma Mesh",
        function: "Acts as a resonant cavity for pressure-driven sound waves (p-modes), which reflect off the stellar surface.",
        assemblyOrder: 4,
        connections: ["MixedModeCouplingRegion", "SurfaceObservationGrid"],
        failureEffect: "Suppression of acoustic modes, rendering the star asteroseismologically 'quiet'.",
        cascadeFailures: ["SurfaceObservationGrid"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // Surface Observation Grid
    const surfaceGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(3, 16, 16));
    const surfaceMesh = new THREE.LineSegments(surfaceGeo, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    surfaceMesh.name = "SurfaceObservationGrid";
    group.add(surfaceMesh);
    parts.push({
        name: "SurfaceObservationGrid",
        description: "The photosphere where brightness fluctuations and radial velocity shifts are measured by space telescopes like Kepler and TESS.",
        material: "Green Wireframe Sensor",
        function: "Detects the superimposed frequencies of p-modes and mixed modes reaching the stellar surface.",
        assemblyOrder: 5,
        connections: ["PModeAcousticCavity"],
        failureEffect: "Loss of photometric data; light curve analysis becomes impossible.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // Harmonic Wave Visualizers (Orbiting rings)
    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(3.5 + i*0.5, 0.02, 8, 64);
        const ringMesh = new THREE.Mesh(ringGeo, chrome);
        ringMesh.rotation.x = Math.random() * Math.PI;
        ringMesh.rotation.y = Math.random() * Math.PI;
        ringMesh.name = `HarmonicRing_${i}`;
        group.add(ringMesh);
        parts.push({
            name: `HarmonicRing_${i}`,
            description: `Visual representation of specific angular degree (l=${i+1}) non-radial oscillation modes.`,
            material: "Chrome",
            function: "Illustrates the multipole expansion of stellar pulsations.",
            assemblyOrder: 6 + i,
            connections: ["SurfaceObservationGrid"],
            failureEffect: "Mode identification failure in the power spectrum.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: (i+1)*2, y: 0, z: (i+1)*2 }
        });
    }

    const description = "The Astroseismology Core Resonance Simulator models the internal pulsations of a star, visualizing how acoustic waves (p-modes) in the outer envelope couple with gravity waves (g-modes) deep in the radiative core to produce observable mixed modes on the stellar surface.";

    const quizQuestions = [
        {
            question: "What is the primary restoring force for g-modes (gravity modes) in a star?",
            options: ["Pressure gradients", "Magnetic fields", "Buoyancy", "Centrifugal force"],
            correct: 2,
            explanation: "Gravity modes, or g-modes, are internal waves whose restoring force is buoyancy. They propagate in stably stratified regions like the radiative core.",
            difficulty: "Medium"
        },
        {
            question: "Why are mixed modes particularly valuable in asteroseismology of red giant stars?",
            options: ["They are the only modes visible from Earth.", "They probe both the outer convective envelope and the deep inner core.", "They cause the star to explode.", "They only occur in binaries."],
            correct: 1,
            explanation: "Mixed modes behave like p-modes (acoustic) in the outer envelope and g-modes (buoyancy) in the deep interior, allowing astronomers to probe the core conditions of evolved stars.",
            difficulty: "Hard"
        },
        {
            question: "Which type of oscillation mode is primarily trapped in the outer convection zone and restored by pressure?",
            options: ["g-modes", "p-modes", "f-modes", "Alfvén waves"],
            correct: 1,
            explanation: "Pressure modes (p-modes) are acoustic sound waves driven by turbulent convection, primarily localized in the outer envelope of stars like the Sun.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes) return;
        
        // Dynamic pulsating core
        const core = meshes.find(m => m.name === "StellarCore");
        if (core) {
            const scale = 1 + Math.sin(time * speed * 5) * 0.05;
            core.scale.set(scale, scale, scale);
            core.material.emissiveIntensity = 3.0 + Math.sin(time * speed * 10) * 1.0;
        }

        // G-mode propagation (Radiative Zone)
        const radZone = meshes.find(m => m.name === "RadiativeZoneShell");
        if (radZone) {
            const radScale = 1 + Math.sin(time * speed * 3 + Math.PI) * 0.03;
            radZone.scale.set(radScale, radScale, radScale);
            radZone.material.opacity = 0.8 + Math.sin(time * speed * 2) * 0.2;
            radZone.rotation.y = time * speed * 0.2;
        }

        // P-mode cavity (Convection Zone) morphing
        const convZone = meshes.find(m => m.name === "PModeAcousticCavity");
        if (convZone) {
            convZone.rotation.x = time * speed * 0.1;
            convZone.rotation.y = time * speed * 0.15;
            // Simulate non-radial pulsations by squishing
            const pScaleX = 1 + Math.sin(time * speed * 8) * 0.04;
            const pScaleY = 1 + Math.cos(time * speed * 8) * 0.04;
            const pScaleZ = 1 + Math.sin(time * speed * 8 + Math.PI/4) * 0.04;
            convZone.scale.set(pScaleX, pScaleY, pScaleZ);
        }

        // Surface Grid rotating
        const surface = meshes.find(m => m.name === "SurfaceObservationGrid");
        if (surface) {
            surface.rotation.y = time * speed * 0.05;
            const sScale = 1 + Math.sin(time * speed * 8) * 0.02;
            surface.scale.set(sScale, sScale, sScale);
        }

        // Harmonic Rings
        for(let i=0; i<3; i++) {
            const ring = meshes.find(m => m.name === `HarmonicRing_${i}`);
            if (ring) {
                ring.rotation.x += 0.01 * speed * (i+1);
                ring.rotation.y += 0.02 * speed * (i+1);
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCoreResonance() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
