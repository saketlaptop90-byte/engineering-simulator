import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const concreteMat = new THREE.MeshPhysicalMaterial({ color: 0x999999, roughness: 1.0 });
    
    const waterMat = new THREE.MeshPhysicalMaterial({
        color: 0x0055aa, transparent: true, opacity: 0.6,
        roughness: 0.1, metalness: 0.1
    });

    // Create a Tetrapod function
    function createTetrapod() {
        const pod = new THREE.Group();
        const legGeo = new THREE.CylinderGeometry(0.3, 0.6, 2, 16);
        // Center of mass
        const centerGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const center = new THREE.Mesh(centerGeo, concreteMat);
        pod.add(center);

        // 4 legs radiating out from the center like a tetrahedron
        const l1 = new THREE.Mesh(legGeo, concreteMat);
        l1.position.set(0, 1, 0);
        pod.add(l1);

        const l2 = new THREE.Mesh(legGeo, concreteMat);
        l2.position.set(0, -0.33, 0.94);
        l2.rotation.x = Math.PI - 1.91; // roughly 109.5 degrees
        pod.add(l2);

        const l3 = new THREE.Mesh(legGeo, concreteMat);
        l3.position.set(0.81, -0.33, -0.47);
        l3.rotation.x = Math.PI - 1.91;
        l3.rotation.y = Math.PI * 2/3;
        l3.rotation.z = Math.PI * 2/3; // approximated rotation for tetrahedron
        pod.add(l3);

        const l4 = new THREE.Mesh(legGeo, concreteMat);
        l4.position.set(-0.81, -0.33, -0.47);
        l4.rotation.x = Math.PI - 1.91;
        l4.rotation.y = -Math.PI * 2/3;
        l4.rotation.z = -Math.PI * 2/3;
        pod.add(l4);

        return pod;
    }

    const breakwaterGrp = new THREE.Group();
    // Pile a bunch of them up randomly
    for(let i=0; i<30; i++) {
        const t = createTetrapod();
        t.position.set(
            (Math.random()-0.5)*10,
            (Math.random())*4,
            (Math.random()-0.5)*4
        );
        t.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        breakwaterGrp.add(t);
    }
    group.add(breakwaterGrp);
    parts.push({
        name: "Interlocking Tetrapod Array",
        description: "Massive, unreinforced concrete structures with four legs.",
        material: "Marine Concrete",
        function: "Forces incoming ocean waves to break and dissipate their energy through the porous gaps, rather than smashing against a solid wall.",
        assemblyOrder: 1,
        connections: ["Seabed", "Adjacent Tetrapods"],
        failureEffect: "Dislodgement by extreme tsunami.",
        cascadeFailures: ["Coastal erosion", "Harbor destruction"],
        originalPosition: {x:0, y:0, z:0},
        explodedPosition: {x:0, y:5, z:0} // whole group explodes up
    });

    const waveGeo = new THREE.BoxGeometry(15, 4, 10, 32, 1, 32);
    const waveMesh = new THREE.Mesh(waveGeo, waterMat);
    waveMesh.position.set(0, 0, 5);
    group.add(waveMesh);
    parts.push({
        name: "Ocean Wave Energy",
        description: "Incoming kinetic energy from the sea.",
        material: "Water",
        function: "Attempts to erode the coastline but is shattered and drained by the tetrapods.",
        assemblyOrder: 2,
        connections: ["Tetrapods"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:0, y:0, z:5},
        explodedPosition: {x:0, y:-5, z:5}
    });

    const description = "Civil Breakwater Tetrapods: Iconic four-legged concrete structures used in coastal engineering. Unlike a solid sea wall that reflects wave energy (causing scouring), tetrapods interlock and create a porous barrier that absorbs and dissipates the crushing power of ocean waves.";

    const quizQuestions = [
        {
            question: "Why do coastal engineers use weirdly shaped 'Tetrapods' instead of just building a massive, solid, flat concrete wall?",
            options: ["A solid wall reflects wave energy downward, scouring the sand at the base until the wall collapses. Tetrapods absorb and dissipate the energy through their gaps.", "Tetrapods are cheaper to make", "Tetrapods look prettier", "A solid wall is illegal"],
            correct: 0,
            explanation: "When a massive wave hits a flat wall, the energy has to go somewhere. It goes down, eroding the foundation. Tetrapods let the water wash through their complex interlocking shapes, destroying the wave's power harmlessly through friction and turbulence.",
            difficulty: "Hard"
        },
        {
            question: "How do tetrapods stay in place during a massive hurricane or tsunami?",
            options: ["Their unique four-legged shape causes them to interlock with each other. The harder the waves hit, the tighter they wedge together.", "They are bolted to the ocean floor", "They are glued together with epoxy", "They are magnetic"],
            correct: 0,
            explanation: "Because of their tetrahedral shape, they naturally interlock when piled up. Rather than being pushed away by waves, wave action actually forces them to nestle closer together, making the structure stronger over time.",
            difficulty: "Medium"
        },
        {
            question: "Are tetrapods filled with steel rebar (reinforced concrete)?",
            options: ["No, they are typically unreinforced. Steel would quickly rust in the saltwater, causing the concrete to spall and explode.", "Yes, they are 50% steel", "They use aluminum rebar", "They are actually made of plastic"],
            correct: 0,
            explanation: "In harsh marine environments, saltwater inevitably penetrates concrete. If there was steel inside, it would rust, expand, and shatter the tetrapod. Their strength relies purely on their massive bulk and shape.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the waves crashing into the tetrapods
        if (group.children[1]) {
            const wave = group.children[1];
            // Access the geometry vertices to create a rolling wave effect
            const pos = wave.geometry.attributes.position;
            for(let i=0; i<pos.count; i++) {
                const x = pos.getX(i);
                const z = pos.getZ(i);
                // Only animate the top surface (y > 0)
                if (pos.getY(i) > 0) {
                    const y = 2 + Math.sin(x * 0.5 + time * speed * 2) * Math.cos(z * 0.5 + time * speed * 2) * 1.5;
                    pos.setY(i, y);
                }
            }
            pos.needsUpdate = true;
            // Slide the wave body back and forth
            wave.position.z = 5 + Math.sin(time * speed) * 2;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBreakwaterTetrapodArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
