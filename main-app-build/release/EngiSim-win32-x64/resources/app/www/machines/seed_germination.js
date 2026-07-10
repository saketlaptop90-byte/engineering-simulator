export function createSeedGermination(THREE) {
    const group = new THREE.Group();

    // Materials
    const coatMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, transparent: true, opacity: 0.9 });
    const cotyledonMaterial = new THREE.MeshStandardMaterial({ color: 0xdeb887 });
    const endospermMaterial = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
    const radicleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const plumuleMaterial = new THREE.MeshStandardMaterial({ color: 0x98fb98 });
    const hypocotylMaterial = new THREE.MeshStandardMaterial({ color: 0xadff2f });
    const epicotylMaterial = new THREE.MeshStandardMaterial({ color: 0x7fff00 });
    const rootMaterial = new THREE.MeshStandardMaterial({ color: 0xfdf5e6 });
    const capMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3 });
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x32cd32 });

    // 1. Seed Coat (Testa)
    const coatGeo = new THREE.SphereGeometry(1.05, 32, 32);
    const seedCoat = new THREE.Mesh(coatGeo, coatMaterial);
    seedCoat.scale.set(1, 1.2, 0.8);
    seedCoat.name = "SeedCoat";
    group.add(seedCoat);

    // 2. Cotyledon
    const cotyledonGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const cotyledon = new THREE.Mesh(cotyledonGeo, cotyledonMaterial);
    cotyledon.scale.set(1, 1.15, 0.75);
    cotyledon.position.set(-0.05, 0, 0);
    cotyledon.name = "Cotyledon";
    group.add(cotyledon);

    // 3. Endosperm
    const endospermGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const endosperm = new THREE.Mesh(endospermGeo, endospermMaterial);
    endosperm.scale.set(0.5, 0.8, 0.5);
    endosperm.position.set(0.4, 0.2, 0);
    endosperm.name = "Endosperm";
    group.add(endosperm);

    // 4. Radicle
    const radicleGeo = new THREE.CylinderGeometry(0.1, 0.05, 0.5, 16);
    const radicle = new THREE.Mesh(radicleGeo, radicleMaterial);
    radicle.position.set(0, -1.0, 0);
    radicle.name = "Radicle";
    group.add(radicle);

    // 5. Plumule
    const plumuleGeo = new THREE.ConeGeometry(0.1, 0.3, 16);
    const plumule = new THREE.Mesh(plumuleGeo, plumuleMaterial);
    plumule.position.set(0, 0.8, 0);
    plumule.name = "Plumule";
    group.add(plumule);

    // 6. Hypocotyl
    const hypoGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.4, 16);
    const hypocotyl = new THREE.Mesh(hypoGeo, hypocotylMaterial);
    hypocotyl.position.set(0, -0.6, 0);
    hypocotyl.name = "Hypocotyl";
    group.add(hypocotyl);

    // 7. Epicotyl
    const epiGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.4, 16);
    const epicotyl = new THREE.Mesh(epiGeo, epicotylMaterial);
    epicotyl.position.set(0, 0.6, 0);
    epicotyl.name = "Epicotyl";
    group.add(epicotyl);

    // 8. Primary Root
    const rootGeo = new THREE.CylinderGeometry(0.08, 0.04, 1.0, 16);
    const primaryRoot = new THREE.Mesh(rootGeo, rootMaterial);
    primaryRoot.position.set(0, -1.5, 0);
    primaryRoot.name = "PrimaryRoot";
    group.add(primaryRoot);

    // 9. Root Cap
    const capGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const rootCap = new THREE.Mesh(capGeo, capMaterial);
    rootCap.position.set(0, -2.0, 0);
    rootCap.name = "RootCap";
    group.add(rootCap);

    // 10. Emerging Leaves
    const leavesGeo = new THREE.ConeGeometry(0.3, 0.6, 16);
    const leaves = new THREE.Mesh(leavesGeo, leavesMaterial);
    leaves.position.set(0, 1.2, 0);
    leaves.name = "EmergingLeaves";
    group.add(leaves);

    // Initial State Setup
    radicle.scale.set(1, 0.1, 1);
    plumule.scale.set(1, 0.1, 1);
    hypocotyl.scale.set(1, 0.1, 1);
    epicotyl.scale.set(1, 0.1, 1);
    primaryRoot.scale.set(1, 0.01, 1);
    rootCap.position.y = -1.0;
    leaves.scale.set(0.01, 0.01, 0.01);
    seedCoat.material.opacity = 1.0;

    let time = 0;

    function animate(delta) {
        time += delta;
        const stage = (time * 0.2) % 10; // Loops

        if (stage < 1) {
            // Imbibition
            const swell = 1 + (stage * 0.2);
            seedCoat.scale.set(swell, swell * 1.2, swell * 0.8);
            cotyledon.scale.set(swell, swell * 1.15, swell * 0.75);
        } else if (stage >= 1 && stage < 2) {
            // Radicle emergence
            seedCoat.material.opacity = 1.0 - ((stage - 1) * 0.8);
            const growth = (stage - 1);
            radicle.scale.set(1, 0.1 + growth * 0.9, 1);
            radicle.position.y = -1.0 - (growth * 0.2);
            rootCap.position.y = radicle.position.y - 0.2;
        } else if (stage >= 2 && stage < 4) {
            // Root & Hypocotyl
            const growth = (stage - 2) / 2;
            primaryRoot.scale.set(1, 0.01 + growth, 1);
            primaryRoot.position.y = -1.2 - (growth * 0.5);
            rootCap.position.y = primaryRoot.position.y - (growth * 0.5) - 0.05;
            hypocotyl.scale.set(1, 0.1 + growth * 0.9, 1);
            hypocotyl.position.y = -0.6 + (growth * 0.2);
        } else if (stage >= 4 && stage < 6) {
            // Plumule & Epicotyl
            const growth = (stage - 4) / 2;
            plumule.scale.set(1, 0.1 + growth * 0.9, 1);
            plumule.position.y = 0.8 + (growth * 0.2);
            epicotyl.scale.set(1, 0.1 + growth * 0.9, 1);
            epicotyl.position.y = 0.6 + (growth * 0.2);
        } else if (stage >= 6 && stage < 8) {
            // Leaves emerge, endosperm consumed
            const growth = (stage - 6) / 2;
            leaves.scale.set(growth, growth, growth);
            leaves.position.y = 1.0 + growth * 0.5;
            cotyledon.scale.set(1 - growth * 0.5, 1.15 * (1 - growth * 0.5), 0.75 * (1 - growth * 0.5));
            endosperm.scale.set(0.5 * (1 - growth * 0.8), 0.8 * (1 - growth * 0.8), 0.5 * (1 - growth * 0.8));
        } else if (stage >= 8 && stage < 9.5) {
            // Mature hold
        } else {
            // Reset
            time = 0;
            seedCoat.material.opacity = 1.0;
            seedCoat.scale.set(1, 1.2, 0.8);
            cotyledon.scale.set(1, 1.15, 0.75);
            endosperm.scale.set(0.5, 0.8, 0.5);
            radicle.scale.set(1, 0.1, 1);
            radicle.position.y = -1.0;
            plumule.scale.set(1, 0.1, 1);
            plumule.position.y = 0.8;
            hypocotyl.scale.set(1, 0.1, 1);
            hypocotyl.position.y = -0.6;
            epicotyl.scale.set(1, 0.1, 1);
            epicotyl.position.y = 0.6;
            primaryRoot.scale.set(1, 0.01, 1);
            primaryRoot.position.y = -1.5;
            rootCap.position.y = -1.0;
            leaves.scale.set(0.01, 0.01, 0.01);
            leaves.position.y = 1.2;
        }
    }

    return { group, animate };
}

export const quiz = [
    {
        question: "What is the first step in seed germination?",
        options: ["Photosynthesis", "Water imbibition", "Leaf emergence", "Flowering"],
        answer: "Water imbibition"
    },
    {
        question: "Which part of the seed emerges first during germination?",
        options: ["Plumule", "Radicle", "Cotyledon", "Epicotyl"],
        answer: "Radicle"
    },
    {
        question: "What is the primary function of the endosperm?",
        options: ["To protect the seed", "To absorb water", "To store nutrients for the developing embryo", "To perform photosynthesis"],
        answer: "To store nutrients for the developing embryo"
    },
    {
        question: "What structure develops into the primary shoot of the plant?",
        options: ["Radicle", "Plumule", "Root Cap", "Seed Coat"],
        answer: "Plumule"
    },
    {
        question: "Which term refers to the region of the stem above the cotyledons?",
        options: ["Hypocotyl", "Radicle", "Epicotyl", "Endosperm"],
        answer: "Epicotyl"
    },
    {
        question: "What protects the growing tip of the primary root as it pushes through the soil?",
        options: ["Seed Coat", "Root Cap", "Cotyledon", "Plumule"],
        answer: "Root Cap"
    }
];
