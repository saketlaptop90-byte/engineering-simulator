import * as THREE from 'three';
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine() {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const portalGlow = new THREE.MeshStandardMaterial({ 
        color: 0xaa00ff, 
        emissive: 0xaa00ff, 
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    
    const hyperspaceGrid = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2,
        wireframe: true
    });

    const goldenNexus = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 1,
        metalness: 1,
        roughness: 0.1
    });

    // 1. Central Nexus (The Core of the Trade Hub)
    const nexusGeo = new THREE.IcosahedronGeometry(20, 2);
    const nexus = new THREE.Mesh(nexusGeo, goldenNexus);
    group.add(nexus);
    meshes.nexus = nexus;

    parts.push({
        name: 'Omniversal_Nexus_Core',
        description: 'The central processing unit that anchors the station across 11 dimensions.',
        material: 'GoldenNexus',
        function: 'Synchronizes time and space across all connected universes.',
        assemblyOrder: 1,
        connections: ['Dimensional_Tethers'],
        failureEffect: 'Spontaneous collapse of local reality into a false vacuum.',
        cascadeFailures: ['Complete Universal Erasure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    // 2. Dimensional Tethers (Rings around the nexus)
    const tethers = new THREE.Group();
    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(35 + (i*10), 1.5, 32, 128);
        const ring = new THREE.Mesh(ringGeo, darkSteel);
        ring.rotation.x = (Math.PI/2) * (i%2);
        ring.rotation.y = (Math.PI/3) * i;
        
        // Add nodes on the rings
        for(let j=0; j<8; j++) {
            const node = new THREE.Mesh(new THREE.DodecahedronGeometry(3), copper);
            const angle = (j / 8) * Math.PI * 2;
            node.position.set(Math.cos(angle)*(35+(i*10)), Math.sin(angle)*(35+(i*10)), 0);
            ring.add(node);
        }
        
        tethers.add(ring);
        meshes[`tether_${i}`] = ring;
    }
    group.add(tethers);

    parts.push({
        name: 'Dimensional_Tethers',
        description: 'Gyroscopic stabilization rings to prevent the station from slipping into the Bulk.',
        material: 'DarkSteel / Copper',
        function: 'Maintains orientation relative to the 5th dimensional axis.',
        assemblyOrder: 2,
        connections: ['Omniversal_Nexus_Core', 'Portal_Gateways'],
        failureEffect: 'Station drifts randomly through parallel timelines.',
        cascadeFailures: ['Paradox Induction', 'Temporal Dislocation'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -100, z: 0 }
    });

    // 3. Multiverse Portal Gateways
    const gatewaysGroup = new THREE.Group();
    const portalCount = 6;
    for(let i=0; i<portalCount; i++) {
        const gate = new THREE.Group();
        
        // Outer ring
        const outerGeo = new THREE.TorusGeometry(15, 2, 16, 64);
        const outer = new THREE.Mesh(outerGeo, steel);
        gate.add(outer);

        // Inner energy portal
        const innerGeo = new THREE.CircleGeometry(14, 32);
        const inner = new THREE.Mesh(innerGeo, portalGlow);
        gate.add(inner);
        meshes[`portalGlow_${i}`] = inner;

        // Position them in a sphere around the nexus
        const phi = Math.acos( -1 + ( 2 * i ) / portalCount );
        const theta = Math.sqrt( portalCount * Math.PI ) * phi;
        const radius = 120;
        
        gate.position.setFromSphericalCoords(radius, phi, theta);
        gate.lookAt(0,0,0);
        
        gatewaysGroup.add(gate);
    }
    group.add(gatewaysGroup);
    meshes.gateways = gatewaysGroup;

    parts.push({
        name: 'Multiverse_Gateways',
        description: 'Stable Einstein-Rosen bridges leading to entirely different cosmological realities.',
        material: 'Steel / Exotic Energy',
        function: 'Allows physical transit between the Alpha, Beta, and Sigma timelines.',
        assemblyOrder: 3,
        connections: ['Dimensional_Tethers'],
        failureEffect: 'Spaghettification of transiting vessels.',
        cascadeFailures: ['Wormhole Collapse'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 0, z: 0 }
    });

    // 4. Trade Ship Swarm (Procedural InstancedMesh)
    const shipCount = 500;
    const shipGeo = new THREE.ConeGeometry(1, 4, 4);
    shipGeo.rotateX(Math.PI/2); // Point forward along Z
    const shipMesh = new THREE.InstancedMesh(shipGeo, chrome, shipCount);
    
    // Initialize ships
    for(let i=0; i<shipCount; i++) {
        const matrix = new THREE.Matrix4();
        // Random position far out
        const r = 200 + Math.random()*300;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const pos = new THREE.Vector3().setFromSphericalCoords(r, phi, theta);
        matrix.setPosition(pos);
        shipMesh.setMatrixAt(i, matrix);
    }
    shipMesh.instanceMatrix.needsUpdate = true;
    group.add(shipMesh);
    meshes.ships = { mesh: shipMesh, count: shipCount };

    parts.push({
        name: 'Interdimensional_Trade_Vessels',
        description: 'A swarm of automated cargo ships moving goods across the multiverse.',
        material: 'Chrome',
        function: 'Commerce.',
        assemblyOrder: 4,
        connections: [],
        failureEffect: 'Economic collapse of 14 galaxies.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -200, y: 0, z: 0 }
    });

    // 5. Hyperspace Grid Background
    const gridGeo = new THREE.SphereGeometry(600, 32, 32);
    const grid = new THREE.Mesh(gridGeo, hyperspaceGrid);
    group.add(grid);
    meshes.grid = grid;

    const description = "The Omniversal Trade Hub. A structure existing outside of standard spacetime, acting as a nexus point for commerce between completely different physical universes.";

    const quizQuestions = [
        {
            question: "In the context of the multiverse, what does M-Theory suggest our universe might be?",
            options: [
                "A 3-dimensional brane floating in a higher-dimensional bulk space.",
                "A holographic projection from a 2D surface.",
                "A simulation running on a Matrioshka brain.",
                "A consequence of a false vacuum collapse."
            ],
            correctAnswer: 0,
            explanation: "M-Theory posits that our universe is a 3-brane existing within a higher-dimensional (11D) space called the 'bulk', allowing for multiple parallel branes (universes)."
        },
        {
            question: "What type of traversable wormhole requires 'exotic matter' with negative energy density to remain open?",
            options: [
                "Schwarzschild Wormhole",
                "Einstein-Rosen Bridge",
                "Morris-Thorne Wormhole",
                "Kruskal-Szekeres Wormhole"
            ],
            correctAnswer: 2,
            explanation: "A Morris-Thorne wormhole is a theoretical model for a traversable wormhole that explicitly requires exotic matter to prevent the throat from pinching off."
        },
        {
            question: "According to the Many-Worlds Interpretation of quantum mechanics, what happens when a quantum measurement is made?",
            options: [
                "The wavefunction collapses into a single definite state.",
                "The universe splits into multiple branching timelines, one for each possible outcome.",
                "The observer's consciousness determines the outcome.",
                "The particle travels backward in time to communicate the result."
            ],
            correctAnswer: 1,
            explanation: "The Many-Worlds Interpretation suggests that all possible outcomes of a quantum measurement are physically realized in some 'world' or universe."
        },
        {
            question: "What cosmological concept defines the boundary beyond which events cannot affect an observer?",
            options: [
                "Ergosphere",
                "Cosmological Horizon",
                "Hubble Sphere",
                "Schwarzschild Radius"
            ],
            correctAnswer: 1,
            explanation: "The Cosmological Horizon (or particle horizon) represents the maximum distance from which light could have traveled to the observer in the age of the universe."
        },
        {
            question: "If the false vacuum of our universe were to decay, at what speed would the true vacuum bubble expand?",
            options: [
                "The speed of sound in a vacuum.",
                "Exactly the speed of light.",
                "Faster than the speed of light due to inflation.",
                "It would expand instantaneously."
            ],
            correctAnswer: 1,
            explanation: "A bubble of true vacuum resulting from a false vacuum decay would expand outward at exactly the speed of light, destroying everything in its path with no warning."
        }
    ];

    function animate(time, speed, meshesObj, exploded) {
        // Spin Nexus
        if(meshesObj.nexus) {
            meshesObj.nexus.rotation.x = time * speed * 0.5;
            meshesObj.nexus.rotation.y = time * speed * 0.7;
            
            // Breathe effect
            const scale = 1 + Math.sin(time * speed * 2) * 0.1;
            meshesObj.nexus.scale.set(scale, scale, scale);
        }

        // Rotate tethers in complex patterns
        if(!exploded) {
            for(let i=0; i<3; i++) {
                if(meshesObj[`tether_${i}`]) {
                    meshesObj[`tether_${i}`].rotation.z = time * speed * (0.2 + i*0.1);
                }
            }
        }

        // Pulse Portals
        for(let i=0; i<6; i++) {
            if(meshesObj[`portalGlow_${i}`]) {
                meshesObj[`portalGlow_${i}`].material.emissiveIntensity = 3 + Math.sin(time*speed*5 + i)*2;
            }
        }

        // Rotate the entire gateway structure slowly
        if(meshesObj.gateways && !exploded) {
            meshesObj.gateways.rotation.y = time * speed * 0.1;
            meshesObj.gateways.rotation.z = time * speed * 0.05;
        }

        // Animate ships
        if(meshesObj.ships) {
            const shipMesh = meshesObj.ships.mesh;
            const count = meshesObj.ships.count;
            const dummy = new THREE.Object3D();
            
            for(let i=0; i<count; i++) {
                shipMesh.getMatrixAt(i, dummy.matrix);
                const pos = new THREE.Vector3();
                pos.setFromMatrixPosition(dummy.matrix);
                
                // Ships orbit the central nexus
                const orbitSpeed = 10 * speed * (1 + (i%5));
                const radius = pos.length();
                
                // Extremely simple orbit around Y axis for demonstration
                const angle = Math.atan2(pos.z, pos.x) + orbitSpeed * 0.01;
                pos.x = Math.cos(angle) * radius;
                pos.z = Math.sin(angle) * radius;
                
                dummy.position.copy(pos);
                // Look forward
                const nextAngle = angle + 0.1;
                const nextPos = new THREE.Vector3(Math.cos(nextAngle)*radius, pos.y, Math.sin(nextAngle)*radius);
                dummy.lookAt(nextPos);
                
                dummy.updateMatrix();
                shipMesh.setMatrixAt(i, dummy.matrix);
            }
            shipMesh.instanceMatrix.needsUpdate = true;
        }

        // Slowly rotate grid
        if(meshesObj.grid) {
            meshesObj.grid.rotation.y = time * speed * 0.02;
            meshesObj.grid.rotation.x = time * speed * 0.01;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
