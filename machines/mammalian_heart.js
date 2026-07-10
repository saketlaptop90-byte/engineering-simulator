export function createMammalianHeart(THREE) {
    const group = new THREE.Group();

    // Materials
    const deoxMaterial = new THREE.MeshStandardMaterial({ color: 0x1144cc, roughness: 0.5 }); // Blue
    const oxMaterial = new THREE.MeshStandardMaterial({ color: 0xcc1111, roughness: 0.5 }); // Red
    const valveMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.8 }); // White

    // 1. Right Atrium
    const raGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const rightAtrium = new THREE.Mesh(raGeo, deoxMaterial);
    rightAtrium.position.set(-1.5, 1.5, 0);
    rightAtrium.name = "Right Atrium";
    group.add(rightAtrium);

    // 2. Right Ventricle
    const rvGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const rightVentricle = new THREE.Mesh(rvGeo, deoxMaterial);
    rightVentricle.position.set(-1.5, -1.5, 0);
    rightVentricle.name = "Right Ventricle";
    group.add(rightVentricle);

    // 3. Left Atrium
    const laGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const leftAtrium = new THREE.Mesh(laGeo, oxMaterial);
    leftAtrium.position.set(1.5, 1.5, 0);
    leftAtrium.name = "Left Atrium";
    group.add(leftAtrium);

    // 4. Left Ventricle
    const lvGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const leftVentricle = new THREE.Mesh(lvGeo, oxMaterial);
    leftVentricle.position.set(1.5, -1.5, 0);
    leftVentricle.name = "Left Ventricle";
    group.add(leftVentricle);

    // 5. Aorta
    const aortaGeo = new THREE.TorusGeometry(1.5, 0.4, 16, 50, Math.PI);
    const aorta = new THREE.Mesh(aortaGeo, oxMaterial);
    aorta.position.set(0, 2.5, 0);
    aorta.rotation.x = Math.PI / 2;
    aorta.name = "Aorta";
    group.add(aorta);

    // 6. Pulmonary Artery
    const paGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const pulmonaryArtery = new THREE.Mesh(paGeo, deoxMaterial);
    pulmonaryArtery.position.set(-0.5, 3, 0.5);
    pulmonaryArtery.rotation.z = -Math.PI / 6;
    pulmonaryArtery.name = "Pulmonary Artery";
    group.add(pulmonaryArtery);

    // 7. Pulmonary Vein
    const pvGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const pulmonaryVein = new THREE.Mesh(pvGeo, oxMaterial);
    pulmonaryVein.position.set(3, 1.5, 0);
    pulmonaryVein.rotation.z = Math.PI / 2;
    pulmonaryVein.name = "Pulmonary Vein";
    group.add(pulmonaryVein);

    // 8. Superior Vena Cava
    const svcGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
    const superiorVenaCava = new THREE.Mesh(svcGeo, deoxMaterial);
    superiorVenaCava.position.set(-2, 3.5, 0);
    superiorVenaCava.name = "Superior Vena Cava";
    group.add(superiorVenaCava);

    // 9. Inferior Vena Cava
    const ivcGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
    const inferiorVenaCava = new THREE.Mesh(ivcGeo, deoxMaterial);
    inferiorVenaCava.position.set(-2, -3.5, 0);
    inferiorVenaCava.name = "Inferior Vena Cava";
    group.add(inferiorVenaCava);

    // 10. Tricuspid Valve
    const valveGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 50);
    const tricuspidValve = new THREE.Mesh(valveGeo, valveMaterial);
    tricuspidValve.position.set(-1.5, 0, 0);
    tricuspidValve.rotation.x = Math.PI / 2;
    tricuspidValve.name = "Tricuspid Valve";
    group.add(tricuspidValve);

    // Animation function
    let time = 0;
    const update = (delta) => {
        time += delta;
        // Simulate heartbeat: a quick double-beat pattern
        const beat = Math.pow(Math.sin(time * 5), 4) * 0.15;
        const scale = 1 + beat;
        group.scale.set(scale, scale, scale);
    };

    const quiz = [
        {
            question: "Which chamber of the mammalian heart pumps oxygenated blood to the rest of the body?",
            options: ["Right Atrium", "Right Ventricle", "Left Atrium", "Left Ventricle"],
            correctAnswer: 3
        },
        {
            question: "The vessel that carries deoxygenated blood from the right ventricle to the lungs is the:",
            options: ["Aorta", "Pulmonary Vein", "Pulmonary Artery", "Superior Vena Cava"],
            correctAnswer: 2
        },
        {
            question: "Blood returning from the body's systemic circulation enters which chamber of the heart first?",
            options: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle"],
            correctAnswer: 0
        },
        {
            question: "The valve located between the right atrium and right ventricle is the:",
            options: ["Mitral Valve", "Tricuspid Valve", "Aortic Valve", "Pulmonary Valve"],
            correctAnswer: 1
        },
        {
            question: "Which vessels carry oxygenated blood from the lungs back to the heart?",
            options: ["Pulmonary Arteries", "Coronary Arteries", "Vena Cavae", "Pulmonary Veins"],
            correctAnswer: 3
        },
        {
            question: "Which chamber of the heart has the thickest, most muscular wall?",
            options: ["Left Atrium", "Right Atrium", "Left Ventricle", "Right Ventricle"],
            correctAnswer: 2
        }
    ];

    return {
        group,
        update,
        quiz
    };
}
