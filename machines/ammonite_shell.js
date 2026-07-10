import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing material for mathematics representation
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });
    
    const neonPink = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9
    });
    
    const shellMat = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 0.5,
    });
    
    const internalMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.4,
        metalness: 0.8,
    });

    const meshes = {};

    // 1. Core / Protoconch
    const coreGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const coreMesh = new THREE.Mesh(coreGeo, neonPink);
    group.add(coreMesh);
    meshes.core = coreMesh;
    
    parts.push({
        name: "Protoconch (Origin Point)",
        description: "The embryonic shell from which the entire structure begins, representing the origin (0,0) in polar coordinates.",
        material: "Neon Pink / Energy",
        function: "Serves as the foundation for logarithmic spiral growth.",
        assemblyOrder: 1,
        connections: ["Inner Chambers"],
        failureEffect: "Structural collapse",
        cascadeFailures: ["Complete shell degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 }
    });

    // 2. Logarithmic Spiral Chambers
    const chambersGroup = new THREE.Group();
    const numChambers = 40;
    const phi = 1.61803398875;
    
    meshes.chambers = [];
    
    for (let i = 0; i < numChambers; i++) {
        const t = i * 0.4;
        // r = a * e^(b*t)
        const a = 0.5;
        const b = 0.2;
        const r = a * Math.exp(b * t);
        
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        
        // Chamber geometry grows with radius
        const radius = a * Math.exp(b * t) * 0.4;
        
        const chamberGeo = new THREE.SphereGeometry(radius, 16, 16);
        // Alternate materials
        const mat = (i % 2 === 0) ? chrome : shellMat;
        const chamberMesh = new THREE.Mesh(chamberGeo, mat);
        
        chamberMesh.position.set(x, y, 0);
        
        // Add septa (dividing walls)
        if (i > 0) {
            const septumGeo = new THREE.TorusGeometry(radius * 0.9, radius * 0.1, 8, 24);
            const septumMesh = new THREE.Mesh(septumGeo, internalMat);
            septumMesh.position.set(x, y, 0);
            septumMesh.lookAt(new THREE.Vector3(0, 0, 0));
            chambersGroup.add(septumMesh);
        }
        
        chambersGroup.add(chamberMesh);
        meshes.chambers.push(chamberMesh);
    }
    group.add(chambersGroup);
    meshes.chambersGroup = chambersGroup;

    parts.push({
        name: "Phragmocone (Chambered Shell)",
        description: "A series of progressively larger chambers following a logarithmic spiral (r = a * e^(bθ)).",
        material: "Chrome / Organic Matrix",
        function: "Provides structural protection and buoyancy control.",
        assemblyOrder: 2,
        connections: ["Protoconch", "Siphuncle"],
        failureEffect: "Loss of buoyancy",
        cascadeFailures: ["Inability to navigate water column"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: -5 }
    });

    // 3. Siphuncle Tube (Central Tube)
    // Connects all chambers
    const siphuncleGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(
            Array.from({length: numChambers}, (_, i) => {
                const t = i * 0.4;
                const r = 0.5 * Math.exp(0.2 * t);
                return new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), 0);
            })
        ),
        100, 
        0.2, 
        8, 
        false
    );
    const siphuncleMesh = new THREE.Mesh(siphuncleGeo, neonBlue);
    group.add(siphuncleMesh);
    meshes.siphuncle = siphuncleMesh;

    parts.push({
        name: "Siphuncle Tube",
        description: "A central tissue tube passing through all septa, pumping gas and fluid to regulate buoyancy.",
        material: "Neon Blue / Bio-fluid",
        function: "Buoyancy regulation via osmosis.",
        assemblyOrder: 3,
        connections: ["Phragmocone"],
        failureEffect: "Uncontrolled sinking or floating",
        cascadeFailures: ["Predation due to immobility"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });

    // 4. Mathematical Overlay (Fibonacci Rectangles/Arcs)
    const overlayGroup = new THREE.Group();
    
    // Draw spiral arcs to represent the math
    const spiralGeo = new THREE.BufferGeometry();
    const spiralPoints = [];
    for (let i = 0; i < 200; i++) {
        const t = i * 0.1;
        const r = 0.5 * Math.exp(0.2 * t) * 1.5; // Slightly larger to overlay
        spiralPoints.push(new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), 0.5));
    }
    spiralGeo.setFromPoints(spiralPoints);
    const spiralLine = new THREE.Line(spiralGeo, new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 }));
    overlayGroup.add(spiralLine);
    meshes.mathOverlay = overlayGroup;
    group.add(overlayGroup);

    parts.push({
        name: "Fibonacci / Logarithmic Overlay",
        description: "A visual projection demonstrating the mathematical perfection of the shell's self-similar growth.",
        material: "Holographic Green",
        function: "Educational visualization of polar mathematics.",
        assemblyOrder: 4,
        connections: [],
        failureEffect: "Math simulation error",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0.5 },
        explodedPosition: { x: 0, y: 0, z: 15 }
    });

    const description = "A high-tech mathematical visualization of an Ammonite Shell, demonstrating logarithmic spirals and self-similar growth patterns found in nature.";

    const quizQuestions = [
        {
            question: "What mathematical curve best describes the growth pattern of an ammonite shell?",
            options: [
                "Archimedean spiral",
                "Logarithmic (equiangular) spiral",
                "Parabolic arc",
                "Hyperbolic tangent"
            ],
            correct: 1,
            explanation: "Ammonite shells grow following a logarithmic spiral (r = a * e^(bθ)), which allows them to increase in size without changing their overall shape (self-similarity).",
            difficulty: "Medium"
        },
        {
            question: "What is the function of the Siphuncle tube?",
            options: [
                "Digestion of food",
                "Structural reinforcement",
                "Buoyancy control via gas/fluid exchange",
                "Sensory perception"
            ],
            correct: 2,
            explanation: "The siphuncle is a tissue tube that pumps fluid in and out of the empty shell chambers, altering the ammonite's buoyancy to move up or down in the water column.",
            difficulty: "Medium"
        },
        {
            question: "In polar coordinates (r, θ), what does the 'b' parameter control in the equation r = a * e^(bθ)?",
            options: [
                "The initial starting size of the spiral",
                "The color of the shell",
                "The rate at which the spiral flares outward",
                "The thickness of the shell wall"
            ],
            correct: 2,
            explanation: "The parameter 'b' determines how tightly or loosely the spiral is wound. A larger 'b' causes the spiral to expand outwards more rapidly.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate the entire shell slowly
        group.rotation.z = time * speed * 0.2;
        group.rotation.x = Math.sin(time * speed * 0.1) * 0.2;
        group.rotation.y = Math.cos(time * speed * 0.1) * 0.2;

        // Pulsate the origin core
        meshes.core.scale.setScalar(1 + Math.sin(time * speed * 2) * 0.1);

        // Fluid flow effect through the siphuncle
        if (meshes.siphuncle.material) {
            meshes.siphuncle.material.emissiveIntensity = 1 + Math.sin(time * speed * 3) * 0.8;
        }

        // Rotate the math overlay in the opposite direction slightly
        meshes.mathOverlay.rotation.z = -time * speed * 0.05;
        
        // Chamber pulsing effect
        meshes.chambers.forEach((chamber, index) => {
            const offset = index * 0.1;
            const pulse = 1 + Math.sin(time * speed * 5 - offset) * 0.05;
            chamber.scale.setScalar(pulse);
        });
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createAmmoniteShell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
