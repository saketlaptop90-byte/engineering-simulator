export function createTunedMassDamper(THREE) {
    const group = new THREE.Group();
    const parts = {};

    // 1. foundation
    const foundationGeo = new THREE.BoxGeometry(20, 2, 20);
    const foundationMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });
    const foundation = new THREE.Mesh(foundationGeo, foundationMat);
    foundation.position.y = 1;
    group.add(foundation);
    parts.foundation = foundation;

    // Building Group for swaying
    const buildingGroup = new THREE.Group();
    buildingGroup.position.y = 2; // Pivot point at the base
    group.add(buildingGroup);

    // 2. outerCore
    const outerCoreGeo = new THREE.BoxGeometry(10, 40, 10);
    const outerCoreMat = new THREE.MeshStandardMaterial({ 
        color: 0x88ccff, 
        transparent: true, 
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0.5
    });
    const outerCore = new THREE.Mesh(outerCoreGeo, outerCoreMat);
    outerCore.position.y = 20;
    buildingGroup.add(outerCore);
    parts.outerCore = outerCore;

    // 3. skyscraperFloors
    const floorsGeo = new THREE.BoxGeometry(9.8, 0.2, 9.8);
    const floorsMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const skyscraperFloors = new THREE.Group();
    for (let i = 1; i <= 30; i++) {
        const floor = new THREE.Mesh(floorsGeo, floorsMat);
        floor.position.y = i * 1.25;
        skyscraperFloors.add(floor);
    }
    buildingGroup.add(skyscraperFloors);
    parts.skyscraperFloors = skyscraperFloors;

    // Damper Group at the top
    const damperGroup = new THREE.Group();
    damperGroup.position.y = 35;
    buildingGroup.add(damperGroup);

    // 4. supportFrame
    const supportGeo = new THREE.BoxGeometry(8, 0.5, 8);
    const supportMat = new THREE.MeshStandardMaterial({ color: 0xaa2222, metalness: 0.8 });
    const supportFrame = new THREE.Mesh(supportGeo, supportMat);
    supportFrame.position.y = 4;
    damperGroup.add(supportFrame);
    parts.supportFrame = supportFrame;

    // 5. cablesSuspensionSystem
    const cablesGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
    cablesGeo.translate(0, -1.5, 0); // Origin at the top for rotation
    const cablesMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
    const cablesSuspensionSystem = new THREE.Group();
    const cable1 = new THREE.Mesh(cablesGeo, cablesMat); cable1.position.set(-1.5, 4, -1.5);
    const cable2 = new THREE.Mesh(cablesGeo, cablesMat); cable2.position.set(1.5, 4, -1.5);
    const cable3 = new THREE.Mesh(cablesGeo, cablesMat); cable3.position.set(-1.5, 4, 1.5);
    const cable4 = new THREE.Mesh(cablesGeo, cablesMat); cable4.position.set(1.5, 4, 1.5);
    cablesSuspensionSystem.add(cable1, cable2, cable3, cable4);
    damperGroup.add(cablesSuspensionSystem);
    parts.cablesSuspensionSystem = cablesSuspensionSystem;

    // Moving Mass Group
    const movingMassGroup = new THREE.Group();
    movingMassGroup.position.y = 1; 
    damperGroup.add(movingMassGroup);

    // 6. pendulumMass
    const massGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const massMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.7, roughness: 0.3 });
    const pendulumMass = new THREE.Mesh(massGeo, massMat);
    movingMassGroup.add(pendulumMass);
    parts.pendulumMass = pendulumMass;

    // 7. viscousDampers
    const damperGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);
    damperGeo.rotateZ(Math.PI / 2);
    const damperMat = new THREE.MeshStandardMaterial({ color: 0x2222ff, metalness: 0.6 });
    const viscousDampers = new THREE.Group();
    const d1 = new THREE.Mesh(damperGeo, damperMat); d1.position.set(-2.5, 1, 0); viscousDampers.add(d1);
    const d2 = new THREE.Mesh(damperGeo, damperMat); d2.position.set(2.5, 1, 0); viscousDampers.add(d2);
    damperGroup.add(viscousDampers);
    parts.viscousDampers = viscousDampers;

    // 8. springs
    const springGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    springGeo.rotateX(Math.PI / 2);
    const springMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true });
    const springs = new THREE.Group();
    const s1 = new THREE.Mesh(springGeo, springMat); s1.position.set(0, 1, -2.5); springs.add(s1);
    const s2 = new THREE.Mesh(springGeo, springMat); s2.position.set(0, 1, 2.5); springs.add(s2);
    damperGroup.add(springs);
    parts.springs = springs;

    // 9. snubberRings
    const snubberGeo = new THREE.TorusGeometry(2.5, 0.2, 16, 100);
    snubberGeo.rotateX(Math.PI / 2);
    const snubberMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const snubberRings = new THREE.Mesh(snubberGeo, snubberMat);
    snubberRings.position.y = 1;
    damperGroup.add(snubberRings);
    parts.snubberRings = snubberRings;

    // 10. windEarthquakeIndicator
    const arrowGeo = new THREE.ConeGeometry(1, 4, 16);
    arrowGeo.rotateZ(-Math.PI / 2);
    const arrowMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const windEarthquakeIndicator = new THREE.Mesh(arrowGeo, arrowMat);
    windEarthquakeIndicator.position.set(-12, 20, 0);
    group.add(windEarthquakeIndicator);
    parts.windEarthquakeIndicator = windEarthquakeIndicator;

    let time = 0;

    const quiz = [
        {
            question: "What is the primary purpose of a tuned mass damper in a skyscraper?",
            options: [
                "To reduce sway and vibrations",
                "To generate electricity",
                "To store water",
                "To provide counterweight for elevators"
            ],
            answer: 0
        },
        {
            question: "Where is a tuned mass damper typically located in a tall building?",
            options: [
                "In the basement",
                "Near the top",
                "At the ground level",
                "Evenly distributed across all floors"
            ],
            answer: 1
        },
        {
            question: "How does a tuned mass damper counteract building sway?",
            options: [
                "By making the building completely rigid",
                "By anchoring the building firmly to the bedrock",
                "By moving out of phase with the building's vibration",
                "By emitting counter-acoustic waves"
            ],
            answer: 2
        },
        {
            question: "What type of natural forces do tuned mass dampers primarily mitigate?",
            options: [
                "Solar radiation",
                "Tsunami waves",
                "Wind and earthquakes",
                "Heavy rainfall"
            ],
            answer: 2
        },
        {
            question: "Which famous building features a prominent 660-ton pendulum tuned mass damper visible to the public?",
            options: [
                "Burj Khalifa",
                "Empire State Building",
                "Eiffel Tower",
                "Taipei 101"
            ],
            answer: 3
        },
        {
            question: "What components are typically part of a tuned mass damper system?",
            options: [
                "Solar panels and batteries",
                "A heavy mass, springs, and viscous fluid dampers",
                "Steel beams and concrete foundations only",
                "Air conditioning units and water pumps"
            ],
            answer: 1
        }
    ];

    return {
        model: group,
        parts: parts,
        animate: function(delta) {
            time += delta;
            
            // Wind force pushes the building
            const force = Math.sin(time * 1.5);
            windEarthquakeIndicator.position.x = -14 + force * 2;
            
            // Building sway lags slightly behind wind force
            const swayAngle = Math.sin(time * 1.5 - Math.PI/4) * 0.04;
            buildingGroup.rotation.z = swayAngle;
            
            // Pendulum mass moves out of phase to counteract the sway
            const massSway = -Math.sin(time * 1.5 - Math.PI/4) * 1.2;
            movingMassGroup.position.x = massSway;
            
            // Update cables to point towards the displaced mass
            cablesSuspensionSystem.children.forEach(cable => {
                cable.rotation.z = Math.atan2(massSway, 3);
            });

            // Update dampers
            const d1 = viscousDampers.children[0];
            d1.scale.y = 1 + massSway / 2;
            d1.position.x = -2.5 + massSway / 2;

            const d2 = viscousDampers.children[1];
            d2.scale.y = 1 - massSway / 2;
            d2.position.x = 2.5 + massSway / 2;
        },
        quiz: quiz
    };
}
