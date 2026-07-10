export function createPlateTectonics(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Create materials
    const oceanicCrustMaterial = new THREE.MeshStandardMaterial({ color: 0x1f3f5f });
    const continentalCrustMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const lithosphereMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const asthenosphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 });
    const magmaMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000 });
    const mantleMaterial = new THREE.MeshStandardMaterial({ color: 0xcc3300 });
    const coreMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 });

    // 1. Oceanic Crust
    const oceanicCrust = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), oceanicCrustMaterial);
    oceanicCrust.position.set(-2, 3, 0);
    group.add(oceanicCrust);
    parts.push({ name: "Oceanic Crust", description: "Thin, dense crust under oceans." });

    // 2. Continental Crust
    const continentalCrust = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4), continentalCrustMaterial);
    continentalCrust.position.set(2, 3.25, 0);
    group.add(continentalCrust);
    parts.push({ name: "Continental Crust", description: "Thick, less dense crust forming landmasses." });

    // 3. Lithosphere
    const lithosphere = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 4), lithosphereMaterial);
    lithosphere.position.set(0, 2.25, 0);
    group.add(lithosphere);
    parts.push({ name: "Lithosphere", description: "Rigid outer part of the earth, consisting of crust and upper mantle." });

    // 4. Asthenosphere
    const asthenosphere = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 4), asthenosphereMaterial);
    asthenosphere.position.set(0, 0.75, 0);
    group.add(asthenosphere);
    parts.push({ name: "Asthenosphere", description: "Semi-fluid layer of the mantle below the lithosphere." });

    // 5. Magma Plume
    const magmaPlume = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1, 3, 16), magmaMaterial);
    magmaPlume.position.set(-2, -0.5, 0);
    group.add(magmaPlume);
    parts.push({ name: "Magma Plume", description: "Upwelling of abnormally hot rock within the Earth's mantle." });

    // 6. Trench
    const trench = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 4), new THREE.MeshStandardMaterial({ color: 0x000033 }));
    trench.position.set(0, 3, 0);
    group.add(trench);
    parts.push({ name: "Trench", description: "Deep depression in the ocean floor caused by subduction." });

    // 7. Mid-Ocean Ridge
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1, 4), magmaMaterial);
    ridge.position.set(-4, 3, 0);
    group.add(ridge);
    parts.push({ name: "Mid-Ocean Ridge", description: "Underwater mountain system formed by plate tectonics." });

    // 8. Subduction Zone
    const subductionZone = new THREE.Mesh(new THREE.PlaneGeometry(2, 4), magmaMaterial);
    subductionZone.rotation.x = -Math.PI / 2;
    subductionZone.rotation.y = Math.PI / 4;
    subductionZone.position.set(0.5, 2, 0);
    group.add(subductionZone);
    parts.push({ name: "Subduction Zone", description: "Region where a tectonic plate sinks under another." });

    // 9. Mantle
    const mantle = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 4), mantleMaterial);
    mantle.position.set(0, -2, 0);
    group.add(mantle);
    parts.push({ name: "Mantle", description: "Mostly solid bulk of Earth's interior." });

    // 10. Core
    const core = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), coreMaterial);
    core.position.set(0, -4.5, 0);
    group.add(core);
    parts.push({ name: "Core", description: "Extremely hot, dense center of the earth." });

    let time = 0;
    function update(delta) {
        time += delta;
        // Simple animation: Plates moving towards/away from each other
        oceanicCrust.position.x = -2 + Math.sin(time) * 0.2;
        continentalCrust.position.x = 2 - Math.sin(time) * 0.2;
        magmaPlume.position.y = -0.5 + Math.sin(time * 2) * 0.1;
    }

    const questions = [
        {
            question: "Which layer is broken into tectonic plates?",
            options: ["Asthenosphere", "Lithosphere", "Mesosphere", "Core"],
            correctAnswer: 1
        },
        {
            question: "What geological feature is formed at a divergent boundary?",
            options: ["Trench", "Mid-Ocean Ridge", "Fold Mountain", "Subduction Zone"],
            correctAnswer: 1
        },
        {
            question: "Where does subduction occur?",
            options: ["Divergent boundary", "Transform boundary", "Convergent boundary", "Mid-ocean ridge"],
            correctAnswer: 2
        },
        {
            question: "What drives the movement of tectonic plates?",
            options: ["Mantle convection", "Earth's magnetic field", "Ocean currents", "Solar wind"],
            correctAnswer: 0
        },
        {
            question: "Which type of crust is denser?",
            options: ["Continental crust", "Oceanic crust", "Both have the same density", "It depends on location"],
            correctAnswer: 1
        },
        {
            question: "What is the semi-fluid layer below the lithosphere called?",
            options: ["Outer core", "Inner core", "Asthenosphere", "Crust"],
            correctAnswer: 2
        }
    ];

    return { group, parts, update, questions };
}
