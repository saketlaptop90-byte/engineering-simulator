import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingNode = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff, emissive: 0x0055aa, emissiveIntensity: 2,
        roughness: 0.1
    });

    const strutMat = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa, metalness: 0.8, roughness: 0.3
    });

    // We will build a simple Icosahedron wireframe
    const domeRadius = 5;
    const geometry = new THREE.IcosahedronGeometry(domeRadius, 1);
    
    // We want a half-dome, so we will clip vertices below y=0 later or just show the whole thing as a sphere and clip
    // For visual simplicity, let's just make it a full sphere but call it a dome, or manually cull.
    // Let's cull the bottom half.
    
    const strutsGrp = new THREE.Group();
    const nodesGrp = new THREE.Group();
    const panelsGrp = new THREE.Group();

    const positions = geometry.attributes.position;
    
    // Create nodes
    for(let i=0; i<positions.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(positions, i);
        if (v.y >= -0.1) { // Only upper half
            const node = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), glowingNode);
            node.position.copy(v);
            nodesGrp.add(node);
        }
    }

    // Creating struts is complex from raw geometry without edges geometry,
    // so we'll use EdgesGeometry to generate the lines, then render cylinders
    const edges = new THREE.EdgesGeometry(geometry);
    const edgePositions = edges.attributes.position;
    
    for(let i=0; i<edgePositions.count; i+=2) {
        const v1 = new THREE.Vector3().fromBufferAttribute(edgePositions, i);
        const v2 = new THREE.Vector3().fromBufferAttribute(edgePositions, i+1);
        
        if (v1.y >= -0.1 && v2.y >= -0.1) {
            const distance = v1.distanceTo(v2);
            const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, distance, 8), strutMat);
            
            // Position halfway between
            cyl.position.copy(v1).add(v2).multiplyScalar(0.5);
            // Orient it
            cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v2.clone().sub(v1).normalize());
            
            strutsGrp.add(cyl);
        }
    }

    // Panels (Transparent)
    const domeMesh = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.DoubleSide
    }));
    // We don't easily slice the mesh, so we'll just let the lower half clip through the floor in our minds, 
    // or position the whole group up
    domeMesh.position.set(0, 0, 0);

    // Assembly
    group.add(strutsGrp);
    parts.push({
        name: "Triangular Struts (Space Frame)",
        description: "Lightweight steel or aluminum tubes.",
        material: "Aluminum",
        function: "Distributes structural stress evenly across the entire structure, acting in pure tension and compression.",
        assemblyOrder: 1,
        connections: ["Hub Nodes"],
        failureEffect: "Strut buckling.",
        cascadeFailures: ["Localized dimpling", "Progressive collapse"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:0} // Exploding hundreds of struts is messy, keep static
    });

    group.add(nodesGrp);
    parts.push({
        name: "Hub Nodes (Vertices)",
        description: "Glowing central connectors where 5 or 6 struts meet.",
        material: "Machined Steel / Glowing",
        function: "Transfers the axial loads perfectly between the intersecting struts.",
        assemblyOrder: 2,
        connections: ["Struts"],
        failureEffect: "Bolt shear at hub.",
        cascadeFailures: ["Loss of triangulation"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:5, z:0}
    });

    group.add(domeMesh);
    parts.push({
        name: "ETFE / Glass Panels",
        description: "Triangular cladding filling the empty spaces.",
        material: "Glass / Polymer",
        function: "Provides weatherproofing while remaining extremely lightweight.",
        assemblyOrder: 3,
        connections: ["Struts"],
        failureEffect: "Tear or shatter.",
        cascadeFailures: ["Rain ingress"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:0, z:-8}
    });

    // Move everything up so it sits on the floor
    group.position.y = 5;

    const description = "Civil Geodesic Dome: Popularized by Buckminster Fuller, this is a spherical structure built entirely from a network of straight elements forming interlocking triangles. It encloses the maximum possible volume with the minimum amount of material, and gets structurally stronger as it gets larger.";

    const quizQuestions = [
        {
            question: "Why is the Geodesic Dome considered incredibly materially efficient?",
            options: ["A sphere encloses the highest volume with the least surface area, and triangles are the most rigid geometric shape. Combined, they create massive strength with very little heavy material.", "Because it uses magic", "Because triangles weigh less than squares", "It only uses glass"],
            correct: 0,
            explanation: "Because the load is perfectly distributed as pure tension and compression across the infinite network of triangles, there are no heavy bending moments. Thus, massive open spans can be built with surprisingly thin, lightweight tubes.",
            difficulty: "Medium"
        },
        {
            question: "Unlike traditional boxy buildings, what happens to the strength of a geodesic dome as it scales up and gets larger?",
            options: ["It actually gets proportionally stronger and lighter", "It gets weaker and collapses", "It becomes too heavy to support itself", "It must be filled with helium"],
            correct: 0,
            explanation: "Due to its spherical geometry, as the dome gets larger, it distributes stress even more efficiently across a higher number of nodes, meaning a massive dome is actually stronger and more stable than a tiny one.",
            difficulty: "Hard"
        },
        {
            question: "Why are there no internal support columns inside a massive geodesic dome?",
            options: ["The curved outer 'shell' is entirely self-supporting due to the triangulated space frame", "The air pressure holds it up", "They use invisible glass columns", "The columns are buried underground"],
            correct: 0,
            explanation: "The genius of the geodesic design is that it creates a completely clear-span interior. The structural load travels through the outer shell directly down to the foundation.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Slowly rotate the entire dome to show its geometry
        group.rotation.y = time * speed * 0.2;
        
        // Pulse the nodes
        if (meshes[1]) {
            meshes[1].children.forEach((n, i) => {
                n.material.emissiveIntensity = 1 + Math.sin(time*speed*5 + i)*1;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGeodesicDome() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
