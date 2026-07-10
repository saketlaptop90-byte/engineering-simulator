export function createHumanHeart(THREE) {
    const group = new THREE.Group();

    const createMesh = (geometry, color, position, name) => {
        const material = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7, metalness: 0.1 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[2]);
        mesh.name = name;
        mesh.userData.originalScale = mesh.scale.clone();
        return mesh;
    };

    // 1. Left Ventricle (Lower left chamber)
    const lvGeom = new THREE.SphereGeometry(1.5, 32, 32);
    lvGeom.scale(1, 1.5, 1);
    const leftVentricle = createMesh(lvGeom, 0xaa0000, [0.8, -1.5, 0], 'Left Ventricle');
    group.add(leftVentricle);

    // 2. Right Ventricle (Lower right chamber)
    const rvGeom = new THREE.SphereGeometry(1.2, 32, 32);
    rvGeom.scale(1, 1.4, 0.9);
    const rightVentricle = createMesh(rvGeom, 0x880000, [-1.0, -1.2, 0.5], 'Right Ventricle');
    group.add(rightVentricle);

    // 3. Left Atrium (Upper left chamber)
    const laGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const leftAtrium = createMesh(laGeom, 0xcc0000, [0.8, 0.5, -0.5], 'Left Atrium');
    group.add(leftAtrium);

    // 4. Right Atrium (Upper right chamber)
    const raGeom = new THREE.SphereGeometry(0.9, 32, 32);
    const rightAtrium = createMesh(raGeom, 0x990000, [-1.2, 0.6, 0.2], 'Right Atrium');
    group.add(rightAtrium);

    // 5. Aorta (Main artery, red)
    const aortaGeom = new THREE.TorusGeometry(1, 0.4, 16, 50, Math.PI);
    const aorta = createMesh(aortaGeom, 0xff0000, [0, 1.5, 0], 'Aorta');
    aorta.rotation.x = Math.PI / 2;
    group.add(aorta);

    // 6. Pulmonary Artery (Blue, carries deoxygenated blood to lungs)
    const paGeom = new THREE.CylinderGeometry(0.35, 0.35, 2, 16);
    const pulmonaryArtery = createMesh(paGeom, 0x0000ff, [-0.5, 1.2, 0.8], 'Pulmonary Artery');
    pulmonaryArtery.rotation.z = -Math.PI / 4;
    group.add(pulmonaryArtery);

    // 7. Pulmonary Vein (Red, carries oxygenated blood from lungs)
    const pvGeom = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const pulmonaryVein = createMesh(pvGeom, 0xff3333, [1.5, 0.5, -0.5], 'Pulmonary Vein');
    pulmonaryVein.rotation.z = Math.PI / 2;
    group.add(pulmonaryVein);

    // 8. Superior Vena Cava (Blue, upper body vein)
    const svcGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const svc = createMesh(svcGeom, 0x0000cc, [-1.5, 1.5, 0], 'Superior Vena Cava');
    group.add(svc);

    // 9. Inferior Vena Cava (Blue, lower body vein)
    const ivcGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const ivc = createMesh(ivcGeom, 0x000099, [-1.2, -2.5, 0], 'Inferior Vena Cava');
    group.add(ivc);

    // 10. Mitral Valve (Between LA and LV)
    const valveGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16);
    const mitralValve = createMesh(valveGeom, 0xffffff, [0.8, -0.2, -0.25], 'Mitral Valve');
    group.add(mitralValve);

    // Animation function
    let timeOffset = 0;
    group.userData.animate = function(delta) {
        timeOffset += delta;
        // Simulating a heartbeat: systolic (contraction) and diastolic (relaxation)
        // A heartbeat has two beats usually (lub-dub).
        // Here we simulate the pulse by combining two sine waves.
        const pulse = 1 + 0.05 * Math.sin(timeOffset * 10) + 0.03 * Math.sin(timeOffset * 20);
        
        group.children.forEach(child => {
            if (child.userData.originalScale) {
                child.scale.x = child.userData.originalScale.x * pulse;
                child.scale.y = child.userData.originalScale.y * pulse;
                child.scale.z = child.userData.originalScale.z * pulse;
            }
        });
    };

    // Quiz questions
    group.userData.quiz = [
        {
            question: "Which chamber of the heart pumps oxygenated blood to the entire body?",
            options: ["Right Atrium", "Right Ventricle", "Left Atrium", "Left Ventricle"],
            answer: 3
        },
        {
            question: "What is the largest artery in the human body?",
            options: ["Pulmonary Artery", "Aorta", "Superior Vena Cava", "Carotid Artery"],
            answer: 1
        },
        {
            question: "Which blood vessels carry deoxygenated blood from the heart to the lungs?",
            options: ["Pulmonary Veins", "Aorta", "Pulmonary Arteries", "Coronary Arteries"],
            answer: 2
        },
        {
            question: "Which valve separates the left atrium from the left ventricle?",
            options: ["Tricuspid Valve", "Mitral Valve", "Aortic Valve", "Pulmonary Valve"],
            answer: 1
        },
        {
            question: "Which chamber receives deoxygenated blood from the body?",
            options: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle"],
            answer: 0
        },
        {
            question: "Which vessel brings oxygenated blood from the lungs back to the heart?",
            options: ["Superior Vena Cava", "Inferior Vena Cava", "Pulmonary Artery", "Pulmonary Vein"],
            answer: 3
        }
    ];

    return group;
}
