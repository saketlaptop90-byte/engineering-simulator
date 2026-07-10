export function createConcreteFrame(THREE) {
    const group = new THREE.Group();

    // Materials
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, roughness: 0.8 });
    const freshConcreteMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
    const rebarMat = new THREE.MeshStandardMaterial({ color: 0x3b2f2f, roughness: 0.6, metalness: 0.8 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 }); // Formwork
    const scaffoldMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.2 });
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x909090, roughness: 0.8 });
    const studMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8 });

    // 1. Foundation Pads
    const foundationGeo = new THREE.BoxGeometry(4, 1, 4);
    const foundationPads = new THREE.Group();
    foundationPads.name = "FoundationPads";
    for (let x = -10; x <= 10; x += 10) {
        for (let z = -10; z <= 10; z += 10) {
            if (x === 0 && z === 0) continue; // Leave center for core
            const pad = new THREE.Mesh(foundationGeo, concreteMat);
            pad.position.set(x, 0.5, z);
            foundationPads.add(pad);
        }
    }
    group.add(foundationPads);

    // 2. Core Walls
    const coreGeo = new THREE.BoxGeometry(6, 20, 6);
    const coreWall = new THREE.Mesh(coreGeo, coreMat);
    coreWall.name = "CoreWalls";
    coreWall.position.set(0, 10, 0);
    group.add(coreWall);

    // 3. Columns
    const columnGeo = new THREE.BoxGeometry(1, 10, 1);
    const columns = new THREE.Group();
    columns.name = "Columns";
    for (let x = -10; x <= 10; x += 10) {
        for (let z = -10; z <= 10; z += 10) {
            if (x === 0 && z === 0) continue;
            const col1 = new THREE.Mesh(columnGeo, concreteMat);
            col1.position.set(x, 5.5, z); // Floor 1
            const col2 = new THREE.Mesh(columnGeo, freshConcreteMat);
            col2.position.set(x, 15.5, z); // Floor 2 (under construction)
            columns.add(col1);
            columns.add(col2);
        }
    }
    group.add(columns);

    // 4. Beams
    const beamGeoX = new THREE.BoxGeometry(10, 1.5, 1);
    const beamGeoZ = new THREE.BoxGeometry(1, 1.5, 10);
    const beams = new THREE.Group();
    beams.name = "Beams";
    // Floor 1 beams
    for (let x = -5; x <= 5; x += 10) {
        for (let z = -10; z <= 10; z += 10) {
            const beam = new THREE.Mesh(beamGeoX, concreteMat);
            beam.position.set(x, 10, z);
            beams.add(beam);
        }
    }
    for (let x = -10; x <= 10; x += 10) {
        for (let z = -5; z <= 5; z += 10) {
            const beam = new THREE.Mesh(beamGeoZ, concreteMat);
            beam.position.set(x, 10, z);
            beams.add(beam);
        }
    }
    group.add(beams);

    // 5. Drop Panels
    const dropGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const dropPanels = new THREE.Group();
    dropPanels.name = "DropPanels";
    for (let x = -10; x <= 10; x += 10) {
        for (let z = -10; z <= 10; z += 10) {
            if (x === 0 && z === 0) continue;
            const drop = new THREE.Mesh(dropGeo, concreteMat);
            drop.position.set(x, 9.5, z);
            dropPanels.add(drop);
        }
    }
    group.add(dropPanels);

    // 6. Slabs
    const slabGeo = new THREE.BoxGeometry(22, 0.5, 22);
    const slab1 = new THREE.Mesh(slabGeo, concreteMat);
    slab1.name = "Slabs";
    slab1.position.set(0, 10.5, 0);
    group.add(slab1);

    // 7. Rebar Cages (Floor 2 columns rebar sticking out)
    const rebarGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const rebars = new THREE.Group();
    rebars.name = "RebarCages";
    for (let x = -10; x <= 10; x += 10) {
        for (let z = -10; z <= 10; z += 10) {
            if (x === 0 && z === 0) continue;
            for (let i = -0.3; i <= 0.3; i += 0.6) {
                for (let j = -0.3; j <= 0.3; j += 0.6) {
                    const rebar = new THREE.Mesh(rebarGeo, rebarMat);
                    rebar.position.set(x + i, 21.5, z + j);
                    rebars.add(rebar);
                }
            }
        }
    }
    group.add(rebars);

    // 8. Formwork (Floor 2 slab area)
    const formworkGeo = new THREE.BoxGeometry(22, 0.2, 22);
    const formwork = new THREE.Mesh(formworkGeo, woodMat);
    formwork.name = "Formwork";
    formwork.position.set(0, 20.5, 0);
    group.add(formwork);

    // 9. Scaffolding (supporting formwork)
    const scaffoldGeo = new THREE.CylinderGeometry(0.1, 0.1, 10);
    const scaffolding = new THREE.Group();
    scaffolding.name = "Scaffolding";
    for (let x = -8; x <= 8; x += 4) {
        for (let z = -8; z <= 8; z += 4) {
            if (Math.abs(x) < 4 && Math.abs(z) < 4) continue;
            const scaffold = new THREE.Mesh(scaffoldGeo, scaffoldMat);
            scaffold.position.set(x, 15.5, z);
            scaffolding.add(scaffold);
        }
    }
    group.add(scaffolding);

    // 10. Shear Studs (on top of beams for composite action)
    const studGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
    const studs = new THREE.Group();
    studs.name = "ShearStuds";
    for (let x = -8; x <= 8; x += 2) {
        const stud = new THREE.Mesh(studGeo, studMat);
        stud.position.set(x, 10.8, -10);
        studs.add(stud);
    }
    group.add(studs);

    // Animation: swaying under wind load
    let time = 0;
    group.userData.update = function(deltaTime) {
        time += deltaTime;
        // The structure sways slightly to simulate structural deflection under wind/seismic load
        const swayForce = Math.sin(time * 2) * 0.01;
        
        // Pivot from base (simulated by rotating the group, since origin is roughly base)
        group.rotation.z = swayForce;
        group.rotation.x = Math.cos(time * 1.5) * 0.01;
    };

    group.userData.quiz = [
        {
            question: "What is the primary purpose of rebar (reinforcement steel) in a concrete frame?",
            options: [
                "To increase compressive strength",
                "To provide tensile strength",
                "To reduce the weight of the structure",
                "To improve thermal insulation"
            ],
            correct: 1
        },
        {
            question: "What is formwork in concrete construction?",
            options: [
                "The foundation layer",
                "Temporary molds into which concrete is poured",
                "A type of decorative finish",
                "The permanent roof structure"
            ],
            correct: 1
        },
        {
            question: "What function do drop panels serve in a concrete slab?",
            options: [
                "They increase the punching shear strength around columns",
                "They serve as decorative ceiling elements",
                "They house electrical wiring",
                "They allow water drainage"
            ],
            correct: 0
        },
        {
            question: "Why are shear walls or core walls critical in tall concrete buildings?",
            options: [
                "They increase the building's height limit",
                "They resist lateral forces like wind and earthquakes",
                "They provide soundproofing",
                "They reduce the amount of concrete needed"
            ],
            correct: 1
        },
        {
            question: "What is the role of scaffolding during construction?",
            options: [
                "To permanently support the building",
                "To provide temporary support for formwork and workers",
                "To reinforce the concrete from the outside",
                "To act as a lightning rod"
            ],
            correct: 1
        },
        {
            question: "What are shear studs used for in structural engineering?",
            options: [
                "To attach windows to the frame",
                "To connect concrete slabs to steel beams for composite action",
                "To join two pieces of rebar together",
                "To anchor the building to the bedrock"
            ],
            correct: 1
        }
    ];

    return group;
}
