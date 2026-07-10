import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom High-Tech Neon Materials
    const glowingCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    const capsidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111122,
        emissive: 0x0a1133,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
    });

    const pentonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xcc0033,
        emissiveIntensity: 0.8,
        metalness: 0.6,
        roughness: 0.2
    });

    // 1. Core RNA
    class CustomRNA extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = Math.sin(t * Math.PI * 12) * 1.5;
            const ty = Math.cos(t * Math.PI * 12) * 1.5;
            const tz = (t - 0.5) * 6;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    const rnaPath = new CustomRNA(0.6);
    const rnaGeo = new THREE.TubeGeometry(rnaPath, 150, 0.15, 8, false);
    const rnaMesh = new THREE.Mesh(rnaGeo, glowingCoreMaterial);
    
    rnaMesh.userData = { id: 'rna_core' };
    group.add(rnaMesh);
    
    parts.push({
        name: "Viral Genome (RNA)",
        description: "The highly compressed genetic blueprint enclosed within the capsid shell.",
        material: "glowingCoreMaterial",
        function: "Carries the genetic instructions necessary for viral replication within the host.",
        assemblyOrder: 1,
        connections: ["Capsid Internal Matrix"],
        failureEffect: "Complete loss of genetic infectivity.",
        cascadeFailures: ["Replication failure", "Viral obsolescence"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 }
    });

    // 2. Icosahedral Capsid Shell
    const radius = 4;
    const icosaGeo = new THREE.IcosahedronGeometry(radius, 0);
    const positionAttribute = icosaGeo.attributes.position;
    
    // Create separate meshes for each triangular face
    for (let i = 0; i < positionAttribute.count; i += 3) {
        const p1 = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
        const p2 = new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 1);
        const p3 = new THREE.Vector3().fromBufferAttribute(positionAttribute, i + 2);
        
        // Face center and normal
        const center = new THREE.Vector3().addVectors(p1, p2).add(p3).divideScalar(3);
        const normal = center.clone().normalize();
        
        // Shift vertices so the mesh is centered at origin
        const faceGeo = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            p1.x - center.x, p1.y - center.y, p1.z - center.z,
            p2.x - center.x, p2.y - center.y, p2.z - center.z,
            p3.x - center.x, p3.y - center.y, p3.z - center.z
        ]);
        faceGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        faceGeo.computeVertexNormals();
        
        // High-tech neon frame geometry
        const edges = new THREE.EdgesGeometry(faceGeo);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2, transparent: true, opacity: 0.6 }));
        
        const faceMesh = new THREE.Mesh(faceGeo, capsidMaterial);
        faceMesh.add(line);
        faceMesh.position.copy(center);
        
        // Exploded position outwards along the normal
        const explodedPos = center.clone().add(normal.clone().multiplyScalar(8));
        
        faceMesh.userData = {
            id: `capsomere_face_${i/3}`,
            originalPosition: center.clone(),
            explodedPosition: explodedPos,
            normal: normal.clone()
        };
        group.add(faceMesh);
        
        parts.push({
            name: `Capsomere Panel ${i/3 + 1}`,
            description: `One of the 20 geometric triangular faces establishing the icosahedral symmetry.`,
            material: "capsidMaterial",
            function: "Forms an impenetrable shield protecting the viral genome.",
            assemblyOrder: 2,
            connections: ["Adjacent Capsomeres", "Spike Receptors"],
            failureEffect: "Compromised shell structural integrity.",
            cascadeFailures: ["Exposure of RNA", "Immediate immune system detection"],
            originalPosition: { x: center.x, y: center.y, z: center.z },
            explodedPosition: { x: explodedPos.x, y: explodedPos.y, z: explodedPos.z }
        });
        
        // 3. Surface Receptor Spikes (Pentons/Hexons)
        const hexonGeo = new THREE.CylinderGeometry(0.1, 0.4, 0.8, 6);
        const hexonMesh = new THREE.Mesh(hexonGeo, pentonMaterial);
        
        // Align cylinder along the face normal
        hexonMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
        const spikePos = center.clone().add(normal.clone().multiplyScalar(0.4));
        hexonMesh.position.copy(spikePos);
        
        const spikeExplodedPos = explodedPos.clone().add(normal.clone().multiplyScalar(3));
        
        hexonMesh.userData = {
            id: `hexon_${i/3}`,
            originalPosition: spikePos.clone(),
            explodedPosition: spikeExplodedPos,
            normal: normal.clone()
        };
        group.add(hexonMesh);
        
        parts.push({
            name: `Surface Receptor Protein ${i/3 + 1}`,
            description: "High-affinity spike-like glycoprotein structure located on the capsid surface.",
            material: "pentonMaterial",
            function: "Functions as a key to bind aggressively to host cell membrane receptors.",
            assemblyOrder: 3,
            connections: [`Capsomere Panel ${i/3 + 1}`],
            failureEffect: "Inability to anchor to host cells.",
            cascadeFailures: ["Loss of infectivity", "Viral neutralization"],
            originalPosition: { x: spikePos.x, y: spikePos.y, z: spikePos.z },
            explodedPosition: { x: spikeExplodedPos.x, y: spikeExplodedPos.y, z: spikeExplodedPos.z }
        });
    }

    const description = "The Viral Capsid is an advanced, ultra-efficient macromolecular machine utilizing exact icosahedral symmetry. This geometry optimally maximizes internal volume using minimal repeating protein subunits to shield the fragile RNA blueprint. This simulation features an intricate bio-mechanical design, glowing neural-like genetic cores, and dynamic self-assembling capsomere arrays with aggressively functional surface receptors.";

    const quizQuestions = [
        {
            question: "Which mathematical geometry is primarily exploited by this capsid model to maximize internal volume efficiently?",
            options: ["Tetrahedral geometry", "Cubic symmetry", "Icosahedral symmetry", "Spherical continuous mesh"],
            correct: 2,
            explanation: "Icosahedral symmetry (composed of 20 equilateral triangular faces) allows the virus to enclose the maximum amount of space using the smallest, most repeatable structural protein units.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary mechanical function of the vibrant glowing surface receptor proteins (spikes)?",
            options: ["To replicate RNA segments", "To bind specifically to target host cell membrane receptors", "To reinforce the structural strength of the capsid", "To enzymatically digest the host's DNA"],
            correct: 1,
            explanation: "Surface receptor proteins act precisely like biomechanical keys that recognize and bind to specific 'lock' receptors on the host cell membrane, initiating the critical infection cascade.",
            difficulty: "Easy"
        },
        {
            question: "If a structural failure occurs within a single Capsomere Panel, what is the most immediate resulting cascade failure?",
            options: ["The virus mutates at a highly accelerated rate", "Rapid exposure and enzymatic degradation of the internal RNA", "The entire virus instantly disintegrates", "The virus alters its host-cell targets"],
            correct: 1,
            explanation: "The capsid acts as an armored protective shell. If its integrity is compromised, the sensitive genetic material inside (RNA/DNA) is directly exposed to harsh extracellular environments and host nucleases, leading to swift degradation.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Smoothly rotate the entire viral assembly
        group.rotation.y = t * 0.15;
        group.rotation.x = t * 0.08;

        meshes.forEach(mesh => {
            const data = mesh.userData;
            
            if (data.id === 'rna_core') {
                // Energetic pulsation and rotation for the genetic core
                mesh.rotation.z = t * 0.8;
                mesh.rotation.y = t * 0.4;
                const pulse = 1 + Math.sin(t * 4) * 0.08;
                mesh.scale.set(pulse, pulse, pulse);
            } 
            else if (data.id && data.id.startsWith('capsomere_face')) {
                // Self-assembly breathing effect: faces move in and out slightly along their normal
                const breath = Math.sin(t * 2 + data.originalPosition.x) * 0.12;
                mesh.position.copy(data.originalPosition).add(data.normal.clone().multiplyScalar(breath));
            }
            else if (data.id && data.id.startsWith('hexon')) {
                // Receptors pulse radially and spin continuously
                const breath = Math.sin(t * 2 + data.originalPosition.x) * 0.12;
                mesh.position.copy(data.originalPosition).add(data.normal.clone().multiplyScalar(breath));
                mesh.rotateY(0.04 * speed); // Spin around their local longitudinal axis
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createViralCapsid() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
