export function createSaturnVRocket(THREE) {
    const group = new THREE.Group();

    // Materials
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const adapterMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });

    const offset = -14.375;

    // 1. F-1 Engines
    const f1Geom = new THREE.CylinderGeometry(0.8, 1.2, 1.5, 32);
    const f1 = new THREE.Mesh(f1Geom, engineMat);
    f1.position.set(0, 0.75 + offset, 0);
    f1.userData = { id: 'f1_engines', name: 'F-1 Engines' };
    group.add(f1);

    // 2. S-IC First Stage
    const s1Geom = new THREE.CylinderGeometry(2, 2, 10, 32);
    const s1 = new THREE.Mesh(s1Geom, whiteMat);
    s1.position.set(0, 6.5 + offset, 0);
    s1.userData = { id: 's_ic_first_stage', name: 'S-IC First Stage' };
    group.add(s1);

    // 3. Interstage
    const interGeom = new THREE.CylinderGeometry(2, 2, 1.5, 32);
    const interstage = new THREE.Mesh(interGeom, blackMat);
    interstage.position.set(0, 12.25 + offset, 0);
    interstage.userData = { id: 'interstage', name: 'Interstage' };
    group.add(interstage);

    // 4. S-II Second Stage
    const s2Geom = new THREE.CylinderGeometry(2, 2, 6, 32);
    const s2 = new THREE.Mesh(s2Geom, whiteMat);
    s2.position.set(0, 16 + offset, 0);
    s2.userData = { id: 's_ii_second_stage', name: 'S-II Second Stage' };
    group.add(s2);

    // 5. J-2 Engines
    const j2Geom = new THREE.CylinderGeometry(1.5, 2, 0.5, 32);
    const j2 = new THREE.Mesh(j2Geom, engineMat);
    j2.position.set(0, 19.25 + offset, 0);
    j2.userData = { id: 'j2_engines', name: 'J-2 Engines' };
    group.add(j2);

    // 6. S-IVB Third Stage
    const s3Geom = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
    const s3 = new THREE.Mesh(s3Geom, whiteMat);
    s3.position.set(0, 21.5 + offset, 0);
    s3.userData = { id: 's_ivb_third_stage', name: 'S-IVB Third Stage' };
    group.add(s3);

    // 7. Instrument Unit
    const iuGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const iu = new THREE.Mesh(iuGeom, blackMat);
    iu.position.set(0, 23.75 + offset, 0);
    iu.userData = { id: 'instrument_unit', name: 'Instrument Unit' };
    group.add(iu);

    // 8. Lunar Module Adapter
    const lmaGeom = new THREE.CylinderGeometry(0.8, 1.5, 2, 32);
    const lma = new THREE.Mesh(lmaGeom, adapterMat);
    lma.position.set(0, 25 + offset, 0);
    lma.userData = { id: 'lunar_module_adapter', name: 'Lunar Module Adapter' };
    group.add(lma);

    // 9. Service Module
    const smGeom = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const sm = new THREE.Mesh(smGeom, silverMat);
    sm.position.set(0, 27 + offset, 0);
    sm.userData = { id: 'service_module', name: 'Service Module' };
    group.add(sm);

    // 10. Command Module
    const cmGeom = new THREE.ConeGeometry(0.8, 1.5, 32);
    const cm = new THREE.Mesh(cmGeom, silverMat);
    cm.position.set(0, 28.75 + offset, 0);
    cm.userData = { id: 'command_module', name: 'Command Module' };
    group.add(cm);

    let startY = group.position.y;
    group.update = function(delta) {
        this.position.y += delta * 5;
        if (this.position.y > startY + 50) {
            this.position.y = startY - 20;
        }
    };

    group.quizzes = [
        {
            question: "Which stage of the Saturn V rocket provides the initial thrust to lift off from the launch pad?",
            options: ["S-IC First Stage", "S-II Second Stage", "S-IVB Third Stage", "Command Module"],
            answer: 0
        },
        {
            question: "What engines powered the S-IC first stage?",
            options: ["J-2 Engines", "F-1 Engines", "RS-25 Engines", "Merlin Engines"],
            answer: 1
        },
        {
            question: "Which component houses the guidance computers and flight control systems?",
            options: ["Interstage", "Lunar Module Adapter", "Instrument Unit", "Service Module"],
            answer: 2
        },
        {
            question: "Which stage is responsible for Earth orbit insertion and trans-lunar injection?",
            options: ["S-IC", "S-II", "S-IVB", "Service Module"],
            answer: 2
        },
        {
            question: "What is housed inside the Lunar Module Adapter during launch?",
            options: ["The Command Module", "The Lunar Module", "The Instrument Unit", "The Escape Tower"],
            answer: 1
        },
        {
            question: "Where did the Apollo astronauts reside during most of the mission?",
            options: ["Service Module", "Command Module", "Instrument Unit", "S-IVB Stage"],
            answer: 1
        }
    ];

    return group;
}
