export function createIssStation(THREE) {
    const group = new THREE.Group();
    const parts = {};

    // Materials
    const moduleMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3, roughness: 0.7 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x112255, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: true });
    const radiatorMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

    // 1. Zarya (FGB)
    const zaryaGeo = new THREE.CylinderGeometry(1.5, 1.5, 6, 16);
    parts.zarya = new THREE.Mesh(zaryaGeo, moduleMat);
    parts.zarya.position.set(0, 0, 0);
    parts.zarya.rotation.z = Math.PI / 2;
    group.add(parts.zarya);

    // 2. Unity (Node 1)
    const unityGeo = new THREE.CylinderGeometry(1.6, 1.6, 3, 16);
    parts.unity = new THREE.Mesh(unityGeo, moduleMat);
    parts.unity.position.set(4.5, 0, 0);
    parts.unity.rotation.z = Math.PI / 2;
    group.add(parts.unity);

    // 3. Zvezda (Service Module)
    const zvezdaGeo = new THREE.CylinderGeometry(1.8, 1.8, 7, 16);
    parts.zvezda = new THREE.Mesh(zvezdaGeo, moduleMat);
    parts.zvezda.position.set(-6.5, 0, 0);
    parts.zvezda.rotation.z = Math.PI / 2;
    group.add(parts.zvezda);

    // 4. Destiny (US Laboratory)
    const destinyGeo = new THREE.CylinderGeometry(1.7, 1.7, 5, 16);
    parts.destiny = new THREE.Mesh(destinyGeo, moduleMat);
    parts.destiny.position.set(8.5, 0, 0);
    parts.destiny.rotation.z = Math.PI / 2;
    group.add(parts.destiny);

    // 5. Integrated Truss Structure
    const trussGeo = new THREE.BoxGeometry(2, 2, 40);
    parts.truss = new THREE.Mesh(trussGeo, trussMat);
    parts.truss.position.set(8.5, 2.5, 0);
    group.add(parts.truss);

    // 6. Solar Array 1 (Starboard)
    parts.solarArray1 = new THREE.Group();
    const solarPanelGeo = new THREE.BoxGeometry(8, 0.1, 4);
    const panel1 = new THREE.Mesh(solarPanelGeo, solarMat);
    parts.solarArray1.add(panel1);
    parts.solarArray1.position.set(8.5, 2.5, 15);
    group.add(parts.solarArray1);

    // 7. Solar Array 2 (Port)
    parts.solarArray2 = new THREE.Group();
    const panel2 = new THREE.Mesh(solarPanelGeo, solarMat);
    parts.solarArray2.add(panel2);
    parts.solarArray2.position.set(8.5, 2.5, -15);
    group.add(parts.solarArray2);

    // 8. Radiators
    const radiatorGeo = new THREE.BoxGeometry(0.1, 8, 2);
    parts.radiators = new THREE.Mesh(radiatorGeo, radiatorMat);
    parts.radiators.position.set(8.5, -3, 0);
    group.add(parts.radiators);

    // 9. Columbus (European Laboratory)
    const columbusGeo = new THREE.CylinderGeometry(1.5, 1.5, 4, 16);
    parts.columbus = new THREE.Mesh(columbusGeo, moduleMat);
    parts.columbus.position.set(11, 0, 2.5);
    parts.columbus.rotation.x = Math.PI / 2;
    group.add(parts.columbus);

    // 10. Kibo (Japanese Experiment Module)
    const kiboGeo = new THREE.CylinderGeometry(1.6, 1.6, 5, 16);
    parts.kibo = new THREE.Mesh(kiboGeo, moduleMat);
    parts.kibo.position.set(11, 0, -3);
    parts.kibo.rotation.x = Math.PI / 2;
    group.add(parts.kibo);

    let time = 0;

    return {
        model: group,
        update: function(deltaTime) {
            time += deltaTime;
            
            // Orbital rotation representing the ISS moving along its orbit
            group.rotation.y = time * 0.1;
            group.position.y = Math.sin(time * 0.5) * 2; 
            
            // Kinematics: Solar arrays continuously track the sun
            parts.solarArray1.rotation.x = time * 0.5;
            parts.solarArray2.rotation.x = time * 0.5;
            
            // Radiators adjusting rotation for optimal heat dissipation
            parts.radiators.rotation.y = Math.sin(time * 0.2) * 0.5;
        },
        metadata: {
            quiz: [
                {
                    question: "Which module was the first component of the ISS launched?",
                    options: ["Zarya", "Unity", "Zvezda", "Destiny"],
                    answer: "Zarya"
                },
                {
                    question: "What is the primary purpose of the large external panels on the ISS?",
                    options: ["Heat dissipation", "Power generation", "Communication", "Radiation shielding"],
                    answer: "Power generation"
                },
                {
                    question: "Which module serves as the primary research laboratory for the United States?",
                    options: ["Columbus", "Kibo", "Destiny", "Unity"],
                    answer: "Destiny"
                },
                {
                    question: "What is the name of the European space laboratory attached to the ISS?",
                    options: ["Kibo", "Columbus", "Zarya", "Leonardo"],
                    answer: "Columbus"
                },
                {
                    question: "Which structure forms the main backbone of the station, supporting solar arrays and radiators?",
                    options: ["Integrated Truss Structure", "Pressurized Mating Adapter", "Mobile Servicing System", "Node 3"],
                    answer: "Integrated Truss Structure"
                },
                {
                    question: "What primary function does the Zvezda module provide?",
                    options: ["Scientific research", "Life support and propulsion", "Airlock for EVAs", "Docking for commercial crew"],
                    answer: "Life support and propulsion"
                }
            ]
        }
    };
}
