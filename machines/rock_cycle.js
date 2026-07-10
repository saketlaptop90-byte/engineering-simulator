export function createRockCycle(THREE) {
    const group = new THREE.Group();

    const parts = [
        { name: "Magma", description: "Molten rock beneath the Earth's surface." },
        { name: "Igneous Rock", description: "Rock formed through the cooling and solidification of magma or lava." },
        { name: "Sedimentary Rock", description: "Rock formed by the accumulation or deposition of mineral or organic particles." },
        { name: "Metamorphic Rock", description: "Rock transformed by heat, pressure, or other natural agencies." },
        { name: "Sediments", description: "Naturally occurring material that is broken down by processes of weathering and erosion." },
        { name: "Weathering Element", description: "Rain, wind, and ice that break down rocks into sediments." },
        { name: "Heat Source", description: "Intense heat from the Earth's interior." },
        { name: "Pressure Zone", description: "High pressure deep underground that causes metamorphism." },
        { name: "Volcano", description: "An opening in the Earth's crust that allows magma to reach the surface." },
        { name: "Melting Zone", description: "The area where extreme heat causes rocks to melt back into magma." }
    ];

    // Create 3D objects for each part
    const materials = {
        magma: new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0x881100 }),
        igneous: new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 }),
        sedimentary: new THREE.MeshStandardMaterial({ color: 0xc2b280, roughness: 0.8 }),
        metamorphic: new THREE.MeshStandardMaterial({ color: 0x8866aa, roughness: 0.7 }),
        sediments: new THREE.MeshStandardMaterial({ color: 0xd2b48c }),
        weathering: new THREE.MeshStandardMaterial({ color: 0x44aaff, transparent: true, opacity: 0.6 }),
        heat: new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff5500 }),
        pressure: new THREE.MeshStandardMaterial({ color: 0xaa2222, wireframe: true }),
        volcano: new THREE.MeshStandardMaterial({ color: 0x554433 }),
        melting: new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 })
    };

    // Magma (Sphere)
    const magmaGeo = new THREE.SphereGeometry(1, 32, 32);
    const magmaMesh = new THREE.Mesh(magmaGeo, materials.magma);
    magmaMesh.position.set(0, -3, 0);
    group.add(magmaMesh);

    // Volcano (Cone)
    const volcanoGeo = new THREE.ConeGeometry(2, 3, 16);
    const volcanoMesh = new THREE.Mesh(volcanoGeo, materials.volcano);
    volcanoMesh.position.set(-4, 0, 0);
    group.add(volcanoMesh);

    // Igneous Rock (Dodecahedron)
    const igneousGeo = new THREE.DodecahedronGeometry(0.8);
    const igneousMesh = new THREE.Mesh(igneousGeo, materials.igneous);
    igneousMesh.position.set(-2, 2, 0);
    group.add(igneousMesh);

    // Weathering Element (Particles/Cubes)
    const weatheringGeo = new THREE.BoxGeometry(1.5, 0.2, 1.5);
    const weatheringMesh = new THREE.Mesh(weatheringGeo, materials.weathering);
    weatheringMesh.position.set(0, 4, 0);
    group.add(weatheringMesh);

    // Sediments (Small spheres in a cluster)
    const sedimentsGroup = new THREE.Group();
    const sedGeo = new THREE.SphereGeometry(0.2, 8, 8);
    for(let i=0; i<5; i++) {
        const sedMesh = new THREE.Mesh(sedGeo, materials.sediments);
        sedMesh.position.set((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5));
        sedimentsGroup.add(sedMesh);
    }
    sedimentsGroup.position.set(2, 2, 0);
    group.add(sedimentsGroup);

    // Sedimentary Rock (Box with layers)
    const sedimentaryGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
    const sedimentaryMesh = new THREE.Mesh(sedimentaryGeo, materials.sedimentary);
    sedimentaryMesh.position.set(4, 0, 0);
    group.add(sedimentaryMesh);

    // Pressure Zone (Torus around sedimentary)
    const pressureGeo = new THREE.TorusGeometry(1.5, 0.2, 16, 50);
    const pressureMesh = new THREE.Mesh(pressureGeo, materials.pressure);
    pressureMesh.position.set(3, -2, 0);
    pressureMesh.rotation.x = Math.PI / 2;
    group.add(pressureMesh);

    // Metamorphic Rock (Octahedron)
    const metamorphicGeo = new THREE.OctahedronGeometry(1);
    const metamorphicMesh = new THREE.Mesh(metamorphicGeo, materials.metamorphic);
    metamorphicMesh.position.set(2, -3, 0);
    group.add(metamorphicMesh);

    // Heat Source (Point light / glowing sphere)
    const heatGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const heatMesh = new THREE.Mesh(heatGeo, materials.heat);
    heatMesh.position.set(0, -4.5, 0);
    group.add(heatMesh);

    // Melting Zone (Cylinder)
    const meltingGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const meltingMesh = new THREE.Mesh(meltingGeo, materials.melting);
    meltingMesh.position.set(-2, -3, 0);
    group.add(meltingMesh);

    let time = 0;
    
    // Animate a central "rock particle" moving through the cycle
    const cycleParticleGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const cycleParticleMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const cycleParticle = new THREE.Mesh(cycleParticleGeo, cycleParticleMat);
    group.add(cycleParticle);

    function update(delta) {
        time += delta;

        // Magma pulsating
        const scale = 1 + Math.sin(time * 2) * 0.1;
        magmaMesh.scale.set(scale, scale, scale);
        
        // Heat pulsating
        heatMesh.scale.set(scale, scale, scale);

        // Sediments rotating
        sedimentsGroup.rotation.y += delta * 0.5;
        sedimentsGroup.rotation.x += delta * 0.2;

        // Metamorphic rock rotating
        metamorphicMesh.rotation.y += delta * 0.3;

        // Particle moving in a cycle path (Circle roughly)
        const cycleSpeed = 0.5;
        const angle = time * cycleSpeed;
        
        // Elliptical path roughly encompassing the stations
        cycleParticle.position.x = Math.cos(angle) * 4;
        cycleParticle.position.y = Math.sin(angle) * 3;
        
        // Change particle color based on position
        if (cycleParticle.position.y < -1) {
            cycleParticle.material.color.setHex(0xff3300); // Magma/Melting
        } else if (cycleParticle.position.x < -1 && cycleParticle.position.y > 0) {
            cycleParticle.material.color.setHex(0x333333); // Igneous
        } else if (cycleParticle.position.x > 1 && cycleParticle.position.y > 1) {
            cycleParticle.material.color.setHex(0xd2b48c); // Sediments
        } else if (cycleParticle.position.x > 2 && cycleParticle.position.y > -1) {
            cycleParticle.material.color.setHex(0xc2b280); // Sedimentary
        } else {
            cycleParticle.material.color.setHex(0x8866aa); // Metamorphic
        }
    }

    const questions = [
        {
            question: "What type of rock is formed by the cooling and solidification of magma?",
            options: ["Sedimentary", "Igneous", "Metamorphic", "Fossilized"],
            correctAnswer: 1
        },
        {
            question: "Which process turns sedimentary rock into metamorphic rock?",
            options: ["Cooling", "Melting", "Weathering", "Heat and Pressure"],
            correctAnswer: 3
        },
        {
            question: "What breaks down rocks into smaller sediments?",
            options: ["Compaction", "Weathering and Erosion", "Melting", "Crystallization"],
            correctAnswer: 1
        },
        {
            question: "How do sediments become sedimentary rock?",
            options: ["Melting and cooling", "Heat and pressure", "Compaction and cementation", "Weathering and erosion"],
            correctAnswer: 2
        },
        {
            question: "What is magma?",
            options: ["Solid rock on Earth's surface", "Molten rock beneath Earth's surface", "Broken pieces of rock", "Compressed sand"],
            correctAnswer: 1
        },
        {
            question: "Can an igneous rock turn directly into a metamorphic rock?",
            options: ["Yes, through heat and pressure", "No, it must become sedimentary first", "Yes, through melting", "No, it must turn into magma first"],
            correctAnswer: 0
        }
    ];

    return { group, parts, update, questions };
}
